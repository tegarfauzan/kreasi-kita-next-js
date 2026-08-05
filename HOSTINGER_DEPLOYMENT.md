# Deployment KreasiKita: GitHub ke Hostinger

## Alur produksi

```text
feature branch -> pull request -> GitHub Actions -> merge main
  -> migration production terkontrol -> Hostinger auto-deploy -> Next.js build
  -> https://kreasi-kita.tegarfauzan.com
```

Gunakan Node.js 22, framework Next.js, root directory `./`, branch `main`, build command `npm run build:hostinger`, dan start command `npm start`.

## Pemeriksaan sebelum commit pertama

1. Pastikan `.env`, backup hosting, database dump, credential, dan output build tidak masuk Git.
2. Jalankan `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, dan `npm run test:e2e`.
3. Push baseline ke repository GitHub, lalu wajibkan pull request serta status check CI untuk perubahan berikutnya.
4. Aktifkan secret scanning, push protection, dan Dependabot di GitHub.

## Database dan website Hostinger

1. Buat database/user MySQL KreasiKita dengan password acak kuat. Jangan gunakan credential lokal.
2. Isi `DATABASE_URL` untuk Prisma CLI serta seluruh `DATABASE_*` untuk runtime adapter.
3. Sebelum menghapus website PHP/HTML lama, unduh dan verifikasi backup lengkap. Simpan backup selama tujuh hari.
4. Penghapusan website lama hanya dilakukan setelah konfirmasi eksplisit karena Hostinger mensyaratkan domain lama dibebaskan sebelum dibuat sebagai Node.js Web App.
5. Tambahkan website baru melalui **Websites -> Add Website -> Deploy Web App -> Import Git Repository**.
6. Pilih repository KreasiKita, branch `main`, Node.js 22, dan Next.js.

## Environment production

Masukkan environment langsung melalui hPanel dan redeploy setelah perubahan. Jangan mengunggah `.env` lokal atau menyimpan production secret di GitHub.

- `NEXT_PUBLIC_APP_URL=https://kreasi-kita.tegarfauzan.com`
- `BETTER_AUTH_URL=https://kreasi-kita.tegarfauzan.com`
- `DATABASE_URL` dan `DATABASE_*` dari MySQL Hostinger
- `DATABASE_CONNECTION_LIMIT=5`
- Better Auth secret minimal 32 karakter
- Midtrans Sandbox terlebih dahulu dengan `MIDTRANS_IS_PRODUCTION=false`
- Credential Cloudinary dan Resend production
- `CRON_SECRET` minimal 32 karakter
- `ADMIN_BOOTSTRAP_ENABLED=true` hanya selama bootstrap
- `ADMIN_BOOTSTRAP_TOKEN` acak minimal 32 karakter hanya selama bootstrap

Jangan mengisi `SEED_ADMIN_*` atau `SEED_CUSTOMER_*` di production.

## Deployment pertama dan deployment rutin

Build container Hostinger tidak dapat mengakses MySQL shared melalui `localhost`. Karena itu, jangan menjalankan migration atau seed di build command. Terapkan migration secara terkontrol dari runner yang diberi akses MySQL sementara, lalu cabut kembali akses tersebut. Jalankan `npm run db:deploy` dan `npm run db:seed:production` sebelum deployment pertama.

Build Hostinger selalu memakai `npm run build:hostinger`. Jangan menetapkan `NODE_ENV=production` secara manual pada environment build karena npm dapat melewatkan dependency kompilasi; Next.js akan memakai mode production saat build/start.

Setelah deployment pertama berhasil:

1. Buka `/api/health` dan pastikan respons `{"status":"ok"}`.
2. Buat admin pertama melalui `POST /api/setup/admin` dengan Bearer bootstrap token.
3. Segera ubah `ADMIN_BOOTSTRAP_ENABLED=false`, hapus `ADMIN_BOOTSTRAP_TOKEN`, lalu redeploy.

Untuk deployment rutin, terapkan migration yang telah direview sebelum deploy kode yang bergantung padanya. Migration wajib backward-compatible; gunakan forward-fix jika terjadi masalah.

## Midtrans dan scheduler

Gunakan konfigurasi Sandbox sampai UAT selesai:

- Finish Redirect URL: `https://kreasi-kita.tegarfauzan.com/payment/finish`
- Payment Notification URL: `https://kreasi-kita.tegarfauzan.com/api/payments/midtrans/notification`

Buat Custom Cron Hostinger setiap 10 menit untuk memanggil `POST /api/cron/expire-orders` dengan header `Authorization: Bearer CRON_SECRET`. Jadwal Hostinger menggunakan UTC.

## Verifikasi dan rollback

- Uji katalog, auth, role admin/customer, upload Cloudinary, reset password Resend, cart, checkout, Midtrans Sandbox, webhook, order, serta cron.
- Merge pull request kecil untuk membuktikan push ke `main` memicu auto-deploy Hostinger.
- Pantau deployment log, runtime log, `/api/health`, resource usage, dan webhook.
- Rollback kode dengan `git revert` melalui pull request. Jangan memakai reset paksa pada `main`.
- Hapus backup website lama setelah produksi stabil selama tujuh hari.

## Referensi resmi

- https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- https://www.hostinger.com/support/how-to-add-environment-variables-during-node-js-application-deployment/
- https://www.hostinger.com/support/how-to-edit-or-add-environment-variables-after-deployment/
- https://www.hostinger.com/support/1583465-how-to-set-up-a-cron-job-at-hostinger/
