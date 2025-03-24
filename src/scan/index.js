import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./Scan.css";

const Scan = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTryNow, setShowTryNow] = useState(false);
  const [url, setUrl] = useState("");
  const [needed, setNeeded] = useState({ number: "", mailid: "", password: "" });
  const [lockmsg, setLockmsg] = useState("");
  const [locked, setLocked] = useState(false);
  const [locked1, setLocked1] = useState(true);

  const handleChange = (e) => {
    setNeeded({ ...needed, [e.target.name]: e.target.value });
  };

  const handleUnlock = () => {
    setLocked(false);
    setLocked1(true);
    setLockmsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Needed Created", needed);

    setLocked(true);
    setLocked1(false);
    setLockmsg(
      "Data locked. Click below to release it. Check WhatsApp! Every minute, mails are fetched to your WhatsApp account."
    );

    const mydata = {
      mailid: `${needed.mailid}`,
      password: `${needed.password}`,
      number: `${needed.number}`,
    };

    (function myLoop(i) {
      setTimeout(() => {
        axios
          .post("http://localhost:8000/okok", mydata, {
            headers: {
              "Content-Type": "application/json",
              Accept: "Token",
              "Access-Control-Allow-Origin": "*",
            },
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.error(err));

        if (--i) myLoop(i);
      }, 60000);
    })(5000); // Loop 5000 times every 60s
  };

  const getQr = () => {
    axios
      .get("http://localhost:8000/")
      .then((response) => {
        setUrl(response.data);
        console.log("QR Code URL:", response.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <h1>WhatsApp Mail Scanner</h1>
      <p>Connect your email to WhatsApp notifications</p>

      {/* Buttons Section */}
      <div className="button-container">
        <button onClick={() => { setShowInstructions(true); setShowTryNow(false); }}>
          Instructions
        </button>
        <button onClick={() => { setShowTryNow(true); setShowInstructions(false); }}>
          Try Now
        </button>
      </div>

      {/* Instructions Section */}
      {showInstructions && (
        <div className="card">
          <h2>📌 Instructions to Follow:</h2>
          <ul className="instructions-list">
            <li>🔄 <strong>Wait</strong> for your QR to load. The initial QR <strong>won't work</strong>.</li>
            <li>📱 Open <strong>WhatsApp</strong> → <strong>Linked Devices</strong> → Scan QR.</li>
            <li>📧 <strong>Enable IMAP</strong> in Gmail.</li>
            <li>🔐 Enable <strong>2-factor authentication</strong> & set an <strong>"App Password"</strong>.</li>
            <li>📞 Enter your <strong>phone number</strong> (without spaces) (Eg: 1234567890).</li>
            <li>✉️ Enter your <strong>IMAP-enabled email</strong> & <strong>App Password</strong>.</li>
            <li>✅ Click <strong>Submit</strong>.</li>
            <li>📲 Check your <strong>WhatsApp</strong> for alerts.</li>
          </ul>
        </div>     
      )}

      {/* Try Now Section */}
      {showTryNow && (
        <div className="card">
          <h2>Scan QR Code</h2>
          <div className="qr-container">
            <div className="qr-code">
              <QRCodeCanvas id="qrCode" value={url} size={200} bgColor={"#ffffff"} level={"H"} />
            </div>
            <button className="get-qr-btn" onClick={getQr}>Get QR</button>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Phone Number</label>
            <input type="tel" name="number" value={needed.number} onChange={handleChange} required placeholder="Enter phone number" />

            <label>Email ID</label>
            <input type="email" name="mailid" value={needed.mailid} onChange={handleChange} required placeholder="Enter email" />

            <label>Password</label>
            <input type="password" name="password" value={needed.password} onChange={handleChange} required placeholder="Enter password" />

            <button type="submit" disabled={locked}>Send Data</button>
          </form>

          {lockmsg && (
            <div className="lock-msg">
              <p>{lockmsg}</p>
              <button className="unlock-btn" disabled={locked1} onClick={handleUnlock}>Unlock</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scan;
