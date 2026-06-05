# Data Dictionary - Project CareerLens
Dokumentasi struktur, tipe data, dan relasi antar tabel untuk sistem rekomendasi karier **CareerLens**.

---

## 🗂️ 1. Tabel: `fields`
**Deskripsi:** Tabel referensi master untuk pengelompokan kategori bidang besar dalam industri karier teknologi.

| Nama Kolom | Tipe Data | Deskripsi | Constraint / Keterangan |
| :--- | :--- | :--- | :--- |
| `field_id` | String | ID unik untuk setiap bidang besar | **Primary Key** (Format: `F01`, `F02`, `F03`, `F04`) |
| `field_name` | String | Nama resmi pengelompokan bidang industri | *Not Null*. Contoh: "Data Science & Artificial Intelligence" |

---

## 🧠 2. Tabel: `roles`
**Deskripsi:** Menyimpan profil psikometrik tiap pekerjaan berdasarkan skor Holland Code (RIASEC). Digunakan sebagai acuan utama komputasi kecocokan minat pengguna.

| Nama Kolom | Tipe Data | Deskripsi | Constraint / Keterangan |
| :--- | :--- | :--- | :--- |
| `role_id` | String | ID Unik untuk setiap posisi pekerjaan | **Primary Key** (Format: `R001`, `R002`, dst.) |
| `field_id` | String | Kategori bidang besar dari pekerjaan terkait | **Foreign Key** ke `fields.field_id` |
| `role_name` | String | Nama posisi pekerjaan resmi di industri | *Not Null*. Contoh: "Software Engineer / Developer" |
| `R` | Float | Skor dimensi *Realistic* (Praktikal/Teknis) | Rentang nilai `0.00` - `1.00` |
| `I` | Float | Skor dimensi *Investigative* (Analitis/Riset) | Rentang nilai `0.00` - `1.00` |
| `A` | Float | Skor dimensi *Artistic* (Kreatif/Desain) | Rentang nilai `0.00` - `1.00` |
| `S` | Float | Skor dimensi *Social* (Edukasi/Pelayanan) | Rentang nilai `0.00` - `1.00` |
| `E` | Float | Skor dimensi *Enterprising* (Bisnis/Persuasif) | Rentang nilai `0.00` - `1.00` |
| `C` | Float | Skor dimensi *Conventional* (Terstruktur/Detail) | Rentang nilai `0.00` - `1.00` |

---

## 📊 3. Tabel: `master_roles`
**Deskripsi:** Menyimpan informasi tekstual lengkap, daftar kompetensi dasar, serta estimasi finansial untuk setiap peran pekerjaan.

| Nama Kolom | Tipe Data | Deskripsi | Constraint / Keterangan |
| :--- | :--- | :--- | :--- |
| `role_id` | String | ID pekerjaan yang merujuk pada profil utama | **Primary Key** & **Foreign Key** ke `roles.role_id` |
| `field_id` | String | ID Kategori bidang besar | **Foreign Key** ke `fields.field_id` |
| `deskripsi` | Text | Penjelasan komprehensif mengenai fungsi dan tugas harian peran | *Not Null*. Digunakan untuk tampilan antarmuka pengguna |
| `skill` | Text | Daftar kompetensi teknis (comma-separated string) | Bahan baku pencarian kata kunci atau *tagging* |
| `gaji` | Integer | Estimasi gaji rata-rata dalam Rupiah (IDR) | Hasil wrangling bersih tanpa simbol desimal (Contoh: `9116248`) |

---

## 📚 4. Tabel: `learning_resources`
**Deskripsi:** Bank data kurikulum/materi pembelajaran yang direkomendasikan untuk menunjang peningkatan keahlian pengguna (*upskilling*).

| Nama Kolom | Tipe Data | Deskripsi | Constraint / Keterangan |
| :--- | :--- | :--- | :--- |
| `resource_id` | String | ID unik untuk setiap item materi belajar | **Primary Key** (Format: `RES0001`, `RES0002`, dst.) |
| `role_id` | String | ID pekerjaan yang membutuhkan kompetensi ini | **Foreign Key** ke `roles.role_id` |
| `step_number` | Integer | Tahapan urutan dalam peta jalan (*learning roadmap*) | Nilai terdistribusi teratur dari `1` hingga `5` |
| `nama_skill` | String | Nama kompetensi spesifik yang diajarkan dalam materi | *Not Null*. Contoh: "Agile", "Python" |
| `link_course` | String | URL valid menuju platform penyedia materi digital | *Not Null*. Harus berupa tautan lengkap (`https://...`) |
| `tipe` | String | Jenis penyampaian atau format media belajar | Contoh: "Video Course + Certificate" |
| `platform` | String | Nama ekosistem penyedia layanan pembelajaran | Contoh: "Coursera", "Udemy", "Dicoding" |

