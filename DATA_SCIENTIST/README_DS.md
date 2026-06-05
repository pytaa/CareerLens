# 📊 Data Scientist

Repository ini berisi proses pengumpulan, pengolahan, eksplorasi, dan rekayasa fitur data yang digunakan sebagai fondasi pengembangan sistem rekomendasi karir CareerLens.

---

## Overview

Tim Data Scientist bertanggung jawab dalam membangun dan mempersiapkan dataset yang digunakan oleh model AI CareerLens. Proses yang dilakukan meliputi pengumpulan data, pembersihan data, eksplorasi data, analisis karakteristik industri digital, hingga pembentukan dataset final yang siap digunakan pada tahap pemodelan.

---

## Dataset

CareerLens menggunakan beberapa dataset utama yang saling terintegrasi:

| Dataset | Deskripsi |
|----------|----------|
| `master_roles.csv` | Informasi role, skill, deskripsi pekerjaan, dan estimasi gaji |
| `roles.csv` | Skor RIASEC untuk setiap role |
| `learning_resources.csv` | Roadmap pembelajaran dan sumber belajar |
| `dummy_projects.csv` | Proyek simulasi yang mendukung pengembangan portofolio pengguna |

### Dataset Statistics

| Component | Total |
|------------|--------|
| Career Roles | 68 |
| Unique Skills | 436 |
| Learning Resources | 977 |
| Dummy Projects | 68 |

---

## Data Processing

### Data Cleaning & Transformation

Tahapan yang dilakukan:

- Standarisasi format data
- Transformasi kolom gaji ke format numerik
- Pembersihan dan normalisasi data skill
- Validasi kualitas data
- Pemeriksaan missing values dan duplikasi data

### Exploratory Data Analysis (EDA)

Analisis dilakukan untuk memahami karakteristik data yang akan digunakan pada sistem rekomendasi karir.

Topik analisis meliputi:

- Distribusi gaji dan deteksi outlier
- Perbandingan rata-rata gaji antar bidang karir
- Identifikasi skill yang paling banyak dibutuhkan industri
- Analisis distribusi skor RIASEC
- Analisis roadmap pembelajaran
- Analisis platform sumber belajar
- Analisis tools dan teknologi pada dummy project

---

## Feature Engineering

Tahap feature engineering dilakukan untuk mempersiapkan data agar dapat diproses oleh model machine learning.

### Proses yang Dilakukan

1. Normalisasi nama skill menjadi format lowercase.
2. Penggabungan data role dengan skor RIASEC berdasarkan `role_id`.
3. Perhitungan jumlah skill pada setiap role.
4. Multi-Hot Encoding pada kolom skill menggunakan representasi biner.
5. Pembentukan dataset final untuk kebutuhan pemodelan.

### Output Feature Engineering

| Output | Total |
|----------|----------|
| Total Role | 68 |
| Total Skill Unik | 436 |
| Total Kolom Dataset Final | 448 |

Dataset Final yang akan digunakan tim AI Engineer:

```text
master_feature_final.csv
```
## 🧪 Dataset Validation (A/B Testing)

Untuk memvalidasi dampak dari proses pembersihan data masif pada file `learning_resources_ULTIMATE.csv` (*V2/Treatment*) dibandingkan dengan dataset lama yang masih kotor (*V1/Control*), tim melakukan simulasi eksperimen **A/B Testing** menggunakan metode *Controlled Simulation Testing* pada 50 sampel *user query/skills*.

Eksperimen ini menguji dua metrik utama: **Kepadatan Noise** (jumlah kursus tidak relevan luar domain IT) dan **Kecepatan Sistem (Latency Backend)** menggunakan uji statistik *Paired T-Test*.

### Ringkasan Hasil Eksperimen

| Metrik Evaluasi | Varian A (Control - OLD) | Varian B (Treatment - ULTIMATE) | Perubahan (%) | P-Value | Kesimpulan |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Rata-rata Noise** | 4.72 courses | 0.54 courses | -88.56% | 0.000000 | Tolak H₀ (Signifikan) |
| **Rata-rata Latency** | 157.19 ms | 109.08 ms | -30.61% | 0.000000 | Tolak H₀ (Signifikan) |
---

## Key Insights

Beberapa temuan utama dari hasil analisis data:

- Bidang Data Science & Artificial Intelligence memiliki rata-rata gaji tertinggi dibandingkan bidang lainnya.
- Python dan SQL merupakan skill yang paling banyak muncul pada berbagai role digital.
- Dimensi RIASEC yang paling dominan adalah **Investigative (I)** dan **Conventional (C)**.
- Sebagian besar roadmap pembelajaran terdiri dari lima tahapan pembelajaran yang terstruktur.
- Coursera mendominasi sumber pembelajaran yang digunakan dalam roadmap karir.
- Python menjadi tools yang paling sering digunakan dalam dummy project sebagai sarana pengembangan portofolio.

---

## Project Structure

```text
ds-feature/
├── ab-testing/
├── dashboard/
├── dataset/
├── notebook/
├── report/
└── README.md
└── data_dictionary.md
```

---

## Contributors

| Nama          | ID             | Peran       |
| ------------- | -------------- | ----------- |
| Pyta Nur Chumairah  | CDCC208D6X1680 | Data Scientist |
| Sevilla Claudia Depari | CDCC319D6X0996 | Data Scientist |

---

**Capstone Project – CareerLens**  
Coding Camp 2025 powered by DBS Foundation
