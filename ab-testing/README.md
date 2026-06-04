# CareerLens AI — A/B Testing: Dataset Quality & Latency Optimization

Direktori ini berisi seluruh skrip, dataset, data hasil pengujian, serta dokumentasi evaluasi eksperimen A/B Testing pada sistem rekomendasi **CareerLens**. 

Tujuan utama dari eksperimen ini adalah memvalidasi dampak pergantian dari dataset lama yang kotor (*V1/Control*) ke dataset hasil pembersihan total bernama `learning_resources_ULTIMATE.csv` (*V2/Treatment*) terhadap dua metrik utama: **Kepadatan Noise (Kursus Tidak Relevan)** dan **Kecepatan Pemrosesan Backend (Latency)**.

---

## 📁 Struktur Direktori

Berikut adalah susunan file di dalam folder `ab-testing/`:

```text
ab-testing/
│
├── dataset_learning_resources/
│   ├── learning_resources_OLD.csv         # Dataset awal (Mengandung noise luar domain IT)
│   └── learning_resources_ULTIMATE.csv    # Dataset final (Bersih total melalui Data Cleansing)
│
├── ab_testing_results.csv             # Output data mentah hasil pengujian 50 test cases
│
├── ab_testing_script.py               # Skrip Python utama untuk simulasi & uji statistik
├── ab_testing_visualization.ipynb     # Jupyter Notebook tempat Sevilla membuat grafik & plot
└── README.md                          # Dokumentasi utama eksperimen
```

---

## 🎯 Desain Eksperimen
Eksperimen ini dijalankan menggunakan metode **Controlled Simulation Testing** dengan mengeksekusi **50 kombinasi user query/skills** yang merepresentasikan seluruh variasi klaster profesi pada file `roles.csv`.

### Varian yang Diuji:
* Varian A (Control): Sistem rekomendasi yang membaca database lama `learning_resources_OLD.csv` (Data kotor).
* Varian B (Treatment): Sistem rekomendasi yang membaca database baru `learning_resources_ULTIMATE.csv` (Data bersih).

### Hipotesis Pengujian:
* H₀ (Null Hypothesis): Tidak ada perbedaan signifikan pada rata-rata jumlah noise kursus dan latency antara Varian A dan Varian B.
* H₁ (Alternative Hypothesis): Terdapat perbedaan signifikan pada rata-rata jumlah noise kursus dan latency setelah menggunakan Varian B.
* Tingkat Signifikansi (α): 0.05 (Confidence Level 95%).

## 📊 Hasil Analisis Statistik & Temuan Utama
Eksperimen terhadap 50 sampel berpasangan menghasilkan metrik ringkasan sebagai berikut:
| Metrik Evaluasi | Varian A (Control) | Varian B (Treatment) | Perubahan (%) | P-Value | Kesimpulan |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Rata-rata Noise** | 4.92 courses | 0.40 courses | -91.86% | 0.000000 | Tolak H₀ (Signifikan) |
| **Rata-rata Latency** | 161.66 ms | 110.43 ms | -31.69% | 0.000000 | Tolak H₀ (Signifikan) |

### 1. Evaluasi Kualitas Rekomendasi (Noise Reduction)
* Temuan: 
* Kekuatan Efek (Cohen's d):
* Catatan Metodologi: 

### 2. Evaluasi Efisiensi Sistem (Latency)
* Temuan: 
* Kekuatan Efek (Cohen's d): 

## ⚙️ Catatan Batasan Eksperimen (Scope Limitations)
1. Synthetic User Query: Pengujian dilakukan dalam lingkungan simulasi terkontrol menggunakan variasi kata kunci riil dari repositori keahlian lokal untuk mengantisipasi ketiadaan trafik pengguna aktif pada fase pra-rilis.

2. Internal Engine Latency: Metrik kecepatan waktu respons (latency) yang dicatat merupakan durasi pemrosesan internal pada unit fungsi backend algorithm, belum mencakup hambatan eksternal seperti network round-trip time (RTT) dari web hosting ke sisi client/frontend.

## 🚀 Cara Menjalankan Eksperimen Sederhana
1. Pastikan file `learning_resources_OLD.csv` dan `learning_resources_ULTIMATE.csv` berada di dalam folder `dataset_learning_resources/`.

2. Jalankan skrip kalkulasi statistik untuk memperbarui data mentah:

```bash
python ab_testing_script.py
``` 
3. Buka Jupyter Notebook `ab_testing_visualization.ipynb` melalui visual editor (VS Code / Jupyter) untuk merender ulang visualisasi Box Plot dan Bar Chart distribusi data terbaru berdasarkan angka di dalam file `ab_testing_results.csv`.