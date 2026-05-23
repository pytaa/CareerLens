// File: src/routes/predict.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

router.post('/', async (req, res) => {
  // 1. Frontend kirim data ke backend
  const { user_id, method, payload } = req.body;

  try {
    console.log(`[1 & 2] Menerima data dan meneruskan ke AI Service...`);
    
    // 2. Backend teruskan ke AI
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict`, req.body, {
      timeout: 120000, 
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // 3 & 4. AI respon & Backend simpan respon AI dalam variabel
    console.log(`[3 & 4] AI berhasil merespon. Menyimpan ke dalam variabel...`);
    const aiData = aiResponse.data;

    // 5. Simpan nilai variabel ke dalam database DAN teruskan ke frontend
    // Syarat: Hanya simpan jika status dari AI benar-benar "success"
    if (aiData.status === "success" && aiData.data) {
      console.log(`[5a] Menyimpan hasil sukses ke Database...`);
      
      await prisma.$transaction(async (tx) => {
        // Buat user jika belum ada
        await tx.user.upsert({
          where: { user_id: user_id },
          update: {}, 
          create: { user_id: user_id }
        });

        // Simpan data frontend (payload) bersamaan dengan data eksklusif AI
        const newAssessment = await tx.assessment.create({
          data: {
            user_id: user_id,
            method: method,
            payload: payload, 
            interest_code: aiData.data.interest_code || null,
            sector_recommendations: aiData.data.sector_recommendations || null
          }
        });

        // Simpan rekomendasi jika ada
        if (aiData.data.recommendations && aiData.data.recommendations.length > 0) {
          const recommendationsToInsert = aiData.data.recommendations.map(rec => ({
            assessment_id: newAssessment.assessment_id,
            user_id: user_id,
            role_id: rec.role_id,
            role_name: rec.role_name,
            match_pct: rec.match_pct, 
            description: rec.description,
            salary_range: rec.salary_range,
            skill_relevant: rec.skill_relevant || [], 
            skill_gap: rec.skill_gap || [],
            roadmap: rec.roadmap 
          }));

          await tx.recommendation.createMany({
            data: recommendationsToInsert
          });
        }

        // Simpan chart_data jika tidak null
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

      console.log(`[5b] Database selesai. Meneruskan data ke Frontend.`);
      return res.status(200).json(aiData);
      
    } else {
      // Jika AI merespon tapi formatnya bukan success, jangan sentuh database
      console.log(`Respon AI tidak sukses. Membatalkan penyimpanan database.`);
      return res.status(400).json(aiData);
    }

  } catch (error) {
    // JIKA DI PROSES 2 GAGAL: (Langsung terlempar ke sini, tidak ada operasi database sama sekali)
    console.error("Gagal di Proses 2 (Hit AI):", error.message);
    
    if (error.code === 'ECONNABORTED') {
       return res.status(504).json({
         status: "error",
         code: 504,
         message: "Gateway Timeout. AI Service terlalu lama merespons.",
         data: null
       });
    }

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error. Gagal terhubung ke AI Service.",
      data: null
    });
  }
});

module.exports = router;