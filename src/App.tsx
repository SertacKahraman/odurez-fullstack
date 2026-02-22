import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RezervasyonOlustur from './pages/RezervasyonOlustur';
import MainLayout from './components/layout/MainLayout';
import TumRezervasyonlar from './pages/TumRezervasyonlar';
import './styles/App.css';
import BilgiGirisi from './pages/BilgiGirisi';
import RezervasyonDuzenle from './pages/RezervasyonDuzenle';
import { useAuth } from './hooks/useAuth';

import Rezervasyonlarim from './pages/Rezervasyonlarim';

// Yetkisiz girişi engellemek için koruyucu bileşen
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Giriş Sayfası */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />

        {/* Korumalı Rotalar */}
        <Route path="/" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/rezervasyon-olustur" element={<ProtectedRoute><RezervasyonOlustur /></ProtectedRoute>} />
        <Route path="/rezervasyonlarim" element={
          <ProtectedRoute>
            <Rezervasyonlarim />
          </ProtectedRoute>
        } />
        <Route path="/tum-rezervasyonlar" element={<ProtectedRoute><TumRezervasyonlar /></ProtectedRoute>} />
        <Route path="/bilgi-girisi" element={<ProtectedRoute><BilgiGirisi /></ProtectedRoute>} />
        <Route path="/rezervasyon-duzenle/:id" element={<ProtectedRoute><RezervasyonDuzenle /></ProtectedRoute>} />

        {/* Yanlış URL'leri ana sayfaya yönlendir */}
        <Route path="*" element={<Navigate to="/" replace />} />
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CalendarPage from './CalendarPage';
import LoginPage from './LoginPage';
import RezervasyonOlustur from './RezervasyonOlustur';
import React from 'react';
import MainLayout from './MainLayout';
import TumRezervasyonlar from './TumRezervasyonlar';
import './App.css';
import BilgiGirisi from './BilgiGirisi';
import RezervasyonDuzenle from './RezervasyonDuzenle';

const Rezervasyonlarim = React.lazy(() => import('./Rezervasyonlarim'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/rezervasyon-olustur" element={<MainLayout><RezervasyonOlustur /></MainLayout>} />
        <Route path="/rezervasyonlarim" element={<MainLayout><React.Suspense fallback={<div>Yükleniyor...</div>}><Rezervasyonlarim /></React.Suspense></MainLayout>} />
        <Route path="/tum-rezervasyonlar" element={<MainLayout><TumRezervasyonlar /></MainLayout>} />
        <Route path="/bilgi-girisi" element={<MainLayout><BilgiGirisi /></MainLayout>} />
        <Route path="/rezervasyon-duzenle/:id" element={<MainLayout><RezervasyonDuzenle /></MainLayout>} />
        <Route path="/" element={<MainLayout><CalendarPage /></MainLayout>} />
>>>>>>> 1f5175d544687031d60f2a7a94be8b75bb2d2414
      </Routes>
    </BrowserRouter>
  );
}

export default App;
