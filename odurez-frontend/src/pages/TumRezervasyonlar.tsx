import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Rezervasyonlarim.css';
import { apiClient } from '../api/client';
import { useAuth } from '../hooks/useAuth';

const TumRezervasyonlar = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [rezervasyonlar, setRezervasyonlar] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            const data = await apiClient.get<any[]>('/rezervasyonlar');
            const mapped = data.map((r: any) => ({
                id: r.ID || r.id,
                baslik: r.baslik || '-',
                aciklama: r.aciklama || '-',
                fakulte: r.fakulte?.ad || r.fakulte?.name || '-',
                salon: r.salon?.ad || r.salon?.name || '-',
                kullanim: r.tur || '-',
                tarih: r.date || '-',
                saat: r.startTime && r.endTime ? `${r.startTime.slice(0, 5)} - ${r.endTime.slice(0, 5)}` : '-',
                userName: r.user?.username || '-',
                userId: String(r.user?.ID || r.user?.id || r.user_id)
            }));
            setRezervasyonlar(mapped);
        } catch (err) {
            console.error('Tüm rezervasyonlar yüklenemedi:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await apiClient.delete(`/rezervasyonlar/${deleteId}`);
            setRezervasyonlar(prev => prev.filter(r => r.id !== deleteId));
            setDeleteModalOpen(false);
        } catch (err) {
            alert('Rezervasyon silinemedi!');
        }
    };

    const filtered = rezervasyonlar.filter(r =>
        Object.values(r).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filtered.length / 10);
    const paged = filtered.slice((page - 1) * 10, page * 10);

    // Bir kullanıcı kendi rezervasyonunu veya admin ise her şeyi silebilir/düzenleyebilir
    const canManage = (userId: string) => {
        return currentUser?.role === 'ADMIN' || String(currentUser?.id) === userId;
    };

    return (
        <div className="rezervasyonlarim-container">
            <div className="rezervasyonlarim-header">
                <div className="rezervasyonlarim-title">Tüm Rezervasyonlar</div>
                <div className="rezervasyonlarim-search-box">
                    <input
                        type="text"
                        placeholder="Ara..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            <table className="rezervasyonlarim-table">
                <thead>
                    <tr>
                        <th>Başlık</th>
                        <th>Kullanıcı</th>
                        <th>Fakülte</th>
                        <th>Salon</th>
                        <th>Tarih</th>
                        <th>Saat</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {paged.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', color: '#B5B7C0', padding: '20px' }}>Rezervasyon bulunamadı.</td></tr>
                    ) : paged.map(r => (
                        <tr key={r.id}>
                            <td>{r.baslik}</td>
                            <td><span className="user-badge">{r.userName}</span></td>
                            <td>{r.fakulte}</td>
                            <td>{r.salon}</td>
                            <td>{r.tarih}</td>
                            <td>{r.saat}</td>
                            <td>
                                <div className="action-buttons">
                                    {canManage(r.userId) ? (
                                        <>
                                            <button className="action-btn edit" onClick={() => navigate(`/rezervasyon-duzenle/${r.id}`)} title="Düzenle">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button className="action-btn delete" onClick={() => { setDeleteId(r.id); setDeleteModalOpen(true); }} title="Sil">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </>
                                    ) : (
                                        <span className="no-action">-</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="rezervasyonlarim-footer-actions">
                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>Geri</button>
                    <span>Sayfa {page} / {totalPages || 1}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>İleri</button>
                </div>
                <div className="rezervasyon-count">
                    Toplam {filtered.length} kayıt
                </div>
            </div>

            {deleteModalOpen && (
                <div className="rezervasyon-modal-overlay">
                    <div className="rezervasyon-modal">
                        <h3>Emin misiniz?</h3>
                        <p>Bu rezervasyon kalıcı olarak silinecektir. Bu işlem geri alınamaz.</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteModalOpen(false)}>Vazgeç</button>
                            <button className="confirm-btn" onClick={handleDeleteConfirm}>Evet, Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TumRezervasyonlar;
