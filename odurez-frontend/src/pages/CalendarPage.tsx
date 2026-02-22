import { useState, useEffect, useMemo } from 'react';
import '../styles/CalendarPage.css';
import { apiClient } from '../api/client';
import type { Fakulte, Rezervasyon } from '../types';

const CalendarPage = () => {
    const [faculties, setFaculties] = useState<Fakulte[]>([]);
    const [selectedFaculty, setSelectedFaculty] = useState<Fakulte | null>(null);
    const [reservations, setReservations] = useState<Rezervasyon[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week'>('month');

    const hours = Array.from({ length: 17 }, (_, i) => i + 8); // 08:00 - 24:00
    const SLOT_HEIGHT = 45;

    const handlePrev = () => {
        if (view === 'month') {
            setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        } else {
            setCurrentDate(prev => {
                const d = new Date(prev);
                d.setDate(d.getDate() - 7);
                return d;
            });
        }
    };

    const handleNext = () => {
        if (view === 'month') {
            setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        } else {
            setCurrentDate(prev => {
                const d = new Date(prev);
                d.setDate(d.getDate() + 7);
                return d;
            });
        }
    };

    const daysToDisplay = useMemo(() => {
        if (view === 'month') {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
            const totalDays = new Date(year, month + 1, 0).getDate();

            const days = [];
            for (let i = 0; i < firstDay; i++) days.push(null);
            for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));
            while (days.length < 42) days.push(null);
            return days;
        } else {
            const d = new Date(currentDate);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(d.getFullYear(), d.getMonth(), diff);

            const days = [];
            for (let i = 0; i < 7; i++) {
                const nextDay = new Date(monday);
                nextDay.setDate(monday.getDate() + i);
                days.push(nextDay);
            }
            return days;
        }
    }, [currentDate, view]);

    useEffect(() => {
        apiClient.get<Fakulte[]>('/fakulteler').then(data => {
            setFaculties(data);
            if (data.length > 0 && !selectedFaculty) setSelectedFaculty(data[0]);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedFaculty) {
            const fId = selectedFaculty.ID || selectedFaculty.id;
            apiClient.get<Rezervasyon[]>(`/rezervasyonlar?fakulteId=${fId}&fakulte_id=${fId}`)
                .then(setReservations)
                .catch(console.error);
        }
    }, [selectedFaculty, currentDate, view]);

    const turToColor = (tur: string) => {
        switch (tur?.toUpperCase()) {
            case 'DERS': return '#B90FCB';
            case 'ETKINLIK': return '#0FC224';
            case 'REZERVE': return '#2F00FF';
            case 'SINAV': return '#FF2D2D';
            case 'SUNUM': return '#FF9900';
            default: return '#64748B';
        }
    };

    const getEventStyle = (r: Rezervasyon) => {
        const [startH, startM] = r.startTime.split(':').map(Number);
        const [endH, endM] = r.endTime.split(':').map(Number);

        const startMinutes = (startH - 8) * 60 + startM;
        const endMinutes = (endH - 8) * 60 + endM;
        const duration = endMinutes - startMinutes;

        return {
            top: `${(startMinutes * SLOT_HEIGHT) / 60}px`,
            height: `${(duration * SLOT_HEIGHT) / 60}px`,
            backgroundColor: turToColor(r.tur)
        };
    };

    return (
        <div className="calendar-container">
            <div className="calendar-controls">
                <div className="faculty-selector">
                    <select
                        value={selectedFaculty?.ID || selectedFaculty?.id || ''}
                        onChange={(e) => {
                            const found = faculties.find(f => String(f.ID || f.id) === e.target.value);
                            if (found) setSelectedFaculty(found);
                        }}
                    >
                        {faculties.map(f => (
                            <option key={f.ID || f.id} value={f.ID || f.id}>{f.ad || f.name}</option>
                        ))}
                    </select>
                </div>

                <div className="view-switcher">
                    <button onClick={handlePrev}>&lt;</button>
                    <span style={{ minWidth: '180px', textAlign: 'center', fontWeight: 'bold' }}>
                        {view === 'month'
                            ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                            : `${daysToDisplay[0]?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} - ${daysToDisplay[6]?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}`
                        }
                    </span>
                    <button onClick={handleNext}>&gt;</button>
                </div>

                <div className="view-switcher">
                    <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Ay</button>
                    <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Hafta</button>
                </div>
            </div>

            <div className={`calendar-main fade-in ${view === 'week' ? 'week-view-active' : ''}`}>
                {view === 'month' ? (
                    <div className="month-grid">
                        {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => (
                            <div key={d} className="calendar-weekday-header">{d}</div>
                        ))}
                        {daysToDisplay.map((date, idx) => (
                            <div key={idx} className={`calendar-day ${!date ? 'empty' : ''}`}>
                                {date && (
                                    <>
                                        <span className="day-number">{date.getDate()}</span>
                                        <div className="day-events">
                                            {reservations
                                                .filter(r => r.date === date.toISOString().split('T')[0])
                                                .slice(0, 4)
                                                .map((r, i) => (
                                                    <div
                                                        key={i}
                                                        className="calendar-event-pill"
                                                        style={{ backgroundColor: turToColor(r.tur) }}
                                                    >
                                                        {r.startTime.slice(0, 5)} {r.baslik}
                                                    </div>
                                                ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="week-grid-wrapper">
                        <div className="time-column">
                            <div className="time-header-spacer"></div>
                            {hours.map(h => (
                                <div key={h} className="time-slot-label">{h}:00</div>
                            ))}
                        </div>
                        <div className="week-columns-container">
                            <div className="week-header-row">
                                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d, i) => (
                                    <div key={d} className="calendar-weekday-header">
                                        {d} <small>{daysToDisplay[i]?.getDate()}</small>
                                    </div>
                                ))}
                            </div>
                            <div className="week-grid-body">
                                {/* Grid Lines */}
                                <div className="grid-lines">
                                    {hours.map(h => <div key={h} className="hour-line"></div>)}
                                </div>
                                {/* Event Columns */}
                                <div className="day-columns">
                                    {daysToDisplay.map((date, dayIdx) => (
                                        <div key={dayIdx} className="day-column">
                                            {reservations
                                                .filter(r => r.date === date?.toISOString().split('T')[0])
                                                .map((r, eventIdx) => (
                                                    <div
                                                        key={eventIdx}
                                                        className="calendar-event-pill absolute-event"
                                                        style={getEventStyle(r)}
                                                        title={`${r.startTime} - ${r.endTime}: ${r.baslik}`}
                                                    >
                                                        <div className="event-time">{r.startTime.slice(0, 5)} - {r.endTime.slice(0, 5)}</div>
                                                        <div className="event-title">{r.baslik}</div>
                                                    </div>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="calendar-legend">
                {['Ders', 'Etkinlik', 'Rezerve', 'Sınav', 'Sunum'].map(label => (
                    <div key={label} className="legend-item">
                        <span className="legend-dot" style={{ background: turToColor(label) }}></span> {label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarPage;
