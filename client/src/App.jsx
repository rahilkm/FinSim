import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import AuthPage from './features/auth/AuthPage';
import FinancialOverview from './features/overview/FinancialOverview';
import ProfileSetup from './features/profile/ProfileSetup';
import ShockSimulator from './features/shock/ShockSimulator';
import DecisionSimulator from './features/decision/DecisionSimulator';

import RequireProfile from './components/layout/RequireProfile';

function PrivateRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(20, 20, 20, 0.9)",
            color: "#e5e7eb",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            fontSize: "13px",
            padding: "10px 14px",
            backdropFilter: "blur(8px)",
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Protected */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* Profile route is accessible without a profile so users can create one */}
          <Route path="/profile" element={<ProfileSetup />} />

          {/* Routes that require a completed profile */}
          <Route element={<RequireProfile />}>
            <Route path="/" element={<FinancialOverview />} />
            <Route path="/shock" element={<ShockSimulator />} />
            <Route path="/decision" element={<DecisionSimulator />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
