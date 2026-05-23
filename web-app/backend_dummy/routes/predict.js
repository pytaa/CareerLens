// File: src/routes/predict.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// 1. INISIALISASI PRISMA 7 DENGAN ADAPTER PG
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

router.post('/', async (req, res) => {
  const { user_id, method, payload } = req.body;

  try {
    // 2. TEMBAK AI TERLEBIH DAHULU
    console.log(`Meneruskan request ke AI Service di: ${AI_SERVICE_URL}/predict`);
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict`, req.body);
    const aiData = aiResponse.data;

    // 3. JIKA AI BERHASIL, SIMPAN KE DATABASE DENGAN TRANSAKSI
    if (aiData.status === "success" && aiData.data) {
      
      // Menggunakan Prisma Transaction agar data aman
      await prisma.$transaction(async (tx) => {
        
        await tx.user.upsert({
          where: { user_id: user_id },
          update: {}, 
          create: { user_id: user_id }
        });

        // MENYIMPAN ASSESSMENT
        // Menyisipkan field eksklusif Riasec (interest_code & sector_recommendations). 
        // Jika method bukan riasec, nilainya akan otomatis menjadi undefined/null.
        const newAssessment = await tx.assessment.create({
          data: {
            user_id: user_id,
            method: method,
            payload: payload,
            interest_code: aiData.data.interest_code || null,
            sector_recommendations: aiData.data.sector_recommendations || null
          }
        });

        // MENYIMPAN RECOMMENDATIONS
        if (aiData.data.recommendations && aiData.data.recommendations.length > 0) {
          const recommendationsToInsert = aiData.data.recommendations.map(rec => ({
            assessment_id: newAssessment.assessment_id,
            user_id: user_id,
            role_id: rec.role_id,
            role_name: rec.role_name,
            match_pct: rec.match_pct, // Mendukung format angka Float maupun null
            description: rec.description,
            salary_range: rec.salary_range,
            skill_relevant: rec.skill_relevant || [], // Menampung array skill_relevant baru
            skill_gap: rec.skill_gap || [],
            roadmap: rec.roadmap // Disimpan utuh sebagai JSON bersarang
          }));

          await tx.recommendation.createMany({
            data: recommendationsToInsert
          });
        }

        // MENYIMPAN CHART DATA (Jika ada)
        if (aiData.data.chart_data !== null) {
          await tx.chartData.create({
            data: {
              assessment_id: newAssessment.assessment_id,
              labels: aiData.data.chart_data.labels,
              scores: aiData.data.chart_data.scores
            }
          });
        }
      });
    }

    // 4. KEMBALIKAN HASIL KE FRONTEND
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