// File: ai_dummy/mockResponses.js

const mockResponses = {
  interest: [
    {
      status: "success",
      method_used: "interest",
      data: {
        chart_data: null,
        recommendations: [
          {
            role_id: "ROLE_001",
            role_name: "Data Scientist",
            match_pct: 87.0,
            description: "Ahli dalam mengolah data besar untuk insight bisnis.",
            salary_range: "8jt - 20jt",
            skill_gap: null,
            roadmap: {
              learning_path: [
                { step: 1, title: "Pengenalan Data Science", resource: "Coursera" },
                { step: 2, title: "Python untuk Data", resource: "Dicoding" }
              ],
              dummy_projects: ["Analisis Data Penjualan", "Dashboard Visualisasi"]
            }
          }
        ]
      }
    },
    {
      status: "success",
      method_used: "interest",
      data: {
        chart_data: null,
        recommendations: [
          {
            role_id: "ROLE_004",
            role_name: "UI/UX Designer",
            match_pct: 94.2,
            description: "Merancang antarmuka pengguna yang estetis dan pengalaman pengguna yang intuitif.",
            salary_range: "7jt - 18jt",
            skill_gap: null,
            roadmap: {
              learning_path: [
                { step: 1, title: "Dasar Desain UI/UX", resource: "Google UX Cert" },
                { step: 2, title: "Prototyping dengan Figma", resource: "YouTube / Dicoding" }
              ],
              dummy_projects: ["Redesign Aplikasi M-Banking", "Wireframing Web E-Commerce"]
            }
          }
        ]
      }
    }
  ],

 skill: [
    {
      status: "success",
      method_used: "skill",
      data: {
        chart_data: {
          labels: ["Data Scientist", "ML Engineer", "Data Analyst"],
          scores: [92.5, 85.0, 78.3]
        },
        recommendations: [
          {
            role_id: "ROLE_001",
            role_name: "Data Scientist",
            match_pct: 92.5,
            description: "Ahli dalam mengolah data besar untuk insight bisnis menggunakan metode statistik dan machine learning.",
            salary_range: "8jt - 20jt",
            skill_gap: ["Machine Learning", "Statistics"],
            roadmap: {
              learning_path: [
                { step: 1, title: "Dasar Statistika", resource: "Coursera" },
                { step: 2, title: "Deep Learning", resource: "TensorFlow Cert" }
              ],
              dummy_projects: ["Prediksi Harga Rumah", "Analisis Sentimen Teks"]
            }
          },
          {
            role_id: "ROLE_002",
            role_name: "Machine Learning Engineer",
            match_pct: 85.0,
            description: "Fokus pada perancangan, pembuatan, dan produksi model machine learning agar bisa digunakan dalam skala besar.",
            salary_range: "10jt - 25jt",
            skill_gap: ["Model Deployment", "MLOps", "C++"],
            roadmap: {
              learning_path: [
                { step: 1, title: "Machine Learning Engineering for Production", resource: "DeepLearning.AI" },
                { step: 2, title: "Docker & Kubernetes untuk ML", resource: "Udemy" }
              ],
              dummy_projects: ["Deploy Model Rekomendasi ke REST API", "Sistem Deteksi Anomali Real-time"]
            }
          },
          {
            role_id: "ROLE_003",
            role_name: "Data Analyst",
            match_pct: 78.3,
            description: "Menerjemahkan data menjadi laporan visual yang mudah dipahami untuk membantu pengambilan keputusan perusahaan.",
            salary_range: "6jt - 15jt",
            skill_gap: ["Tableau", "Advanced SQL", "Storytelling"],
            roadmap: {
              learning_path: [
                { step: 1, title: "Google Data Analytics Professional Certificate", resource: "Coursera" },
                { step: 2, title: "Data Visualization with Tableau", resource: "DataCamp" }
              ],
              dummy_projects: ["Dashboard Performa Sales Interaktif", "Analisis Churn Pelanggan"]
            }
          }
        ]
      }
    },
    {
      status: "success",
      method_used: "skill",
      data: {
        chart_data: {
          labels: ["Backend Dev", "Cloud Engineer", "DevOps"],
          scores: [89.4, 82.1, 75.0]
        },
        recommendations: [
          {
            role_id: "ROLE_007",
            role_name: "Backend Developer",
            match_pct: 89.4,
            description: "Membangun dan mengelola logika server, database, dan arsitektur API.",
            salary_range: "9jt - 22jt",
            skill_gap: ["Docker", "System Design"],
            roadmap: {
              learning_path: [
                { step: 1, title: "RESTful API dengan Node.js", resource: "Dicoding" },
                { step: 2, title: "Database Architecture", resource: "Udemy" }
              ],
              dummy_projects: ["Membuat API Toko Online", "Sistem Autentikasi JWT"]
            }
          },
          {
            role_id: "ROLE_008",
            role_name: "Cloud Engineer",
            match_pct: 82.1,
            description: "Merancang, membangun, dan memelihara infrastruktur komputasi awan yang aman dan dapat diskalakan.",
            salary_range: "10jt - 25jt",
            skill_gap: ["AWS Certified Solutions Architect", "Terraform", "Networking"],
            roadmap: {
              learning_path: [
                { step: 1, title: "AWS Cloud Practitioner Essentials", resource: "AWS Training" },
                { step: 2, title: "Infrastructure as Code", resource: "HashiCorp" }
              ],
              dummy_projects: ["Hosting Web Highly Available di AWS", "Otomatisasi Server dengan Terraform"]
            }
          },
          {
            role_id: "ROLE_010",
            role_name: "DevOps Engineer",
            match_pct: 75.0,
            description: "Menjembatani tim development dan operasi untuk mempercepat perilisan perangkat lunak secara otomatis dan stabil.",
            salary_range: "12jt - 28jt",
            skill_gap: ["Kubernetes", "CI/CD Pipelines", "Linux Administration"],
            roadmap: {
              learning_path: [
                { step: 1, title: "GitLab CI/CD Masterclass", resource: "Udemy" },
                { step: 2, title: "Kubernetes for Beginners", resource: "KodeKloud" }
              ],
              dummy_projects: ["Membuat Pipeline Auto-Deploy Express.js", "Setup Monitoring Cluster dengan Prometheus"]
            }
          }
        ]
      }
    },
    {
      status: "success",
      method_used: "skill",
      data: {
        chart_data: {
          labels: ["Frontend Dev", "Fullstack Dev", "UI/UX Designer"],
          scores: [90.0, 84.5, 76.2]
        },
        recommendations: [
          {
            role_id: "ROLE_005",
            role_name: "Frontend Developer",
            match_pct: 90.0,
            description: "Mengembangkan antarmuka pengguna interaktif dan responsif menggunakan teknologi web modern.",
            salary_range: "7jt - 18jt",
            skill_gap: ["Next.js", "TypeScript", "State Management"],
            roadmap: {
              learning_path: [
                { step: 1, title: "Belajar Membuat Aplikasi Web dengan React", resource: "Dicoding" },
                { step: 2, title: "Advanced TypeScript", resource: "Frontend Masters" }
              ],
              dummy_projects: ["Clone Aplikasi Spotify", "Dashboard Analitik Real-time"]
            }
          },
          {
            role_id: "ROLE_006",
            role_name: "Fullstack Developer",
            match_pct: 84.5,
            description: "Menguasai pengembangan sisi klien (frontend) maupun sisi peladen (backend) dari sebuah aplikasi.",
            salary_range: "10jt - 24jt",
            skill_gap: ["Node.js", "PostgreSQL", "API Security"],
            roadmap: {
              learning_path: [
                { step: 1, title: "Menjadi Back-End Developer Expert", resource: "Dicoding" },
                { step: 2, title: "Web Security Fundamentals", resource: "Coursera" }
              ],
              dummy_projects: ["Aplikasi E-Commerce End-to-End", "Sistem Manajemen Rumah Sakit"]
            }
          },
          {
            role_id: "ROLE_004",
            role_name: "UI/UX Designer",
            match_pct: 76.2,
            description: "Merancang pengalaman pengguna dan visual yang estetik agar aplikasi mudah dan nyaman digunakan.",
            salary_range: "7jt - 18jt",
            skill_gap: ["Figma Prototyping", "User Research", "Design Systems"],
            roadmap: {
              learning_path: [
                { step: 1, title: "Google UX Design Professional Certificate", resource: "Coursera" },
                { step: 2, title: "Membangun Design System", resource: "Memorisely" }
              ],
              dummy_projects: ["Redesign Alur Checkout Marketplace", "Wireframing Aplikasi Finansial"]
            }
          }
        ]
      }
    }
  ],

  riasec: [
    {
      status: "success",
      method_used: "riasec",
      data: {
        chart_data: null,
        recommendations: [
          {
            role_id: "ROLE_001",
            role_name: "Data Scientist",
            match_pct: 88.7,
            description: "Ahli dalam mengolah data besar untuk insight bisnis.",
            salary_range: "8jt - 20jt",
            skill_gap: ["Python", "TensorFlow"],
            roadmap: {
              learning_path: [
                { step: 1, title: "Pengenalan Programming", resource: "Dicoding" },
                { step: 2, title: "Machine Learning Dasar", resource: "Coursera" }
              ],
              dummy_projects: ["Klasifikasi Gambar", "Sistem Rekomendasi Sederhana"]
            }
          }
        ]
      }
    },
    {
      status: "success",
      method_used: "riasec",
      data: {
        chart_data: null,
        recommendations: [
          {
            role_id: "ROLE_009",
            role_name: "Product Manager",
            match_pct: 91.5,
            description: "Memimpin strategi produk, memahami kebutuhan pasar, dan menjembatani tim teknis.",
            salary_range: "12jt - 30jt",
            skill_gap: ["Agile/Scrum", "Data Analytics Dasar"],
            roadmap: {
              learning_path: [
                { step: 1, title: "Product Management 101", resource: "Binar Academy" },
                { step: 2, title: "Agile Framework", resource: "Coursera" }
              ],
              dummy_projects: ["Membuat PRD (Product Requirements Document)", "Riset Pasar Fitur Baru"]
            }
          }
        ]
      }
    }
  ]
};

module.exports = mockResponses;