import streamlit as st
import plotly.express as px
import pandas as pd
import numpy as np

# ==================== KONFIGURASI HALAMAN ====================
st.set_page_config(page_title="Market Overview | CareerLens", layout="wide")

# ==================== CSS ====================
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
    background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #312E81 100%);
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
    background: rgba(124,58,237,0.18);
}
.header-banner::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 30%;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(37,99,235,0.15);
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
.badge-row {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    flex-wrap: wrap;
}
.badge {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 99px;
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.9) !important;
    border: 1px solid rgba(255,255,255,0.2);
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
        <div class="page-title">📈 Market Overview & Insights</div>
        <div class="page-desc">
            Analisis makro tren industri, kebutuhan keterampilan, sebaran gaji,
            dan ekosistem platform pembelajaran di pasar kerja digital Indonesia.
        </div>
        <div class="badge-row">
            <span class="badge">🗂️ 4 Bidang Industri</span>
            <span class="badge">🔧 15 Top Skills</span>
            <span class="badge">💰 Distribusi Gaji</span>
            <span class="badge">📚 4 Platform Belajar</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)


# ==================== DATA MOCKUP ====================
bidang_list = [
    'Teknologi Informasi (IT) & Software Development',
    'Data Science & Artificial Intelligence',
    'Desain Kreatif & UI/UX',
    'Digital Marketing & Analytics'
]

np.random.seed(42)
data_mockup = {
    'bidang_pekerjaan': (
        [bidang_list[0]] * 350 +
        [bidang_list[1]] * 280 +
        [bidang_list[2]] * 150 +
        [bidang_list[3]] * 190
    ),
    'gaji': (
        list(np.random.normal(10500000, 2500000, 350)) +
        list(np.random.normal(12000000, 3000000, 280)) +
        list(np.random.normal(7500000,  1500000, 150)) +
        list(np.random.normal(8000000,  1800000, 190))
    )
}
df_mock = pd.DataFrame(data_mockup)
df_mock = df_mock[df_mock['gaji'] > 0]

df_skills_mock = pd.DataFrame({
    'Skill': [
        'Python', 'SQL', 'Figma', 'Java', 'Excel',
        'Google Analytics', 'Tableau', 'AWS', 'Power BI', 'CSS',
        'TensorFlow', 'Git', 'A/B Testing', 'Data Modeling', 'Hadoop'
    ],
    'Frekuensi': [32, 20, 8, 8, 8, 7, 7, 7, 6, 6, 6, 6, 6, 5, 5]
})

df_platform_mock = pd.DataFrame({
    'Platform': ['Coursera', 'Udemy', 'Dicoding', 'edX'],
    'Total': [886, 70, 15, 7]
})


# ==================== CHART 1: DISTRIBUSI PEKERJAAN ====================
st.markdown("""
<div class="chart-card">
    <div class="chart-card-header">
        <div class="chart-icon">🏢</div>
        <div>
            <div class="chart-title">Distribusi Pekerjaan per Bidang</div>
            <div class="chart-subtitle">Total lowongan berdasarkan 4 bidang industri utama</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

df_bidang = df_mock['bidang_pekerjaan'].value_counts().reset_index()
df_bidang.columns = ['Bidang Pekerjaan', 'Jumlah Lowongan']

fig_bidang = px.bar(
    df_bidang,
    x='Jumlah Lowongan',
    y='Bidang Pekerjaan',
    orientation='h',
    color='Jumlah Lowongan',
    color_continuous_scale='Blues',
    text_auto=True
)
fig_bidang.update_layout(
    template='plotly_white',
    xaxis_title="Jumlah Role (Pekerjaan)", # Dihapus agar tidak duplikat dengan sub-title HTML kalian
    yaxis_title="",
    yaxis={'categoryorder': 'total ascending'},
    font_family="Inter",
    coloraxis_showscale=False,
    margin=dict(l=280, r=20, t=10, b=10), # l=280 Mengamankan nama teks bidang agar tidak terpotong kiri
    height=360,
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
)
st.plotly_chart(fig_bidang, use_container_width=True)

st.markdown('<hr class="section-divider">', unsafe_allow_html=True)


# ==================== CHART 2: TOP 15 SKILLS ====================
st.markdown("""
<div class="chart-card">
    <div class="chart-card-header">
        <div class="chart-icon">🎯</div>
        <div>
            <div class="chart-title">Top 15 Keterampilan Paling Dicari</div>
            <div class="chart-subtitle">Frekuensi kemunculan skill di seluruh pekerjaan (All Role)</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

fig_skills = px.bar(
    df_skills_mock.sort_values('Frekuensi'),
    x='Frekuensi',
    y='Skill',
    orientation='h',
    color='Frekuensi',
    color_continuous_scale='Purples',
    text_auto=True
)
fig_skills.update_layout(
    template='plotly_white',
    xaxis_title="Frekuensi Kemunculan di Seluruh Role", # Dihapus agar minimalis
    yaxis_title="",
    font_family="Inter",
    coloraxis_showscale=False,
    margin=dict(l=100, r=20, t=10, b=10), # l=100 disesuaikan ukuran teks nama skill
    height=520,
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
)
st.plotly_chart(fig_skills, use_container_width=True)

st.markdown('<hr class="section-divider">', unsafe_allow_html=True)


# ==================== CHART 3: DISTRIBUSI GAJI ====================
st.markdown("""
<div class="chart-card">
    <div class="chart-card-header">
        <div class="chart-icon">💰</div>
        <div>
            <div class="chart-title">Rentang Distribusi Gaji per Bidang</div>
            <div class="chart-subtitle">Sebaran nilai gaji (IDR) berdasarkan bidang industri, termasuk outlier</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

fig_gaji = px.box(
    df_mock,
    x='gaji',
    y='bidang_pekerjaan',
    color='bidang_pekerjaan',
    points="outliers",
    color_discrete_sequence=['#2563EB', '#7C3AED', '#059669', '#D97706']
)
fig_gaji.update_layout(
    template='plotly_white',
    xaxis_title="Rentang Standar Gaji Bulanan (IDR)", # Dihapus agar rapi
    yaxis_title="",
    showlegend=False,
    font_family="Inter",
    margin=dict(l=280, r=20, t=10, b=10), # l=280 agar nama bidang di box plot tidak terpotong
    height=400,
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
)
st.plotly_chart(fig_gaji, use_container_width=True)

st.markdown('<hr class="section-divider">', unsafe_allow_html=True)


# ==================== CHART 4: PLATFORM PEMBELAJARAN ====================
st.markdown("""
<div class="chart-card">
    <div class="chart-card-header">
        <div class="chart-icon">📚</div>
        <div>
            <div class="chart-title">Distribusi Platform Pembelajaran</div>
            <div class="chart-subtitle">Total resource belajar per platform (total: 978)</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

fig_platform = px.bar(
    df_platform_mock,
    x='Total',
    y='Platform',
    orientation='h',
    color='Total',
    color_continuous_scale='Tealgrn',
    text_auto=True
)
fig_platform.update_layout(
    template='plotly_white',
    xaxis_title="Total Tiap Platform", # Dihapus agar bersih
    yaxis_title="",
    yaxis={'categoryorder': 'total ascending'},
    font_family="Inter",
    coloraxis_showscale=False,
    margin=dict(l=100, r=20, t=10, b=10), # l=100 disesuaikan untuk nama platform
    height=320,
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
)
st.plotly_chart(fig_platform, use_container_width=True)