import React, { useState } from 'react';
import '../styles/login.css';
import { apiClient } from '../api/client';
import type { User } from '../types';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await apiClient.post<{ token: string, user: User }>('/auth/login', {
                username,
                password
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
                const userInfo = {
                    id: data.user.ID || data.user.id,
                    username: data.user.username,
                    role: data.user.role
                };
                localStorage.setItem('user', JSON.stringify(userInfo));
                window.location.href = '/';
            }
        } catch (err: any) {
            setError(err.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-visual">
            </div>
            <div className="login-form-side">
                <div className="login-card">
                    <div className="login-header">
                        <img src="/logo1dikey.png" alt="Logo" style={{ width: '120px', marginBottom: '24px', display: 'block', margin: '0 auto' }} />
                        <h2>Giriş Yap</h2>
                        <p>Sistem erişimi için bilgilerinizi girin</p>
                    </div>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Kullanıcı Adı</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Kullanıcı adınız"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && <div className="login-error">{error}</div>}
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
