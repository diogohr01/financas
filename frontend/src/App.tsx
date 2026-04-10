import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Toaster } from '@/components/ui/Toaster';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';

// Auth pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

// App pages
import Dashboard from '@/pages/Dashboard';
import Revenues from '@/pages/Revenues';
import Expenses from '@/pages/Expenses';
import Goals from '@/pages/Goals';
import Simulations from '@/pages/Simulations';
import Crypto from '@/pages/Crypto';
import AIPredictions from '@/pages/AIPredictions';
import Reports from '@/pages/Reports';

export default function App() {
  const { darkMode } = useUIStore();
  const { toasts, dismiss } = useToast();

  // Initialize auth listener
  useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="receitas" element={<Revenues />} />
          <Route path="despesas" element={<Expenses />} />
          <Route path="metas" element={<Goals />} />
          <Route path="simulacoes" element={<Simulations />} />
          <Route path="crypto" element={<Crypto />} />
          <Route path="previsoes" element={<AIPredictions />} />
          <Route path="relatorios" element={<Reports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster toasts={toasts} dismiss={dismiss} />
    </BrowserRouter>
  );
}
