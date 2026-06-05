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
| **Rata-rata Noise** | 4.72 courses | 0.54 courses | -88.56% | 0.000000 | Tolak H₀ (Signifikan) |
| **Rata-rata Latency** | 157.19 ms | 109.08 ms | -30.61% | 0.000000 | Tolak H₀ (Signifikan) |

### 1. Evaluasi Kualitas Rekomendasi (Noise Reduction)
* Temuan: Proses pembersihan data secara masif pada Varian B berhasil menekan kemunculan kursus tidak relevan (*noise*) secara drastis. Rata-rata *noise* terpangkas hebat dari **4.72** kursus per pencarian menjadi hanya **0.54** kursus pada Varian B (efisiensi kebersihan sebesar **88.56%**). Melalui uji *Paired T-Test*, diperoleh nilai $P-value = 0.000000$ ($P < 0.05$), yang berarti keputusan statistik adalah **Tolak $H_0$**. Ini membuktikan secara ilmiah bahwa pembersihan kurikulum luar domain berdampak nyata pada akurasi rekomendasi.
* Kekuatan Efek (Cohen's d): Sangat Besar (*Large Effect Size*). Penurunan kontaminasi data asing ini memberikan kepastian bahwa pengguna website hanya akan mendapatkan rekomendasi kompetensi yang benar-benar relevan dengan karir IT pilihan mereka.
* Catatan Metodologi: Metrik *noise* dihitung berdasarkan total kemunculan materi non-IT/luar domain yang menyusup ke dalam sistem ketika diuji menggunakan 50 kombinasi *keywords* keahlian sampel.

### 2. Evaluasi Efisiensi Sistem (Latency)
* Temuan: Varian B menunjukkan peningkatan efisiensi performa komputasi backend yang sangat nyata. Waktu respons rata-rata (*average latency*) berhasil dipangkas dari **157.19 ms** (Varian A) menjadi **109.08 ms** (Varian B), atau menghemat waktu pemrosesan sebesar **30.61%**. Nilai $P-value = 0.000000$ ($P < 0.05$) menegaskan bahwa performa Varian B yang lebih gegas ini murni karena struktur dataset `ULTIMATE` yang lebih ramping, bukan faktor kebetulan (*random chance*).
* Kekuatan Efek (Cohen's d): Besar (*Large Effect Size*). Reduksi baris dan kolom sampah terbukti meringankan beban *input/output* (I/O) memori saat skrip backend melakukan pemindaian data.
* Catatan Metodologi: Durasi latensi dihitung dalam satuan milidetik (ms) menggunakan pemanfaatan pustaka `time` internal Python untuk mengukur kecepatan eksekusi fungsi pencarian pada memori lokal.

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