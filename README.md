# FinSim — Financial Shock & Decision Simulator

A MERN-stack personal finance simulation platform.

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)

### 1. Environment Setup
```bash
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
```

### 2. Backend
```bash
cd server
npm install
npm run dev    # starts on port 5000
```

### 3. Frontend
```bash
cd client
npm install 
npm run dev    # starts on port 5173
```

The frontend proxies API calls to `http://localhost:5000`.

## Modules
- **Shock Simulator** — job loss, medical emergency, market crash
- **Decision Simulator** — EMI, loan impact, disposable income
- **Resilience Analyzer** — composite financial health score (0–100)
- **Recommendation Engine** — rule-based financial advice

## Tech Stack
| Layer | Stack |
|---|---|
| Frontend | React, Vite, Redux Toolkit, TailwindCSS, Recharts, Framer Motion |
| Backend | Node.js, Express, Mongoose, JWT, Joi, Winston |
| Database | MongoDB Atlas |
