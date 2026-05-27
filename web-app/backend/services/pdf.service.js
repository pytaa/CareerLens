const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

const SECTOR_MAPPING = {
  'F01': 'Teknologi Informasi & Software Development',
  'F02': 'Data Science & Artificial Intelligence',
  'F03': 'Desain Kreatif & UI/UX Design',
  'F04': 'Digital Marketing & Analytics'
};

class PdfService {
  constructor() {
    this.smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    this.smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    this.smtpSecure = process.env.SMTP_SECURE === 'true';
    this.smtpUser = process.env.SMTP_USER || '';
    this.smtpPass = process.env.SMTP_PASSWORD || '';
    this.emailFrom = process.env.EMAIL_FROM || `no-reply@careerlens.app`;
  }

  async sendMinatKarirPdf(email, reqData, resData) {
    const interestId = reqData?.payload?.interest_id || '';
    const sectorName = SECTOR_MAPPING[interestId] || interestId;
    const recommendations = resData?.data?.recommendations || [];

    const pdfBuffer = await this._buildMinatKarirPdf(email, sectorName, recommendations);
    await this._sendEmail(email, pdfBuffer, 'Minat Karir');
    
    return { success: true, email };
  }

  async _sendEmail(to, pdfBuffer, type) {
    const transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpSecure,
      auth: this.smtpUser && this.smtpPass ? {
        user: this.smtpUser,
        pass: this.smtpPass
      } : undefined
    });

    const subject = `CareerLens - Laporan Hasil Analisis ${type}`;
    const html = `<p>Halo,</p><p>Berikut adalah lampiran laporan hasil analisis <b>${type}</b> dari CareerLens.</p><p>Terima kasih!</p>`;

    await transporter.sendMail({
      from: this.emailFrom,
      to,
      subject,
      html,
      attachments: [{
        filename: `CareerLens_Laporan_${type.replace(' ', '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    });
  }

  async _buildMinatKarirPdf(email, sectorName, recommendations) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const blueColor = '#032b6a';
      const textColor = '#333333';
      const lightGrey = '#f7f7f7';

      // Header
      doc.font('Helvetica-Bold').fontSize(22).fillColor(blueColor).text('Laporan Hasil Analisis Minat Karir');
      doc.font('Helvetica').fontSize(12).fillColor('#666666').text('CareerLens Career Path Recommendation');
      
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(2).strokeColor(blueColor).stroke();
      doc.moveDown(1.5);

      // INFORMASI HASIL ASSESSMENT
      doc.font('Helvetica-Bold').fontSize(14).fillColor(blueColor).text('INFORMASI HASIL ASSESSMENT');
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const col1X = 50;
      const col2X = 200;
      
      doc.font('Helvetica-Bold').fontSize(10).fillColor(textColor);
      doc.text('Email User', col1X, tableTop);
      doc.font('Helvetica').text(email || '-', col2X, tableTop);
      
      const row2Y = doc.y + 10;
      doc.font('Helvetica-Bold').text('Tanggal Tes', col1X, row2Y);
      doc.font('Helvetica').text(new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), col2X, row2Y);

      const row3Y = doc.y + 10;
      doc.font('Helvetica-Bold').text('Metode Evaluasi', col1X, row3Y);
      doc.font('Helvetica').text('Analisis Minat Karir (Interest Assessment)', col2X, row3Y);

      const row4Y = doc.y + 10;
      doc.font('Helvetica-Bold').text('Pilihan Minat Karir', col1X, row4Y);
      doc.font('Helvetica').text(sectorName, col2X, row4Y);
      
      // Draw table borders (simple)
      const tableBottom = doc.y + 15;
      doc.moveTo(50, tableTop - 10).lineTo(545, tableTop - 10).lineWidth(0.5).strokeColor('#dddddd').stroke();
      doc.moveTo(50, tableBottom).lineTo(545, tableBottom).lineWidth(0.5).strokeColor('#dddddd').stroke();
      doc.moveTo(col2X - 10, tableTop - 10).lineTo(col2X - 10, tableBottom).lineWidth(0.5).strokeColor('#dddddd').stroke();

      doc.y = tableBottom + 30;

      // REKOMENDASI JALUR KARIR
      doc.font('Helvetica-Bold').fontSize(16).fillColor(blueColor).text('REKOMENDASI JALUR KARIR');
      doc.moveDown(1);

      recommendations.forEach((role, idx) => {
        if (doc.y > 650) {
           doc.addPage();
        }

        // Title and Salary
        const roleY = doc.y;
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#000000').text(`${idx + 1}. ${role.role_name}`, 50, roleY);
        if (role.salary_range) {
           const salaryWidth = doc.widthOfString(`Estimasi Gaji: ${role.salary_range}`);
           doc.fillColor(blueColor).text(`Estimasi Gaji: ${role.salary_range}`, 545 - salaryWidth, roleY);
        }
        
        doc.moveDown(0.8);
        
        // Description
        doc.font('Helvetica').fontSize(10).fillColor(textColor).text(role.description || '', { align: 'justify', lineGap: 3 });
        doc.moveDown(0.8);

        // Keahlian Relevan
        if (role.skill_relevant && role.skill_relevant.length > 0) {
            doc.font('Helvetica-Bold').text('Keahlian Relevan:');
            doc.moveDown(0.3);
            doc.font('Helvetica').fillColor('#555555').text(role.skill_relevant.map(s => `[ ${s.toUpperCase()} ]`).join('  '));
            doc.moveDown(0.8);
        }

        // Learning Path (Group by step)
        if (role.roadmap && role.roadmap.learning_path && role.roadmap.learning_path.length > 0) {
            const steps = {};
            role.roadmap.learning_path.forEach(lp => {
                const s = lp.step || 1;
                if (!steps[s]) steps[s] = [];
                steps[s].push(lp);
            });

            Object.keys(steps).sort().forEach(stepNum => {
                doc.font('Helvetica-Bold').fontSize(11).fillColor(blueColor).text(`Step ${stepNum}: Pembelajaran Tahap ${stepNum}`);
                doc.moveDown(0.3);
                steps[stepNum].forEach(course => {
                    doc.font('Helvetica').fontSize(10).fillColor(textColor)
                       .text(`• ${course.nama_skill} — ${course.link_course.split('/').pop().replace(/-/g, ' ')} (${course.platform})`);
                });
                doc.moveDown(0.5);
            });
        }

        // Dummy Projects
        if (role.roadmap && role.roadmap.dummy_projects && role.roadmap.dummy_projects.length > 0) {
            doc.moveDown(0.5);
            const projY = doc.y;
            
            // Draw grey box
            doc.rect(50, projY, 495, 60).fill(lightGrey);
            
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#000000').text(`Proyek Rekomendasi: ${role.roadmap.dummy_projects[0].judul || role.roadmap.dummy_projects[0]}`, 60, projY + 10);
            
            let projDesc = '';
            if (role.roadmap.dummy_projects[0].brief_case) {
                projDesc += role.roadmap.dummy_projects[0].brief_case + '. ';
                projDesc += role.roadmap.dummy_projects[0].instructions + '. ';
                projDesc += `(Tools: ${role.roadmap.dummy_projects[0].tools_used})`;
            }
            
            doc.font('Helvetica').fontSize(9).fillColor('#444444').text(projDesc, 60, projY + 25, { width: 475 });
            doc.y = projY + 70;
        }

        doc.moveDown(1.5);
      });

      doc.end();
    });
  }
}

module.exports = new PdfService();
