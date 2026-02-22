import React from 'react';

interface SidebarProps {
    user: any;
    navigate: (path: string) => void;
    view: string;
    setView?: (v: any) => void;
    settingsOpen: boolean;
    setSettingsOpen: (v: any) => void;
    showLogoutMenu: boolean;
    setShowLogoutMenu: (v: any) => void;
    handleLogout: () => void;
    currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ user, navigate, view, setView, settingsOpen, setSettingsOpen, showLogoutMenu, setShowLogoutMenu, handleLogout, currentPath }) => (
    <aside className="calendar-sidebar" style={{
        width: 300,
        minWidth: 220,
        maxWidth: 350,
        height: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        boxShadow: '2px 0 16px #0001',
        zIndex: 2,
        boxSizing: 'border-box',
        overflow: 'hidden',
    }}>
        <div className="calendar-logo">
            <img src="/logo1yatay.png" alt="Ordu Üniversitesi Logo" style={{ width: '100%', maxWidth: 180, height: 'auto' }} />
        </div>
        <div className="calendar-title" style={{ textAlign: 'center', width: '100%' }}>Salon Rezervasyon Sistemi</div>
        <div className="calendar-menu">
            <div className="calendar-menu-item" style={{ color: (currentPath === '/' || currentPath === '/calendar' || currentPath === '/takvim') ? '#111' : '#6B7280', fontWeight: (currentPath === '/' || currentPath === '/calendar' || currentPath === '/takvim') ? 700 : 600, fontFamily: 'Space Grotesk, sans-serif', fontSize: 18 }} onClick={() => navigate('/')}>
                <span className="calendar-menu-icon" style={{ display: 'flex', alignItems: 'center', marginRight: 6, color: view === 'month' || view === 'week' ? '#111' : '#6B7280' }}>
                    {/* Takvim ikonu SVG */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3" stroke={view === 'month' || view === 'week' ? '#111' : '#6B7280'} strokeWidth="1.7" /><path d="M16 3v4M8 3v4" stroke={view === 'month' || view === 'week' ? '#111' : '#6B7280'} strokeWidth="1.7" strokeLinecap="round" /><path d="M3 9h18" stroke={view === 'month' || view === 'week' ? '#111' : '#6B7280'} strokeWidth="1.7" /></svg>
                </span>
                Takvim
            </div>
            {user && (user.role === 'TEACHER' || user.role === 'ADMIN') && (
                <>
                    <div className="calendar-menu-item" style={{ color: currentPath === '/rezervasyon-olustur' ? '#111' : '#6B7280', fontWeight: currentPath === '/rezervasyon-olustur' ? 700 : 600, fontFamily: 'Space Grotesk, sans-serif', fontSize: 18 }} onClick={() => navigate('/rezervasyon-olustur')}>
                        <span className="calendar-menu-icon" style={{ display: 'flex', alignItems: 'center', marginRight: 6 }}>
                            {/* Artı ikonu SVG */}
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#6B7280" strokeWidth="1.7" strokeLinecap="round" /></svg>
                        </span>
                        Rezervasyon Oluştur
                    </div>
                    <div className="calendar-menu-item" style={{ color: currentPath === '/rezervasyonlarim' ? '#111' : '#6B7280', fontWeight: currentPath === '/rezervasyonlarim' ? 700 : 600, fontFamily: 'Space Grotesk, sans-serif', fontSize: 18 }} onClick={() => navigate('/rezervasyonlarim')}>
                        <span className="calendar-menu-icon" style={{ display: 'flex', alignItems: 'center', marginRight: 6 }}>
                            {/* Liste ikonu SVG */}
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="2" rx="1" fill="#6B7280" /><rect x="4" y="11" width="16" height="2" rx="1" fill="#6B7280" /><rect x="4" y="16" width="16" height="2" rx="1" fill="#6B7280" /></svg>
                        </span>
                        Rezervasyonlarım
                    </div>
                </>
            )}
            {user && user.role === 'ADMIN' && (
                <>
                    <div className="calendar-menu-item" style={{ color: '#6B7280', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSettingsOpen((v: any) => !v)}>
                        <span className="calendar-menu-icon" style={{ display: 'flex', alignItems: 'center', marginRight: 6, color: '#6B7280' }}>
                            {/* Modern sade dişli çark (gear) ikonu SVG */}
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.06-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.03 7.03 0 00-1.62-.94l-.36-2.53A.5.5 0 0014 2h-4a.5.5 0 00-.5.42l-.36 2.53a7.03 7.03 0 00-1.62.94l-2.39-.96a.5.5 0 00-.61.22l-1.92 3.32a.5.5 0 00.12.64l2.03 1.58c-.04.3-.06.61-.06.94s.02.64.06.94l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32a.5.5 0 00.61.22l2.39-.96c.5.38 1.04.7 1.62.94l.36 2.53A.5.5 0 0010 22h4a.5.5 0 00.5-.42l.36-2.53c.58-.24 1.12-.56 1.62-.94l2.39.96a.5.5 0 00.61-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" fill="#6B7280" />
                            </svg>
                        </span>
                        Ayarlar
                        <span style={{ marginLeft: 'auto', marginTop: 2, transition: 'transform 0.2s', display: 'flex', alignItems: 'flex-end' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: settingsOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                <polyline points="8 5 16 12 8 19" stroke="#6B7280" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                    {settingsOpen && (
                        <div style={{ marginLeft: 8, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, borderLeft: '1.5px solid #D1D5DB', zIndex: 0 }} />
                            <div className="calendar-menu-item" style={{ color: currentPath === '/bilgi-girisi' ? '#111' : '#6B7280', fontWeight: currentPath === '/bilgi-girisi' ? 700 : 500, fontSize: 15, paddingLeft: 24, marginBottom: 8, background: 'none', boxShadow: 'none', zIndex: 1 }} onClick={() => navigate('/bilgi-girisi')}>
                                Bilgi Girişi
                            </div>
                            <div className="calendar-menu-item" style={{ color: currentPath === '/tum-rezervasyonlar' ? '#111' : '#6B7280', fontWeight: currentPath === '/tum-rezervasyonlar' ? 700 : 500, fontSize: 15, paddingLeft: 24, marginBottom: 0, background: 'none', boxShadow: 'none', zIndex: 1 }} onClick={() => navigate('/tum-rezervasyonlar')}>
                                Tüm Rezervasyonlar
                            </div>
                        </div>
                    )}
                </>
            )}
            {/* Diğer menü item'ları */}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '8px 16px 0 0',
            boxSizing: 'border-box',
            gap: 12,
        }}>
            <span className="calendar-footer-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', marginLeft: 0, gap: 8, cursor: 'pointer', paddingLeft: 16, marginBottom: 16 }} onClick={() => { if (!user) navigate('/login'); }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><circle cx="12" cy="8" r="4" stroke="#24242C" strokeWidth="1.7" /><path d="M4 19c0-2.5 3.5-4 8-4s8 1.5 8 4" stroke="#24242C" strokeWidth="1.7" /></svg>
                {user ? user.username : 'Giriş Yap'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginBottom: 16, gap: 8, cursor: user ? 'pointer' : 'default', position: 'relative' }} onClick={user ? () => setShowLogoutMenu((v: any) => !v) : undefined}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><circle cx="12" cy="5" r="1.5" fill="#24242C" /><circle cx="12" cy="12" r="1.5" fill="#24242C" /><circle cx="12" cy="19" r="1.5" fill="#24242C" /></svg>
                {showLogoutMenu && (
                    <div style={{ position: 'absolute', bottom: 32, right: 0, background: '#fff', border: '1px solid #eee', borderRadius: 10, boxShadow: '0 4px 24px #0002', padding: '12px 20px', zIndex: 10000, minWidth: 120 }}>
                        <button onClick={handleLogout} style={{ width: '100%', background: '#ff3b3b', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontWeight: 600, fontFamily: 'Space Grotesk', fontSize: 15, cursor: 'pointer' }}>Çıkış Yap</button>
                    </div>
                )}
            </span>
        </div>
    </aside>
);

export default Sidebar; 