import React, { useState } from "react";
import axios from "axios";
import "./Scan.css";

const API =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://ping-to-mail-backend.onrender.com";

const instructionData = [
  {
    id: "imap",
    icon: "📧",
    title: "Enable IMAP in Gmail",
    steps: [
      "Open Gmail",
      "Click ⚙️ Settings (top-right corner)",
      <>Select <b>See all settings</b></>,
      <>Open the <b>Forwarding and POP/IMAP</b> tab</>,
      <>Under <b>IMAP Access</b>, select <b>Enable IMAP</b></>,
      <>Click <b>Save Changes</b></>,
    ],
  },
  {
    id: "apppass",
    icon: "🔐",
    title: "Generate Gmail App Password",
    steps: [
      "Open your Google Account",
      <>Go to <b>Security</b></>,
      <>Enable <b>2-Step Verification</b> first</>,
      <>Search for <b>App Passwords</b></>,
      <>Select App → <b>Mail</b> and Device → <b>Other</b></>,
      <>Enter any name like <b>Ping_To_Mail</b></>,
      <>Click <b>Generate</b></>,
      "Copy the generated 16-digit password",
    ],
  },
  {
    id: "number",
    icon: "📞",
    title: "Enter WhatsApp Number",
    steps: [
      "Enter only your 10-digit number",
      <>Do NOT add <b>+91</b>, spaces, or dashes</>,
      <>Example: <b>9876543210</b></>,
    ],
  },
  {
    id: "start",
    icon: "▶️",
    title: "Start Email Monitoring",
    steps: [
      "Enter your Gmail ID",
      "Paste the generated App Password",
      <>Click <b>Send Data</b></>,
      "The app monitors unread emails every 10 seconds",
      "New emails instantly arrive on WhatsApp 📲",
    ],
  },
];

