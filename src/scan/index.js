import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./Scan.css";

// 🔥 Dynamic API URL (IMPORTANT)
const API =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://ping-to-mail.onrender.com"; // change after deploy

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
      mailid: needed.mailid,
      password: needed.password,
      number: needed.number,
    };

    (function myLoop(i) {
      setTimeout(() => {
        axios
          .post(`${API}/okok`, mydata, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log("Response:", res.data);
          })
          .catch((err) => console.error("Error:", err));

        if (--i) myLoop(i);
      }, 60000);
    })(5000);
  };

  const getQr = () => {
    axios
      .get(`${API}/`)
      .then((response) => {
        setUrl(response.data);
        console.log("QR Code:", response.data);
      })
      .catch((err) => console.error("QR Error:", err));
  };

  return (
    <div className="container">
      <h1>WhatsApp Mail Scanner</h1>
      <p>Connect your email to WhatsApp notifications</p>

      <div className="button-container">
        <button onClick={() => { setShowInstructions(true); setShowTryNow(false); }}>
          Instructions
        </button>
        <button onClick={() => { setShowTryNow(true); setShowInstructions(false); }}>
          Try Now
        </button>
      </div>

      {showInstructions && (
        <div className="card">
          <h2>📌 Instructions to Follow:</h2>
          <ul className="instructions-list">
            <li>🔄 Wait for QR (first one won’t work)</li>
            <li>📱 WhatsApp → Linked Devices → Scan QR</li>
            <li>📧 Enable IMAP in Gmail</li>
            <li>🔐 Use App Password</li>
            <li>📞 Enter phone number</li>
            <li>✉️ Enter email + app password</li>
            <li>✅ Click Submit</li>
          </ul>
        </div>
      )}

      {showTryNow && (
        <div className="card">
          <h2>Scan QR Code</h2>

          <div className="qr-container">
            <QRCodeCanvas value={url} size={200} />
            <button className="get-qr-btn" onClick={getQr}>
              Get QR
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Phone Number</label>
            <input type="tel" name="number" value={needed.number} onChange={handleChange} required />

            <label>Email ID</label>
            <input type="email" name="mailid" value={needed.mailid} onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" value={needed.password} onChange={handleChange} required />

            <button type="submit" disabled={locked}>Send Data</button>
          </form>

          {lockmsg && (
            <div className="lock-msg">
              <p>{lockmsg}</p>
              <button disabled={locked1} onClick={handleUnlock}>
                Unlock
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scan;