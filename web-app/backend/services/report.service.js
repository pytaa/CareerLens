const BaseService = require('./base.service');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const userEmailRepository = require('../repositories/user.email.repository');

/**
 * Service untuk mengelola Laporan (Report) pengguna. Termasuk di dalamnya pembuatan file PDF dan pengiriman via Email (SMTP).
 */
class ReportService extends BaseService {
  constructor() {
    super(null);
    this.smtpHost = process.env.SMTP_HOST || 'smtp.sendgrid.net';
    this.smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    this.smtpSecure = process.env.SMTP_SECURE === 'true';
    this.smtpUser = process.env.SMTP_USER || '';
    this.smtpPass = process.env.SMTP_PASSWORD || '';
    this.emailFrom = process.env.EMAIL_FROM || `no-reply@${process.env.SMTP_HOST || 'careerlens.app'}`;
    this.emailReplyTo = process.env.EMAIL_REPLY_TO || this.emailFrom;
  }

  /**
   * Menggenerasi laporan berbentuk PDF yang berisi ringkasan profil, 
   * rekomendasi, dan roadmap, lalu mengirimkannya ke alamat email pengguna.
   */
  async sendAnalysisReport({ email, user_id = null, profile = {}, summary = '', recommendations = [], riasec_scores = null }) {
    if (!email) {
      throw new Error('Alamat email penerima diperlukan.');
    }

    const pdfBuffer = await this._buildPdf({ profile, summary, recommendations, riasec_scores });
    await this._sendEmail(email, pdfBuffer, profile);

    if (user_id) {
      await userEmailRepository.create({
        user_id,
        email,
        is_primary: false,
        verified: false,
        metadata: {
          sent_at: new Date().toISOString(),
          profile_summary: summary || null
        }
      });
    }

    return {
      email,
      message: 'Laporan analisis telah dikirimkan sebagai lampiran PDF.'
    };
  }

  async _sendEmail(to, pdfBuffer, profile) {
    const transporterConfig = {
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpSecure,
      auth: this.smtpUser && this.smtpPass ? {
        user: this.smtpUser,
        pass: this.smtpPass
      } : undefined
    };

    const transporter = nodemailer.createTransport(transporterConfig);
    await transporter.verify();

    const subject = `CareerLens Laporan Analisis untuk ${profile.name || 'Pengguna'}`;
    const html = `<p>Halo,</p><p>Berikut lampiran PDF laporan hasil analisis CareerLens Anda.</p><p>Terima kasih telah menggunakan CareerLens.</p>`;

    await transporter.sendMail({
      from: this.emailFrom,
      replyTo: this.emailReplyTo,
      to,
      subject,
      html,
      attachments: [
        {
          filename: 'CareerLens_Report.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });
  }

  async _buildPdf({ profile, summary, recommendations, riasec_scores = null }) {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const chunks = [];

    return new Promise((resolve, reject) => {
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('CareerLens Laporan Analisis', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#555').text(`Dibuat pada: ${new Date().toLocaleString('id-ID')}`, { align: 'center' });
      doc.moveDown(1.5);

      doc.fontSize(14).fillColor('#032b6a').text('Ringkasan Profil', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#000');
      if (profile.name) {
        doc.text(`Nama Pengguna: ${profile.name}`);
      }
      if (profile.user_id) {
        doc.text(`ID Pengguna: ${profile.user_id}`);
      }
      if (profile.email) {
        doc.text(`Email: ${profile.email}`);
      }
      doc.moveDown(0.5);
      if (summary) {
        doc.text(summary, { lineGap: 4 });
      } else {
        doc.text('Laporan ini berisi ringkasan hasil analisis CareerLens, rekomendasi jalur karir, dan roadmap upskilling.');
      }

      if (riasec_scores && Object.keys(riasec_scores).length) {
        doc.moveDown(1);
        doc.fontSize(14).fillColor('#032b6a').text('Hasil Tes RIASEC', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000');
        Object.entries(riasec_scores).forEach(([key, value]) => {
          doc.text(`${key.toUpperCase()}: ${parseFloat(value).toFixed(2)}`);
        });
      }

      doc.addPage();
      doc.fontSize(14).fillColor('#032b6a').text('Rekomendasi Role', { underline: true });
      doc.moveDown(0.5);

      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        doc.fontSize(11).fillColor('#000').text('Tidak ada rekomendasi role yang tersedia.', { lineGap: 4 });
      } else {
        recommendations.forEach((role, index) => {
          doc.fontSize(12).fillColor('#000').text(`${index + 1}. ${role.role_name || 'Nama role tidak tersedia'}`, { continued: false });
          doc.fontSize(10).fillColor('#444');
          if (role.match_pct != null) {
            doc.text(`   Kecocokan: ${role.match_pct}%`);
          }
          if (role.salary_range) {
            doc.text(`   Salary: ${role.salary_range}`);
          }
          if (role.description) {
            doc.text(`   Deskripsi: ${role.description}`);
          }
          if (Array.isArray(role.skill_relevant) && role.skill_relevant.length) {
            doc.text(`   Skill Relevan: ${role.skill_relevant.join(', ')}`);
          }
          if (Array.isArray(role.skill_gap) && role.skill_gap.length) {
            doc.text(`   Skill Gap: ${role.skill_gap.join(', ')}`);
          }
          doc.moveDown(0.5);

          if (Array.isArray(role.roadmap?.learning_path) && role.roadmap.learning_path.length) {
            doc.fontSize(11).fillColor('#032b6a').text('   Roadmap Upskilling:', { continued: false });
            role.roadmap.learning_path.forEach((step) => {
              doc.fontSize(10).fillColor('#444').text(`     • Step ${step.step}: ${step.nama_skill || step.title || '-'}${step.platform ? ` (${step.platform})` : ''}${step.link_course ? ` — ${step.link_course}` : ''}`);
            });
            doc.moveDown(0.25);
          }

          if (Array.isArray(role.roadmap?.dummy_projects) && role.roadmap.dummy_projects.length) {
            doc.fontSize(11).fillColor('#032b6a').text('   Proyek Rekomendasi:', { continued: false });
            role.roadmap.dummy_projects.forEach((project) => {
              doc.fontSize(10).fillColor('#444').text(`     • ${project.judul || project}`);
            });
            doc.moveDown(0.25);
          }

          if (index < recommendations.length - 1) {
            doc.moveDown(0.5);
            if (doc.y > 700) {
              doc.addPage();
            }
          }
        });
      }

      doc.end();
    });
  }
}

module.exports = new ReportService();
