// File: ai_dummy/server.js
const express = require('express');
const cors = require('cors');
const mockResponses = require('./mockResponses');

const app = express();
// Kita gunakan port 8000 untuk mensimulasikan server FastAPI tim AI
const PORT = 8000; 

app.use(cors());
app.use(express.json());

app.post('/predict', (req, res) => {
  console.log("AI Dummy menerima request:", req.body.method);
  const { user_id, method, payload } = req.body;

  if (!user_id || !method || !payload) {
    return res.status(400).json({ status: "error", code: 400, message: "user_id, method, payload wajib diisi", data: null });
  }

  const availableResponses = mockResponses[method];
  if (!availableResponses) {
    return res.status(400).json({ status: "error", code: 400, message: "Method tidak valid.", data: null });
  }

  if (method === 'skill' && (!payload.skills || payload.skills.length < 2)) {
    return res.status(400).json({ status: "error", code: 400, message: "Minimal 2 skill harus dimasukkan", data: null });
  }

  const randomIndex = Math.floor(Math.random() * availableResponses.length);
  const selectedResponse = availableResponses[randomIndex];

  // Jeda 1.5 detik seolah AI sedang berpikir
  setTimeout(() => {
    res.status(200).json(selectedResponse);
  }, 1500);
});

app.listen(PORT, () => {
  console.log(`[AI DUMMY] FastAPI Simulator berjalan di http://localhost:${PORT}`);
});