import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/RezervasyonOlustur.css';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../api/client';
import type { Fakulte, Salon } from '../types';

const RezervasyonDuzenle: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [fakulte, setFakulte] = useState('');
    const [fakulteler, setFakulteler] = useState<Fakulte[]>([]);
    const [salonlar, setSalonlar] = useState<Salon[]>([]);
    const [sinif, setSinif] = useState('');
    const [kullanimTuru, setKullanimTuru] = useState('');
    const [baslik, setBaslik] = useState('');
    const [aciklama, setAciklama] = useState('');
    const [seciliTarih, setSeciliTarih] = useState<number | null>(null);
    const [baslangicSaati, setBaslangicSaati] = useState('13:00');
    const [bitisSaati, setBitisSaati] = useState('14:00');
    const [tarih, setTarih] = useState(new Date());
    const [mesaj, setMesaj] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const gunler = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
    const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Fakülteleri yükle
                const fakList = await apiClient.get<Fakulte[]>('/fakulteler');
                setFakulteler(fakList);

                // 2. Rezervasyon verisini çek
                let data: any = null;
                try {
                    data = await apiClient.get(`/rezervasyonlar/${id}`);
                } catch {
                    const all = await apiClient.get<any[]>('/rezervasyonlar');
                    data = all.find((r: any) => String(r.ID || r.id) === String(id));
                }

                if (!data) throw new Error('Rezervasyon bulunamadı.');

                // 3. Formu doldur
                const fId = String(data.fakulte?.ID || data.fakulte?.id || data.fakulte_id);
                setFakulte(fId);

                // Salonları getir
                const sList = await apiClient.get<Salon[]>(`/salonlar?fakulte_id=${fId}&fakulteId=${fId}`);
                setSalonlar(sList);

                setSinif(String(data.salon?.ID || data.salon?.id || data.salon_id));
                setBaslik(data.baslik || '');
                setAciklama(data.aciklama || '');
                setKullanimTuru(data.tur || '');

                if (data.date) {
                    const d = new Date(data.date);
                    setTarih(new Date(d.getFullYear(), d.getMonth(), 1));
                    setSeciliTarih(d.getDate());
                }
                setBaslangicSaati(data.startTime?.slice(0, 5) || '13:00');
                setBitisSaati(data.endTime?.slice(0, 5) || '14:00');

            } catch (err: any) {
                setMesaj('Hata: ' + err.message);
            }
        };
        loadInitialData();
    }, [id]);

    // Fakülte değişince salonları güncelle
    useEffect(() => {
        if (fakulte) {
            apiClient.get<Salon[]>(`/salonlar?fakulte_id=${fakulte}&fakulteId=${fakulte}`)
                .then(setSalonlar)
                .catch(err => console.error('Salonlar yüklenemedi:', err));
        }
    }, [fakulte]);

    const handleGuncelle = async () => {
        if (!fakulte || !sinif || !seciliTarih || !baslangicSaati || !bitisSaati || !baslik) {
            setMesaj('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        setLoading(true);
        try {
            const tarihStr = `${tarih.getFullYear()}-${String(tarih.getMonth() + 1).padStart(2, '0')}-${String(seciliTarih).padStart(2, '0')}`;
            const payload = {
                fakulte_id: Number(fakulte),
                salon_id: Number(sinif),
                user_id: Number(currentUser?.id),
                tur: kullanimTuru.toUpperCase(),
                baslik,
                aciklama,
                date: tarihStr,
                startTime: baslangicSaati,
                endTime: bitisSaati
            };
            await apiClient.put(`/rezervasyonlar/${id}`, payload);
            setMesaj('Rezervasyon güncellendi!');
            setTimeout(() => navigate('/rezervasyonlarim'), 1500);
        } catch (err: any) {
            setMesaj('Hata: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const ay = tarih.getMonth();
    const yil = tarih.getFullYear();
    const ilkGun = (new Date(yil, ay, 1).getDay() + 6) % 7;
    const gunSayisi = new Date(yil, ay + 1, 0).getDate();

    return (
        <div className="rezervasyon-olustur-container">
            {mesaj && <div className={`rezervasyon-toast ${mesaj.includes('Hata') ? 'error' : 'success'}`}>{mesaj}</div>}

            <div className="rezervasyon-form-wrapper">
                <h2 className="rezervasyon-title">Rezervasyonu Düzenle</h2>

                <div className="rezervasyon-grid">
                    <div className="rezervasyon-section">
                        <label>Fakülte</label>
                        <select value={fakulte} onChange={(e) => setFakulte(e.target.value)}>
                            {fakulteler.map(f => (
                                <option key={f.ID || f.id} value={f.ID || f.id}>{f.ad || f.name}</option>
                            ))}
                        </select>

                        <label>Salon</label>
                        <select value={sinif} onChange={(e) => setSinif(e.target.value)}>
                            {salonlar.map(s => (
                                <option key={s.ID || s.id} value={s.ID || s.id}>{s.name || s.ad}</option>
                            ))}
                        </select>

                        <label>Başlık</label>
                        <input type="text" value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder="Rezervasyon başlığı..." />

                        <label>Açıklama</label>
                        <textarea
                            value={aciklama}
                            onChange={(e) => setAciklama(e.target.value)}
                            placeholder="Rezervasyon detayları..."
                            rows={3}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', marginTop: '4px', marginBottom: '16px' }}
                        />

                        <label>Kullanım Türü</label>
                        <select value={kullanimTuru} onChange={(e) => setKullanimTuru(e.target.value)}>
                            <option value="DERS">Ders</option>
                            <option value="ETKINLIK">Etkinlik</option>
                            <option value="REZERVE">Rezerve</option>
                        </select>
                    </div>

                    <div className="rezervasyon-section">
                        <div className="calendar-header">
                            <h3>{aylar[ay]} {yil}</h3>
                            <div className="calendar-nav">
                                <button onClick={() => setTarih(new Date(yil, ay - 1))}>&lt;</button>
                                <button onClick={() => setTarih(new Date(yil, ay + 1))}>&gt;</button>
                            </div>
                        </div>
                        <div className="mini-calendar">
                            {gunler.map(g => <div key={g} className="weekday">{g}</div>)}
                            {[...Array(ilkGun)].map((_, i) => <div key={`empty-${i}`} />)}
                            {[...Array(gunSayisi)].map((_, i) => {
                                const d = i + 1;
                                return (
                                    <div
                                        key={d}
                                        className={`day ${seciliTarih === d ? 'selected' : ''}`}
                                        onClick={() => setSeciliTarih(d)}
                                    >
                                        {d}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="time-grid">
                            <div>
                                <label>Başlangıç</label>
                                <input type="time" value={baslangicSaati} onChange={(e) => setBaslangicSaati(e.target.value)} />
                            </div>
                            <div>
                                <label>Bitiş</label>
                                <input type="time" value={bitisSaati} onChange={(e) => setBitisSaati(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                <button className="submit-btn" onClick={handleGuncelle} disabled={loading}>
                    {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>
        </div>
    );
};

export default RezervasyonDuzenle;
