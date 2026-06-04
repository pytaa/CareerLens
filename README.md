# CareerLens

CareerLens adalah platform berbasis Artificial Intelligence yang dirancang untuk membantu mahasiswa, fresh graduate, dan pencari kerja dalam menemukan jalur karier yang sesuai dengan minat, keterampilan, dan bakat yang dimiliki.

CareerLens berfokus pada empat bidang utama:

- Teknologi Informasi & Software Development
- Data Science & Artificial Intelligence
- Desain Kreatif & UI/UX
- Digital Marketing & Analytics

Melalui kombinasi Machine Learning, Skill Analysis, dan Tes Bakat RIASEC, sistem memberikan rekomendasi karier yang personal, disertai roadmap pembelajaran serta rekomendasi proyek yang relevan.

---

# Live Demo

| Service | URL |
|----------|----------|
| Frontend | https://careerlens-livid.vercel.app |
| Backend API | https://careerlens-fork-production.up.railway.app |
| AI Service | https://shusiee-careerlens-api.hf.space |

---

## Features

- Career Interest Analysis — Analisis minat karir berdasarkan bidang yang dipilih pengguna
- Skill Analysis — Analisis skill pengguna menggunakan model AI
- RIASEC Personality Test — Tes bakat berbasis teori Holland (RIASEC)
- Career Recommendation — Rekomendasi karir berdasarkan hasil analisis
- Role Match Analysis — Persentase kecocokan dengan berbagai profesi
- Skill Gap Analysis — Identifikasi skill yang perlu ditingkatkan
- Learning Roadmap — Jalur pembelajaran yang dipersonalisasi
- Project Recommendation — Rekomendasi proyek sesuai jalur karir
- PDF Report Generation — Generate laporan hasil analisis dalam format PDF
- Email Report Delivery — Pengiriman laporan PDF melalui email menggunakan Brevo

---
# 🛠️ System Architecture

# Architecture

CareerLens dibangun menggunakan arsitektur berbasis layanan (service-oriented architecture) yang terdiri dari frontend, backend, PostgreSQL database, AI inference service, dan email delivery service. Arsitektur ini memungkinkan sistem memberikan rekomendasi karier yang personal berdasarkan analisis minat, keterampilan, dan hasil tes bakat pengguna.
<p align="center">
  <img src="https://github.com/user-attachments/assets/18dd7fdb-748b-4dcb-bc94-cf735c9cdf30" alt="System Architecture" width="700">
</p>

# Tech Stack

| Layer | Technology |
|---------|-----------|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Sequelize |
| AI Service | Python |
| Machine Learning | TensorFlow, Keras |
| Data Processing | Pandas, NumPy, Scikit-Learn |
| Email Service | Brevo |
| Containerization | Docker, Docker Compose |
| Deployment | Vercel, Railway, Hugging Face Spaces |
| Version Control | Git, GitHub |

---

# 📂 Project Structure

```text
CareerLens/
├── ai-service/
│   ├── api/
│   ├── src/
│   ├── dataset/
│   ├── saved_model/
│   └── notebooks/
│
├── web-app/
│   ├── backend/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── config/
│   │
│   └── frontend/
│       ├── src/
│       └── assets/
│
├── dashboard/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Pastikan perangkat telah terinstal:

- Node.js >= 18
- npm atau yarn
- Python >= 3.11
- Docker
- Docker Compose
- Git

Layanan eksternal yang digunakan:

- PostgreSQL
- Brevo
- Hugging Face Spaces

---

## 1. Clone Repository

```bash
git clone https://github.com/pytaa/CareerLens.git

cd CareerLens
```

---

## 2. Backend Setup

Masuk ke folder backend:

```bash
cd web-app/backend

npm install
```

Buat file `.env`

```env
# ─── Server ────────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── PostgreSQL ────────────────────────────────────────────
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=careerlens
DB_USER=postgres
DB_PASSWORD=your_database_password

# ─── AI Service ────────────────────────────────────────────
AI_SERVICE_URL=https://your-huggingface-space.hf.space
AI_SERVICE_TIMEOUT=120000

