import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RezervasyonOlustur.css';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../api/client';
import type { Fakulte, Salon } from '../types';

const RezervasyonOlustur: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // Form alanları
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

  // Toast mesajı otomatik gizle
  useEffect(() => {
    if (mesaj) {
      const timer = setTimeout(() => setMesaj(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mesaj]);

  // Fakülteleri yükle
  useEffect(() => {
    apiClient.get<Fakulte[]>('/fakulteler')
      .then(setFakulteler)
      .catch(err => console.error('Fakülteler yüklenemedi:', err));
  }, []);

  // Seçili fakülteye göre salonları yükle
  useEffect(() => {
    if (fakulte) {
      apiClient.get<Salon[]>(`/salonlar?fakulte_id=${fakulte}&fakulteId=${fakulte}`)
        .then(setSalonlar)
        .catch(err => console.error('Salonlar yüklenemedi:', err));
    } else {
      setSalonlar([]);
    }
  }, [fakulte]);

  const gunler = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
  const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  const ay = tarih.getMonth();
  const yil = tarih.getFullYear();
  const ilkGun = (new Date(yil, ay, 1).getDay() + 6) % 7;
  const gunSayisi = new Date(yil, ay + 1, 0).getDate();

  const handleRezervasyonOlustur = async () => {
    if (!fakulte || !sinif || !seciliTarih || !baslangicSaati || !bitisSaati || !baslik) {
      setMesaj('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const tarihStr = `${yil}-${String(ay + 1).padStart(2, '0')}-${String(seciliTarih).padStart(2, '0')}`;
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

      await apiClient.post('/rezervasyonlar', payload);
      setMesaj('Rezervasyon başarıyla oluşturuldu!');
      setTimeout(() => navigate('/rezervasyonlarim'), 1500);
    } catch (err: any) {
      setMesaj('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rezervasyon-olustur-container">
      {mesaj && <div className={`rezervasyon-toast ${mesaj.includes('Hata') ? 'error' : 'success'}`}>{mesaj}</div>}

      <div className="rezervasyon-form-wrapper">
        <h2 className="rezervasyon-title">Yeni Rezervasyon</h2>

        <div className="rezervasyon-grid">
          <div className="rezervasyon-section">
            <label>Fakülte</label>
            <select value={fakulte} onChange={(e) => setFakulte(e.target.value)}>
              <option value="">Fakülte Seçin</option>
              {fakulteler.map((f: any) => (
                <option key={f.ID || f.id} value={f.ID || f.id}>{f.ad || f.name}</option>
              ))}
            </select>

            <label>Salon</label>
            <select value={sinif} onChange={(e) => setSinif(e.target.value)} disabled={!fakulte}>
              <option value="">Salon Seçin</option>
              {salonlar.map((s: any) => (
                <option key={s.ID || s.id} value={s.ID || s.id}>{s.name || s.ad}</option>
              ))}
            </select>

            <label>Başlık</label>
            <input type="text" value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder="Rezervasyon başlığı..." />

            <label>Açıklama</label>
            <textarea value={aciklama} onChange={(e) => setAciklama(e.target.value)} placeholder="Rezervasyon detayları..." rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', marginTop: '4px', marginBottom: '16px' }} />

            <label>Kullanım Türü</label>
            <select value={kullanimTuru} onChange={(e) => setKullanimTuru(e.target.value)}>
              <option value="">Tür Seçin</option>
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

        <button className="submit-btn" onClick={handleRezervasyonOlustur} disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Rezervasyon Oluştur'}
        </button>
      </div>
    </div>
  );
};

export default RezervasyonOlustur;
