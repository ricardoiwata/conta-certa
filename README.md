# 💰 Conta Certa

> **Your smart and simple financial assistant.**

**Conta Certa** is a full-featured personal finance management application built with modern technologies. It allows users to track income and expenses, visualize data through intuitive charts, and get financial insights with the help of AI.

---

## 🌎 About the Project

This project was developed as part of my portfolio to demonstrate full-stack development skills, including scalable backend architecture, mobile development, and AI integration.

---

## 🚀 Features

- 📊 Interactive Dashboard: Overview of balance, income, and expenses with clear visualizations.
- 💸 Transaction Management: Easily add income and expenses (one-time or recurring).
- 🤖 AI Chatbot: Ask financial questions and receive personalized tips powered by Google Gemini.
- 📂 Categorization: Organize transactions with customizable categories.
- 🔔 Notifications: Get reminders for upcoming bills and useful tips.
- 📄 Reports: Generate detailed PDF reports for deeper analysis.
- 🔐 Secure Authentication: Firebase-based login and registration.
- 📱 Modern UI: Clean and responsive interface built with React Native Paper.

---

## 🛠️ Tech Stack

This project is structured as a monorepo with Backend and Frontend:

### Backend (API)
- Framework: NestJS
- Language: TypeScript
- Database: SQLite / MySQL (via TypeORM)
- Authentication: Firebase Admin SDK
- Testing: Jest

### Frontend (Mobile)
- Framework: Expo (React Native)
- Routing: Expo Router
- UI Library: React Native Paper
- Charts: React Native Chart Kit
- AI Integration: Google Generative AI SDK
- Testing: Jest & Testing Library

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Firebase account

---

### 1. Clone the repository

```bash
git clone https://github.com/ricardoiwata/conta-certa.git
cd conta-certa
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

Backend runs at http://localhost:3000

---

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Use Expo Go or an emulator to run the app.

---

## 🧪 Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

---

## 📂 Project Structure

```
conta-certa/
├── backend/
│   ├── src/
│   ├── test/
├── frontend/
│   ├── app/
│   ├── src/
└── README.md
```
