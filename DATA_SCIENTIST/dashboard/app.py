# pyrefly: ignore [missing-import]

import sys
import os

# Daftarkan root folder (CareerLens) ke dalam sistem Python secara dinamis
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
    
import streamlit as st
from data_loader import get_platform_stats

st.set_page_config(
    page_title="CareerLens",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==================== GLOBAL CSS ====================
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

:root {
    --card-bg: rgba(128, 128, 128, 0.07);
    --card-border: rgba(128, 128, 128, 0.18);
    --card-hover-border: #60A5FA;
    --text-muted: #6B7280;
    --accent: #2563EB;
}

@keyframes fadeSlideUp {
    0%   { opacity: 0; transform: translateY(28px); }
    100% { opacity: 1; transform: translateY(0); }
}

.hero-section     { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.stats-section    { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
.features-section { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
.workflow-section { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards; opacity: 0; }

.hero {
    padding: 48px 52px;
    border-radius: 24px;
    backdrop-filter: blur(12px);
    background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #7C3AED 100%);
    box-shadow: 0 14px 40px rgba(37, 99, 235, 0.28);
    margin-bottom: 32px;
    font-family: 'Inter', sans-serif;
}
.hero-title {
    font-family: 'Manrope', sans-serif;
    font-size: 52px;
    font-weight: 900;
    color: white !important;
    margin: 0 0 6px 0;
    line-height: 1.1;
    letter-spacing: -1px;
}
.hero-subtitle {
    font-size: 20px;
    font-weight: 500;
    color: rgba(255,255,255,0.92) !important;
    margin-bottom: 18px;
}
.hero-desc {
    font-size: 15.5px;
    line-height: 1.75;
    max-width: 820px;
    color: rgba(255,255,255,0.85) !important;
}

.section-title {
    font-family: 'Manrope', sans-serif;
    font-size: 24px;
    font-weight: 800;
    margin-top: 20px;
    margin-bottom: 18px;
    color: inherit;
    letter-spacing: -0.5px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 12px;
}
.stats-card {
    padding: 24px 22px;
    border-radius: 18px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    box-shadow: 0 4px 14px rgba(0,0,0,0.05);
    font-family: 'Inter', sans-serif;
}
.stats-label { font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.7px; }
.stats-value { font-family: 'Manrope', sans-serif; font-size: 34px; font-weight: 800; margin-top: 6px; color: var(--accent); }

.feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;
}
.feature-card {
    padding: 30px 28px;
    border-radius: 22px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    min-height: 250px;
    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1), border-color 0.28s ease, box-shadow 0.28s ease;
    font-family: 'Inter', sans-serif;
}
.feature-card:hover {
    transform: translateY(-6px);
    border-color: var(--card-hover-border);
    box-shadow: 0 16px 36px rgba(59,130,246,0.18);
}
.feature-card .icon { font-size: 32px; margin-bottom: 14px; display: block; }
.feature-card h3 { font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 700; margin: 0 0 12px 0; color: inherit; }
.feature-card p { font-size: 14px; line-height: 1.6; margin: 0; color: var(--text-muted); }
.feature-card ul { margin: 8px 0 0 0; padding-left: 16px; font-size: 13px; color: var(--text-muted); line-height: 1.5; }

.flow-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 10px;
}
.flow-box {
    padding: 20px;
    border-radius: 16px;
    background: rgba(59, 130, 246, 0.04);
    border: 1px dashed rgba(59, 130, 246, 0.25);
    font-family: 'Inter', sans-serif;
}
.flow-step { font-size: 11px; font-weight: 800; color: var(--accent); text-transform: uppercase; margin-bottom: 4px; }
.flow-text { font-size: 14px; font-weight: 600; color: inherit; }

@media (max-width: 900px) {
    .stats-grid, .feature-grid, .flow-grid { grid-template-columns: repeat(2, 1fr); }
    .hero-title { font-size: 38px; }
}
@media (max-width: 600px) {
    .stats-grid, .feature-grid, .flow-grid { grid-template-columns: 1fr; }
    .hero { padding: 28px 22px; }
    .hero-title { font-size: 30px; }
}
</style>
""", unsafe_allow_html=True)


# ==================== SIDEBAR: LOGO + NAVIGATION ====================
with st.sidebar:
    # Display logo image
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.image("assets/careerlens_logo.png", use_container_width=True)
    
    st.markdown("""
    <div style="text-align:center; padding: 8px 0;">
        <div style="font-size:11px; color:#6B7280; font-family:'Inter',sans-serif;">
            Platform Analisis Karier & Market Insight
        </div>
    </div>
    <hr style="border:none; border-top:1px solid rgba(128,128,128,0.2); margin:12px 0 16px 0;">
    """, unsafe_allow_html=True)

    selected_page = st.selectbox(
        "🧭 Navigasi Menu",
        options=["Overview", "Market Insights", "RIASEC Analysis", "Career Explorer"],
        key="navigation"
    )

    st.markdown("---")
    st.caption("Developed by CareerLens Team · 2024")


# ==================== PAGE ROUTING ====================
if selected_page == "Overview":
    # ---- LOAD DYNAMIC METRICS ----
    stats = get_platform_stats()

    # ---- SECTION 1: HERO ----
    st.markdown(f"""
    <div class="hero-section">
        <div class="hero">
            <div class="hero-title">🔎 CareerLens</div>
            <div class="hero-subtitle">Platform Analisis Karier & Market Insight</div>
            <div class="hero-desc">
                Dashboard interaktif untuk membantu pengguna memahami peluang karier,
                menganalisis kecocokan minat berbasis <strong>RIASEC</strong>, membaca insight pasar kerja,
                dan menemukan jalur pembelajaran yang relevan.
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ---- SECTION 2: METRIC CARDS (DYNAMIC) ----
    st.markdown(f"""
    <div class="stats-section">
        <div class="section-title">📊 Sekilas Platform</div>
        <div class="stats-grid">
            <div class="stats-card">
                <div class="stats-label">Total Roles</div>
                <div class="stats-value">{stats['total_roles']}</div>
            </div>
            <div class="stats-card">
                <div class="stats-label">Most Demanded Skill</div>
                <div class="stats-value" style="font-size:22px; padding-top:6px;">{stats['top_skill']}</div>
            </div>
            <div class="stats-card">
                <div class="stats-label">Average Market Salary</div>
                <div class="stats-value" style="font-size:20px; padding-top:6px;">{stats['avg_salary']}</div>
            </div>
            <div class="stats-card">
                <div class="stats-label">Total Learning Resources</div>
                <div class="stats-value">{stats['total_resources']}</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.divider()

    # ---- SECTION 3: FEATURE CARDS ----
    st.markdown("""
    <div class="features-section">
        <div class="section-title">🚀 Fitur & Komponen Analisis</div>
        <div class="feature-grid">
            <div class="feature-card">
                <span class="icon">📈</span>
                <h3>01. Market Insights</h3>
                <p>Analisis makro industri lowongan kerja saat ini yang memuat:</p>
                <ul>
                    <li>Distribusi Pekerjaan per Bidang (Bar Chart)</li>
                    <li>Top 15 Keterampilan Paling Dicari (Horizontal Bar)</li>
                    <li>Sebaran Gaji Industri (Box Plot)</li>
                    <li>Popularitas Platform Pembelajaran (Bar Chart)</li>
                </ul>
            </div>
            <div class="feature-card">
                <span class="icon">🧠</span>
                <h3>02. RIASEC Analysis</h3>
                <p>Pemetaan minat kepribadian kerja berdasarkan framework RIASEC:</p>
                <ul>
                    <li>Radar/Spider Chart profil RIASEC per role pilihan</li>
                    <li>Bar Chart distribusi peran dominan tiap dimensi kepribadian</li>
                </ul>
            </div>
            <div class="feature-card">
                <span class="icon">🗺️</span>
                <h3>03. Career Explorer</h3>
                <p>Navigasi mikro untuk pengembangan keahlian personal:</p>
                <ul>
                    <li>Eksplorasi prasyarat detail per peran karier</li>
                    <li>Penyusunan kurikulum dan peta jalan pembelajaran (Roadmap)</li>
                    <li>Kurasi sumber daya pendidikan (Resources)</li>
                </ul>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.divider()

    # ---- SECTION 4: WORKFLOW ----
    st.markdown("""
    <div class="workflow-section">
        <div class="section-title">🛠️ Alur Eksplorasi</div>
        <div class="flow-grid">
            <div class="flow-box">
                <div class="flow-step">Langkah 01</div>
                <div class="flow-text">Pahami peta kekuatan industri saat ini di halaman Market Insights.</div>
            </div>
            <div class="flow-box">
                <div class="flow-step">Langkah 02</div>
                <div class="flow-text">Identifikasi karakter dan kecocokan minat profesi Anda lewat RIASEC Analysis.</div>
            </div>
            <div class="flow-box">
                <div class="flow-step">Langkah 03</div>
                <div class="flow-text">Ambil keputusan dan susun kurikulum belajar Anda di Career Explorer.</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)


elif selected_page == "Market Insights":
    from DATA_SCIENTIST.dashboard.modules.market_overview import render_market_overview
    render_market_overview()

elif selected_page == "RIASEC Analysis":
    from DATA_SCIENTIST.dashboard.modules.riasec_analytics import render_riasec_analytics
    render_riasec_analytics()

elif selected_page == "Career Explorer":
    from DATA_SCIENTIST.dashboard.modules.career_explorer import render_career_explorer
    render_career_explorer()