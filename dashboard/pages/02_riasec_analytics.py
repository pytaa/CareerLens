import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

# ==================== KONFIGURASI HALAMAN ====================
st.set_page_config(page_title="RIASEC Analytics | CareerLens", layout="wide")

# ==================== CSS PREMIUM (Sama dengan Market Overview) ====================
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

:root {
    --muted: #6B7280;
    --card-bg: rgba(128,128,128,0.06);
    --card-border: rgba(128,128,128,0.15);
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
.header-section { animation: fadeUp 0.6s ease-out forwards; }
.chart-section  { animation: fadeUp 0.6s ease-out forwards; }

/* ---- HEADER BANNER ---- */
.header-banner {
    background: linear-gradient(135deg, #0F172A 0%, #312E81 50%, #581C87 100%);
    border-radius: 20px;
    padding: 36px 44px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
}
.header-banner::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(236,72,153,0.15);
}
.header-banner::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 40%;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(124,58,237,0.15);
}
.page-title {
    font-family: 'Manrope', sans-serif;
    font-size: 34px;
    font-weight: 800;
    color: white !important;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
}
.page-desc {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    color: rgba(255,255,255,0.75) !important;
    margin: 0;
    max-width: 680px;
    line-height: 1.6;
}

/* ---- CHART CARD ---- */
.chart-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 20px;
    padding: 28px 28px 4px 28px;
    margin-bottom: 8px;
}
.chart-card-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
}
.chart-icon { font-size: 26px; line-height: 1; margin-top: 2px; }
.chart-title {
    font-family: 'Manrope', sans-serif;
    font-size: 19px;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: inherit;
}
.chart-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: var(--muted);
    margin: 0;
}

.section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(128,128,128,0.2), transparent);
    border: none;
    margin: 16px 0 24px 0;
}
</style>
""", unsafe_allow_html=True)

# ==================== HEADER BANNER ====================
st.markdown("""
<div class="header-section">
    <div class="header-banner">
        <div class="page-title">🧠 RIASEC Analytics & Persona Match</div>
        <div class="page-desc">
            Analisis kecocokan minat dan tipe kepribadian kerja berdasarkan framework Holland Code (RIASEC). 
            Bandingkan profil personal Anda dengan kebutuhan kompetensi dari tiap peran industri.
        </div>
    </div>
</div>
""", unsafe_allow_html=True)


# ==================== SIDEBAR SIMULASI INPUT USER ====================
with st.sidebar:
    st.markdown("### 🎛️ Simulasi Skor RIASEC Anda")
    st.caption("Ubah slider di bawah untuk mensimulasikan hasil tes kepribadian minat:")
    
    # Input nilai RIASEC (Skala 0-100)
    r_score = st.slider("🔧 Realistic (R)", 0, 100, 45)
    i_score = st.slider("🔬 Investigative (I)", 0, 100, 85)
    a_score = st.slider("🎨 Artistic (A)", 0, 100, 75)
    s_score = st.slider("🤝 Social (S)", 0, 100, 50)
    e_score = st.slider("💼 Enterprising (E)", 0, 100, 60)
    c_score = st.slider("📁 Conventional (C)", 0, 100, 40)
    
    st.markdown("---")
    st.markdown("### 💼 Target Karir Eksplorasi")
    target_role = st.selectbox(
        "Pilih peran yang ingin dicocokkan:",
        ["Data Scientist", "Software Engineer", "UI/UX Designer", "Digital Strategist"]
    )

# Definisi Nilai Kebutuhan Role (Benchmark data)
role_benchmarks = {
    "Data Scientist": [60, 95, 50, 45, 65, 80],
    "Software Engineer": [70, 90, 55, 40, 55, 85],
    "UI/UX Designer": [40, 65, 95, 75, 60, 50],
    "Digital Strategist": [30, 60, 70, 65, 90, 60]
}

categories = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional']
user_scores = [r_score, i_score, a_score, s_score, e_score, c_score]
benchmark_scores = role_benchmarks[target_role]


# ==================== CHART 1: RADAR / SPIDER CHART ====================
st.markdown("""
<div class="chart-card">
    <div class="chart-card-header">
        <div class="chart-icon">🕸️</div>
        <div>
            <div class="chart-title">Radar Pemetaan Kecocokan Minat</div>
            <div class="chart-subtitle">Perbandingan profil RIASEC personal Anda dengan nilai standar kebutuhan profesi</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Membuat Radar Chart menggunakan plotly.graph_objects karena lebih fleksibel untuk Radar berlapis
fig_radar = go.Figure()

# Lapisan 1: Skor User
fig_radar.add_trace(go.Scatterpolar(
    r=user_scores + [user_scores[0]], # Ditutup ke titik awal agar membentuk area melingkar
    theta=categories + [categories[0]],
    fill='toself',
    name='Profil Anda',
    fillcolor='rgba(124, 58, 237, 0.25)',
    line=dict(color='#7C3AED', width=2.5)
))

# Lapisan 2: Skor Benchmark Role
fig_radar.add_trace(go.Scatterpolar(
    r=benchmark_scores + [benchmark_scores[0]],
    theta=categories + [categories[0]],
    fill='toself',
    name=f'Kebutuhan {target_role}',
    fillcolor='rgba(37, 99, 235, 0.15)',
    line=dict(color='#2563EB', width=2, dash='dash')
))

fig_radar.update_layout(
    polar=dict(
        radialaxis=dict(visible=True, range=[0, 100]),
        gridshape='circular'
    ),
    template='plotly_white',
    font_family="Inter",
    height=450,
    margin=dict(l=80, r=80, t=20, b=40),
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
    legend=dict(orientation="h", yanchor="bottom", y=-0.15, xanchor="center", x=0.5)
)

st.plotly_chart(fig_radar, use_container_width=True)

st.markdown('<hr class="section-divider">', unsafe_allow_html=True)


# ==================== CHART 2: SEBARAN ASPEK RIASEC (BAR CHART) ====================
st.markdown("""
<div class="chart-card">
    <div class="chart-card-header">
        <div class="chart-icon">📊</div>
        <div>
            <div class="chart-title">Distribusi dan Skor Dominasi RIASEC</div>
            <div class="chart-subtitle">Urutan tingkat kekuatan dimensi kepribadian kerja Anda saat ini</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

df_riasec = pd.DataFrame({
    'Dimensi RIASEC': categories,
    'Skor Personal': user_scores
}).sort_values('Skor Personal') # Diurutkan membesar agar horizontal bar rapi dari kecil ke besar

fig_bar = px.bar(
    df_riasec,
    x='Skor Personal',
    y='Dimensi RIASEC',
    orientation='h',
    color='Skor Personal',
    color_continuous_scale='RdPu', # Gradasi pink-ungu yang estetik untuk personaliti
    text_auto=True
)

fig_bar.update_layout(
    template='plotly_white',
    xaxis_title="Skor Dimensi Kepribadian (0 - 100)",
    yaxis_title="",
    font_family="Inter",
    coloraxis_showscale=False,
    margin=dict(l=120, r=20, t=10, b=10), # l=120 aman agar nama dimensi teks RIASEC ga kepotong
    height=380,
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)'
)

st.plotly_chart(fig_bar, use_container_width=True)