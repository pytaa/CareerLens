require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Routes
const testRoutes = require('./routes/test');
const fieldsRoutes = require('./routes/fields');
const recommendationRoutes = require('./routes/recommendation');
const roadmapRoutes = require('./routes/roadmap');
const resultsRoutes = require('./routes/results');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: config.api.maxRequestSize }));
app.use(express.urlencoded({ limit: config.api.maxRequestSize, extended: true }));

// Database sync on startup
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected and synced successfully');
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });

// API Routes
app.use('/api/test', testRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/results', resultsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Legacy endpoint untuk mock API
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
            },
            {
              "role_id": "ROLE_004",
              "role_name": "Data Engineer",
              "match_pct": 79.5,
              "description": "Mengelola infrastruktur data, pipeline ETL, dan integrasi dataset agar data siap digunakan oleh tim analytics.",
              "salary_range": "9jt - 22jt",
              "skill_gap": null,
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Database & ETL Fundamentals", "resource": "Udacity" },
                  { "step": 2, "title": "Streaming Data dengan Kafka", "resource": "Confluent" },
                  { "step": 3, "title": "Cloud Data Engineering", "resource": "Coursera" }
                ],
                "dummy_projects": ["Pipeline Data Real-time", "Repositori Data Terintegrasi"]
              }
            },
            {
              "role_id": "ROLE_005",
              "role_name": "Business Analyst",
              "match_pct": 75.8,
              "description": "Menerjemahkan kebutuhan bisnis menjadi insights dan rekomendasi strategis untuk tim produk dan manajemen.",
              "salary_range": "7jt - 16jt",
              "skill_gap": null,
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Analisis Bisnis Dasar", "resource": "LinkedIn Learning" },
                  { "step": 2, "title": "Visualisasi Data untuk Bisnis", "resource": "Coursera" },
                  { "step": 3, "title": "Storytelling dengan Data", "resource": "Dicoding" }
                ],
                "dummy_projects": ["Analisis Kinerja Penjualan", "Studi Kasus Otomasi Proses Bisnis"]
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
            "labels": ["Data Scientist", "Machine Learning Engineer", "Data Analyst", "Data Engineer", "Business Analyst"],
            "scores": [92.5, 85.0, 78.3, 74.1, 70.2]
          },
          "recommendations": [
            {
              "role_id": "ROLE_001",
              "role_name": "Data Scientist",
              "match_pct": 92.5,
              "description": "Ahli dalam mengolah data besar untuk insight bisnis dan pembuatan pemodelan prediktif tingkat lanjut.",
              "salary_range": "8jt - 20jt",
              "skill_gap": ["Machine Learning", "Statistics Advanced"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Dasar Statistika & Probabilitas", "resource": "Coursera" },
                  { "step": 2, "title": "Deep Learning Fundamentals", "resource": "TensorFlow Cert" },
                  { "step": 3, "title": "Big Data Processing", "resource": "Udacity" }
                ],
                "dummy_projects": ["Prediksi Harga Rumah Berbasis Regresi", "Analisis Sentimen Ulasan Produk"]
              }
            },
            {
              "role_id": "ROLE_002",
              "role_name": "Machine Learning Engineer",
              "match_pct": 85.0,
              "description": "Pengembang perangkat lunak yang bertanggung jawab merancang, membangun, dan melakukan produksi (deployment) model AI berskala besar.",
              "salary_range": "10jt - 25jt",
              "skill_gap": ["Docker/Kubernetes", "Model Deployment (MLOps)"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "MLOps Fundamental", "resource": "DeepLearning.AI" },
                  { "step": 2, "title": "Model Deployment Patterns", "resource": "AWS Academy" },
                  { "step": 3, "title": "CI/CD untuk Machine Learning", "resource": "Coursera" }
                ],
                "dummy_projects": ["Pembuatan Scalable Image Classification API", "Real-time Fraud Detection Pipeline"]
              }
            },
            {
              "role_id": "ROLE_003",
              "role_name": "Data Analyst",
              "match_pct": 78.3,
              "description": "Menganalisis dataset untuk mengidentifikasi tren, membuat visualisasi dashboard interaktif, dan membantu pengambilan keputusan manajemen.",
              "salary_range": "6jt - 15jt",
              "skill_gap": ["Tableau / PowerBI", "Business Intelligence Business Insight"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Advanced SQL Queries", "resource": "DataCamp" },
                  { "step": 2, "title": "Dashboard Design Principles", "resource": "Coursera" },
                  { "step": 3, "title": "Data Storytelling", "resource": "Dicoding" }
                ],
                "dummy_projects": ["Sales Performance & Tracking Dashboard", "Customer Churn Analysis Report"]
              }
            },
            {
              "role_id": "ROLE_004",
              "role_name": "Data Engineer",
              "match_pct": 74.1,
              "description": "Mengelola pipeline data dan menjamin tersedianya dataset siap pakai untuk tim analytics.",
              "salary_range": "9jt - 22jt",
              "skill_gap": ["ETL", "Cloud Data Architecture"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "ETL & Data Warehousing", "resource": "Udemy" },
                  { "step": 2, "title": "Streaming Data with Kafka", "resource": "Confluent" }
                ],
                "dummy_projects": ["Pipeline Data Real-time", "Sistem Integrasi Data"]
              }
            },
            {
              "role_id": "ROLE_005",
              "role_name": "Business Analyst",
              "match_pct": 70.2,
              "description": "Menghubungkan kebutuhan bisnis dengan analisis data dan rekomendasi keputusan strategis.",
              "salary_range": "7jt - 16jt",
              "skill_gap": ["Business Storytelling", "Stakeholder Communication"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Business Analysis Fundamentals", "resource": "LinkedIn Learning" },
                  { "step": 2, "title": "Data Visualization for Business", "resource": "Coursera" }
                ],
                "dummy_projects": ["Analisis Kinerja Penjualan", "Studi Kasus Otomasi Proses Bisnis"]
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
              "description": "Ahli dalam mengolah data besar untuk insight bisnis menggunakan pendekatan statistik dan pemrograman.",
              "salary_range": "8jt - 20jt",
              "skill_gap": ["Python", "TensorFlow"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Pengenalan Programming & Statistik", "resource": "Dicoding" },
                  { "step": 2, "title": "Machine Learning Dasar", "resource": "Coursera" }
                ],
                "dummy_projects": ["Klasifikasi Gambar", "Sistem Rekomendasi Sederhana"]
              }
            },
            {
              "role_id": "ROLE_002",
              "role_name": "Machine Learning Engineer",
              "match_pct": 94.5,
              "description": "Fokus pada pengembangan algoritma AI dan deployment model ke lingkungan produksi.",
              "salary_range": "10jt - 25jt",
              "skill_gap": ["Docker", "Kubernetes", "MLOps"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Advanced Python Patterns", "resource": "Kaggle" },
                  { "step": 2, "title": "Deep Learning Specialization", "resource": "DeepLearning.AI" }
                ],
                "dummy_projects": ["Object Detection System", "Automated Prediction Pipeline"]
              }
            },
            {
              "role_id": "ROLE_003",
              "role_name": "Data Analyst",
              "match_pct": 76.2,
              "description": "Menganalisis data mentah untuk memberikan laporan visual yang membantu pengambilan keputusan bisnis.",
              "salary_range": "6jt - 15jt",
              "skill_gap": ["SQL Advanced", "Tableau"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Data Visualization Mastery", "resource": "Google Data Analytics" },
                  { "step": 2, "title": "Business Intelligence Tools", "resource": "Coursera" }
                ],
                "dummy_projects": ["Sales Performance Dashboard", "Churn Rate Analysis"]
              }
            },
            {
              "role_id": "ROLE_004",
              "role_name": "Data Engineer",
              "match_pct": 79.2,
              "description": "Mengelola aliran data dari sumber ke sistem analitik agar data tersedia secara andal dan terstruktur.",
              "salary_range": "9jt - 22jt",
              "skill_gap": ["Pipeline Data", "Cloud Storage"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Data Engineering Basics", "resource": "Udemy" },
                  { "step": 2, "title": "Data Lake & Warehousing", "resource": "Coursera" }
                ],
                "dummy_projects": ["Pipeline Data Batch", "Sistem Integrasi Data"]
              }
            },
            {
              "role_id": "ROLE_005",
              "role_name": "Business Analyst",
              "match_pct": 72.8,
              "description": "Menerjemahkan kebutuhan bisnis menjadi analisis dan rekomendasi yang jelas untuk pengambilan keputusan.",
              "salary_range": "7jt - 16jt",
              "skill_gap": ["Business Process", "Data Storytelling"],
              "roadmap": {
                "learning_path": [
                  { "step": 1, "title": "Business Analysis Essentials", "resource": "LinkedIn Learning" },
                  { "step": 2, "title": "Visualisasi Data untuk Stakeholder", "resource": "Coursera" }
                ],
                "dummy_projects": ["Analisis Produktivitas Tim", "Laporan Efisiensi Operasional"]
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