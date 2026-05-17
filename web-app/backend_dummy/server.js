// File: server.js (Berada di luar folder src)
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import rute predict yang ada di dalam folder src/routes
const predictRoute = require('./routes/predict.js'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Menggunakan router
app.use('/predict', predictRoute);

app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API CareerLens!' });
});

// INI YANG PALING PENTING: Menyalakan server agar standby!
app.listen(PORT, () => {
  console.log(`Server Backend CareerLens berjalan di http://localhost:${PORT}`);
});