---

## 📁 5. Tabel: `dummy_projects`
**Deskripsi:** Spesifikasi studi kasus proyek portofolio praktis yang disarankan kepada pengguna untuk mengasah kesiapan kerja.

| Nama Kolom | Tipe Data | Deskripsi | Constraint / Keterangan |
| :--- | :--- | :--- | :--- |
| `project_id` | String | ID unik untuk setiap berkas studi kasus proyek | **Primary Key** (Format: `P001`, `P002`, dst.) |
| `judul_project` | String | Judul atau nama proyek portofolio | *Not Null*. Contoh: "Enterprise Resource Planning System" |
| `brief_case` | Text | Penjelasan latar belakang masalah industri (*problem statement*) | *Not Null* |
| `instructions` | Text | Prosedur pengerjaan teknis tahapan proyek | Dipisahkan menggunakan tanda titik koma (`;`) |
| `tools_used` | String | Daftar perkakas teknologi yang disarankan untuk digunakan | Dipisahkan menggunakan tanda titik koma (`;`) |

---

## 🔗 6. Tabel: `project_role_mapping`
**Deskripsi:** Tabel relasi (*junction table*) untuk memetakan hubungan banyak-ke-banyak (*many-to-many*) antara studi kasus proyek dengan peran pekerjaan yang sesuai.

| Nama Kolom | Tipe Data | Deskripsi | Constraint / Keterangan |
| :--- | :--- | :--- | :--- |
| `project_id` | String | ID studi kasus proyek yang dirujuk | **Composite PK** & **Foreign Key** ke `dummy_projects.project_id` |
| `role_id` | String | ID pekerjaan yang cocok dengan portofolio tersebut | **Composite PK** & **Foreign Key** ke `roles.role_id` |

---

## ❓ 7. Tabel: `test_question`
**Deskripsi:** Instrumen bank soal berupa kuesioner pernyataan minat untuk menghasilkan profil skor Holland Code pengguna.

| Nama Kolom | Tipe Data | Deskripsi | Constraint / Keterangan |
| :--- | :--- | :--- | :--- |
| `question_id` | String | ID unik untuk tiap butir soal kuesioner | **Primary Key** (Format: `Q01` - `Q30`) |
| `questions` | Text | Kalimat pernyataan tindakan atau preferensi minat kerja | *Not Null* |
| `riasec_type` | String | Kode dimensi tipe kepribadian RIASEC yang diwakili | Berisi satu karakter alfabet kapital: `R`, `I`, `A`, `S`, `E`, atau `C` |

---

## 🧪 8. Tabel Khusus AI: `master_feature_final`
**Deskripsi:** Hasil akhir penggabungan (*merge*) dan rekayasa fitur (*feature engineering*). Tabel raksasa ini bersifat *read-only* untuk dibaca langsung oleh model *Machine Learning* / *Neural Network* pada modul input skill dan RIASEC.

| Nama Kolom | Tipe Data | Deskripsi | Constraint / Keterangan |
| :--- | :--- | :--- | :--- |
| `role_id` | String | ID Unik posisi pekerjaan | Bertindak sebagai pengenal baris vektor |
| `field_id` | String | ID Kategori bidang besar | Diambil dari `master_roles` |
| `deskripsi` | Text | Paragraf penjelasan tugas harian pekerjaan | Digunakan jika tim AI ingin menerapkan *Text Embedding* |
| `skill` | Text | Untaian teks nama keahlian dalam format *lowercase* | Acuan teks mentah sebelum di-encode |
| `gaji` | Integer | Nilai nominal penghasilan dalam angka bulat murni | Fitur numerik pembantu |
| `R` / `I` / `A` / `S` / `E` / `C` | Float | Nilai matriks skor minat profil pekerjaan | Vektor 6-Dimensi bawaan dari tabel `roles` |
| `[nama_skill_1]` s.d. `[nama_skill_390]` | Integer | Kolom-kolom matriks biner untuk setiap keahlian unik | Hasil *Multi-hot Encoding*. Bernilai `1` jika peran membutuhkan skill tersebut, dan `0` jika tidak. Contoh kolom: `python`, `sql`, `figma`, dll. |

---

