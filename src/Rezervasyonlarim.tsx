import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rezervasyonlarim.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Rezervasyon {
    id: number;
    baslik: string;
    aciklama: string;
    fakulte: string;
    salon: string;
    kullanim: string;
    tarih: string;
    saat: string;
}

const Rezervasyonlarim = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [rezervasyonlar, setRezervasyonlar] = useState<Rezervasyon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    })();

    const navigate = useNavigate();

    const tableRef = useRef<HTMLDivElement>(null);

    // Backend'den rezervasyonları çek
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const headers: any = token ? { 'Authorization': 'Bearer ' + token } : {};
                const res = await fetch('http://10.15.0.15:8080/rezervasyonlar', { headers });
                if (!res.ok) throw new Error('Rezervasyonlar alınamadı');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    console.log('APIdan gelen ilk rezervasyon:', data[0]);
                }
                if (!Array.isArray(data)) {
                    setError('Beklenmeyen veri formatı: API bir dizi döndürmeli.');
                    setRezervasyonlar([]);
                    return;
                }
                // Backend'den gelen veri örneği dönüştürülüyor
                const mapped = data.map((r: any) => {
                    // Saat
                    let saat = '-';
                    if (r.startTime && r.endTime) {
                        // Sadece saat kısmını al
                        const st = r.startTime.slice(0, 5);
                        const et = r.endTime.slice(0, 5);
                        saat = `${st} - ${et}`;
                    } else if (r.baslangicSaati && r.bitisSaati) {
                        saat = `${r.baslangicSaati} - ${r.bitisSaati}`;
                    } else if (r.saat || r.time) {
                        saat = r.saat || r.time;
                    }
                    // Tarih
                    let tarih = r.tarih || r.date || '-';
                    // Salon
                    let salon = r.salon;
                    if (salon && typeof salon === 'object') salon = salon.name || salon.ad || '-';
                    // Fakülte
                    let fakulte = r.fakulte;
                    if (fakulte && typeof fakulte === 'object') fakulte = fakulte.name || fakulte.ad || '-';
                    // Kullanıcı
                    let userId = r.user && typeof r.user === 'object' ? String(r.user.id) : null;
                    return {
                        id: r.id,
                        baslik: r.baslik || r.title || '-',
                        aciklama: r.aciklama || r.description || '-',
                        fakulte,
                        salon,
                        kullanim: r.tur || r.kullanimTuru || r.type || '-',
                        tarih,
                        saat,
                        userId,
                    };
                });
                console.log('localStorage user:', user);
                console.log('mapped rezervasyonlar:', mapped);
                const currentUserId = user && user.id != null ? String(user.id) : null;
                console.log('currentUserId:', currentUserId);
                const kendiRezervasyonlarim = currentUserId
                    ? mapped.filter(r => r.userId === currentUserId)
                    : [];
                setRezervasyonlar(kendiRezervasyonlarim);
                setPage(1); // Sayfayı 1'e çek
            } catch (err: any) {
                setError(err.message || 'Bir hata oluştu');
                setRezervasyonlar([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Rezervasyon silme fonksiyonu
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deleteId == null) return;
        try {
            const token = localStorage.getItem('token');
            const headers: any = token ? { 'Authorization': 'Bearer ' + token } : {};
            const res = await fetch(`http://10.15.0.15:8080/rezervasyonlar/${deleteId}`, {
                method: 'DELETE',
                headers
            });
            if (!res.ok) throw new Error('Rezervasyon silinemedi');
            setRezervasyonlar(prev => prev.filter(r => r.id !== deleteId));
        } catch (err) {
            alert('Rezervasyon silinirken hata oluştu!');
        } finally {
            setDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setDeleteId(null);
    };

    // Filtrelenmiş ve sayfalanmış veri
    const filtered = rezervasyonlar.filter(r =>
        (r.baslik || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.aciklama || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.fakulte || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.salon || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.kullanim || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.tarih || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.saat || '').toLowerCase().includes(search.toLowerCase())
    );
    const pageSize = 8;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    // Sayfa değişince scroll başa al
    useEffect(() => {
        const container = document.querySelector('.rezervasyonlarim-container');
        if (container) container.scrollTop = 0;
    }, [page]);

    // Sayfa butonlarını oluştur
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pageButtons = [];
        // 1, 2, 3, 4, ... N gibi gösterim
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageButtons.push(
                    <button key={i} className={`rezervasyonlarim-page-btn${page === i ? ' active' : ''}`} onClick={() => setPage(i)}>{i}</button>
                );
            }
        } else {
            // Çok sayfa varsa: 1 ... [page-1] [page] [page+1] ... N
            pageButtons.push(
                <button key={1} className={`rezervasyonlarim-page-btn${page === 1 ? ' active' : ''}`} onClick={() => setPage(1)}>1</button>
            );
            if (page > 3) {
                pageButtons.push(<span key="start-ellipsis" className="rezervasyonlarim-page-ellipsis">...</span>);
            }
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pageButtons.push(
                    <button key={i} className={`rezervasyonlarim-page-btn${page === i ? ' active' : ''}`} onClick={() => setPage(i)}>{i}</button>
                );
            }
            if (page < totalPages - 2) {
                pageButtons.push(<span key="end-ellipsis" className="rezervasyonlarim-page-ellipsis">...</span>);
            }
            pageButtons.push(
                <button key={totalPages} className={`rezervasyonlarim-page-btn${page === totalPages ? ' active' : ''}`} onClick={() => setPage(totalPages)}>{totalPages}</button>
            );
        }
        return (
            <div className="rezervasyonlarim-pagination">
                <button className="rezervasyonlarim-page-btn" onClick={() => setPage(page - 1)} disabled={page === 1}>{'<'}</button>
                {pageButtons}
                <button className="rezervasyonlarim-page-btn" onClick={() => setPage(page + 1)} disabled={page === totalPages}>{'>'}</button>
            </div>
        );
    };

    // Güvenli hücre gösterimi
    const safeCell = (val: any) => {
        if (val == null) return '-';
        if (typeof val === 'object') {
            if ('name' in val) return val.name;
            if ('ad' in val) return val.ad;
            return JSON.stringify(val);
        }
        return val;
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(paged.map(r => ({
            'Başlık': r.baslik,
            'Açıklama': r.aciklama,
            'Fakülte': r.fakulte,
            'Salon': r.salon,
            'Kullanım Amacı': r.kullanim,
            'Tarih': r.tarih,
            'Saat': r.saat
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Rezervasyonlarım');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'rezervasyonlarim.xlsx');
    };
    const exportPDF = () => {
        const allRows = filtered.length > 0 ? filtered : rezervasyonlar;
        const doc = new jsPDF();
        doc.setFont('times'); // Gömülü ve Türkçe karakter desteği en iyi olan font
        doc.setFontSize(16);
        doc.text('Rezervasyonlarım', 14, 16);
        autoTable(doc, {
            startY: 22,
            head: [[
                'Başlık', 'Açıklama', 'Fakülte', 'Salon', 'Kullanım Amacı', 'Tarih', 'Saat'
            ]],
            body: allRows.map(r => [
                r.baslik, r.aciklama, r.fakulte, r.salon, r.kullanim, r.tarih, r.saat
            ]),
            styles: { font: 'times', fontSize: 10 },
            headStyles: { fillColor: [74, 78, 104] },
            margin: { left: 14, right: 14 }
        });
        doc.save('rezervasyonlarim.pdf');
    };
    const printTable = () => {
        // Tüm rezervasyonları yazdırmak için filtered veya rezervasyonlar kullanılacak
        const allRows = filtered.length > 0 ? filtered : rezervasyonlar;
        // Tablo başlığı ve gövdesi aksiyon sütunu olmadan oluşturulacak
        const tableHtml = `
            <div class='rezervasyonlarim-title'>Rezervasyonlarım</div>
            <table style="width:100%;border-collapse:collapse;margin-top:24px;">
                <thead>
                    <tr>
                        <th>Başlık</th>
                        <th>Açıklama</th>
                        <th>Fakülte</th>
                        <th>Salon</th>
                        <th>Kullanım Amacı</th>
                        <th>Tarih</th>
                        <th>Saat</th>
                    </tr>
                </thead>
                <tbody>
                    ${allRows.map(r => `
                        <tr>
                            <td>${r.baslik}</td>
                            <td>${r.aciklama}</td>
                            <td>${r.fakulte}</td>
                            <td>${r.salon}</td>
                            <td>${r.kullanim}</td>
                            <td>${r.tarih}</td>
                            <td>${r.saat}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        const printWindow = window.open('', '', 'width=900,height=700');
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Rezervasyonlarım</title>
                    <style>
                        body { font-family: 'Space Grotesk', 'Poppins', sans-serif; background: #fff; color: #222; }
                        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
                        th, td { border: 1px solid #E5E7EB; padding: 10px; font-size: 15px; }
                        th { background: #F8F9FB; font-weight: 600; }
                        tr:nth-child(even) td { background: #F6F7F9; }
                        tr:hover td { background: #F1F3F6; }
                    </style>
                </head>
                <body>
                    ${tableHtml}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 200);
    };

    return (
        <div className="rezervasyonlarim-container" style={{ position: 'relative' }}>
            {/* Sağ üst arama kutusu */}
            <div className="rezervasyonlarim-search-box">
                <input
                    type="text"
                    placeholder="Rezervasyon Ara"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                <span className="rezervasyonlarim-search-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#B5B7C0" strokeWidth="2" /><path d="M20 20L17 17" stroke="#B5B7C0" strokeWidth="2" strokeLinecap="round" /></svg>
                </span>
            </div>
            <div ref={tableRef}>
                <div className="rezervasyonlarim-title">Rezervasyonlarım</div>
                <table className="rezervasyonlarim-table">
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>Açıklama</th>
                            <th>Fakülte</th>
                            <th>Salon</th>
                            <th>Kullanım Amacı</th>
                            <th>Tarih</th>
                            <th>Saat</th>
                            <th>Aksiyon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.length === 0 ? (
                            <tr><td colSpan={8} style={{ textAlign: 'center', color: '#B5B7C0' }}>Kayıt bulunamadı.</td></tr>
                        ) : paged.map(r => (
                            <tr key={r.id}>
                                <td>{safeCell(r.baslik)}</td>
                                <td>{safeCell(r.aciklama)}</td>
                                <td>{safeCell(r.fakulte)}</td>
                                <td>{safeCell(r.salon)}</td>
                                <td>{safeCell(r.kullanim)}</td>
                                <td>{safeCell(r.tarih)}</td>
                                <td>{safeCell(r.saat)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn" onClick={() => navigate(`/rezervasyon-duzenle/${r.id}`)} title="Düzenle">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 21h17" stroke="#4A4E68" strokeWidth="1.5" strokeLinecap="round" /><path d="M12.5 6.5l5 5L7 22H2v-5l10.5-10.5z" stroke="#4A4E68" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                                        </button>
                                        <button className="action-btn" title="Sil" onClick={() => handleDeleteClick(r.id)}>
                                            {/* Sil ikonu */}
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18" stroke="#6A6A65" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#6A6A65" strokeWidth="1.5" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 4v6m4-6v6" stroke="#6A6A65" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="rezervasyonlarim-count">{filtered.length} rezervasyon gösteriliyor</div>
                {renderPagination()}
                <div className="rezervasyonlarim-action-bar">
                    <button className="rezervasyonlarim-action-btn" title="Excel'e Aktar" onClick={exportExcel} style={{ border: 'none', background: '#F3F4F6', borderRadius: 6, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#2E7D32" strokeWidth="1.7" /><path d="M8 8l8 8M16 8l-8 8" stroke="#2E7D32" strokeWidth="1.7" /></svg>
                    </button>
                    <button className="rezervasyonlarim-action-btn" title="PDF Oluştur" onClick={exportPDF} style={{ border: 'none', background: '#F3F4F6', borderRadius: 6, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#D32F2F" strokeWidth="1.7" /><path d="M8 8h8v8H8z" stroke="#D32F2F" strokeWidth="1.7" /></svg>
                    </button>
                    <button className="rezervasyonlarim-action-btn" title="Yazdır" onClick={printTable} style={{ border: 'none', background: '#F3F4F6', borderRadius: 6, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="6" rx="2" stroke="#374151" strokeWidth="1.7" /><rect x="4" y="9" width="16" height="10" rx="2" stroke="#374151" strokeWidth="1.7" /><rect x="8" y="13" width="8" height="4" rx="1" stroke="#374151" strokeWidth="1.7" /></svg>
                    </button>
                </div>
            </div>
            {deleteModalOpen && (
                <div className="rezervasyonlarim-modal-overlay">
                    <div className="rezervasyonlarim-modal">
                        <div className="rezervasyonlarim-modal-title">Rezervasyonu silmek istediğinize emin misiniz?</div>
                        <div className="rezervasyonlarim-modal-actions">
                            <button className="rezervasyonlarim-modal-btn" onClick={handleDeleteCancel}>Vazgeç</button>
                            <button className="rezervasyonlarim-modal-btn sil" onClick={handleDeleteConfirm}>Evet, Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rezervasyonlarim; 