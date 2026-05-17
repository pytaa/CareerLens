require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import koneksi database
const db = require('./config/db'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API CareerLens!' });
});

app.listen(PORT, () => {
  console.log(`Server Backend CareerLens berjalan di http://localhost:${PORT}`);
});