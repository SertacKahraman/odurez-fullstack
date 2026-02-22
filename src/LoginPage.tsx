import React, { useState } from 'react';
import './login.css'; // Space Grotesk ve ek stiller için

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Giriş butonuna tıklanınca login isteği at
    const handleLogin = async () => {
        const res = await fetch('http://10.15.0.15:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password })
        });
        if (!res.ok) {
            alert('Giriş başarısız!');
            return;
        }
        const data = await res.json();
        const token = data.token || data.access_token || data.jwt || data.data;
        if (!token) {
            alert('Token alınamadı!');
            return;
        }
        localStorage.setItem('token', token);
        // Kullanıcı adı ve rolü backend'den gelen user objesinden alınacak
        let role = data.user?.role || data.role;
        // Eğer user array ise (bazı backendlerde olabilir)
        if (!role && Array.isArray(data.user) && data.user.length > 0) {
            role = data.user[0].role;
        }
        // Eğer hala yoksa, token'dan çözümle (JWT ise)
        if (!role && token) {
            try {
                const payload = token.split('.')[1];
                if (payload) {
                    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
                    role = decoded.role || (decoded.authorities && decoded.authorities[0]?.authority?.replace('ROLE_', ''));
                }
            } catch { }
        }
        let userId = data.user?.id;
        if (!userId && token) {
            try {
                const payload = token.split('.')[1];
                if (payload) {
                    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
                    userId = decoded.id || decoded.userId || decoded.sub || null;
                }
            } catch { }
        }
        localStorage.setItem('user', JSON.stringify({ id: userId, username: data.user?.username || email, role }));
        // Giriş sonrası ana sayfaya yönlendir
        window.location.href = '/';
    };

    return (
        <div className="login-root">
            {/* Sol görsel */}
            <div className="login-left-image" />
            {/* Sağ form alanı */}
            <div className="login-right-form">
                {/* Logo */}
                <img src="/logo1dikey.png" alt="Logo" className="login-logo" />
                {/* Başlık */}
                <div className="login-title">Salon Rezervasyon Sistemi</div>
                <div className="login-subtitle">Giriş Yap</div>
                {/* E-posta alanı */}
                <div className="login-input-wrapper">
                    <input
                        type="email"
                        placeholder="E-Posta Adresinizi Giriniz"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="login-input"
                    />
                </div>
                {/* Şifre alanı */}
                <div className="login-input-wrapper" style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Şifre"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="login-input"
                        style={{ paddingRight: 48 }}
                    />
                    {/* Şifreyi göster/gizle ikonu */}
                    <span
                        onClick={() => setShowPassword(v => !v)}
                        className="login-eye-icon"
                    >
                        {showPassword ? (
                            // Göz açık
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M1 12C2.73 7.61 7.11 4.5 12 4.5c4.89 0 9.27 3.11 11 7.5-1.73 4.39-6.11 7.5-11 7.5-4.89 0-9.27-3.11-11-7.5Z" stroke="#4A4E68" strokeWidth="1.7" /><circle cx="12" cy="12" r="3.5" stroke="#4A4E68" strokeWidth="1.7" /></svg>
                        ) : (
                            // Göz kapalı
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M1 12c2.73-4.39 7.11-7.5 11-7.5 2.13 0 4.15.56 5.89 1.54M23 12c-1.73 4.39-6.11 7.5-11 7.5-2.13 0-4.15-.56-5.89-1.54" stroke="#4A4E68" strokeWidth="1.7" /><circle cx="12" cy="12" r="3.5" stroke="#4A4E68" strokeWidth="1.7" /></svg>
                        )}
                    </span>
                </div>
                {/* Giriş butonu */}
                <button className="login-button" onClick={handleLogin}>Giriş</button>
            </div>
        </div>
    );
};

export default LoginPage; 