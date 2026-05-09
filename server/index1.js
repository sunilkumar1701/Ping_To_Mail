const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
var Imap = require("imap");
const simpleParser = require("mailparser").simpleParser;
var Promise = require("bluebird");
const axios = require("axios");
Promise.longStackTraces();
require("dotenv").config();

var app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─── Meta WhatsApp Cloud API config (from .env) ───────────────────────────────
// WHATSAPP_TOKEN=your_access_token
// WHATSAPP_PHONE_ID=your_phone_number_id
// ─────────────────────────────────────────────────────────────────────────────

async function sendWhatsAppMessage(toNumber, messageData) {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const token = process.env.WHATSAPP_TOKEN;

  const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: `91${toNumber}`,
    type: "template",
    template: {
      name: "mail_alert",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: messageData.username || "Unknown",
            },
            {
              type: "text",
              text: messageData.mail || "No Mail",
            },
            {
              type: "text",
              text: messageData.subject || "No Subject",
            },
            {
              type: "text",
              text: messageData.content || "No Content",
            },
          ],
        },
      ],
    },
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ WhatsApp template message sent!");
    console.log(response.data);
  } catch (error) {
    console.error(
      "❌ WhatsApp template error:",
      error.response?.data || error.message,
    );
  }
}
// Health check route
app.get("/", (req, res) => {
  res.send("Ping_To_Mail backend is running ✅");
});

app.post("/okok", async (req, res) => {
  var needed = req.body.mailid;
  var phonenumber1 = req.body.number;
  var password = req.body.password;

  console.log(`📨 Starting email check for: ${needed}`);

  var imapConfig = {
    user: needed,
    password: password,
    host: "imap.gmail.com",
    port: 993,
    tls: true,

    authTimeout: 30000,
    connTimeout: 30000,

    tlsOptions: {
      rejectUnauthorized: false,
      servername: "imap.gmail.com",
    },

    keepalive: {
      interval: 10000,
      idleInterval: 300000,
      forceNoop: true,
    },
  };

  var imap = new Imap(imapConfig);
  Promise.promisifyAll(imap);

  imap.once("ready", execute);
  imap.once("error", function (err) {
    console.log("❌ IMAP Connection error: " + err.message);
  });

  imap.connect();

  function execute() {
    function checkEmails() {
      imap.openBox("INBOX", false, function (err, mailBox) {
        if (err) {
          console.error("❌ Error opening mailbox:", err);
          return;
        }
        imap.search(["UNSEEN"], function (err, results) {
          if (!results || !results.length) {
            console.log(
              "📭 No new unread mails. Checking again in 10 seconds...",
            );
            return;
          }

          console.log(`📬 Found ${results.length} unread email(s)!`);

          imap.setFlags(results, ["\\Seen"], function (err) {
            if (!err) {
              console.log("✅ Marked emails as read");
            } else {
              console.error("❌ Error marking as read:", err);
            }
          });

          var f = imap.fetch(results, { bodies: "" });
          f.on("message", processMessage);
          f.once("error", function (err) {
            console.error("❌ Fetch error:", err);
          });
          f.once("end", function () {
            console.log("✅ Finished fetching emails.");
          });
        });
      });
    }

    // Check for new emails every 10 seconds
    setInterval(checkEmails, 10000);
  }

  function processMessage(msg, seqno) {
    console.log("📩 Processing msg #" + seqno);

    msg.on("body", function (stream) {
      simpleParser(stream, async (err, mail) => {
        if (err) {
          console.error("❌ Error parsing email:", err);
          return;
        }

        let username = mail.from.value[0].name || "Unknown";
        let mailid = mail.from.value[0].address || "Unknown";
        let subject = mail.subject || "No Subject";
        let content = (mail.text || "No content available")
  .replace(/\n/g, " ")
  .replace(/\t/g, " ")
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, 300);

        let formattedMessage =
          `👤 *Username*: ${username}\n` +
          `📧 *Mail*: ${mailid}\n` +
          `📌 *Subject*: ${subject}\n` +
          `📜 *Content*:\n${content}`;

        console.log("✅ Parsed message from:", mailid);

        // Send via Meta WhatsApp Cloud API
        await sendWhatsAppMessage(phonenumber1, {
          username,
          mail: mailid,
          subject,
          content,
        });
      });
    });

    msg.once("end", function () {
      console.log("✅ Finished msg #" + seqno);
    });
  }

  res.send("Email monitoring started ✅");
});

var port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});
