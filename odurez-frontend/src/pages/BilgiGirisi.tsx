import { useState, useEffect } from 'react';
import '../styles/BilgiGirisi.css';
import { apiClient } from '../api/client';
import type { Fakulte } from '../types';

const BilgiGirisi = () => {
    const [fakulteAdi, setFakulteAdi] = useState('');
    const [salonAdi, setSalonAdi] = useState('');
    const [seciliFakulte, setSeciliFakulte] = useState('');
    const [fakulteler, setFakulteler] = useState<Fakulte[]>([]);
    const [mesaj, setMesaj] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFakulteler();
    }, []);

    const loadFakulteler = async () => {
        try {
            const list = await apiClient.get<Fakulte[]>('/fakulteler');
            setFakulteler(list);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFakulteKaydet = async () => {
        if (!fakulteAdi.trim()) return;
        setLoading(true);
        try {
            await apiClient.post('/fakulteler', { name: fakulteAdi.trim() });
            setMesaj({ text: 'Fakülte başarıyla eklendi!', type: 'success' });
            setFakulteAdi('');
            await loadFakulteler();
        } catch (err) {
            setMesaj({ text: 'Fakülte eklenirken hata oluştu.', type: 'error' });
        } finally {
            setLoading(false);
            setTimeout(() => setMesaj(null), 3000);
        }
    };

    const handleSalonKaydet = async () => {
        if (!salonAdi.trim() || !seciliFakulte) return;
        setLoading(true);
        try {
            await apiClient.post('/salonlar', {
                name: salonAdi.trim(),
                fakulte_id: Number(seciliFakulte),
                fakulte: { id: Number(seciliFakulte), ID: Number(seciliFakulte) }
            });
            setMesaj({ text: 'Salon başarıyla eklendi!', type: 'success' });
            setSalonAdi('');
        } catch (err) {
            setMesaj({ text: 'Salon eklenirken hata oluştu.', type: 'error' });
        } finally {
            setLoading(false);
            setTimeout(() => setMesaj(null), 3000);
        }
    };

    return (
        <div className="bilgi-girisi-container fade-in">
            <div className="admin-header-section">
                <div>
                    <h2 className="admin-title">Sistem Yönetimi</h2>
                    <p className="admin-subtitle">Fakülte ve salon tanımlamalarını bu panelden gerçekleştirebilirsiniz.</p>
                </div>
            </div>

            {mesaj && (
                <div className={`admin-notification ${mesaj.type}`}>
                    {mesaj.type === 'success' ? (
                        <svg className="notif-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    ) : (
                        <svg className="notif-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    )}
                    {mesaj.text}
                </div>
            )}

            <div className="admin-grid">
                <div className="admin-card">
                    <h3>Fakülte Yönetimi</h3>
                    <p className="card-desc">Sisteme yeni bir akademik birim ekleyin.</p>

                    <div className="input-group">
                        <label>Fakülte Adı</label>
                        <input
                            type="text"
                            placeholder="Örn: Fen Edebiyat Fakültesi"
                            value={fakulteAdi}
                            onChange={e => setFakulteAdi(e.target.value)}
                        />
                    </div>
                    <button className="admin-btn primary" onClick={handleFakulteKaydet} disabled={loading || !fakulteAdi.trim()}>
                        {loading ? 'İşleniyor...' : 'Fakülteyi Sisteme Ekle'}
                    </button>
                </div>

                <div className="admin-card">
                    <h3>Salon Yönetimi</h3>
                    <p className="card-desc">Fakültelere bağlı derslik veya konferans salonu ekleyin.</p>

                    <div className="input-group">
                        <label>Bağlı Olduğu Fakülte</label>
                        <select value={seciliFakulte} onChange={e => setSeciliFakulte(e.target.value)}>
                            <option value="">Fakülte Seçin...</option>
                            {fakulteler.map(f => (
                                <option key={f.ID || f.id} value={f.ID || f.id}>{f.ad || f.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Salon Adı</label>
                        <input
                            type="text"
                            placeholder="Örn: Konferans Salonu A"
                            value={salonAdi}
                            onChange={e => setSalonAdi(e.target.value)}
                            disabled={!seciliFakulte}
                        />
                    </div>
                    <button className="admin-btn success" onClick={handleSalonKaydet} disabled={loading || !salonAdi.trim() || !seciliFakulte}>
                        {loading ? 'İşleniyor...' : 'Salonu Sisteme Ekle'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BilgiGirisi;
