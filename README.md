# KreasiKita Next.js

Aplikasi e-commerce full-stack berbasis Next.js App Router, Better Auth, Prisma/MySQL, dan Midtrans. Desain template KreasiKita dipertahankan, sementara data runtime kini berasal dari database.

## Menjalankan lokal

1. Salin `.env.example` menjadi `.env`, lalu isi nilai lokal dan credential pihak ketiga.
2. Buat database MySQL sesuai `DATABASE_NAME`.
3. Jalankan `npm install`.
4. Jalankan `npm run db:deploy` lalu `npm run db:seed`.
5. Jalankan `npm run dev` dan buka `http://localhost:3000`.

Jangan commit `.env`. Kredensial seed hanya untuk lokal dan wajib berbeda dari production.

## Perintah penting

- `npm run typecheck` — validasi TypeScript.
- `npm test` — unit tests.
- `npm run build` — production build biasa.
- `npm run build:hostinger` — deploy migration, generate Prisma Client, lalu build Next.js.
- `npm run db:deploy` — terapkan migration yang sudah direview.

Perintah deployment tambahan:

- `npm run build:hostinger:first` - deployment pertama dengan seed katalog production-safe.
- `GET /api/health` - readiness aplikasi dan database tanpa detail internal.
- `POST /api/setup/admin` - bootstrap admin production satu kali; wajib dinonaktifkan setelah digunakan.

Dokumentasi deployment production tersedia di `HOSTINGER_DEPLOYMENT.md`.
