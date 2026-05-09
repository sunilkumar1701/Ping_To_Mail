# 📩 Ping_To_Mail

Real-time Gmail to WhatsApp notification system using Node.js, IMAP, React, and Meta WhatsApp Cloud API.

---

## 🚀 Live Demo

### 🌐 Frontend

https://ping-to-mail-frontend.onrender.com/

### ⚙️ Backend

https://ping-to-mail-backend.onrender.com/

---

# 📌 Project Overview

Ping_To_Mail is a full-stack MERN-based automation project that monitors unread Gmail messages and instantly forwards them to WhatsApp using the Meta WhatsApp Cloud API.

The system continuously checks incoming emails every 10 seconds using IMAP and sends beautifully formatted WhatsApp alerts containing:

* 👤 Sender Name
* 📧 Sender Mail ID
* 📌 Subject
* 📜 Mail Content

This project was built to automate email notifications directly into WhatsApp for faster communication and accessibility.

---

# ✨ Features

* 📩 Real-time Gmail monitoring
* 📲 WhatsApp instant notifications
* 🔄 Automatic unread email detection
* ✅ Marks emails as read after processing
* ⚡ Checks emails every 10 seconds
* 🌐 Fully deployed on Render
* 🔐 Secure Gmail App Password authentication
* 📱 Responsive React frontend UI
* ☁️ Meta WhatsApp Cloud API integration

---

# 🛠️ Technologies Used

## Frontend

* React.js
* Axios
* CSS3

## Backend

* Node.js
* Express.js
* IMAP
* Mailparser
* Axios
* dotenv
* body-parser
* cors

## APIs & Services

* Meta WhatsApp Cloud API
* Gmail IMAP

## Deployment

* Render (Frontend + Backend)
* GitHub

---

# 🧠 How This Project Works

## Step 1 — User Connects Gmail

The user enters:

* WhatsApp Number
* Gmail ID
* Gmail App Password

through the React frontend.

---

## Step 2 — Backend Receives Credentials

The backend API receives the data using Express.js.

---

## Step 3 — IMAP Connection

Node.js establishes a secure IMAP connection with Gmail servers.

---

## Step 4 — Email Monitoring

The server checks unread emails every 10 seconds.

---

## Step 5 — Email Parsing

Mailparser extracts:

* Sender Name
* Sender Email
* Subject
* Message Content

---

## Step 6 — WhatsApp Notification

The backend sends the formatted email content to WhatsApp using the Meta WhatsApp Cloud API template messaging system.

---

# 📂 Project Structure

```bash
Ping_To_Mail/
│
├── public/
├── src/
│   ├── scan/
│   ├── App.js
│   └── index.js
│
├── server/
│   ├── index1.js
│   ├── package.json
│   ├── start.sh
│   └── .env
│
├── package.json
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=8000

WHATSAPP_TOKEN=YOUR_META_ACCESS_TOKEN

WHATSAPP_PHONE_ID=YOUR_PHONE_NUMBER_ID
```

---

# 🔐 Gmail Setup Instructions

## Enable IMAP

* Open Gmail Settings
* Go to "Forwarding and POP/IMAP"
* Enable IMAP

## Generate App Password

* Open Google Account
* Security → 2-Step Verification
* App Passwords
* Generate a 16-digit app password

---

# ▶️ Run Locally

## Clone Repository

```bash
git clone https://github.com/sunilkumar1701/Ping_To_Mail.git
```

---

## Install Frontend Dependencies

```bash
npm install
```

---

## Install Backend Dependencies

```bash
cd server
npm install
```

---

## Start Frontend

```bash
npm start
```

---

## Start Backend

```bash
node index1.js
```

---

# 📸 Screenshots

* ✅ WhatsApp notifications received successfully
  <img width="1373" height="1007" alt="image" src="https://github.com/user-attachments/assets/2999caa2-980f-43a5-990a-ab8af6fd2bbe" />

* ✅ Render deployment working
  <img width="1918" height="987" alt="image" src="https://github.com/user-attachments/assets/45adff99-9f9a-4092-a288-bc7b9882032e" />
  <img width="1918" height="200" alt="image" src="https://github.com/user-attachments/assets/50e8c6c2-19b7-4b8f-b01d-7b1ad849c524" />


* ✅ Gmail email monitoring active
  <img width="1918" height="947" alt="image" src="https://github.com/user-attachments/assets/d4b7ec56-4ac7-4990-845d-dcdf83e247e7" />


---

# 📈 Future Improvements

* 🔔 Push notifications
* 📎 Attachment support
* 👥 Multiple account support
* 🤖 AI-generated email summaries
* 📊 Dashboard analytics
* 🔐 OAuth authentication

---

# 👨‍💻 Author

## Sunil Kumar P

MERN Stack Developer
B.Tech Information Technology

* GitHub: https://github.com/sunilkumar1701

---

# ⭐ Support

If you like this project:

* ⭐ Star the repository
* 🍴 Fork the project
* 📢 Share it with others

---
