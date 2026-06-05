# CareerLens Backend API

Ini adalah repositori utama untuk *Backend* aplikasi CareerLens. *Backend* ini dibangun menggunakan Node.js (Express), terhubung ke database PostgreSQL, dan bertindak sebagai jembatan yang berkomunikasi dengan API AI (Hugging Face / Python).

## Persyaratan Sistem (Prerequisites)
Sebelum menjalankan proyek ini, pastikan komputer Anda telah menginstal:
- **Node.js** (versi 16 atau lebih baru)
- **PostgreSQL** (pastikan server database menyala dan memiliki kredensial yang valid)

---

## Cara Instalasi & Menjalankan Aplikasi

### 1. Instalasi Dependensi
Buka terminal di dalam folder `web-app/backend`, lalu jalankan:
```bash
npm install
```

### 2. Konfigurasi Lingkungan (.env)
Pastikan Anda memiliki file `.env` di dalam folder `web-app/backend`. Jika belum ada, buat file baru bernama `.env` dan isi dengan konfigurasi berikut (sesuaikan dengan kredensial PostgreSQL Anda):

```env
PORT=5000
NODE_ENV=development

# Konfigurasi Database PostgreSQL
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=careerlens
DB_USER=postgres
DB_PASSWORD=password # Ganti dengan password Postgres Anda

# Konfigurasi AI
AI_SERVICE_URL=https://shusiee-careerlens-api.hf.space
AI_SERVICE_TIMEOUT=30000

# Konfigurasi Email (Nodemailer / SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email.anda@gmail.com
SMTP_PASSWORD=app_password_anda_disini
```

### 3. Persiapan Database (Sangat Penting!)
Agar fitur rekomendasi berjalan sempurna, tabel database tidak boleh kosong. Jalankan dua langkah berikut secara berurutan:

**Langkah A: Menjalankan Seeder**
Perintah ini akan secara otomatis membuat tabel-tabel di database Anda dan mengisi data awal (Sektor, Profesi Dasar, dan Skill) dari folder `dataset`.
```bash
npm run seed
```

**Langkah B: Melakukan Patching Data (Enrichment)**
Perintah ini akan menambahkan data teks panjang seperti "Deskripsi Pekerjaan" dan "Rentang Gaji" dari file CSV master ke dalam database Anda.
```bash
node scripts/patch_roles.js
```

> **Catatan Penting terkait Roadmap/Pelatihan:** 
> Pastikan Anda memiliki file `learning_resources.csv` dan `dummy_projects.csv` di dalam folder `dataset/` di *root* proyek Anda. Jika file tersebut tidak ada, maka `npm run seed` tidak bisa mengisi tabel *roadmap*, sehingga *frontend* akan menampilkan teks *dummy* bawaan AI.

### 4. Menyalakan Server
Setelah instalasi dan database siap, nyalakan *server backend* dalam mode *development* (otomatis me-restart jika ada perubahan kode):
```bash
npm run dev
```
Jika sukses, terminal akan menampilkan tulisan: `Database connected successfully.` dan `Server is running on port 5000`.

---

## Arsitektur Singkat
- **`controllers/`**: Mengatur rute URL dan menerima *request* dari Frontend.
- **`services/`**: Otak dari logika bisnis (termasuk validasi *Cache* dan menembak ke API AI).
- **`repositories/`**: Berinteraksi langsung dengan database PostgreSQL melalui ORM Sequelize.
- **`routes/`**: Mendefinisikan daftar *endpoint* RESTful API (seperti `/api/recommendations/predict`).
