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
    // resData dari frontend mungkin sudah berupa object data, atau object response utuh
    const dataInti = resData?.data?.data || resData?.data || resData;
    const recommendations = dataInti?.recommendations || [];

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
    const html = `
      <div style="font-family: sans-serif; color: #333333; line-height: 1.6;">
        <p>Halo,</p>
        <p>Terima kasih telah menggunakan layanan CareerLens.</p>
        <p>Bersama email ini, kami lampirkan dokumen PDF yang berisi <strong>Laporan Hasil Analisis ${type}</strong> Anda. Laporan ini memuat rincian profil karir, rekomendasi jalur pembelajaran (<em>roadmap</em>), proyek rekomendasi, serta keahlian yang relevan untuk menunjang masa depan karir Anda.</p>
        <p>Semoga laporan ini dapat memberikan wawasan berharga untuk perjalanan karir Anda ke depannya.</p>
        <p>Salam hangat,<br><strong>Tim CareerLens</strong></p>
      </div>
    `;

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

      // --- WATERMARK KIRI BAWAH ---
      const addWatermark = () => {
          const prevX = doc.x;
          const prevY = doc.y;
          doc.font('Helvetica-Bold').fontSize(8).fillColor('#cbd5e1').text(`CareerLens © ${new Date().getFullYear()}`, 50, doc.page.height - 40, { lineBreak: false });
          doc.x = prevX;
          doc.y = prevY;
      };
      doc.on('pageAdded', addWatermark);
      addWatermark(); // Untuk halaman pertama

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

      // Tabel Selesai
      doc.y = tableBottom + 30;
      doc.moveDown(1);

      recommendations.forEach((role, index) => {
        // SELALU mulai rekomendasi di halaman baru sesuai permintaan
        doc.addPage();

        const marginX = 50;
        const contentWidth = 495;

        // --- 1. HEADER (Title & Salary) ---
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#3b82f6').text('CAREER INSIGHT REPORT'.toUpperCase(), marginX, 50, { indent: 0 });
        doc.moveDown(0.5);
        
        doc.font('Helvetica-Bold').fontSize(22).fillColor('#0f172a').text(role.role_name, marginX, doc.y, { indent: 0 });
        doc.moveDown(0.3);
        
        if (role.salary_range) {
            doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text(role.salary_range, marginX, doc.y, { continued: true });
            doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(' / average monthly salary');
        }
        
        doc.moveDown(0.8);
        doc.moveTo(marginX, doc.y).lineTo(marginX + contentWidth, doc.y).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
        doc.moveDown(1.5);

        // --- 2. ROLE OVERVIEW ---
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#0f172a').text('Role Overview', marginX, doc.y, { indent: 0 });
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).fillColor('#475569').text(role.description || '', marginX, doc.y, { align: 'justify', width: contentWidth, lineGap: 3, indent: 0 });
        doc.moveDown(1.5);

        // --- 3. CORE SKILLS (Box) ---
        if (role.skill_relevant && role.skill_relevant.length > 0) {
            const boxStartX = marginX;
            const boxStartY = doc.y;
            const boxWidth = contentWidth;
            
            // Calculate height needed for the box first
            let currentX = boxStartX + 20;
            let currentY = boxStartY + 40;
            const tagHeight = 22;
            const paddingX = 12;
            const gapX = 8;
            const gapY = 8;
            
            doc.font('Helvetica-Bold').fontSize(9);
            role.skill_relevant.forEach(skill => {
                const text = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const textWidth = doc.widthOfString(text);
                const tagWidth = textWidth + (paddingX * 2);
                
                if (currentX + tagWidth > boxStartX + boxWidth - 20) {
                    currentX = boxStartX + 20;
                    currentY += tagHeight + gapY;
                }
                currentX += tagWidth + gapX;
            });
            
            const boxHeight = (currentY - boxStartY) + tagHeight + 20;

            // Draw Big Gray Box
            doc.roundedRect(boxStartX, boxStartY, boxWidth, boxHeight, 8).fill('#f8fafc');
            
            // Draw Core Skills Text
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#0f172a').text('Core Skills', boxStartX + 20, boxStartY + 15, { indent: 0 });
            
            // Draw tags inside
            currentX = boxStartX + 20;
            currentY = boxStartY + 45;
            
            doc.font('Helvetica-Bold').fontSize(9);
            role.skill_relevant.forEach(skill => {
                const text = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const textWidth = doc.widthOfString(text);
                const tagWidth = textWidth + (paddingX * 2);
                
                if (currentX + tagWidth > boxStartX + boxWidth - 20) {
                    currentX = boxStartX + 20;
                    currentY += tagHeight + gapY;
                }
                
                doc.roundedRect(currentX, currentY, tagWidth, tagHeight, 11).fill('#e2e8f0');
                doc.fillColor('#475569').text(text, currentX + paddingX, currentY + 6, { indent: 0 });
                currentX += tagWidth + gapX;
            });
            
            doc.y = boxStartY + boxHeight + 25;
        }

        // --- 4. UPSKILLING ROADMAP ---
        if (role.roadmap && role.roadmap.learning_path && role.roadmap.learning_path.length > 0) {
            // Check page break
            if (doc.y > 650) doc.addPage();

            doc.font('Helvetica-Bold').fontSize(16).fillColor('#0f172a').text('Upskilling Roadmap', marginX, doc.y, { indent: 0 });
            doc.moveDown(1);
            
            const steps = {};
            role.roadmap.learning_path.forEach(lp => {
                const s = lp.step || 1;
                if (!steps[s]) steps[s] = [];
                steps[s].push(lp);
            });

            Object.keys(steps).sort().forEach(stepNum => {
                // Determine height needed for this step box
                const stepCourses = steps[stepNum];
                const boxStartY = doc.y;
                let estimatedHeight = 50 + (stepCourses.length * 20);
                
                // If the box will overflow the page, move to next page
                if (boxStartY + estimatedHeight > 780) {
                    doc.addPage();
                }

                const actualStartY = doc.y;
                
                // We will draw the box AFTER drawing the content so we know exactly the height.
                // Or better, calculate EXACT height first.
                // Let's just draw the content, track max Y, then draw the box UNDER it? PDFKit draws over.
                // So we must calculate height exactly.
                const boxHeight = 40 + (stepCourses.length * 22);
                
                // Draw Step Box
                doc.roundedRect(marginX, actualStartY, contentWidth, boxHeight, 6)
                   .lineWidth(1).strokeColor('#e2e8f0').stroke();

                // Draw Black Circle with Number
                const circleX = marginX + 25;
                const circleY = actualStartY + 25;
                doc.circle(circleX, circleY, 12).fill('#0f172a');
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#ffffff').text(stepNum, circleX - 10, circleY - 4, { width: 20, align: 'center', indent: 0 });
                
                // Draw Step Title
                const titleX = circleX + 25;
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text(`Step ${stepNum}: Pembelajaran Tahap ${stepNum}`, titleX, actualStartY + 20, { indent: 0 });
                
                // Draw Courses
                let courseY = actualStartY + 45;
                stepCourses.forEach(course => {
                    const platform = course.platform || course.resource || 'Unknown';
                    const bulletText = `• ${course.nama_skill} (${platform})`;
                    
                    doc.font('Helvetica').fontSize(9).fillColor('#64748b').text(bulletText, titleX, courseY, { indent: 0 });
                    
                    // Link aligned to the right
                    doc.fillColor('#3b82f6').text('Link ∞', marginX + contentWidth - 40, courseY, {
                        link: course.link_course,
                        underline: false,
                        align: 'right',
                        width: 30,
                        indent: 0
                    });
                    
                    courseY += 20;
                });
                
                doc.y = actualStartY + boxHeight + 15;
            });
        }

        // --- 5. CAPSTONE PROJECT ---
        const dummyProjects = role.dummy_projects || (role.roadmap && role.roadmap.dummy_projects) || [];
        if (dummyProjects.length > 0) {
            doc.moveDown(1);
            
            dummyProjects.forEach(proj => {
                let estimatedHeight = 220;
                let instructionsArray = [];
                let instructionsStr = proj.instructions || '';
                if (instructionsStr.includes(';')) {
                    instructionsArray = instructionsStr.split(';');
                } else {
                    instructionsArray = instructionsStr.split(/(?=[A-Z])/).filter(s => s.trim().length > 3);
                    if (instructionsArray.length === 0) instructionsArray = [instructionsStr];
                }
                estimatedHeight += instructionsArray.length * 20;
                
                // FIX PAGINATION: Check if it fits on the current page
                if (doc.y + estimatedHeight > 770) {
                    doc.addPage();
                } else if (doc.y > 550) {
                    doc.addPage(); // legacy fallback just in case
                }

                const boxStartY = doc.y;
                const boxWidth = contentWidth;
                
                // Draw Box Background
                doc.roundedRect(marginX, boxStartY, boxWidth, estimatedHeight, 8).fill('#f1f5f9');
                
                let currentY = boxStartY + 25;
                const innerX = marginX + 25;
                
                // Pill "Capstone Project"
                doc.roundedRect(innerX, currentY, 110, 22, 11).lineWidth(1).strokeColor('#cbd5e1').stroke();
                doc.font('Helvetica').fontSize(9).fillColor('#0f172a').text('Capstone Project', innerX + 15, currentY + 6, { indent: 0 });
                
                currentY += 40;
                
                // Project Title
                doc.font('Helvetica-Bold').fontSize(18).fillColor('#0f172a').text(proj.judul || 'Sales Data Dashboard', innerX, currentY, { indent: 0 });
                currentY += 25;
                
                // Project Brief
                doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(proj.brief_case || '', innerX, currentY, { indent: 0, width: boxWidth - 50, lineGap: 3 });
                currentY += 30; // approx height
                
                // Instruksi Header
                doc.font('Helvetica').fontSize(9).fillColor('#64748b').text('INSTRUKSI', innerX, currentY, { indent: 0 });
                currentY += 15;
                
                // Instruksi List
                instructionsArray.forEach(inst => {
                    const txt = inst.trim();
                    if (txt) {
                        doc.font('Helvetica').fontSize(10).fillColor('#475569').text(`•  ${txt}`, innerX, currentY, { indent: 0 });
                        currentY += 18;
                    }
                });
                
                currentY += 15;
                
                // Tools Header
                doc.font('Helvetica').fontSize(9).fillColor('#64748b').text('TOOLS', innerX, currentY, { indent: 0 });
                currentY += 15;
                
                // Tools Pills
                const toolsStr = proj.tools_used || '';
                let toolsArray = [];
                if (toolsStr.includes(',')) toolsArray = toolsStr.split(',');
                else if (toolsStr.includes(';')) toolsArray = toolsStr.split(';');
                else toolsArray = toolsStr.split(' ');

                let toolX = innerX;
                doc.font('Helvetica-Bold').fontSize(9);
                toolsArray.forEach(tool => {
                    const txt = tool.trim();
                    if (!txt) return;
                    
                    const textWidth = doc.widthOfString(txt);
                    const tagWidth = textWidth + 24; // padding
                    
                    doc.roundedRect(toolX, currentY, tagWidth, 22, 6).fill('#e2e8f0');
                    doc.fillColor('#334155').text(txt, toolX + 12, currentY + 6, { indent: 0 });
                    toolX += tagWidth + 8;
                });
                
                // Update doc.y and potentially extend box if we miscalculated? 
                // To be safe, we made estimatedHeight large enough. 
                // Let's just set doc.y below the box.
                doc.y = Math.max(currentY + 50, boxStartY + estimatedHeight);
            });
        }
        
        doc.moveDown(1.5);
      });

      doc.end();
    });
  }

  async sendSkillPdf(email, reqData, resData) {
    const skillsInputArray = reqData?.payload?.skills || [];
    const skillsInput = skillsInputArray.join(', ');
    const capitalizedSkills = skillsInput.split(', ').map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(', ') || '-';
    
    const dataInti = resData?.data?.data || resData?.data || resData;
    const recommendations = dataInti?.recommendations || [];
    const chartData = dataInti?.chart_data || { labels: [], scores: [] };

    const pdfBuffer = await this._buildSkillPdf(email, capitalizedSkills, recommendations, chartData);
    await this._sendEmail(email, pdfBuffer, 'Analisis Skill');
    
    return { success: true, email };
  }

  async _buildSkillPdf(email, skillsInput, recommendations, chartData) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const blueColor = '#032b6a';
      const textColor = '#333333';

      const addWatermark = () => {
          const prevX = doc.x;
          const prevY = doc.y;
          doc.font('Helvetica-Bold').fontSize(8).fillColor('#cbd5e1').text(`CareerLens © ${new Date().getFullYear()}`, 50, doc.page.height - 40, { lineBreak: false });
          doc.x = prevX;
          doc.y = prevY;
      };
      doc.on('pageAdded', addWatermark);
      addWatermark();

      doc.font('Helvetica-Bold').fontSize(22).fillColor(blueColor).text('Laporan Hasil Analisis Skill');
      doc.font('Helvetica').fontSize(12).fillColor('#666666').text('CareerLens Career Path Recommendation');
      
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(2).strokeColor(blueColor).stroke();
      doc.moveDown(1.5);

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
      doc.font('Helvetica').text('Analisis Skill (Skill Assessment)', col2X, row3Y);

      const row4Y = doc.y + 10;
      doc.font('Helvetica-Bold').text('Input Skill', col1X, row4Y);
      doc.font('Helvetica').text(skillsInput, col2X, row4Y, { width: 345, align: 'left' });
      
      // Calculate dynamic table bottom based on text height of Input Skill
      const tableBottom = doc.y + 15;
      doc.moveTo(50, tableTop - 10).lineTo(545, tableTop - 10).lineWidth(0.5).strokeColor('#dddddd').stroke();
      doc.moveTo(50, tableBottom).lineTo(545, tableBottom).lineWidth(0.5).strokeColor('#dddddd').stroke();
      doc.moveTo(col2X - 10, tableTop - 10).lineTo(col2X - 10, tableBottom).lineWidth(0.5).strokeColor('#dddddd').stroke();

      doc.y = tableBottom + 30;

      // CHART BAR (Analisis Kecocokan Peran)
      if (chartData && chartData.labels && chartData.labels.length > 0) {
          doc.font('Helvetica-Bold').fontSize(14).fillColor(blueColor).text('Analisis Kecocokan Peran', 50, doc.y);
          doc.moveDown(1.5);

          chartData.labels.forEach((label, idx) => {
              const score = chartData.scores[idx] || 0;
              
              if (doc.y > 700) doc.addPage();
              
              doc.font('Helvetica-Bold').fontSize(10).fillColor(blueColor).text(label, 50, doc.y, { continued: true });
              doc.font('Helvetica-Bold').fillColor('#64748b').text(`${score}%`, { align: 'right' });
              
              doc.moveDown(0.4);
              
              const barWidth = 495;
              const fillWidth = (score / 100) * barWidth;
              
              // Gray track
              doc.roundedRect(50, doc.y, barWidth, 8, 4).fill('#f1f5f9');
              // Blue fill
              doc.roundedRect(50, doc.y, fillWidth, 8, 4).fill(blueColor);
              
              doc.y += 8 + 20; 
          });
      }

      recommendations.forEach((role, index) => {
        doc.addPage();

        const marginX = 50;
        const contentWidth = 495;

        // HEADER
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#3b82f6').text('CAREER INSIGHT REPORT', marginX, 50, { indent: 0 });
        doc.moveDown(0.5);
        
        doc.font('Helvetica-Bold').fontSize(22).fillColor('#0f172a').text(role.role_name, marginX, doc.y, { indent: 0 });
        doc.moveDown(0.3);
        
        if (role.salary_range) {
            doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text(role.salary_range, marginX, doc.y, { continued: true });
            doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(' / average monthly salary');
        }
        
        doc.moveDown(0.8);
        doc.moveTo(marginX, doc.y).lineTo(marginX + contentWidth, doc.y).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
        doc.moveDown(1.5);

        // ROLE OVERVIEW
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#0f172a').text('Role Overview', marginX, doc.y, { indent: 0 });
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).fillColor('#475569').text(role.description || '', marginX, doc.y, { align: 'justify', width: contentWidth, lineGap: 3, indent: 0 });
        doc.moveDown(1.5);

        // CORE SKILLS
        if (role.skill_relevant && role.skill_relevant.length > 0) {
            const boxStartX = marginX;
            const boxStartY = doc.y;
            
            let currentX = boxStartX + 20;
            let currentY = boxStartY + 40;
            const tagHeight = 22;
            const paddingX = 12;
            const gapX = 8;
            const gapY = 8;
            
            doc.font('Helvetica-Bold').fontSize(9);
            role.skill_relevant.forEach(skill => {
                const text = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const textWidth = doc.widthOfString(text);
                const tagWidth = textWidth + (paddingX * 2);
                
                if (currentX + tagWidth > boxStartX + contentWidth - 20) {
                    currentX = boxStartX + 20;
                    currentY += tagHeight + gapY;
                }
                currentX += tagWidth + gapX;
            });
            
            const boxHeight = (currentY - boxStartY) + tagHeight + 20;

            doc.roundedRect(boxStartX, boxStartY, contentWidth, boxHeight, 8).fill('#f8fafc');
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#0f172a').text('Core Skills', boxStartX + 20, boxStartY + 15, { indent: 0 });
            
            currentX = boxStartX + 20;
            currentY = boxStartY + 45;
            
            doc.font('Helvetica-Bold').fontSize(9);
            role.skill_relevant.forEach(skill => {
                const text = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const textWidth = doc.widthOfString(text);
                const tagWidth = textWidth + (paddingX * 2);
                
                if (currentX + tagWidth > boxStartX + contentWidth - 20) {
                    currentX = boxStartX + 20;
                    currentY += tagHeight + gapY;
                }
                
                doc.roundedRect(currentX, currentY, tagWidth, tagHeight, 11).fill('#e2e8f0');
                doc.fillColor('#475569').text(text, currentX + paddingX, currentY + 6, { indent: 0 });
                currentX += tagWidth + gapX;
            });
            
            doc.y = boxStartY + boxHeight + 25;
        }

        // SKILL GAP
        if (role.skill_gap && role.skill_gap.length > 0) {
            const gapStartX = marginX;
            const gapStartY = doc.y;
            
            let currentX = gapStartX + 20;
            let currentY = gapStartY + 40;
            const tagHeight = 22;
            const paddingX = 12;
            const gapX = 8;
            const gapY = 8;
            
            doc.font('Helvetica-Bold').fontSize(9);
            role.skill_gap.forEach(skill => {
                const text = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const textWidth = doc.widthOfString(text);
                const tagWidth = textWidth + (paddingX * 2);
                
                if (currentX + tagWidth > gapStartX + contentWidth - 20) {
                    currentX = gapStartX + 20;
                    currentY += tagHeight + gapY;
                }
                currentX += tagWidth + gapX;
            });
            
            const gapBoxHeight = (currentY - gapStartY) + tagHeight + 20;

            doc.roundedRect(gapStartX, gapStartY, contentWidth, gapBoxHeight, 8).fill('#fef2f2');
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#991b1b').text('Skill Gap', gapStartX + 20, gapStartY + 15, { indent: 0 });
            
            currentX = gapStartX + 20;
            currentY = gapStartY + 45;
            
            doc.font('Helvetica-Bold').fontSize(9);
            role.skill_gap.forEach(skill => {
                const text = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const textWidth = doc.widthOfString(text);
                const tagWidth = textWidth + (paddingX * 2);
                
                if (currentX + tagWidth > gapStartX + contentWidth - 20) {
                    currentX = gapStartX + 20;
                    currentY += tagHeight + gapY;
                }
                
                doc.roundedRect(currentX, currentY, tagWidth, tagHeight, 11).fill('#fee2e2');
                doc.fillColor('#b91c1c').text(text, currentX + paddingX, currentY + 6, { indent: 0 });
                currentX += tagWidth + gapX;
            });
            
            doc.y = gapStartY + gapBoxHeight + 25;
        }

        // UPSKILLING ROADMAP
        if (role.roadmap && role.roadmap.learning_path && role.roadmap.learning_path.length > 0) {
            if (doc.y > 650) doc.addPage();

            doc.font('Helvetica-Bold').fontSize(16).fillColor('#0f172a').text('Upskilling Roadmap', marginX, doc.y, { indent: 0 });
            doc.moveDown(1);
            
            const steps = {};
            role.roadmap.learning_path.forEach(lp => {
                const s = lp.step || 1;
                if (!steps[s]) steps[s] = [];
                steps[s].push(lp);
            });

            Object.keys(steps).sort().forEach(stepNum => {
                const stepCourses = steps[stepNum];
                const boxStartY = doc.y;
                let estimatedHeight = 50 + (stepCourses.length * 20);
                
                if (boxStartY + estimatedHeight > 780) {
                    doc.addPage();
                }

                const actualStartY = doc.y;
                const boxHeight = 40 + (stepCourses.length * 22);
                
                doc.roundedRect(marginX, actualStartY, contentWidth, boxHeight, 6)
                   .lineWidth(1).strokeColor('#e2e8f0').stroke();

                const circleX = marginX + 25;
                const circleY = actualStartY + 25;
                doc.circle(circleX, circleY, 12).fill('#0f172a');
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#ffffff').text(stepNum, circleX - 10, circleY - 4, { width: 20, align: 'center', indent: 0 });
                
                const titleX = circleX + 25;
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text(`Step ${stepNum}: Pembelajaran Tahap ${stepNum}`, titleX, actualStartY + 20, { indent: 0 });
                
                let courseY = actualStartY + 45;
                stepCourses.forEach(course => {
                    const platform = course.platform || course.resource || 'Unknown';
                    const bulletText = `• ${course.nama_skill} (${platform})`;
                    
                    doc.font('Helvetica').fontSize(9).fillColor('#64748b').text(bulletText, titleX, courseY, { indent: 0 });
                    
                    doc.fillColor('#3b82f6').text('Link ∞', marginX + contentWidth - 40, courseY, {
                        link: course.link_course,
                        underline: false,
                        align: 'right',
                        width: 30,
                        indent: 0
                    });
                    
                    courseY += 20;
                });
                
                doc.y = actualStartY + boxHeight + 15;
            });
        }

        // CAPSTONE PROJECT
        const dummyProjects = role.dummy_projects || (role.roadmap && role.roadmap.dummy_projects) || [];
        if (dummyProjects.length > 0) {
            doc.moveDown(1);
            
            dummyProjects.forEach(proj => {
                let estimatedHeight = 220;
                let instructionsArray = [];
                let instructionsStr = proj.instructions || '';
                if (instructionsStr.includes(';')) {
                    instructionsArray = instructionsStr.split(';');
                } else {
                    instructionsArray = instructionsStr.split(/(?=[A-Z])/).filter(s => s.trim().length > 3);
                    if (instructionsArray.length === 0) instructionsArray = [instructionsStr];
                }
                estimatedHeight += instructionsArray.length * 20;
                
                // FIX PAGINATION: Check if it fits on the current page
                if (doc.y + estimatedHeight > 770) {
                    doc.addPage();
                } else if (doc.y > 550) {
                    doc.addPage(); // legacy fallback just in case
                }

                const boxStartY = doc.y;
                const boxWidth = contentWidth;
                
                doc.roundedRect(marginX, boxStartY, boxWidth, estimatedHeight, 8).fill('#f1f5f9');
                
                let currentY = boxStartY + 25;
                const innerX = marginX + 25;
                
                doc.roundedRect(innerX, currentY, 110, 22, 11).lineWidth(1).strokeColor('#cbd5e1').stroke();
                doc.font('Helvetica').fontSize(9).fillColor('#0f172a').text('Capstone Project', innerX + 15, currentY + 6, { indent: 0 });
                
                currentY += 40;
                
                doc.font('Helvetica-Bold').fontSize(18).fillColor('#0f172a').text(proj.judul || 'Sales Data Dashboard', innerX, currentY, { indent: 0 });
                currentY += 25;
                
                doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(proj.brief_case || '', innerX, currentY, { indent: 0, width: boxWidth - 50, lineGap: 3 });
                currentY += 30;
                
                doc.font('Helvetica').fontSize(9).fillColor('#64748b').text('INSTRUKSI', innerX, currentY, { indent: 0 });
                currentY += 15;
                
                instructionsArray.forEach(inst => {
                    const txt = inst.trim();
                    if (txt) {
                        doc.font('Helvetica').fontSize(10).fillColor('#475569').text(`•  ${txt}`, innerX, currentY, { indent: 0 });
                        currentY += 18;
                    }
                });
                
                currentY += 15;
                
                doc.font('Helvetica').fontSize(9).fillColor('#64748b').text('TOOLS', innerX, currentY, { indent: 0 });
                currentY += 15;
                
                const toolsStr = proj.tools_used || '';
                let toolsArray = [];
                if (toolsStr.includes(',')) toolsArray = toolsStr.split(',');
                else if (toolsStr.includes(';')) toolsArray = toolsStr.split(';');
                else toolsArray = toolsStr.split(' ');

                let toolX = innerX;
                doc.font('Helvetica-Bold').fontSize(9);
                toolsArray.forEach(tool => {
                    const txt = tool.trim();
                    if (!txt) return;
                    
                    const textWidth = doc.widthOfString(txt);
                    const tagWidth = textWidth + 24;
                    
                    doc.roundedRect(toolX, currentY, tagWidth, 22, 6).fill('#e2e8f0');
                    doc.fillColor('#334155').text(txt, toolX + 12, currentY + 6, { indent: 0 });
                    toolX += tagWidth + 8;
                });
                
                doc.y = Math.max(currentY + 50, boxStartY + estimatedHeight);
            });
        }
        
        doc.moveDown(1.5);
      });

      doc.end();
    });
  }
  async sendBakatPdf(email, reqData, resData) {
    const riasecScores = reqData?.payload?.riasec_scores || {};
    
    const dataInti = resData?.data?.data || resData?.data || resData;
    const recommendations = dataInti?.recommendations || [];
    const chartData = dataInti?.chart_data || { labels: [], scores: [] };
    const interestCode = dataInti?.interest_code || '-';

    const sectorRecommendations = dataInti?.sector_recommendations || [];

    const pdfBuffer = await this._buildBakatPdf(email, riasecScores, interestCode, sectorRecommendations, recommendations, chartData);
    await this._sendEmail(email, pdfBuffer, 'Tes Bakat (RIASEC)');
    
    return { success: true, email };
  }

  async _buildBakatPdf(email, riasecScores, interestCode, sectorRecommendations, recommendations, chartData) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const blueColor = '#032b6a';
      const textColor = '#333333';

      const addWatermark = () => {
          const prevX = doc.x;
          const prevY = doc.y;
          doc.font('Helvetica-Bold').fontSize(8).fillColor('#cbd5e1').text(`CareerLens © ${new Date().getFullYear()}`, 50, doc.page.height - 40, { lineBreak: false });
          doc.x = prevX;
          doc.y = prevY;
      };
      doc.on('pageAdded', addWatermark);
      addWatermark();

      doc.font('Helvetica-Bold').fontSize(22).fillColor(blueColor).text('Laporan Hasil Analisis Tes Bakat');
      doc.font('Helvetica').fontSize(12).fillColor('#666666').text('CareerLens Career Path Recommendation');
      
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(2).strokeColor(blueColor).stroke();
      doc.moveDown(1.5);

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
      doc.font('Helvetica').text('Tes bakat (riasec)', col2X, row3Y);

      const row4Y = doc.y + 10;
      doc.font('Helvetica-Bold').text('Skor RIASEC', col1X, row4Y);
      
      const riasecStr = `Realistic (R) : ${riasecScores.r || 0}\nInvestigative (I) : ${riasecScores.i || 0}\nArtistic (A) : ${riasecScores.a || 0}\nSosial (S) : ${riasecScores.s || 0}\nEnterprising (E) : ${riasecScores.e || 0}\nConventional (C) : ${riasecScores.c || 0}`;
      
      doc.font('Helvetica').text(riasecStr, col2X, row4Y, { lineGap: 5 });
      
      const riasecHeight = doc.heightOfString(riasecStr, { lineGap: 5 });
      
      const row5Y = row4Y + riasecHeight + 10;
      doc.font('Helvetica-Bold').text('Interest Code', col1X, row5Y);
      doc.font('Helvetica-Bold').fillColor(blueColor).text(interestCode, col2X, row5Y);
      doc.fillColor(textColor);
      
      const tableBottom = row5Y + 15;
      doc.moveTo(50, tableTop - 10).lineTo(545, tableTop - 10).lineWidth(0.5).strokeColor('#dddddd').stroke();
      doc.moveTo(50, tableBottom).lineTo(545, tableBottom).lineWidth(0.5).strokeColor('#dddddd').stroke();
      doc.moveTo(col2X - 10, tableTop - 10).lineTo(col2X - 10, tableBottom).lineWidth(0.5).strokeColor('#dddddd').stroke();

      doc.y = tableBottom + 30;

      // CHART BAR (Analisis Kecocokan Peran)
      if (chartData && chartData.labels && chartData.labels.length > 0) {
          doc.font('Helvetica-Bold').fontSize(14).fillColor(blueColor).text('Analisis Kecocokan Peran', 50, doc.y);
          doc.moveDown(1.5);

          chartData.labels.forEach((label, idx) => {
              const score = chartData.scores[idx] || 0;
              
              if (doc.y > 700) doc.addPage();
              
              doc.font('Helvetica-Bold').fontSize(10).fillColor(blueColor).text(label, 50, doc.y, { continued: true });
              doc.font('Helvetica-Bold').fillColor('#64748b').text(`${score}%`, { align: 'right' });
              
              const barY = doc.y + 5;
              doc.roundedRect(50, barY, 495, 8, 4).fill('#f1f5f9');
              
              const progressWidth = Math.max(10, (score / 100) * 495);
              doc.roundedRect(50, barY, progressWidth, 8, 4).fill(blueColor);
              
              doc.y = barY + 25;
          });
          doc.moveDown(2);
      }

      recommendations.forEach((role, index) => {
        doc.addPage();
        const marginX = 50;
        const contentWidth = 495;

        // HEADER
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#3b82f6').text('CAREER INSIGHT REPORT', marginX, 50, { indent: 0 });
        doc.moveDown(0.5);
        
        doc.font('Helvetica-Bold').fontSize(22).fillColor('#0f172a').text(role.role_name, marginX, doc.y, { indent: 0 });
        doc.moveDown(0.3);

        if (role.match_pct) {
            doc.font('Helvetica-Bold').fontSize(12).fillColor('#64748b').text(`Match Score: ${role.match_pct}%`, marginX, doc.y, { indent: 0 });
            doc.moveDown(0.2);
        }
        
        if (role.salary_range) {
            doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text(role.salary_range, marginX, doc.y, { continued: true, indent: 0 });
            doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(' / average monthly salary', { continued: false });
        }
        
        doc.moveDown(0.8);
        doc.moveTo(marginX, doc.y).lineTo(marginX + contentWidth, doc.y).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
        doc.moveDown(1.5);

        // ROLE OVERVIEW
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#0f172a').text('Role Overview', marginX, doc.y, { indent: 0 });
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).fillColor('#475569').text(role.description || '', marginX, doc.y, { align: 'justify', width: contentWidth, lineGap: 3, indent: 0 });
        
        doc.moveDown(1.5);
        doc.font('Helvetica-Bold').fontSize(12).fillColor(textColor).text('Core Skills (Keahlian Relevan)', marginX, doc.y);
        doc.moveDown(0.5);
        
        const skillsX = 50;
        let currentY = doc.y;
        let currentX = skillsX;
        const skills = role.skill_relevant || [];
        
        skills.forEach(skill => {
            const skillWidth = doc.widthOfString(skill) + 20;
            if (currentX + skillWidth > 545) {
                currentX = skillsX;
                currentY += 25;
            }
            if (currentY > 750) {
                doc.addPage();
                currentY = 50;
                currentX = skillsX;
            }
            doc.roundedRect(currentX, currentY, skillWidth, 20, 10).fill('#f8fafc');
            doc.fillColor('#334155').font('Helvetica-Bold').fontSize(9).text(skill, currentX + 10, currentY + 6);
            currentX += skillWidth + 10;
        });
        
        doc.y = currentY + 35;
        
        // Skill Gap box, if any
        if (role.skill_gap && role.skill_gap.length > 0) {
            doc.font('Helvetica-Bold').fontSize(12).fillColor(textColor).text('Skill Gap (Keahlian yang Perlu Ditingkatkan)', 50, doc.y);
            doc.moveDown(0.5);
            
            let gapY = doc.y;
            let gapX = 50;
            
            role.skill_gap.forEach(gap => {
                const gapWidth = doc.widthOfString(gap) + 20;
                if (gapX + gapWidth > 545) {
                    gapX = 50;
                    gapY += 25;
                }
                if (gapY > 750) {
                    doc.addPage();
                    gapY = 50;
                    gapX = 50;
                }
                doc.roundedRect(gapX, gapY, gapWidth, 20, 10).fill('#fef2f2');
                doc.fillColor('#dc2626').font('Helvetica-Bold').fontSize(9).text(gap, gapX + 10, gapY + 6);
                gapX += gapWidth + 10;
            });
            doc.y = gapY + 35;
        }
        
        // SEKTOR YANG RELEVAN (Moved here, grid 2 columns)
        if (sectorRecommendations && sectorRecommendations.length > 0) {
            doc.moveDown(1);
            if (doc.y > 700) doc.addPage();
            doc.font('Helvetica-Bold').fontSize(12).fillColor(textColor).text('Sektor yang Relevan', 50, doc.y);
            doc.moveDown(0.5);
            
            let sY = doc.y;
            let colIndex = 0;
            const colWidth = 240;
            const gap = 15;
            
            sectorRecommendations.forEach((sector) => {
                const xPos = 50 + (colIndex * (colWidth + gap));
                
                if (sY > 750 && colIndex === 0) {
                    doc.addPage();
                    sY = 50;
                }
                
                doc.roundedRect(xPos, sY, colWidth, 34, 6).fill('#f8fafc').strokeColor('#e2e8f0').lineWidth(1).stroke();
                
                // Truncate if too long (optional, handled by width)
                doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a').text(sector.field_name, xPos + 10, sY + 12, { width: 170, height: 12 });
                doc.font('Helvetica-Bold').fontSize(10).fillColor(blueColor).text(`${sector.relevance_pct}%`, xPos + colWidth - 45, sY + 11);
                
                colIndex++;
                if (colIndex > 1) {
                    colIndex = 0;
                    sY += 44;
                }
            });
            if (colIndex > 0) sY += 44;
            doc.y = sY;
        }

        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
        doc.moveDown(1.5);
        
        // UPSKILLING ROADMAP
        if (role.roadmap && role.roadmap.learning_path && role.roadmap.learning_path.length > 0) {
            if (doc.y > 650) doc.addPage();

            doc.font('Helvetica-Bold').fontSize(16).fillColor('#0f172a').text('Upskilling Roadmap', 50, doc.y, { indent: 0 });
            doc.moveDown(1);
            
            const steps = {};
            role.roadmap.learning_path.forEach(lp => {
                const s = lp.step || 1;
                if (!steps[s]) steps[s] = [];
                steps[s].push(lp);
            });

            Object.keys(steps).sort().forEach(stepNum => {
                const stepCourses = steps[stepNum];
                const boxStartY = doc.y;
                let estimatedHeight = 50 + (stepCourses.length * 20);
                
                if (boxStartY + estimatedHeight > 780) {
                    doc.addPage();
                }

                const actualStartY = doc.y;
                const boxHeight = 40 + (stepCourses.length * 22);
                
                doc.roundedRect(50, actualStartY, 495, boxHeight, 6)
                   .lineWidth(1).strokeColor('#e2e8f0').stroke();

                const circleX = 50 + 25;
                const circleY = actualStartY + 25;
                doc.circle(circleX, circleY, 12).fill('#0f172a');
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#ffffff').text(stepNum, circleX - 10, circleY - 4, { width: 20, align: 'center', indent: 0 });
                
                const titleX = circleX + 25;
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text(`Step ${stepNum}: Pembelajaran Tahap ${stepNum}`, titleX, actualStartY + 20, { indent: 0 });
                
                let courseY = actualStartY + 45;
                stepCourses.forEach(course => {
                    const platform = course.platform || course.resource || 'Unknown';
                    const bulletText = `• ${course.nama_skill} (${platform})`;
                    
                    doc.font('Helvetica').fontSize(9).fillColor('#64748b').text(bulletText, titleX, courseY, { indent: 0 });
                    
                    doc.fillColor('#3b82f6').text('Link ∞', 50 + 495 - 40, courseY, {
                        link: course.link_course,
                        underline: false,
                        align: 'right',
                        width: 30,
                        indent: 0
                    });
                    
                    courseY += 20;
                });
                
                doc.y = actualStartY + boxHeight + 15;
            });
            doc.moveDown(1.5);
        }
        
        const dummyProjects = role.roadmap?.dummy_projects || [];
        if (dummyProjects.length > 0) {
            doc.moveDown(1);
            
            dummyProjects.forEach(proj => {
                let estimatedHeight = 220;
                let instructionsArray = [];
                let instructionsStr = proj.instructions || '';
                if (instructionsStr.includes(';')) {
                    instructionsArray = instructionsStr.split(';');
                } else {
                    instructionsArray = instructionsStr.split(/(?=[A-Z])/).filter(s => s.trim().length > 3);
                    if (instructionsArray.length === 0) instructionsArray = [instructionsStr];
                }
                estimatedHeight += instructionsArray.length * 20;
                
                if (doc.y + estimatedHeight > 770) {
                    doc.addPage();
                } else if (doc.y > 550) {
                    doc.addPage();
                }

                const boxStartY = doc.y;
                const boxWidth = 495;
                
                doc.roundedRect(50, boxStartY, boxWidth, estimatedHeight, 8).fill('#f1f5f9');
                
                let currentBoxY = boxStartY + 25;
                const innerX = 50 + 25;
                
                doc.roundedRect(innerX, currentBoxY, 120, 20, 10).fill('#ffffff').strokeColor('#cbd5e1').lineWidth(1).stroke();
                doc.fillColor('#64748b').font('Helvetica-Bold').fontSize(8).text('Capstone Project', innerX, currentBoxY + 6, { width: 120, align: 'center' });
                
                currentBoxY += 35;
                
                doc.font('Helvetica-Bold').fontSize(14).fillColor(blueColor).text(proj.judul || 'Project', innerX, currentBoxY);
                currentBoxY += 20;
                
                doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(proj.brief_case || '', innerX, currentBoxY, { width: boxWidth - 50, lineGap: 2 });
                const briefHeight = doc.heightOfString(proj.brief_case || '', { width: boxWidth - 50, lineGap: 2 });
                currentBoxY += briefHeight + 20;
                
                doc.font('Helvetica-Bold').fontSize(9).fillColor('#94a3b8').text('INSTRUKSI:', innerX, currentBoxY);
                currentBoxY += 15;
                
                doc.font('Helvetica').fontSize(9).fillColor('#334155');
                instructionsArray.forEach(inst => {
                    const cleanInst = inst.trim();
                    if (cleanInst) {
                        doc.circle(innerX + 3, currentBoxY + 4, 2).fill('#64748b');
                        doc.text(cleanInst, innerX + 10, currentBoxY, { width: boxWidth - 60, lineGap: 2 });
                        const itemHeight = doc.heightOfString(cleanInst, { width: boxWidth - 60, lineGap: 2 });
                        currentBoxY += itemHeight + 5;
                    }
                });
                currentBoxY += 15;
                
                doc.font('Helvetica-Bold').fontSize(9).fillColor('#64748b').text('TOOLS', innerX, currentBoxY, { indent: 0 });
                currentBoxY += 15;
                
                const toolsStr = proj.tools_used || '';
                let toolsArray = [];
                if (toolsStr.includes(',')) toolsArray = toolsStr.split(',');
                else if (toolsStr.includes(';')) toolsArray = toolsStr.split(';');
                else toolsArray = toolsStr.split(' ');

                let toolX = innerX;
                doc.font('Helvetica-Bold').fontSize(9);
                toolsArray.forEach(tool => {
                    const txt = tool.trim();
                    if (!txt) return;
                    
                    const textWidth = doc.widthOfString(txt);
                    const tagWidth = textWidth + 24;
                    
                    doc.roundedRect(toolX, currentBoxY, tagWidth, 22, 6).fill('#e2e8f0');
                    doc.fillColor('#334155').text(txt, toolX + 12, currentBoxY + 6, { indent: 0 });
                    toolX += tagWidth + 8;
                });
                
                doc.y = Math.max(currentBoxY + 50, boxStartY + estimatedHeight);
            });
        }
        
        doc.moveDown(1.5);
      });

      doc.end();
    });
  }
}

module.exports = new PdfService();
