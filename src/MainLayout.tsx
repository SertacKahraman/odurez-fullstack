import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    })();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const navigate = useNavigate();
    const view = '';
    const location = useLocation();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', background: '#F6F7F9' }}>
            <Sidebar
                user={user}
                navigate={navigate}
                view={view}
                settingsOpen={settingsOpen}
                setSettingsOpen={setSettingsOpen}
                showLogoutMenu={showLogoutMenu}
                setShowLogoutMenu={setShowLogoutMenu}
                handleLogout={handleLogout}
                currentPath={location.pathname}
            />
            <div style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
                {children}
            </div>
        </div>
    );
};

export default MainLayout; 