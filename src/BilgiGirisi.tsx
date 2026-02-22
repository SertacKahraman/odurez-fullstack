import React, { useState, useEffect } from 'react';

const BilgiGirisi = () => {
    const [fakulteAdi, setFakulteAdi] = useState('');
    const [fakulteler, setFakulteler] = useState([]);
    const [seciliFakulte, setSeciliFakulte] = useState('');
    const [salonAdi, setSalonAdi] = useState('');

    useEffect(() => {
        fetch('http://10.15.0.15:8080/fakulteler')
            .then(res => {
                if (!res.ok) throw new Error('Fakülteler yüklenemedi');
                return res.json();
            })
            .then(data => setFakulteler(data))
            .catch(() => alert('Fakülteler yüklenirken hata oluştu'));
    }, []);

    const handleFakulteKaydet = () => {
        if (!fakulteAdi.trim()) {
            alert('Lütfen fakülte adını girin');
            return;
        }
        fetch('http://10.15.0.15:8080/fakulteler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: fakulteAdi.trim() }),
        })
            .then(res => {
                if (!res.ok) throw new Error('Fakülte eklenirken hata oluştu');
                return res.json();
            })
            .then(() => {
                alert('Fakülte başarıyla eklendi!');
                setFakulteAdi('');
                return fetch('http://10.15.0.15:8080/fakulteler')
                    .then(res => res.json())
                    .then(data => setFakulteler(data));
            })
            .catch(err => alert(err.message));
    };

    const handleSalonKaydet = () => {
        if (!seciliFakulte) {
            alert('Lütfen fakülte seçin');
            return;
        }
        if (!salonAdi.trim()) {
            alert('Lütfen salon ismini girin');
            return;
        }
        fetch('http://10.15.0.15:8080/salonlar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: salonAdi.trim(),
                fakulte: { id: Number(seciliFakulte) },
            }),
        })
            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || 'Salon eklenirken hata oluştu');
                }
                return res.json();
            })
            .then(() => {
                alert('Salon başarıyla eklendi!');
                setSalonAdi('');
                setSeciliFakulte('');
            })
            .catch(err => alert('Salon eklenirken hata oluştu: ' + err.message));
    };

    // Butonların ortak stili
    const butonStili = {
        flex: 0,
        fontFamily: 'Space Grotesk',
        fontWeight: 700,
        fontSize: 22,
        padding: '18px 40px',
        border: 'none',
        borderRadius: 10,
        background: '#4A4E68',
        color: '#fff',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(27, 50, 177, 0.6)',  // burası daha belirgin gölge
        transition: 'background 0.2s',
        height: 60,
    };


    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                background: '#fff',
                margin: 0,
                padding: 0,
                position: 'relative',
                overflow: 'hidden',
                overflowX: 'hidden',
            }}
        >
            <h1
                style={{
                    fontFamily: 'Space Grotesk',
                    fontWeight: 700,
                    fontSize: 64,
                    color: '#000',
                    position: 'absolute',
                    top: 32,
                    left: 64,
                    margin: 0,
                    padding: 0,
                    letterSpacing: '-0.01em',
                }}
            >
                Bilgi Girişi
            </h1>

            {/* Sağ ortaya görsel */}
            <img
                src={'/teacher-icon.png'}
                alt="Bilgi Girişi Görseli"
                className="bilgi-girisi-gorsel"
            />

            {/* Fakülte Ekleme */}
            <div
                style={{
                    position: 'absolute',
                    top: 180,
                    left: 64,
                    width: 700,
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                }}
            >
                <div
                    style={{
                        fontFamily: 'Space Grotesk',
                        fontWeight: 400,
                        fontSize: 28,
                        color: '#222',
                    }}
                >
                    Yeni Fakülte / Meslek Yüksekokulu Ekle
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 18 }}>
                    <input
                        type="text"
                        placeholder="Eklemek istediğiniz fakülte ismini giriniz..."
                        value={fakulteAdi}
                        onChange={e => setFakulteAdi(e.target.value)}
                        style={{
                            flex: 2,
                            fontFamily: 'Space Grotesk',
                            fontSize: 16,
                            padding: '18px 24px',
                            border: '2px solid #E0E0E0',
                            borderRadius: 10,
                            background: '#F0EFFF',
                            color: '#222',
                            outline: 'none',
                            minWidth: 0,
                            height: 60,
                        }}
                    />
                    <button onClick={handleFakulteKaydet} style={butonStili}>
                        Kaydet
                    </button>
                </div>
            </div>

            {/* Salon Ekleme */}
            <div
                style={{
                    position: 'absolute',
                    top: 320,
                    left: 64,
                    width: 700,
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                    marginTop: 48,
                }}
            >
                <div
                    style={{
                        fontFamily: 'Space Grotesk',
                        fontWeight: 400,
                        fontSize: 28,
                        color: '#222',
                    }}
                >
                    Salon Ekle
                </div>

                {/* Fakülte başlığı + dropdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div
                        style={{
                            fontFamily: 'Space Grotesk',
                            fontSize: 18,
                            fontWeight: 300,
                            color: '#333',
                        }}
                    >
                        Fakülte veya Meslek Yüksekokulu Seçiniz
                    </div>
                    <select
                        value={seciliFakulte}
                        onChange={e => setSeciliFakulte(e.target.value)}
                        style={{
                            flex: 2,
                            fontFamily: 'Space Grotesk',
                            fontSize: 16,
                            padding: '18px 24px',
                            border: '2px solid #E0E0E0',
                            borderRadius: 10,
                            background: '#F0EFFF',
                            color: '#222',
                            outline: 'none',
                            minWidth: 0,
                            height: 60,
                            appearance: 'none',
                        }}
                    >
                        <option value="">Bir fakülte seçin...</option>
                        {fakulteler.map(fakulte => (
                            <option key={fakulte.id} value={fakulte.id}>
                                {fakulte.name || fakulte.ad}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Salon başlığı + input + buton yan yana */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div
                        style={{
                            fontFamily: 'Space Grotesk',
                            fontSize: 18,
                            fontWeight: 300,
                            color: '#333',
                        }}
                    >
                        Seçilen Fakülteye Yeni Salon Ekle
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 18 }}>
                        <input
                            type="text"
                            placeholder="Eklemek istediğiniz salon ismini giriniz..."
                            value={salonAdi}
                            onChange={e => setSalonAdi(e.target.value)}
                            style={{
                                flex: 2,
                                fontFamily: 'Space Grotesk',
                                fontSize: 16,
                                padding: '18px 24px',
                                border: '2px solid #E0E0E0',
                                borderRadius: 10,
                                background: '#F0EFFF',
                                color: '#222',
                                outline: 'none',
                                minWidth: 0,
                                height: 60,
                            }}
                        />
                        <button onClick={handleSalonKaydet} style={butonStili}>
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BilgiGirisi;

/* Responsive görsel için stil */
/* Bilgi Girişi görseli responsive */
const style = document.createElement('style');
style.innerHTML = `
.bilgi-girisi-gorsel {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  width: 35vw;
  max-width: 400px;
  min-width: 180px;
  height: auto;
  border-radius: 24px;
  z-index: 2;
}
@media (max-width: 900px) {
  .bilgi-girisi-gorsel {
    position: static;
    display: block;
    margin: 32px auto 0 auto;
    top: unset;
    right: unset;
    transform: none;
    width: 60vw;
    max-width: 320px;
    min-width: 120px;
  }
}`;
document.head.appendChild(style);