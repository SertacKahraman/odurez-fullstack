# Ordu Üniversitesi Salon Rezervasyon Sistemi (Odurez) - Frontend

Bu depo, Ordu Üniversitesi Salon Rezervasyon Sistemi'nin kullanıcı arayüzünü içermektedir. Modern, hızlı ve kullanıcı dostu bir deneyim sunmak üzere React ve Vite ile geliştirilmiştir.

## Özellikler

-   **İnteraktif Takvim**: Aylık ve haftalık saat bazlı görünüm.
-   **Profesyonel Arayüz**: Minimalist tasarım ve akıcı kullanıcı deneyimi.
-   **Fakülte/Salon Filtreleme**: Birim bazlı hızlı tarama.
-   **Rezervasyon Yönetimi**: Rezervasyon oluşturma, düzenleme ve silme.
-   **Responsive Tasarım**: Tüm cihazlarla tam uyumlu.

## Teknoloji Yığını

-   **Framework**: React 19
-   **Build Tool**: Vite
-   **Dil**: TypeScript
-   **Stil**: Vanilla CSS (Ekipler arası uyum için standartlaştırılmış tasarım sistemi)
-   **API İstemcisi**: Fetch API tabanlı custom `apiClient`

## Kurulum ve Çalıştırma

1.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

2.  Ortam değişkenlerini ayarlayın (Opsiyonel):
    `.env` dosyası oluşturup API adresini belirtebilirsiniz:
    ```env
    VITE_API_URL=http://localhost:8080
    ```

3.  Projeyi geliştirme modunda başlatın:
    ```bash
    npm run dev
    ```

## Not
Bu proje bir backend servisine ihtiyaç duyar. Backend deposuna [buradan](link-verebilirsiniz) ulaşabilirsiniz.
