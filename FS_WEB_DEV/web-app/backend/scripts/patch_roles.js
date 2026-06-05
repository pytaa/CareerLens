// Mengambil variabel environment dari file .env di folder backend agar bisa terhubung ke database
require('dotenv').config({ path: '../.env' });
const fs = require('fs'); 
const path = require('path'); 
const csv = require('csv-parser');
const { Role } = require('../models'); 

// Menentukan letak folder dataset yang berisi file CSV
const datasetPath = path.join(__dirname, '../../../dataset');

/**
 * Fungsi bantuan (helper) untuk membaca isi file CSV secara asynchronous
 * @param {string} filePath 
 * @returns {Promise<Array>} 
 */

const readCSV = (filePath) => {
  // Mengecek apakah file CSV benar-benar ada di dalam folder
  if (!fs.existsSync(filePath)) {
    console.error(`File tidak ditemukan: ${filePath}`);
    process.exit(1);
  }
  

  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv()) 
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results)) 
      .on('error', reject); 
  });
};


//Fungsi utama untuk menambal (patching) data yang hilang di database
const patchRoles = async () => {
  try {
    console.log('Menghubungkan ke database...');
    
    // Menentukan jalur lokasi spesifik untuk file master_roles.csv
    const csvPath = path.join(datasetPath, 'master_roles.csv');
    console.log(`Membaca data dari ${csvPath}...`);
    
    const rolesData = await readCSV(csvPath);
    
    let updatedCount = 0;

    // Melakukan perulangan (loop) pada setiap baris data yang ada di file CSV
    for (const row of rolesData) {
      const roleId = row.role_id;
      const description = row.deskripsi;
      const salary = row.gaji;

      if (!roleId) continue;

      // Mengeksekusi perintah UPDATE ke database menggunakan Sequelize ORM
      const [affectedRows] = await Role.update(
        {
          description: description || null, 
          salary_range: salary || null 
        },
        {
          where: { role_id: roleId } 
        }
      );

      // affectedRows berisi angka berapa banyak baris di tabel database yang terpengaruh/berubah
      if (affectedRows > 0) {
        updatedCount++; 
      }
    }

    console.log(`Sukses! Berhasil memperbarui ${updatedCount} role dengan deskripsi dan gaji.`);
  } catch (error) {
    console.error('Terjadi kesalahan saat melakukan patching:', error);
  } finally {
    process.exit(0); 
  }
};

patchRoles();
