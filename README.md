<<<<<<< HEAD
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
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> 1f5175d544687031d60f2a7a94be8b75bb2d2414
