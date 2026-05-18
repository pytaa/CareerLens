const express = require('express');
const router = express.Router();
const axios = require('axios');

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Menghubungkan adapter pg ke Prisma
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// ----------------------------------------

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

router.post('/', async (req, res) => {
  const { user_id, method, payload } = req.body;

  try {
    // 1. Catat Pengguna (Upsert: Buat baru jika tidak ada, abaikan jika sudah ada)
    await prisma.user.upsert({
      where: { user_id: user_id },
      update: {}, // Tidak ada yang diupdate jika user sudah ada
      create: { user_id: user_id }
    });

    // 2. Catat Riwayat Input Asesmen
    const newAssessment = await prisma.assessment.create({
      data: {
        user_id: user_id,
        method: method,
        payload: payload
      }
    });

    // 3. Meneruskan request ke AI Service
    console.log(`Meneruskan request ke AI Service di: ${AI_SERVICE_URL}/predict`);
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict`, req.body);
    const aiData = aiResponse.data;

    // 4. Proses Hasil AI dan Simpan ke Database
    if (aiData.status === "success" && aiData.data) {
      
      // Simpan Rekomendasi
      if (aiData.data.recommendations && aiData.data.recommendations.length > 0) {
        // Menggunakan createMany untuk menyimpan banyak rekomendasi sekaligus
        const recommendationsToInsert = aiData.data.recommendations.map(rec => ({
          assessment_id: newAssessment.assessment_id,
          user_id: user_id,
          role_id: rec.role_id,
          role_name: rec.role_name,
          match_pct: rec.match_pct,
          description: rec.description,
          salary_range: rec.salary_range,
          skill_gap: rec.skill_gap || [],
          roadmap: rec.roadmap
        }));

        await prisma.recommendation.createMany({
          data: recommendationsToInsert
        });
      }

      // Simpan Chart Data (Hanya untuk metode skill)
      if (aiData.data.chart_data !== null) {
        await prisma.chartData.create({
          data: {
            assessment_id: newAssessment.assessment_id,
            labels: aiData.data.chart_data.labels,
            scores: aiData.data.chart_data.scores
          }
        });
      }
    }

    // 5. Kembalikan hasil dari AI langsung ke React (Frontend)
    return res.status(200).json(aiData);

  } catch (error) {
    console.error("Gagal memproses prediksi:", error.message);
    
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error. Gagal memproses permintaan.",
      data: null
    });
  }
});

module.exports = router;