const Scan = () => {
  const [view, setView] = useState(null); // null | 'instructions' | 'trynow'
  const [needed, setNeeded] = useState({ number: "", mailid: "", password: "" });
  const [lockmsg, setLockmsg] = useState("");
  const [locked, setLocked] = useState(false);
  const [locked1, setLocked1] = useState(true);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // '' | 'success' | 'error' | 'loading'
  const [activeModal, setActiveModal] = useState(null);

  const handleChange = (e) =>
    setNeeded({ ...needed, [e.target.name]: e.target.value });

  const handleUnlock = () => {
    setLocked(false);
    setLocked1(true);
    setLockmsg("");
    setStatus("");
    setStatusType("");
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setLocked(true);
  setLocked1(false);

  setStatus("⏳ Connecting to your email...");
  setStatusType("loading");

  setLockmsg(
    "✅ Running! Every 10 seconds, new emails will be forwarded to your WhatsApp."
  );

  try {
    const response = await axios.post(
      `${API}/okok`,
      {
        mailid: needed.mailid,
        password: needed.password,
        number: needed.number,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response.data);

    setStatus("✅ Connected! Watching for new emails...");
    setStatusType("success");
  } catch (error) {
    console.error("Error:", error);

    setStatus("❌ Error connecting. Check your email or app password.");
    setStatusType("error");

    setLocked(false);
    setLocked1(true);
    setLockmsg("");
  }
};

  const currentModal = instructionData.find((i) => i.id === activeModal);

  return (
    <div className="wms-root">
      {/* Header */}
      <header className="wms-header">
        <div className="wms-logo">
          <span className="wms-logo-icon">✉️</span>
        </div>
        <h1 className="wms-title">WhatsApp Mail Scanner</h1>
        <p className="wms-subtitle">Forward your Gmail to WhatsApp — instantly</p>
        <div className="wms-nav">
          <button
            className={`wms-nav-btn${view === "instructions" ? " active" : ""}`}
            onClick={() => setView(view === "instructions" ? null : "instructions")}
          >
            Instructions
          </button>
          <button
            className={`wms-nav-btn${view === "trynow" ? " active" : ""}`}
            onClick={() => setView(view === "trynow" ? null : "trynow")}
          >
            Try Now
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="wms-main">

        {/* Instructions Panel */}
        {view === "instructions" && (
          <section className="wms-card wms-card--instructions" aria-label="Setup instructions">
            <h2 className="wms-card-title">Setup Instructions</h2>
            <p className="wms-card-desc">Click any step to expand the guide.</p>
            <div className="wms-instruction-grid">
              {instructionData.map((item) => (
                <button
                  key={item.id}
                  className="wms-instruction-tile"
                  onClick={() => setActiveModal(item.id)}
                  aria-haspopup="dialog"
                >
                  <span className="wms-tile-icon" aria-hidden="true">{item.icon}</span>
                  <span className="wms-tile-title">{item.title}</span>
                  <span className="wms-tile-arrow" aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Try Now Panel */}
        {view === "trynow" && (
          <section className="wms-card wms-card--form" aria-label="Email to WhatsApp setup form">
            <h2 className="wms-card-title">Email to WhatsApp</h2>
            <p className="wms-card-desc">
              Enter your details below. New unread emails will be forwarded to your WhatsApp automatically.
            </p>

            <form className="wms-form" onSubmit={handleSubmit} noValidate>
              <div className="wms-field">
                <label htmlFor="number" className="wms-label">
                  Phone Number
                  <span className="wms-label-hint">without country code</span>
                </label>
                <input
                  id="number"
                  type="tel"
                  name="number"
                  value={needed.number}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  maxLength={10}
                  className="wms-input"
                  disabled={locked}
                />
              </div>

              <div className="wms-field">
                <label htmlFor="mailid" className="wms-label">Gmail Address</label>
                <input
                  id="mailid"
                  type="email"
                  name="mailid"
                  value={needed.mailid}
                  onChange={handleChange}
                  placeholder="yourname@gmail.com"
                  required
                  className="wms-input"
                  disabled={locked}
                />
              </div>

              <div className="wms-field">
                <label htmlFor="password" className="wms-label">
                  App Password
                  <span className="wms-label-hint">16-digit, from Google Account</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={needed.password}
                  onChange={handleChange}
                  placeholder="xxxxxxxxxxxxxxxx"
                  required
                  className="wms-input"
                  disabled={locked}
                />
              </div>

              <button type="submit" className="wms-submit-btn" disabled={locked}>
                {locked ? (
                  <>
                    <span className="wms-spinner" aria-hidden="true"></span>
                    Running…
                  </>
                ) : (
                  "Send Data"
                )}
              </button>
            </form>

            {status && (
              <div className={`wms-status wms-status--${statusType}`} role="status" aria-live="polite">
                <span>{status}</span>
              </div>
            )}

            {lockmsg && (
              <div className="wms-running-msg">
                <div className="wms-running-dot" aria-hidden="true"></div>
                <p className="wms-running-text">{lockmsg}</p>
                <button
                  className="wms-stop-btn"
                  disabled={locked1}
                  onClick={handleUnlock}
                >
                  Stop &amp; Unlock
                </button>
              </div>
            )}
          </section>
        )}

        {/* Landing state */}
        {view === null && (
          <div className="wms-landing">
            <div className="wms-feature-grid">
              {[
                { icon: "⚡", label: "Every 10 seconds", desc: "Email checks run continuously" },
                { icon: "📲", label: "Instant delivery", desc: "Forwarded straight to WhatsApp" },
                { icon: "🔒", label: "App password safe", desc: "No full account access needed" },
              ].map((f) => (
                <div className="wms-feature-card" key={f.label}>
                  <span className="wms-feature-icon" aria-hidden="true">{f.icon}</span>
                  <strong className="wms-feature-label">{f.label}</strong>
                  <span className="wms-feature-desc">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {activeModal && currentModal && (
        <div
          className="wms-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={currentModal.title}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="wms-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="wms-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="wms-modal-header">
              <span className="wms-modal-icon" aria-hidden="true">{currentModal.icon}</span>
              <h2 className="wms-modal-title">{currentModal.title}</h2>
            </div>

            <ol className="wms-steps" aria-label="Steps">
              {currentModal.steps.map((step, i) => (
                <li key={i} className="wms-step">
                  <span className="wms-step-num" aria-hidden="true">{i + 1}</span>
                  <span className="wms-step-text">{step}</span>
                </li>
              ))}
            </ol>

            <button className="wms-modal-done" onClick={() => setActiveModal(null)}>
              Got it ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scan;