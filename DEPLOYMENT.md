# Deploy Swayen Backend ke Render

## 0. Setup Database: Neon (Postgres)

Kita pakai **Neon** untuk dev lokal *dan* production sekaligus — biar tidak ada mismatch behavior antara 2 provider database yang berbeda. Neon free tier permanen (bukan trial), auto-provision database dalam hitungan detik.

1. Daftar/login di [neon.tech](https://neon.tech) (bisa pakai GitHub)
2. **New Project** → kasih nama (mis. `swayen`) → pilih region **Singapore** (paling deket ke Indonesia) → Neon otomatis bikin 1 database default
3. Di dashboard project, klik **Connect** → copy **Connection string**, bentuknya:
   ```
   postgresql://user:password@ep-xxxx-xxxx.ap-southeast-1.aws.neon.tech/dbname?sslmode=require
   ```
4. **Opsional tapi direkomendasikan**: buat 2 branch database terpisah di Neon (fitur branching-nya gratis) — 1 untuk dev lokal, 1 untuk production. Klik **Branches** → **New Branch** → kasih nama `production`. Masing-masing branch punya connection string sendiri, jadi data testing lokal tidak campur sama data production.
5. Update `.env` lokal kamu dengan connection string ini (ganti yang MySQL sebelumnya):
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxxx....neon.tech/xxyx_db?sslmode=require"
   ```
6. Jalankan ulang migration & seed karena provider database berubah (Postgres butuh migration baru, bukan lanjutan dari yang MySQL):
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

## 1. Push kode ke GitHub

```bash
cd swayen-backend
git init
git add .
git commit -m "Initial commit"
# buat repo baru di GitHub, lalu:
git remote add origin https://github.com/<username>/swayen-backend.git
git push -u origin main
```

> `.gitignore` sudah exclude `node_modules/`, `dist/`, dan `.env` — aman, secret tidak ikut ke-push.

## 2. Deploy ke Render

### Opsi A — pakai Blueprint (`render.yaml`), paling cepat
1. Buka [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect repo GitHub `swayen-backend` — Render otomatis baca `render.yaml`
3. Render akan minta isi 2 environment variable yang di-mark `sync: false`:
   - `DATABASE_URL` → paste connection string branch `production` dari Neon (Step 0)
   - `CORS_ORIGIN` → domain frontend kamu (sementara bisa isi `*` dulu buat testing, tapi **ganti ke domain asli sebelum production**)
4. Klik **Apply** — Render langsung provision & deploy.

### Opsi B — manual lewat dashboard
1. **New** → **Web Service** → connect repo
2. **Region**: Singapore (paling deket ke Indonesia)
3. **Build Command**: `npm install && npm run render-build`
4. **Start Command**: `npm run start`
5. **Environment Variables** — isi semua ini:
   ```
   NODE_ENV=production
   API_PREFIX=/api/v1
   DATABASE_URL=<connection string Neon branch production kamu>
   JWT_ACCESS_SECRET=<generate: openssl rand -hex 32>
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=<generate: openssl rand -hex 32 — beda dari yang di atas>
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=<domain frontend kamu>
   ```
6. **Health Check Path**: `/health`
7. Klik **Create Web Service**

`npm run render-build` otomatis menjalankan `tsc` (compile TypeScript) **dan** `prisma migrate deploy` (apply semua migration ke database production) di setiap deploy — jadi schema selalu sinkron tanpa langkah manual tambahan.

## 3. Seed Daily Quotes di production

`db seed` tidak otomatis jalan di Render. Setelah deploy pertama sukses, buka tab **Shell** di dashboard Render service kamu, lalu jalankan:
```bash
npx prisma db seed
```

## 4. Verifikasi

```bash
curl https://<nama-service-kamu>.onrender.com/health
# harus balikin: {"success":true,"message":"Swayen API is healthy"}
```

Lanjut test `POST /api/v1/auth/register` pakai Postman collection yang sudah ada — tinggal ganti `baseUrl` collection variable jadi `https://<nama-service-kamu>.onrender.com/api/v1`.

## Catatan penting

- **Free tier Render** service-nya "sleep" setelah 15 menit idle, request pertama setelahnya bakal lambat (cold start ~30-60 detik). Normal untuk tier gratis, upgrade kalau butuh always-on.
- **CORS_ORIGIN** cuma nerima 1 origin — kalau nanti butuh multi-origin (misal web + Vercel preview URLs), perlu sedikit modifikasi `app.ts` (ganti jadi array/fungsi validasi, bukan string tunggal).
- Setiap kali ganti/tambah model di `schema.prisma`, jalankan `npx prisma migrate dev --name <nama>` di lokal dulu (bikin file migration), commit & push — `render-build` akan otomatis apply migration itu di production lewat `prisma migrate deploy`.
