# Odurez - Ordu Üniversitesi Salon Rezervasyon Sistemi

Ordu Üniversitesi için geliştirilmiş, modern ve ölçeklenebilir bir salon rezervasyon yönetim sistemidir. Proje, yüksek performanslı bir Go backend ve etkileşimli bir React frontend'den oluşmaktadır.

##  Proje Genel Yapısı

Sistem iki ana parçaya bölünmüştür:

```text
odurez-main/
├── odurez-backend/      # Go (Fiber) tabanlı API sunucusu
│   ├── controllers/     # İş mantığı ve istek yönetimi
│   ├── database/        # SQLite/Gorm veritabanı bağlantısı
│   ├── models/          # Veritabanı şemaları
│   ├── routes/          # API uç noktaları (Auth, Salonlar, Rezervasyonlar)
│   └── main.go          # Uygulama giriş noktası
├── odurez-frontend/     # React (Vite) tabanlı kullanıcı arayüzü
│   ├── src/
│   │   ├── api/         # Global API istemcisi
│   │   ├── components/  # Paylaşılan UI bileşenleri
│   │   ├── pages/       # Sayfa görünümleri (Takvim, Login, Kayıt vb.)
│   │   ├── styles/      # CSS Tasarım sistemi
│   │   └── App.tsx      # Rota ve Kimlik Doğrulama yönetimi
│   └── index.html       # Giriş HTML
└── README.md            # Genel proje dökümanı
```

##  Kullanılan Teknolojiler

### Backend
- **Dil:** Go (Golang)
- **Framework:** [Fiber v2](https://gofiber.io/) (Hız ve performans odaklı)
- **ORM:** [GORM](https://gorm.io/)
- **Veritabanı:** SQLite (Hafif ve taşınabilir)
- **Güvenlik:** JWT tabanlı kimlik doğrulama, CORS yapılandırması

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Router:** React Router v7
- **Stil:** Vanilla CSS (Özel tasarım sistemi)
- **Veri Paylaşımı:** Hooks ve Storage tabanlı Auth yönetimi

##  Kurulum ve Çalıştırma

### 1. Ön Hazırlık
- Go (1.20+) ve Node.js (18+) yüklü olmalıdır.

### 2. Backend'i Başlatma
```bash
cd odurez-backend
go mod download
go run main.go
```
*API varsayılan olarak `http://localhost:8080` adresinde çalışacaktır.*

### 3. Frontend'i Başlatma
```bash
cd odurez-frontend
npm install
npm run dev
```
*Frontend varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.*

##  Mevcut API Uç Noktaları

| Yöntem | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Sisteme giriş yapma |
| `GET` | `/fakulteler` | Tüm fakülteleri getirme |
| `GET` | `/salonlar` | Salon listesini getirme |
| `GET` | `/rezervasyonlar` | Mevcut rezervasyonları listeleme |
| `POST` | `/rezervasyonlar` | Yeni rezervasyon oluşturma |

##  Yapısal Analiz
Proje, **Seperation of Concerns** (İlgi Alanlarının Ayrılması) prensibine uygun olarak geliştirilmiştir:
- **Backend**, tamamen veriden sorumlu bir API katmanı olarak çalışır.
- **Frontend**, sadece veriyi görselleştiren ve kullanıcıyla etkileşime giren bağımsız bir uygulamadır.
- **Güvenlik**, JWT tokenlar üzerinden hem client hem server tarafında kontrol edilmektedir.
