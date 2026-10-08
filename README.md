[finsim readme.md](https://github.com/user-attachments/files/33212867/finsim.readme.md)
# FinSim — Financial Shock & Decision Simulator

A full-stack personal finance simulation platform that lets you stress-test your financial situation against real-world scenarios before they happen. Built with the MERN stack.

---

## What does it do?

FinSim gives you a **safe sandbox** to answer hard financial questions:

- *"If I lose my job for 6 months, how long will my savings last?"*
- *"Can I afford that ₹40L car loan without wrecking my monthly budget?"*
- *"How resilient is my portfolio to a 30% market crash?"*

You enter your real financial profile once, and the simulators run the math for you — returning concrete numbers like remaining savings, new debt-to-income ratio, emergency fund runway, and an overall risk level.

---

## Features

| Module | What it does |
|---|---|
| **Shock Simulator** | Models income loss, unexpected expenses, and market drops. Calculates remaining savings, new net worth, and emergency fund runway after the shock. |
| **Decision Simulator** | Models major purchase/loan decisions. Computes EMI via standard amortization, total interest paid, disposable income change, and updated savings rate. |
| **Resilience Analyzer** | Scores your portfolio's overall resilience and surfaces weak points. |
| **Financial Overview** | Dashboard view of your full financial picture. |
| **Recommendation Engine** | Generates actionable, rule-based suggestions based on simulation results. |

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Redux Toolkit (state management)
- Framer Motion (animations)
- Headless UI + Lucide React (UI components)
- Axios (API calls)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (bcryptjs + jsonwebtoken)
- Helmet, CORS, express-rate-limit (security)
- Morgan (logging), Nodemon (dev)

---

## Project Structure

```
FinSim/
├── .env.example
├── client/                  # React + Vite frontend
│   └── src/
│       ├── App.jsx
│       ├── features/
│       │   ├── auth/        # Login, register, password reset
│       │   ├── profile/     # Financial profile setup
│       │   ├── overview/    # Financial overview dashboard
│       │   ├── shock/       # Shock Simulator UI
│       │   ├── decision/    # Decision Simulator UI
│       │   ├── resilience/  # Resilience Analyzer UI
│       │   └── dashboard/   # Summary dashboard
│       ├── components/
│       ├── hooks/
│       └── utils/
└── server/                  # Express API
    ├── server.js
    ├── app.js
    ├── config/
    ├── controllers/
    ├── middleware/          # Auth, rate limiter, error handler
    ├── models/              # User, FinancialProfile, Simulation, Recommendation, AuditLog
    ├── routes/              # auth, profile, simulation, analysis, dashboard
    ├── services/
    ├── simulation/          # Core simulation engine
    │   ├── shockSimulator.js
    │   ├── decisionSimulator.js
    │   ├── resilienceAnalyzer.js
    │   ├── recommendationEngine.js
    │   └── validators.js
    └── utils/               # financialMath helpers (EMI, DTI, net worth, risk)
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or a local MongoDB instance)

### 1. Clone & configure environment

```bash
git clone https://github.com/rahilkm/FinSim.git
cd FinSim
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/finsim
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev        # starts on http://localhost:5000
```

### 3. Start the frontend

```bash
cd client
npm install
npm run dev        # starts on http://localhost:5173
```

The frontend is configured to proxy all `/api` requests to `http://localhost:5000`, so no extra CORS setup is needed in development.

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET/PUT | `/api/profile` | Get or update financial profile |
| POST | `/api/simulation/shock` | Run a shock simulation |
| POST | `/api/simulation/decision` | Run a decision simulation |
| GET | `/api/analysis/resilience` | Get resilience analysis |
| GET | `/api/dashboard` | Get dashboard summary |

All routes except auth require a valid JWT in the `Authorization: Bearer <token>` header.

---

## How the Simulations Work

### Shock Simulator
Given your profile (income, expenses, savings, investments) and shock parameters (income loss %, unexpected expense, market drop %, duration in months):

```
new_income         = monthly_income × (1 − income_loss_percent)
new_expenses       = monthly_expenses + unexpected_expense
monthly_net        = new_income − new_expenses
remaining_savings  = max(0, savings + monthly_net × duration_months)
new_investments    = investments × (1 − market_drop_percent)
emergency_runway   = remaining_savings / monthly_expenses  (in months)
```

### Decision Simulator
Given a major purchase (cost, down payment, interest rate %, tenure in months):

```
loan_amount            = purchase_cost − down_payment
new_emi                = standard amortization formula
total_interest         = (new_emi × tenure) − loan_amount
disposable_income_after = monthly_income − monthly_expenses − total_emi
new_debt_to_income     = total_emi / monthly_income
```

---

## License

MIT
