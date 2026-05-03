const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var Imap = require("imap");
const simpleParser = require('mailparser').simpleParser;
var Promise = require("bluebird");
Promise.longStackTraces();
require('dotenv').config();

var app  = express();

app.use(cors({
  origin: "*",
}));

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({    
  extended: true
})); 

const { Client } = require('whatsapp-web.js');
const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  "/opt/render/.cache/puppeteer/chrome/linux-147.0.7727.57/chrome-linux64/chrome";

console.log("Using Chrome path:", executablePath);

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  }
});

app.get('/', async (req, res) => {
    client.on('disconnected', (reason) => {
        console.log("WhatsApp client disconnected due to:", reason);
        client.destroy();
        client.initialize();
    });
    
    let qr = await new Promise((resolve, reject) => {
        client.once('qr', (qr) =>
         resolve(qr)
         )
    })
    res.send(qr)
})

client.on('ready', () => {
    console.log('Client is ready!');
    // client.sendMessage(chatId,text);
});
client.on('auth_failure', (msg) => {
    console.error("AUTHENTICATION FAILURE:", msg);
});


client.initialize();

app.post('/okok', async(req,res) =>{
    var needed = req.body.mailid;
    var phonenumber1 = req.body.number;
    var password = req.body.password;
    console.log(password);
    const phonenumber = `91${phonenumber1}@c.us`;

    var imapConfig = {
      user: `${needed}`,
      password: `${password}`,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions:{rejectUnauthorized:false}
  };
  
  var imap = new Imap(imapConfig);
  Promise.promisifyAll(imap);
  
  imap.once("ready", execute);
  imap.once("error", function(err) {
      console.log("Connection error: " + err.stack);
  });
  
  imap.connect();
  
  function execute() {
    function checkEmails() {
        imap.openBox("INBOX", false, function(err, mailBox) {
            if (err) {
                console.error("Error opening mailbox:", err);
                return;
            }
            imap.search(["UNSEEN"], function(err, results) {
                if (!results || !results.length) {
                    console.log("No new unread mails. Checking again in 10 seconds...");
                    return;
                }

                imap.setFlags(results, ['\\Seen'], function(err) {
                    if (!err) {
                        console.log("Marked emails as read");
                    } else {
                        console.error("Error marking as read:", err);
                    }
                });

                var f = imap.fetch(results, { bodies: "" });
                f.on("message", processMessage);
                f.once("error", function(err) {
                    console.error("Fetch error:", err);
                });
                f.once("end", function() {
                    console.log("Finished fetching emails.");
                });
            });
        });
    }

    // Check for new emails every 10 seconds
    setInterval(checkEmails, 10000);
}

  
 function processMessage(msg, seqno) {
    console.log("Processing msg #" + seqno);
    var prefix = '(#' + seqno + ') ';

    msg.on("body", function(stream) {
        simpleParser(stream, async (err, mail) => {
            if (err) {
                console.error("❌ Error parsing email:", err);
                return;
            }

            let username = mail.from.value[0].name || "Unknown";
            let mailid = mail.from.value[0].address || "Unknown";
            let subject = mail.subject || "No Subject";
            let content = mail.text || "No content available"; // Use plain text version of email

            let formattedMessage = 
                `👤 *Username*: ${username}\n` +
                `📧 *Mail*: ${mailid}\n` +
                `📌 *Subject*: ${subject}\n` +
                `📜 *Content*:\n${content}`;

            console.log("✅ Parsed message:", formattedMessage);

            const phonenumber = `91${phonenumber1}@c.us`; // Ensure phonenumber1 is accessible

            // ✅ Check if WhatsApp client is ready before sending
            if (!client || !client.info || !client.info.wid) {
                console.error("❌ WhatsApp client is not initialized properly. Message not sent.");
                return;
            }

            console.log("🚀 Sending message to:", phonenumber);

            try {
                await client.sendMessage(phonenumber, formattedMessage);
                console.log("✅ Message sent successfully!");
            } catch (error) {
                console.error("❌ Failed to send message:", error);
            }
        });
    });

    msg.once("end", function() {
        console.log("Finished msg #" + seqno);
    });
}



        
    res.send('saved')
})
var port = process.env.PORT || 8000
app.listen(port, () => {console.log('Client is listeningto port 8000!');});