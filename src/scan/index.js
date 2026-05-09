import React, { useState } from "react";
import axios from "axios";
import "./Scan.css";

const API =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://ping-to-mail-backend.onrender.com";

const Scan = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTryNow, setShowTryNow] = useState(false);
  const [needed, setNeeded] = useState({ number: "", mailid: "", password: "" });
  const [lockmsg, setLockmsg] = useState("");
  const [locked, setLocked] = useState(false);
  const [locked1, setLocked1] = useState(true);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setNeeded({ ...needed, [e.target.name]: e.target.value });
  };

  const handleUnlock = () => {
    setLocked(false);
    setLocked1(true);
    setLockmsg("");
    setStatus("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLocked(true);
    setLocked1(false);
    setStatus("⏳ Connecting to your email...");
    setLockmsg(
      "✅ Running! Every 10 seconds, new emails will be forwarded to your WhatsApp."
    );

    const mydata = {
      mailid: needed.mailid,
      password: needed.password,
      number: needed.number,
    };

    // Send once immediately
    axios
      .post(`${API}/okok`, mydata, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log("Response:", res.data);
        setStatus("✅ Connected! Watching for new emails...");
      })
      .catch((err) => {
        console.error("Error:", err);
        setStatus("❌ Error connecting. Check your email/password.");
        setLocked(false);
        setLocked1(true);
      });
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
            <li>📧 Enable IMAP in Gmail Settings</li>
            <li>🔐 Generate an App Password in your Google Account</li>
            <li>📞 Enter your WhatsApp phone number (without +91)</li>
            <li>✉️ Enter your Gmail ID and App Password</li>
            <li>✅ Click Send Data — new emails will arrive on WhatsApp!</li>
          </ul>
        </div>
      )}

      {showTryNow && (
        <div className="card">
          <h2>📧 Email to WhatsApp</h2>
          <p style={{ color: "#666", marginBottom: "16px" }}>
            New emails will be forwarded to your WhatsApp automatically.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Phone Number (without +91)</label>
            <input
              type="tel"
              name="number"
              value={needed.number}
              onChange={handleChange}
              placeholder="8148487561"
              required
            />

            <label>Gmail ID</label>
            <input
              type="email"
              name="mailid"
              value={needed.mailid}
              onChange={handleChange}
              placeholder="yourname@gmail.com"
              required
            />

            <label>App Password</label>
            <input
              type="password"
              name="password"
              value={needed.password}
              onChange={handleChange}
              placeholder="16-digit app password"
              required
            />

            <button type="submit" disabled={locked}>
              {locked ? "Running..." : "Send Data"}
            </button>
          </form>

          {status && (
            <p style={{ marginTop: "12px", fontWeight: "bold" }}>{status}</p>
          )}

          {lockmsg && (
            <div className="lock-msg">
              <p>{lockmsg}</p>
              <button disabled={locked1} onClick={handleUnlock}>
                Stop & Unlock
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scan;