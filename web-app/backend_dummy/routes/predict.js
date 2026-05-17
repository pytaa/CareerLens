// File: src/routes/predict.js
const express = require('express');
const router = express.Router();
const axios = require('axios'); 

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

router.post('/', async (req, res) => {
  try {
    console.log(`Meneruskan request ke AI Service di: ${AI_SERVICE_URL}/predict`);
    
    // Backend Express.js menembak ke server AI Dummy
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict`, req.body);

    return res.status(200).json(aiResponse.data);

  } catch (error) {
    console.error("Gagal menghubungi AI Service:", error.message);
    
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error. Gagal menghubungi model AI.",
      data: null
    });
  }
});

module.exports = router;