import React, { useState, useEffect, useRef } from 'react';
import './CalendarPage.css';
import { useNavigate } from 'react-router-dom';

// Örnek rezervasyon verisi


function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}



// Hafta görünümü bileşeni
interface WeekViewProps {
    currentWeek: Date[];
    reservations?: any[];
    onReservationClick?: (r: any, e: React.MouseEvent) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentWeek, reservations = [], onReservationClick }) => {
    // Saatler (07:00 - 21:00)
    const hours = Array.from({ length: 15 }, (_, i) => `${(7 + i).toString().padStart(2, '0')}:00`);
    const days = currentWeek;
    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

    const hourCount = hours.length;

    return (
        <div style={{
            width: '100%',
            height: '100%',
            minHeight: 0,
            minWidth: 0,
            background: '#fff',
            border: '1px solid #DCE0E5',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Üst başlık satırı */}
            <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #B6C1CA', background: '#fff', zIndex: 2, flex: '0 0 80px', minHeight: 80 }}>
                {/* Sol üst boş kutu */}
                <div style={{ width: 80, minWidth: 80, height: 80, borderRight: '1px solid #DCE0E5', background: '#F6F7F9' }} />
                {/* Gün başlıkları */}
                {days.map((date, i) => (
                    <div key={i} style={{
                        flex: 1,
                        minWidth: 0,
                        height: 80,
                        borderRight: i === 6 ? 'none' : '1px solid #DCE0E5',
                        borderBottom: '1px solid #B6C1CA',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        position: 'relative',
                        background: '#fff',
                        padding: '0px 0 0 10px',
                    }}>
                        <span style={{ fontWeight: 700, fontSize: 18, color: '#14181F', fontFamily: 'Inter' }}>{date.getDate()}</span>
                        <span style={{ fontSize: 12, color: '#14181F', fontFamily: 'Inter', fontWeight: 400 }}>
                            {monthNames[date.getMonth()]}, {dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                        </span>
                    </div>
                ))}
            </div>
            {/* Grid satırları */}
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flex: 1, minHeight: 0, position: 'relative' }}>
                {/* Saatler sütunu */}
                <div style={{ width: 80, minWidth: 80, background: '#F6F7F9', display: 'flex', flexDirection: 'column', borderRight: '1px solid #DCE0E5', height: '100%' }}>
                    {hours.map((h, i) => (
                        <div key={i} style={{
                            flex: 1,
                            minHeight: 0,
                            borderTop: i === 0 ? 'none' : '1px solid #DCE0E5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            padding: '0 10px',
                            fontFamily: 'Inter',
                            fontSize: 15,
                            color: '#14181F',
                        }}>{h}</div>
                    ))}
                </div>
                {/* Günler için grid hücreleri */}
                {days.map((date, dayIdx) => (
                    <div key={dayIdx} style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRight: dayIdx === 6 ? 'none' : '1px solid #DCE0E5',
                        borderLeft: '1px solid #DCE0E5',
                        background: '#fff',
                        height: '100%',
                        position: 'relative',
                        overflow: 'visible',
                    }}>
                        {/* Grid hücreleri */}
                        {hours.map((_, hourIdx) => (
                            <div key={hourIdx} style={{
                                flex: 1,
                                minHeight: 0,
                                height: `${100 / hourCount}%`,
                                borderTop: hourIdx === 0 ? 'none' : '1px solid #DCE0E5',
                                background: '#fff',
                                padding: '0px 0px 0px 10px',
                                position: 'relative',
                                zIndex: 1,
                            }} />
                        ))}
                        {/* Rezervasyon kutucukları */}
                        {reservations.filter(r => {
                            const d = new Date(r.date);
                            return d.getFullYear() === date.getFullYear() &&
                                d.getMonth() === date.getMonth() &&
                                d.getDate() === date.getDate();
                        }).map((r, i) => {
                            if (!r.startTime || !r.endTime) return null;
                            const [startHour] = r.startTime.split(":");
                            const [endHour] = r.endTime.split(":");
                            const start = parseInt(startHour, 10);
                            const end = parseInt(endHour, 10);
                            const topIdx = start - 7;
                            const hourSpan = Math.max(1, end - start);
                            if (topIdx < 0 || topIdx >= hourCount) return null;
                            return (
                                <div
                                    key={i}
                                    className={`calendar-event${r.tur ? ' ' + turToClass(r.tur) : ''}`}
                                    title={r.baslik}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        top: `calc(${(topIdx / hourCount) * 100}% + 4px)`,
                                        height: `calc(${(hourSpan / hourCount) * 100}% - 8px)`,
                                        margin: '0 8px',
                                        boxSizing: 'border-box',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'normal',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        fontSize: 13,
                                        cursor: 'pointer',
                                        transition: 'background 0.15s, box-shadow 0.15s',
                                        border: '1.5px solid #e5e7eb',
                                        borderRadius: 14,
                                        color: '#fff',
                                        fontWeight: 500,
                                        fontFamily: 'Space Grotesk',
                                        padding: '6px 10px',
                                        maxWidth: '100%',
                                        zIndex: 2
                                    }}
                                    onClick={e => onReservationClick && onReservationClick(r, e)}
                                >
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.baslik}</div>
                                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2, color: '#e0e7ef' }}>{r.startTime?.slice(0, 5)} - {r.endTime?.slice(0, 5)}</div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

const turToClass = (tur: any) => {
    if (!tur) return '';
    const t = String(tur).toUpperCase();
    switch (t) {
        case 'SINAV': return 'sn'; // kırmızı
        case 'DERS': return 'o'; // yeşil
        case 'ETKINLIK': return 'd'; // mor
        case 'SUNUM': return 'su'; // turuncu
        case 'TOPLANTI': return 't'; // mavi
        case 'DIGER': return 'e'; // açık mavi
        default: return '';
    }
};

const turToColor = (tur: any) => {
    if (!tur) return '#2563eb';
    const t = String(tur).toUpperCase();
    switch (t) {
        case 'SINAV': return '#FF2D2D';
        case 'DERS': return '#00C81E';
        case 'ETKINLIK': return '#B90FCB';
        case 'SUNUM': return '#FFA600';
        case 'TOPLANTI': return '#2600FF';
        case 'DIGER': return '#2563eb';
        default: return '#2563eb';
    }
};

const CalendarPage: React.FC = () => {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [view, setView] = useState<'month' | 'week'>('month');

    // Fakülte/MYO listesi backend'den gelecek
    const [faculties, setFaculties] = useState<{ id: number, name: string }[]>([]);
    const [selectedFaculty, setSelectedFaculty] = useState<{ id: number, name: string } | null>(null);
    const [facultyLoading, setFacultyLoading] = useState(true);
    const [facultyError, setFacultyError] = useState<string | null>(null);
    const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);

    // Rezervasyonlarının gösterileceği state
    const [reservations, setReservations] = useState<any[]>([]);

    // Kullanıcı login mi kontrolü (state)
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        try {
            let u = JSON.parse(localStorage.getItem('user') || 'null');
            // Eğer user yoksa veya role yoksa, token'dan çözümle
            if (!u || !u.role) {
                const token = localStorage.getItem('token');
                if (token) {
                    // JWT ise payload'ı decode et
                    const payload = token.split('.')[1];
                    if (payload) {
                        try {
                            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
                            // Pek çok JWT'de rol authorities veya role olarak gelir
                            let role = decoded.role || (decoded.authorities && decoded.authorities[0]?.authority) || null;
                            // Eğer authorities array ise ve içinde ROLE_ ile başlıyorsa düzelt
                            if (typeof role === 'string' && role.startsWith('ROLE_')) {
                                role = role.replace('ROLE_', '');
                            }
                            // Bazı JWT'lerde authorities array olabilir
                            if (!role && Array.isArray(decoded.authorities) && decoded.authorities.length > 0) {
                                role = decoded.authorities[0]?.authority?.replace('ROLE_', '') || null;
                            }
                            u = { username: decoded.sub || decoded.username || '', role };
                        } catch (e) { /* ignore */ }
                    }
                }
            }
            setUser(u);
        } catch {
            setUser(null);
        }
    }, []);

    // Dosyanın başına getToken fonksiyonunu ekle
    async function getToken() {
        let token = localStorage.getItem('token');
        if (!token) {
            const res = await fetch('http://10.15.0.15:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', password: 'admin123' })
            });
            const data = await res.json();
            token = data.token || data.access_token || data.jwt || data.data;
            localStorage.setItem('token', token ?? '');
        }
        return token || '';
    }

    // Fakülteler ve rezervasyonlar için useEffect'lerde async fonksiyon kullan
    useEffect(() => {
        async function fetchFaculties() {
            setFacultyLoading(true);
            setFacultyError(null);
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { 'Authorization': 'Bearer ' + token } : undefined;
                const res = await fetch('http://10.15.0.15:8080/fakulteler', { headers });
                if (!res.ok) throw new Error('Fakülte listesi alınamadı');
                const data = await res.json();
                setFaculties(data);
                setSelectedFaculty(data[0] || null);
                setFacultyLoading(false);
            } catch (err) {
                setFacultyError('Fakülte listesi alınamadı');
                setFacultyLoading(false);
            }
        }
        fetchFaculties();
    }, []);

    useEffect(() => {
        if (!selectedFaculty) return;
        async function fetchReservations() {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': 'Bearer ' + token } : undefined;
            if (!selectedFaculty) return; // null kontrolü
            fetch(`http://10.15.0.15:8080/rezervasyonlar?fakulteId=${selectedFaculty.id}`, { headers })
                .then(res => {
                    if (!res.ok) throw new Error('Rezervasyonlar alınamadı');
                    return res.json();
                })
                .then(data => setReservations(data))
                .catch(() => setReservations([]));
        }
        fetchReservations();
    }, [selectedFaculty]);

    // Haftanın başlangıç ve bitiş tarihini hesaplayan fonksiyon
    function getWeekRange(date: Date) {
        const first = new Date(date);
        first.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // Pazartesi
        const last = new Date(first);
        last.setDate(first.getDate() + 6); // Pazar
        return { start: first, end: last };
    }

    const [weekReservations, setWeekReservations] = useState<any[]>([]);

    // Haftalık görünümde haftanın başlangıç günü için state
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Pazartesi
        return today;
    });

    // Haftalık görünümde ok tuşları ile haftayı değiştir
    const handlePrevWeek = () => {
        setCurrentWeekStart(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 7);
            return d;
        });
    };
    const handleNextWeek = () => {
        setCurrentWeekStart(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 7);
            return d;
        });
    };

    // Haftalık başlık metni (örn: 30 Haz - 6 Tem)
    function getWeekTitle(start: Date) {
        const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return `${start.getDate()} ${monthNames[start.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]}`;
    }

    useEffect(() => {
        if (view !== 'week' || !selectedFaculty) return;
        const { start, end } = getWeekRange(currentWeekStart);
        const startStr = start.toISOString().slice(0, 10);
        const endStr = end.toISOString().slice(0, 10);
        async function fetchWeekReservations() {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': 'Bearer ' + token } : undefined;
            const res = await fetch(`http://10.15.0.15:8080/rezervasyonlar?start=${startStr}&end=${endStr}&fakulteId=${selectedFaculty?.id}`, { headers });
            if (!res.ok) return setWeekReservations([]);
            const data = await res.json();
            setWeekReservations(data);
        }
        fetchWeekReservations();
    }, [view, currentWeekStart, selectedFaculty]);

    useEffect(() => {
        if (view === 'week') {
            // Seçili ayın 1. günüyle başlasın
            setCurrentWeekStart(new Date(currentYear, currentMonth, 1));
        }
        // eslint-disable-next-line
    }, [view]);

    // Menü dışında tıklanınca kapat
    useEffect(() => {
        if (!facultyDropdownOpen) return;
        const handleClick = (e: MouseEvent) => {
            const dropdown = document.getElementById('faculty-dropdown-root');
            if (dropdown && !dropdown.contains(e.target as Node)) {
                setFacultyDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [facultyDropdownOpen]);

    // API'den güncel tarih bilgisini çek
    useEffect(() => {
        fetch('https://worldtimeapi.org/api/timezone/Europe/Istanbul')
            .then(res => res.json())
            .then(data => {
                if (data && data.datetime) {
                    const date = new Date(data.datetime);
                    setCurrentYear(date.getFullYear());
                    setCurrentMonth(date.getMonth());
                }
            });
    }, []);

    // Takvim gridini oluştur (gün numaraları için)
    const calendarDays: (number | null)[] = [];
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // JS'de Pazar=0, Pazartesi=1... Figma'da Pazartesi başlıyor, düzeltme:
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < startOffset; i++) {
        calendarDays.push(null); // Boş kutu
    }
    for (let d = 1; d <= daysInMonth; d++) {
        calendarDays.push(d);
    }
    while (calendarDays.length < 35) {
        calendarDays.push(null); // Ay sonu boş kutular
    }

    // Ay adını Türkçe göster
    const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(11);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };
    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(0);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const navigate = useNavigate();
    // Footer'da çıkış fonksiyonu
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };
    // Çıkış menüsü için state
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);

    // Ayarlar menüsü açma state'i
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Türden class'a eşleme fonksiyonu
    // Sınav: sn (kırmızı #FF2D2D)
    // Ders: o (yeşil #0FC224)
    // Etkinlik: d (mor #AC10A1)
    // Sunum: su (turuncu #FF9900)
    // Toplantı: t (mavi #2F00FF)
    // Diğer: e (açık mavi #00CFFF)

    // Türden renge eşleme fonksiyonu (modal için)
    // Sınav: sn (kırmızı #FF2D2D)
    // Ders: o (yeşil #0FC224)
    // Etkinlik: d (mor #AC10A1)
    // Sunum: su (turuncu #FF9900)
    // Toplantı: t (mavi #2F00FF)
    // Diğer: e (açık mavi #00CFFF)

    // Renk koyulaştırıcı (hex kodunu %80 koyulaştır)
    function darkenColor(hex: string, amount = 0.8) {
        if (!hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) return hex;
        let r, g, b;
        if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        } else {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        r = Math.floor(r * amount);
        g = Math.floor(g * amount);
        b = Math.floor(b * amount);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // Modal state'leri
    const [showModal, setShowModal] = useState(false);
    const [modalReservations, setModalReservations] = useState<any[]>([]);
    const [modalDate, setModalDate] = useState<string | null>(null);
    const [modalPos, setModalPos] = useState<{ x: number, y: number } | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    // Modal yüksekliğine göre y pozisyonunu güncelle
    React.useEffect(() => {
        if (showModal && modalRef.current && modalPos) {
            const modalHeight = modalRef.current.offsetHeight;
            let y = modalPos.y;
            const gap = 8;
            // Eğer modal ekranın altına taşacaksa yukarı kaydır
            if (y + modalHeight + gap > window.innerHeight) {
                y = window.innerHeight - modalHeight - gap;
            }
            if (y < gap) y = gap;
            if (y !== modalPos.y) setModalPos({ x: modalPos.x, y });
        }
    }, [showModal, modalPos]);

    // Rezervasyon detay modalı için state
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailReservation, setDetailReservation] = useState<any | null>(null);
    const [detailModalPos, setDetailModalPos] = useState<{ x: number, y: number } | null>(null);
    const detailModalRef = useRef<HTMLDivElement>(null);
    // Detay modalı konumunu dinamik ayarla
    React.useEffect(() => {
        if (showDetailModal && detailModalRef.current && detailModalPos) {
            const modalHeight = detailModalRef.current.offsetHeight;
            let y = detailModalPos.y;
            const gap = 8;
            if (y + modalHeight + gap > window.innerHeight) {
                y = window.innerHeight - modalHeight - gap;
            }
            if (y < gap) y = gap;
            if (y !== detailModalPos.y) setDetailModalPos({ x: detailModalPos.x, y });
        }
    }, [showDetailModal, detailModalPos]);

    // Gün adını ve tarihi almak için yardımcı fonksiyon
    const getDayLabel = (dateStr: string | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    return (
        <>
            {/* Takvim kutusunun hemen üstüne fakülte seçme butonunu ekliyorum */}
            <div id="faculty-dropdown-root" className="faculty-select-root" style={{ position: 'absolute', top: 48, left: 'calc(300px + 32px)', zIndex: 10 }}>
                <button className="faculty-select" onClick={() => setFacultyDropdownOpen(v => !v)} disabled={facultyLoading || !!facultyError || faculties.length === 0}>
                    <span className="faculty-select__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 21V10.5L12 3L21 10.5V21H3Z" stroke="#222" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><rect x="7" y="14" width="2" height="4" fill="#222" /><rect x="15" y="14" width="2" height="4" fill="#222" /><rect x="11" y="14" width="2" height="4" fill="#222" /></svg>
                    </span>
                    {facultyLoading ? 'Yükleniyor...' : facultyError ? 'Fakülte bulunamadı' : (selectedFaculty?.name || 'Fakülte Seç')}
                    <span className="faculty-select__arrow" style={{ marginLeft: 8, transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)', transform: facultyDropdownOpen ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6L9 12L15 18" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                </button>
                {facultyDropdownOpen && faculties.filter(f => f.name).length > 0 && !facultyLoading && !facultyError && (
                    <div style={{
                        position: 'absolute',
                        top: 52,
                        left: 0,
                        minWidth: 320,
                        background: '#fff',
                        borderRadius: 14,
                        boxShadow: '0 4px 24px #0002',
                        border: '1.5px solid #e5e7eb',
                        padding: '8px 0',
                        zIndex: 1000
                    }}>
                        {faculties.filter(fac => fac.name).map(fac => (
                            <div
                                key={fac.id}
                                onClick={() => { setSelectedFaculty(fac); setFacultyDropdownOpen(false); }}
                                style={{
                                    padding: '12px 24px',
                                    fontFamily: 'Space Grotesk',
                                    fontWeight: 500,
                                    fontSize: 16,
                                    color: fac.id === selectedFaculty?.id ? '#2563eb' : '#222',
                                    background: fac.id === selectedFaculty?.id ? '#f3f6fa' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {fac.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Takvim kutusu */}
            <div style={{
                margin: 0,
                width: '100%',
                maxWidth: '100vw',
                minWidth: 0,
                background: '#fff',
                boxShadow: '0 2px 16px #0001',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '16px 24px 12px 24px',
                boxSizing: 'border-box',
                position: 'relative',
                height: '100%',
                minHeight: 0,
                paddingBottom: 40,
            }}>
                {/* Başlık ve ay/hafta çubuğu kutu içinde, margin-bottom ile ayrık */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                        {view === 'week' ? (
                            <>
                                <button onClick={handlePrevWeek} style={{ border: '1px solid #E5E7EB', background: '#fff', borderRadius: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', padding: 0, cursor: 'pointer' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <polyline points="15 6 9 12 15 18" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 40, margin: 0, color: '#111' }}>{getWeekTitle(currentWeekStart)}</span>
                                <button onClick={handleNextWeek} style={{ border: '1px solid #E5E7EB', background: '#fff', borderRadius: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', padding: 0, cursor: 'pointer' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <polyline points="9 6 15 12 9 18" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <>
                                <button style={{ border: '1px solid #E5E7EB', background: '#fff', borderRadius: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', padding: 0, cursor: 'pointer' }} onClick={handlePrevMonth}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <polyline points="15 6 9 12 15 18" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 40, margin: 0, color: '#111' }}>
                                    {monthNames[currentMonth]} {currentYear}
                                </h1>
                                <button style={{ border: '1px solid #E5E7EB', background: '#fff', borderRadius: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', padding: 0, cursor: 'pointer' }} onClick={handleNextMonth}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <polyline points="9 6 15 12 9 18" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                    <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 8, overflow: 'hidden', width: 200, boxShadow: '0 1px 4px #0001', border: '1.5px solid #E5E7EB', marginTop: 8 }}>
                        <button
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                background: view === 'month' ? '#fff' : '#F3F4F6',
                                border: view === 'month' ? '1.5px solid #E5E7EB' : 'none',
                                fontWeight: 600,
                                fontSize: 17,
                                color: view === 'month' ? '#111' : '#6B7280',
                                borderRadius: view === 'month' ? '8px 0 0 8px' : 0,
                                boxShadow: view === 'month' ? '0 2px 8px #2563eb22' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                outline: 'none',
                                zIndex: view === 'month' ? 1 : 0
                            }}
                            onClick={() => setView('month')}
                        >
                            Ay
                        </button>
                        <button
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                background: view === 'week' ? '#fff' : '#F3F4F6',
                                border: view === 'week' ? '1.5px solid #E5E7EB' : 'none',
                                fontWeight: 600,
                                fontSize: 17,
                                color: view === 'week' ? '#111' : '#6B7280',
                                borderRadius: view === 'week' ? '0 8px 8px 0' : 0,
                                boxShadow: view === 'week' ? '0 2px 8px #2563eb22' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                outline: 'none',
                                zIndex: view === 'week' ? 1 : 0
                            }}
                            onClick={() => setView('week')}
                        >
                            Hafta
                        </button>
                    </div>
                </div>
                {/* Gün isimleri satırı */}
                {view === 'month' && (
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', minHeight: 56, padding: 0, margin: 0, gap: 0, boxSizing: 'border-box', borderLeft: '1px solid #DCE0E5' }}>
                        {['PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA', 'CUMARTESİ', 'PAZAR'].map((day, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 12,
                                    gap: 10,
                                    flex: 1,
                                    minWidth: 0,
                                    minHeight: 56,
                                    background: '#F6F7F9',
                                    border: '1px solid #DCE0E5',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'Space Grotesk',
                                        fontWeight: 500,
                                        fontSize: 17,
                                        lineHeight: '140%',
                                        color: '#6F7C8E',
                                        display: 'block',
                                        textAlign: 'center'
                                    }}
                                >
                                    {day}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                {/* Takvim günleri grid'i */}
                {/* Haftalara bölünmüş grid: Satırdaki en fazla rezervasyon sayısına göre satır yüksekliği dinamik */}
                {/* Haftaları render et */}
                {view === 'month' ? (
                    Array.from({ length: 5 }).map((_, weekIdx) => {
                        const weekDaysArr = calendarDays.slice(weekIdx * 7, (weekIdx + 1) * 7);
                        return (
                            <div key={weekIdx} style={{ display: 'flex', flexDirection: 'row', width: '100%', flex: 1, borderBottom: weekIdx === 4 ? 'none' : '1px solid #DCE0E5', alignItems: 'stretch', minHeight: 0, margin: 0, padding: 0, gap: 0, boxSizing: 'border-box' }}>
                                {weekDaysArr.map((day, idx) => {
                                    const dayReservations = day ? reservations.filter(r => {
                                        const d = new Date(r.date);
                                        return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
                                    }) : [];
                                    const shown = dayReservations.slice(0, 3);
                                    const hiddenCount = dayReservations.length - 3;
                                    return (
                                        <div
                                            key={idx}
                                            className="calendar-day"
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                                minHeight: 0,
                                                position: 'relative',
                                                borderRight: '1px solid #DCE0E5',
                                                borderLeft: (idx === 0) ? '1px solid #DCE0E5' : 'none',
                                                borderBottom: '1px solid #DCE0E5',
                                                margin: 0,
                                                padding: 0,
                                                boxSizing: 'border-box',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                justifyContent: 'flex-start',
                                                height: '100%',
                                            }}
                                        >
                                            {/* Gün numarası */}
                                            {day && (
                                                <span style={{
                                                    fontFamily: 'Space Grotesk',
                                                    fontWeight: 700,
                                                    fontSize: '1.2vw',
                                                    color: '#14181F',
                                                    padding: '8px 0 0 8px',
                                                    lineHeight: 1,
                                                    marginBottom: 6
                                                }}>{day}</span>
                                            )}
                                            {/* Rezervasyon kutucukları */}
                                            {day && (
                                                <div style={{
                                                    flex: 1,
                                                    width: '100%',
                                                    overflowY: 'auto',
                                                    minHeight: 0,
                                                    boxSizing: 'border-box',
                                                    padding: '0 8px 6px 8px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'flex-start',
                                                }}>
                                                    {shown.map((r, i) => (
                                                        <div
                                                            key={i}
                                                            className={`calendar-event${r.tur ? ' ' + turToClass(r.tur) : ''}`}
                                                            title={r.baslik}
                                                            style={{
                                                                flex: 1,
                                                                minHeight: 0,
                                                                minWidth: 0,
                                                                width: '100%',
                                                                height: 'unset',
                                                                maxHeight: 'unset',
                                                                boxSizing: 'border-box',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'flex-start', // sola yasla
                                                                padding: 0,
                                                                paddingLeft: 10,
                                                                margin: 0,
                                                                fontSize: '0.75vw',
                                                                cursor: 'pointer',
                                                                transition: 'background 0.15s, box-shadow 0.15s',
                                                                marginBottom: i === shown.length - 1 && hiddenCount <= 0 ? 0 : 6,
                                                                border: '1.5px solid #e5e7eb',
                                                                borderRadius: 14,
                                                                background: r.tur && r.tur.toUpperCase() === 'DİĞER' ? '#00CFFF' : r.tur ? turToColor(r.tur) : '#E5E7EB',
                                                            }}
                                                            onMouseEnter={e => {
                                                                // Tür rengine göre koyulaştır
                                                                const color = r.tur ? turToColor(r.tur) : '';
                                                                if (color) {
                                                                    e.currentTarget.style.background = darkenColor(color, 0.8);
                                                                }
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.currentTarget.style.background = '';
                                                            }}
                                                            onClick={e => {
                                                                setDetailReservation(r);
                                                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                                const modalWidth = 260;
                                                                const gap = 8;
                                                                const x = rect.right + modalWidth + gap < window.innerWidth ? rect.right + gap : rect.left - modalWidth - gap;
                                                                let y = rect.top;
                                                                setDetailModalPos({ x, y });
                                                                setShowDetailModal(true);
                                                            }}
                                                        >
                                                            {r.baslik}
                                                        </div>
                                                    ))}
                                                    {hiddenCount > 0 && (
                                                        <button
                                                            className="calendar-event"
                                                            style={{
                                                                flex: 1,
                                                                minHeight: 0,
                                                                minWidth: 0,
                                                                width: '100%',
                                                                height: 'unset',
                                                                maxHeight: 'unset',
                                                                boxSizing: 'border-box',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'flex-start', // sola yasla
                                                                padding: 0,
                                                                paddingLeft: 10,
                                                                margin: 0,
                                                                fontSize: '0.75vw',
                                                                background: '#E5E7EB',
                                                                color: '#222',
                                                                fontWeight: 500,
                                                                fontFamily: 'Space Grotesk',
                                                                border: '1.5px solid #e5e7eb',
                                                                borderRadius: 14,
                                                                cursor: 'pointer',
                                                                transition: 'background 0.15s, box-shadow 0.15s',
                                                                marginBottom: 0
                                                            }}
                                                            onMouseEnter={e => {
                                                                // +N butonu için arka planı koyulaştır
                                                                e.currentTarget.style.background = darkenColor('#E5E7EB', 0.8);
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.currentTarget.style.background = '#E5E7EB';
                                                            }}
                                                            onClick={e => {
                                                                setModalReservations(dayReservations);
                                                                setModalDate(dayReservations[0]?.date || null);
                                                                setShowModal(true);
                                                                // Mouse pozisyonunu al
                                                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                                // Sağda yer varsa sağda, yoksa solda aç
                                                                const gap = 8;
                                                                const x = rect.right + 340 < window.innerWidth ? rect.right + gap : rect.left - 340;
                                                                const y = rect.top;
                                                                setModalPos({ x, y });
                                                            }}
                                                            title="Tüm rezervasyonları gör"
                                                        >
                                                            +{hiddenCount}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })
                ) : (
                    <WeekView
                        currentWeek={Array.from({ length: 7 }).map((_, i) => {
                            const d = new Date(currentWeekStart);
                            d.setDate(currentWeekStart.getDate() + i);
                            return d;
                        })}
                        reservations={weekReservations}
                        onReservationClick={(r, e) => {
                            setDetailReservation(r);
                            const rect = (e.target as HTMLElement).getBoundingClientRect();
                            const modalWidth = 260;
                            const gap = 8;
                            const x = rect.right + modalWidth + gap < window.innerWidth ? rect.right + gap : rect.left - modalWidth - gap;
                            let y = rect.top;
                            setDetailModalPos({ x, y });
                            setShowDetailModal(true);
                        }}
                    />
                )}
            </div>
            {/* Takvim kutusunun içindeki en son satıra footer divi ekliyorum: */}
            {/* Bunu kaldırıp, legend divini takvim ana kutusunun sağ alt köşesine ekliyorum: */}
            <div style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                display: 'flex',
                flexFlow: 'wrap',
                alignItems: 'center',
                gap: 8,
                zIndex: 100,
                background: '#fff',
                padding: '4px 24px 4px 12px',
                borderRadius: 8,
                minWidth: 0,
                maxWidth: '100%',
                boxSizing: 'border-box',
            }}>
                {/* Sınav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF2D2D', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 15, lineHeight: '20px', letterSpacing: '-0.01em', color: '#000' }}>Sınav</span>
                </div>
                {/* Ders */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0FC224', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 15, lineHeight: '20px', letterSpacing: '-0.01em', color: '#000' }}>Ders</span>
                </div>
                {/* Etkinlik */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#AC10A1', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 15, lineHeight: '20px', letterSpacing: '-0.01em', color: '#000' }}>Etkinlik</span>
                </div>
                {/* Sunum */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF9900', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 15, lineHeight: '20px', letterSpacing: '-0.01em', color: '#000' }}>Sunum</span>
                </div>
                {/* Toplantı */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2F00FF', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 15, lineHeight: '20px', letterSpacing: '-0.01em', color: '#000' }}>Toplantı</span>
                </div>
                {/* Diğer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00CFFF', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 15, lineHeight: '20px', letterSpacing: '-0.01em', color: '#000' }}>Diğer</span>
                </div>
            </div>
            {/* Modal */}
            {
                showModal && modalPos && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.0)', // Arka planı kaldırdık
                        zIndex: 9999,
                    }} onClick={() => setShowModal(false)}>
                        <div
                            ref={modalRef}
                            style={{
                                position: 'fixed',
                                top: modalPos.y,
                                left: modalPos.x,
                                background: '#fff',
                                borderRadius: 18,
                                minWidth: 260,
                                maxWidth: 340,
                                padding: 0,
                                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.13)',
                                fontFamily: 'Space Grotesk',
                                border: '1.5px solid #e5e7eb',
                                overflow: 'hidden',
                                height: 'auto',
                                maxHeight: '80vh',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{
                                background: 'linear-gradient(90deg, #2563eb 0%, #4f8cff 100%)',
                                color: '#fff',
                                padding: '14px 20px 12px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontWeight: 700,
                                fontSize: 17,
                                letterSpacing: '0.01em',
                            }}>
                                <span>{getDayLabel(modalDate)}</span>
                                <button
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: 22,
                                        cursor: 'pointer',
                                        color: '#fff',
                                        marginLeft: 12,
                                        borderRadius: 6,
                                        padding: '2px 8px',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseOver={e => (e.currentTarget.style.background = '#1e40af33')}
                                    onMouseOut={e => (e.currentTarget.style.background = 'none')}
                                >
                                    &times;
                                </button>
                            </div>
                            <div style={{ padding: '18px 20px 16px 20px' }}>
                                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: 14, color: '#2563eb', letterSpacing: '-0.01em' }}>Tüm Rezervasyonlar</h2>
                                {modalReservations.length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {[...modalReservations].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')).map((r, i) => (
                                            <li key={i} style={{
                                                borderRadius: 10,
                                                background: '#f3f6fa',
                                                boxShadow: '0 2px 8px #2563eb11',
                                                padding: '12px 14px',
                                                fontSize: 15,
                                                fontWeight: 500,
                                                color: '#222',
                                                border: '1.2px solid #e5e7eb',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                                cursor: 'pointer'
                                            }}
                                                onClick={e => {
                                                    setDetailReservation(r);
                                                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                    const modalWidth = 260;
                                                    const gap = 8;
                                                    const x = rect.right + modalWidth + gap < window.innerWidth ? rect.right + gap : rect.left - modalWidth - gap;
                                                    let y = rect.top;
                                                    setDetailModalPos({ x, y });
                                                    setShowDetailModal(true);
                                                }}
                                            >
                                                <div style={{ color: turToColor(r.tur), fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{r.baslik}</div>
                                                <div style={{ color: '#6b7280', fontSize: 13 }}>{r.startTime?.slice(0, 5)} - {r.endTime?.slice(0, 5)}</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div style={{ color: '#888', fontSize: 14, textAlign: 'center', marginTop: 18 }}>Rezervasyon bulunamadı.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Rezervasyon detay modalı */}
            {
                showDetailModal && detailModalPos && detailReservation && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.0)',
                        zIndex: 10001,
                    }} onClick={() => setShowDetailModal(false)}>
                        <div
                            ref={detailModalRef}
                            style={{
                                position: 'fixed',
                                top: detailModalPos.y,
                                left: detailModalPos.x,
                                background: '#fff',
                                borderRadius: 14,
                                minWidth: 220,
                                maxWidth: 300,
                                padding: '18px 20px 16px 20px',
                                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.13)',
                                fontFamily: 'Space Grotesk',
                                border: '1.5px solid #e5e7eb',
                                overflow: 'hidden',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{
                                background: '#fff',
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
                                margin: '-18px -20px 0 -20px',
                                minWidth: 240,
                                minHeight: 120,
                                position: 'relative',
                                paddingBottom: 12,
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '18px 22px 8px 22px',
                                    fontWeight: 700,
                                    fontSize: 19,
                                    color: turToColor(detailReservation.tur),
                                    letterSpacing: '-0.01em',
                                    gap: 10,
                                    minWidth: 0,
                                }}>
                                    <span style={{
                                        flex: 1,
                                        minWidth: 0,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontWeight: 700,
                                        fontSize: 18,
                                    }}>{detailReservation.baslik || '-'}</span>
                                    <span style={{
                                        color: '#111',
                                        fontWeight: 700,
                                        fontSize: 18,
                                        marginLeft: 12,
                                        letterSpacing: '-0.01em',
                                        minWidth: 90,
                                        textAlign: 'right',
                                        flexShrink: 0,
                                    }}>{(detailReservation.startTime?.slice(0, 5) || '-') + ' - ' + (detailReservation.endTime?.slice(0, 5) || '-')}</span>
                                </div>
                                <div style={{ borderBottom: `2px solid ${turToColor(detailReservation.tur)}`, margin: '0 22px 14px 22px' }} />
                                <div style={{
                                    color: '#111',
                                    fontSize: 18,
                                    fontWeight: 500,
                                    margin: '18px 22px 0 22px',
                                    minHeight: 48,
                                    lineHeight: 1.6,
                                    wordBreak: 'break-word',
                                    textAlign: 'left',
                                    letterSpacing: '-0.01em',
                                }}>
                                    {detailReservation.aciklama || detailReservation.description || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Açıklama yok</span>}
                                </div>
                                {/* Gün bilgisi */}
                                <div style={{
                                    color: '#888',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    margin: '8px 22px 0 22px',
                                    letterSpacing: '-0.01em',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    {detailReservation.date ?
                                        new Date(detailReservation.date).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })
                                        : '-'}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    margin: '22px 22px 0 22px',
                                }}>
                                    <span style={{ color: '#888', fontSize: 13, fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {detailReservation.user?.firstName || ''} {detailReservation.user?.lastName || ''}
                                    </span>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: '50%',
                                            background: turToColor(detailReservation.tur),
                                            border: 'none',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 16px 0 rgba(37,99,235,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
                                            marginLeft: 8,
                                            transition: 'background 0.15s, transform 0.15s',
                                            outline: 'none',
                                            padding: 0,
                                        }}
                                        onMouseOver={e => {
                                            // Tür rengine yakın bir koyu tonu kullan
                                            let color = turToColor(detailReservation.tur);
                                            // Basitçe biraz koyulaştır (ör: opacity ile)
                                            e.currentTarget.style.background = color + 'cc';
                                            e.currentTarget.style.transform = 'scale(1.10)';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.background = turToColor(detailReservation.tur);
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        <span style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 22,
                                            fontWeight: 700,
                                            lineHeight: 1,
                                            userSelect: 'none',
                                        }}>
                                            &times;
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default CalendarPage;