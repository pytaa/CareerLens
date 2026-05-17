folder ini hanya buat untuk pengembangan dan testing frondend dan akan dihapus jika sudah selesai digunakan

:)

jalankan perintah ini di postgree

CREATE DATABASE careerlens_db;

\c careerlens_db

-- ====================================================
-- 1. TABEL PENGGUNA (users)
-- Menyimpan id unik pengguna. Kolom email dibuat NULLABLE (bisa dikosongkan) 
-- karena email baru diambil di akhir sesi saat user ingin mengunduh PDF.
-- ====================================================
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================
-- 2. TABEL RIWAYAT ASESMEN / INPUT (assessments)
-- Menyimpan metode yang digunakan oleh Frontend (interest, skill, atau riasec).
-- Kolom payload menggunakan JSONB agar bisa menampung berbagai variasi bentuk 
-- data input dari ketiga metode tersebut secara fleksibel.
-- ====================================================
CREATE TABLE assessments (
    assessment_id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
    method VARCHAR(20) NOT NULL CHECK (method IN ('interest', 'skill', 'riasec')),
    payload JSONB NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================
-- 3. TABEL HASIL REKOMENDASI KARIER (recommendations)
-- Menyimpan hasil pencocokan dari model AI tim AI Engineer.
-- Struktur ini dibuat terurai agar tim Data Scientist mudah melakukan query analitik.
-- ====================================================
CREATE TABLE recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    user_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
    role_id VARCHAR(50) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    match_pct NUMERIC(5, 2) NOT NULL, -- Mengakomodasi nilai desimal seperti 92.50
    description TEXT,
    salary_range VARCHAR(50),
    skill_gap TEXT[], -- Menyimpan kekurangan skill dalam bentuk Array teks PostgreSQL
    roadmap JSONB,    -- Menyimpan objek bersarang (learning_path & dummy_projects) dari AI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================
-- 4. TABEL GRAFIK EVALUASI (chart_data)
-- Menyimpan data khusus untuk keperluan visualisasi bar chart di Frontend.
-- Hanya terisi jika pengguna menggunakan metode 'skill' sesuai API Contract.
-- ====================================================
CREATE TABLE chart_data (
    chart_id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    labels TEXT[] NOT NULL,   -- Contoh: ARRAY['Data Scientist', 'ML Engineer']
    scores NUMERIC(5, 2)[] NOT NULL, -- Contoh: ARRAY[92.5, 85.0]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================
-- INDEXING UNTUK OPTIMALISASI QUERY PERFORMANCE
-- Membuat proses pencarian data analitik berbasis user_id menjadi jauh lebih cepat.
-- ====================================================
CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_recommendations_user ON recommendations(user_id);


terus buat file .env dengan konfigurasi seperti ini
PORT=5000
DB_USER=postgres
DB_PASSWORD=Admin1234 (password disesuaikan)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=careerlens_db

EMAIL_USER=email_kamu@gmail.com (belum diperlukan)
EMAIL_PASSWORD=password_app_gmail_kamu (belum diperlukan)

AI_SERVICE_URL=http://localhost:8000