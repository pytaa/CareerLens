import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import sys
import os

# Ensure the parent directory (dashboard/) is on the path so data_loader is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_loader import load_roles, load_fields, load_master_roles, load_learning_resources, load_master_feature_final


# ==================== CSS ====================
PAGE_CSS = """
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
"""


def render_market_overview():
    st.markdown(PAGE_CSS, unsafe_allow_html=True)

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
                <span class="badge">🔧 Top 15 Skills</span>
                <span class="badge">💰 Distribusi Gaji</span>
                <span class="badge">📚 Platform Belajar</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ==================== LOAD DATA ====================
    df_roles   = load_roles()
    df_fields  = load_fields()
    df_master  = load_master_roles()
    df_lr      = load_learning_resources()
    df_feat    = load_master_feature_final()

    # ==================== CHART 1: JOB DISTRIBUTION BY FIELD ====================
    st.markdown("""
    <div class="chart-card">
        <div class="chart-card-header">
            <div class="chart-icon">🏢</div>
            <div>
                <div class="chart-title">Distribusi Pekerjaan per Bidang</div>
                <div class="chart-subtitle">Total role berdasarkan 4 bidang industri utama (sumber: roles.csv × fields.csv)</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # JOIN roles + fields, count roles per field
    df_job_dist = (
        df_roles
        .merge(df_fields, on="field_id", how="left")
        .groupby("field_name", as_index=False)
        .agg(Jumlah_Role=("role_id", "count"))
        .sort_values("Jumlah_Role", ascending=True)
    )

    fig_bidang = px.bar(
        df_job_dist,
        x="Jumlah_Role",
        y="field_name",
        orientation="h",
        color="Jumlah_Role",
        color_continuous_scale="Blues",
        text_auto=True,
        labels={"field_name": "", "Jumlah_Role": "Jumlah Role (Pekerjaan)"}
    )
    fig_bidang.update_layout(
        template="plotly_white",
        xaxis_title="Jumlah Role (Pekerjaan)",
        yaxis_title="",
        font_family="Inter",
        coloraxis_showscale=False,
        margin=dict(l=310, r=20, t=10, b=10),
        height=360,
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
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
                <div class="chart-subtitle">Frekuensi kemunculan skill di seluruh pekerjaan (sumber: master_feature_final.csv)</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Explode comma-separated skills, count occurrences
    skills_series = (
        df_feat["skill"]
        .dropna()
        .str.split(",")
        .explode()
        .str.strip()
        .str.title()
    )
    df_skills = (
        skills_series
        .value_counts()
        .head(15)
        .reset_index()
        .rename(columns={"index": "Skill", "count": "Frekuensi", "skill": "Frekuensi"})
    )
    # pandas value_counts returns (value, count) → rename properly
    df_skills.columns = ["Skill", "Frekuensi"]
    df_skills = df_skills.sort_values("Frekuensi", ascending=True)

    fig_skills = px.bar(
        df_skills,
        x="Frekuensi",
        y="Skill",
        orientation="h",
        color="Frekuensi",
        color_continuous_scale="Purples",
        text_auto=True,
        labels={"Skill": "", "Frekuensi": "Frekuensi Kemunculan"}
    )
    fig_skills.update_layout(
        template="plotly_white",
        xaxis_title="Frekuensi Kemunculan di Seluruh Role",
        yaxis_title="",
        font_family="Inter",
        coloraxis_showscale=False,
        margin=dict(l=140, r=20, t=10, b=10),
        height=520,
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
    )
    st.plotly_chart(fig_skills, use_container_width=True)

    st.markdown('<hr class="section-divider">', unsafe_allow_html=True)

    # ==================== CHART 3: SALARY DISTRIBUTION BY FIELD ====================
    st.markdown("""
    <div class="chart-card">
        <div class="chart-card-header">
            <div class="chart-icon">💰</div>
            <div>
                <div class="chart-title">Rentang Distribusi Gaji per Bidang</div>
                <div class="chart-subtitle">Sebaran nilai gaji (IDR) per bidang industri (sumber: master_roles.csv × fields.csv)</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # master_roles has 'gaji' stored as "Rp 9.116.248" → parse to numeric
    df_salary = df_master.merge(df_fields, on="field_id", how="left").copy()
    df_salary["gaji_numeric"] = (
        df_salary["gaji"]
        .astype(str)
        .str.replace(r"[Rp\s\.]", "", regex=True)
        .str.replace(",", ".", regex=False)
        .pipe(pd.to_numeric, errors="coerce")
    )
    df_salary = df_salary.dropna(subset=["gaji_numeric"])

    fig_gaji = px.box(
        df_salary,
        x="gaji_numeric",
        y="field_name",
        color="field_name",
        points="all",
        color_discrete_sequence=["#2563EB", "#7C3AED", "#059669", "#D97706"],
        labels={"gaji_numeric": "Rentang Gaji Bulanan (IDR)", "field_name": ""}
    )
    fig_gaji.update_layout(
        template="plotly_white",
        xaxis_title="Rentang Standar Gaji Bulanan (IDR)",
        yaxis_title="",
        showlegend=False,
        font_family="Inter",
        margin=dict(l=310, r=20, t=10, b=10),
        height=400,
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
    )
    fig_gaji.update_xaxes(tickformat=",.0f")
    st.plotly_chart(fig_gaji, use_container_width=True)

    st.markdown('<hr class="section-divider">', unsafe_allow_html=True)

    # ==================== CHART 4: LEARNING PLATFORM DISTRIBUTION ====================
    total_resources = df_lr["resource_id"].nunique()
    st.markdown(f"""
    <div class="chart-card">
        <div class="chart-card-header">
            <div class="chart-icon">📚</div>
            <div>
                <div class="chart-title">Distribusi Platform Pembelajaran</div>
                <div class="chart-subtitle">Total resource belajar per platform (total: {total_resources:,})</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    df_platform = (
        df_lr
        .groupby("platform", as_index=False)
        .agg(Total=("resource_id", "count"))
        .sort_values("Total", ascending=True)
    )

    fig_platform = px.bar(
        df_platform,
        x="Total",
        y="platform",
        orientation="h",
        color="Total",
        color_continuous_scale="Tealgrn",
        text_auto=True,
        labels={"platform": "", "Total": "Total Resource"}
    )
    fig_platform.update_layout(
        template="plotly_white",
        xaxis_title="Total Resource per Platform",
        yaxis_title="",
        font_family="Inter",
        coloraxis_showscale=False,
        margin=dict(l=100, r=20, t=10, b=10),
        height=320,
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
    )
    st.plotly_chart(fig_platform, use_container_width=True)