# ─── CORS ──────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:3000
```

Jalankan backend:

```bash
npm run dev
```

---

## 3. Frontend Setup

Masuk ke folder frontend:

```bash
cd web-app/frontend

npm install
```

Buat file `.env`

```env
# ─── API Configuration ─────────────────────────────────────
VITE_API_URL=http://localhost:5000/api

# ─── Application ───────────────────────────────────────────
VITE_APP_TITLE=CareerLens - Career Path Recommendation
```

Jalankan frontend:

```bash
npm run dev
```

Aplikasi dapat diakses melalui:

```text
http://localhost:5173
```

---

# Database Setup (PostgreSQL)

CareerLens menggunakan PostgreSQL sebagai database utama untuk menyimpan data pengguna, hasil analisis karier, dan rekomendasi yang dihasilkan sistem.

### Database Configuration

| Configuration | Purpose | Environment Variable |
|---------------|---------|----------------------|
| Database Dialect | Jenis database yang digunakan | DB_DIALECT |
| Database Host | Host PostgreSQL | DB_HOST |
| Database Port | Port PostgreSQL | DB_PORT |
| Database Name | Nama database aplikasi | DB_NAME |
| Database User | Username PostgreSQL | DB_USER |
| Database Password | Password PostgreSQL | DB_PASSWORD |

### Default Docker Configuration

| Property | Value |
|-----------|---------|
| Database | careerlens |
| Username | postgres |
| Port | 5432 |
| PostgreSQL Version | 15-alpine |

### Run PostgreSQL with Docker

```bash
docker-compose up -d db
```

---

# Email Setup

CareerLens menggunakan Brevo untuk mengirim laporan hasil analisis karier dalam format PDF kepada pengguna.

### Email Configuration

| Service | Purpose | Environment Variable |
|----------|----------|----------------------|
| Brevo API | Mengirim email laporan hasil analisis | BREVO_API_KEY |
| Sender Email | Email pengirim laporan | BREVO_SENDER_EMAIL |

Tambahkan konfigurasi berikut pada file `.env` backend:

```env
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_email
```

### Setup Steps

1. Buat akun pada Brevo
2. Verifikasi email atau domain pengirim
3. Generate API Key
4. Tambahkan API Key ke file `.env`
5. Pastikan alamat email pengirim sudah terverifikasi

---

# AI Models

Model yang digunakan dalam CareerLens dapat diakses melalui:

- [CareerLens Models] (https://drive.google.com/drive/folders/1m9pCoNPWp6gRV1Qn5iMAYHUvtyoS8ju2?usp=sharing)

---

# Docker Setup

CareerLens menyediakan konfigurasi Docker untuk menjalankan seluruh layanan secara lokal.

### Services

| Service | Port | Description |
|----------|---------|-------------|
| PostgreSQL | 5432 | Database utama aplikasi |
| Backend API | 5000 | Express.js REST API |
| AI Service | 8000 | FastAPI inference service |

### Run All Services

```bash
docker-compose up --build
```

### Run in Background

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

---

## 👥 Tim Pengembang (CC26-PSU093)

| Nama | ID | Universitas | Peran |
| :--- | :--- | :--- | :--- |
| Najdain Tafdhila | CFCC319D6X1704 | Universitas Sumatera Utara | Full-Stack Web Developer |
| Muhammad Aidil Radiansyah | CFCC208D6Y2420 | Universitas Hasanuddin | Full-Stack Web Developer |
| Sevilla Claudia Depari | CDCC319D6X0996 | Universitas Sumatera Utara | Data Scientist |
| Pyta Nur Chumairah | CDCC208D6X1680 | Universitas Hasanuddin | Data Scientist |
| Nazwa Nabila | CACC319D6X0515 | Universitas Sumatera Utara | AI Engineer |
| Susi Pujiarti | CACC319D6X0883 | Universitas Sumatera Utara | AI Engineer |

## License

This project was developed as part of the Coding Camp 2026 Capstone Project.
