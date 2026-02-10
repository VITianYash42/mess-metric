# 🌿 Mess-Metric: Smart Food Sustainability Portal

![Mess Metric Banner](https://img.shields.io/badge/Status-Live-success?style=for-the-badge) ![Tech](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge) ![AI](https://img.shields.io/badge/AI-Gemini_Powered-orange?style=for-the-badge)

> **Transforming campus dining with AI-driven analytics, reducing food waste, and rewarding eco-conscious students.**

🌐 **Live Demo:** [https://mess-metric.vercel.app](https://mess-metric.vercel.app)

---

## 🚀 Overview

**Mess-Metric** is a comprehensive solution designed to bridge the gap between students and mess management. By digitizing the feedback loop and gamifying food sustainability, we aim to drastically reduce food waste in college campuses.

We use **Google Gemini AI** to analyze student feedback in real-time, categorizing reviews by sentiment and severity to give mess managers actionable insights instantly.

---

## ✨ Key Features

### 👨‍🎓 **For Students**
* **AI-Powered Reviews:** Submit daily food reviews. Our AI automatically tags them (e.g., "Too Oily", "Spicy") and assigns a **Severity Score** (-1 to +1).
* **Gamified Sustainability:** Earn **Mess Coins** for consistent reviews and "Zero Waste" streaks.
* **Leaderboard:** Compete with peers to become the monthly "Green Champion".
* **Menu & Rebates:** Check daily menus and apply for meal rebates instantly.

### 👨‍🍳 **For Admins/Managers**
* **Live Analytics Dashboard:** Visualize feedback trends and waste data.
* **Severity Alerts:** Instant highlighting of critical negative feedback (e.g., "Stale food").
* **Inventory Tracking:** Monitor consumption patterns to optimize cooking quantities.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **AI Engine** | Google Gemini API (Natural Language Processing) |
| **Deployment** | Vercel (Client) + Render (Server) |

---

## ⚡ Quick Start (Run Locally)

### 1. Clone the Repository
```bash
git clone [https://github.com/VITianYash42/mess-metric.git](https://github.com/VITianYash42/mess-metric.git)
cd mess-metric

### 2. Backend Setup
```bash
cd server
npm install

Create a .env file in the server folder:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_key

Run the server:
```bash
npm start

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev

## 🔐 Demo Credentials (For Judges)

Don't want to sign up? Use our one-click **Demo Mode** on the Login page, or use these credentials:

* **Role:** Student / Judge
* **Email:** `judge@vitbhopal.ac.in`
* **Password:** `JudgePass123`

---

## 🤝 Contributors

* **Yash Singhal** - AI Logic & Integration
* **Aditya Mittal** - Frontend & UI/UX
* **Raghav** - Backend Development

---

Made with 💚 at **VIT Bhopal** for a greener future.
