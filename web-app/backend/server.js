const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Mengizinkan request dari frontend (React)
app.use(express.json()); // Mem-parsing body request berformat JSON

// Endpoint Predict
app.post('/predict', (req, res) => {
  const { user_id, method, payload } = req.body;

  console.log(`\n[MOCK API] Menerima request dari: ${user_id}`);
  console.log(`[MOCK API] Method: ${method}`);
  console.log(`[MOCK API] Payload:`, payload);

  // Simulasi loading (delay) selama 1 detik agar UI di React terlihat natural
  setTimeout(() => {
    
// 1. Handling untuk Metode "interest" (Minat Karir)
    if (method === 'interest') {
      return res.json({
        "status": "success",
        "method_used": "interest",
        "data": {
          "chart_data": null,
          "recommendations": [
            {
              "role_id": "ROLE_001",
              "role_name": "Data Scientist",
              "match_pct": 87.0,
              "description": "Ahli dalam mengolah data besar untuk insight bisnis dan pemodelan prediktif tingkat lanjut.",
              "salary_range": "8jt - 20jt",
              "skill_gap": null,
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Pengenalan Data Science & Statistika", "resource": "Coursera" },
                  { "step": 2, "title": "Python untuk Data Analysis", "resource": "Dicoding" },
                  { "step": 3, "title": "Machine Learning Fundamental", "resource": "Kaggle" }
                ],
                "dummy_projects": ["Analisis Prediksi Harga Properti", "Dashboard Visualisasi Interaktif"]
              }
            },
            {
              "role_id": "ROLE_002",
              "role_name": "Machine Learning Engineer",
              "match_pct": 95.0,
              "description": "Fokus pada perancangan, pembuatan, dan produksi (deployment) model machine learning agar dapat digunakan pada aplikasi skala besar.",
              "salary_range": "10jt - 25jt",
              "skill_gap": null,
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Advanced Programming & Math", "resource": "Kaggle" },
                  { "step": 2, "title": "Deep Learning Implementation", "resource": "DeepLearning.AI" },
                  { "step": 3, "title": "Productionalization & Monitoring", "resource": "Coursera" }
                ],
                "dummy_projects": ["Scalable Image Recognition API", "Sistem Rekomendasi E-Commerce"]
              }
            },
            {
              "role_id": "ROLE_003",
              "role_name": "Data Analyst",
              "match_pct": 82.0,
              "description": "Bertanggung jawab menerjemahkan angka menjadi laporan yang mudah dipahami manajemen untuk membantu pengambilan keputusan bisnis.",
              "salary_range": "6jt - 15jt",
              "skill_gap": null,
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "SQL & Spreadsheet Mastery", "resource": "DataCamp" },
                  { "step": 2, "title": "Data Visualization (Tableau/PowerBI)", "resource": "Coursera" },
                  { "step": 3, "title": "Exploratory Data Analysis (EDA)", "resource": "Dicoding" }
                ],
                "dummy_projects": ["Analisis Tingkat Churn Pelanggan", "Laporan Kinerja Kampanye Marketing"]
              }
            }
          ]
        }
      });
    }

    // 2. Handling untuk Metode "skill" (Analisis Skill)
    if (method === 'skill') {
      // Validasi error jika skill kurang dari 2
      if (!payload.skills || payload.skills.length < 2) {
        return res.status(400).json({
          "status": "error",
          "code": 400,
          "message": "Minimal 2 skill harus dimasukkan",
          "data": null
        });
      }

      return res.json({
        "status": "success",
        "method_used": "skill",
        "data": {
          "chart_data": {
            "labels": ["Data Scientist", "ML Engineer", "Data Analyst"],
            "scores": [92.5, 85.0, 78.3]
          },
          "recommendations": [
            {
              "role_id": "ROLE_001",
              "role_name": "Data Scientist",
              "match_pct": 92.5,
              "description": "Ahli dalam mengolah data besar untuk insight bisnis.",
              "salary_range": "8jt - 20jt",
              "skill_gap": ["Machine Learning", "Statistics"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Dasar Statistika", "resource": "Coursera" },
                  { "step": 2, "title": "Deep Learning", "resource": "TensorFlow Cert" }
                ],
                "dummy_projects": ["Prediksi Harga Rumah", "Analisis Sentimen"]
              }
            }
          ]
        }
      });
    }

    // 3. Handling untuk Metode "riasec" (Tes Minat Bakat)
    if (method === 'riasec') {
      return res.json({
        "status": "success",
        "method_used": "riasec",
        "data": {
          "chart_data": null,
          "recommendations": [
            {
              "role_id": "ROLE_001",
              "role_name": "Data Scientist",
              "match_pct": 88.7,
              "description": "Ahli dalam mengolah data besar untuk insight bisnis.",
              "salary_range": "8jt - 20jt",
              "skill_gap": ["Python", "TensorFlow"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Pengenalan Programming", "resource": "Dicoding" },
                  { "step": 2, "title": "Machine Learning Dasar", "resource": "Coursera" }
                ],
                "dummy_projects": ["Klasifikasi Gambar", "Sistem Rekomendasi Sederhana"]
              }
            }
          ]
        }
      });
    }

    // 4. Fallback Error jika method yang dikirim ngawur
    return res.status(400).json({
      "status": "error",
      "code": 400,
      "message": "Metode analisis tidak valid.",
      "data": null
    });

  }, 1000); 
});

// Jalankan Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Mock Backend API berjalan di http://localhost:${PORT}`);
  console.log(`Siap menerima request di POST http://localhost:${PORT}/predict`);
});