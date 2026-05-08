const logger = (req, res, next) => {
  const start = Date.now(); // Waktu mulai request

  // Event listener saat response selesai dikirim ke client
  res.on('finish', () => {
    const duration = Date.now() - start; // Hitung durasi pemrosesan
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next(); // Lanjutkan ke middleware/route selanjutnya
};

module.exports = logger;
