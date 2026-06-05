# pyrefly: ignore [missing-import]
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_loader import load_roles


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

/* ── Override selectbox focus border to blue ── */
div[data-baseweb="select"] > div {
    border-color: rgba(128,128,128,0.3) !important;
}
div[data-baseweb="select"] > div:focus-within,
div[data-baseweb="select"] > div:hover {
    border-color: #2563EB !important;
    box-shadow: 0 0 0 1px #2563EB !important;
}

.filter-box {
    background: rgba(124,58,237,0.06);
    border: 1px solid rgba(124,58,237,0.2);
    border-radius: 14px;
    padding: 16px 18px;
    margin-bottom: 12px;
}

.info-banner {
    background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.08));
    border: 1px solid rgba(124,58,237,0.25);
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 24px;
    font-family: 'Inter', sans-serif;
}
.info-role-name {
    font-family: 'Manrope', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #7C3AED;
    margin-bottom: 4px;
}
.info-role-sub {
    font-size: 13px;
    color: var(--muted);
}
</style>
"""

RIASEC_CATEGORIES = ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"]
RIASEC_COLS       = ["R", "I", "A", "S", "E", "C"]
RIASEC_COLORS     = ["#F59E0B", "#3B82F6", "#EC4899", "#10B981", "#F97316", "#8B5CF6"]


def _get_dominant_riasec(row) -> str:
    """Return the label of the highest-scoring RIASEC dimension for a role row."""
    scores = {cat: row[col] for cat, col in zip(RIASEC_CATEGORIES, RIASEC_COLS)}
    return max(scores, key=scores.get)


def render_riasec_analytics():
    st.markdown(PAGE_CSS, unsafe_allow_html=True)

    # ---- Load data ----
    df_roles = load_roles()

    # ---- SIDEBAR FILTER (role-specific) ----
    role_names = sorted(df_roles["role_name"].unique().tolist())
    with st.sidebar:
        st.markdown("""
        <div style="font-family:'Manrope',sans-serif; font-weight:700; font-size:14px;
                    color:#7C3AED; margin-bottom:6px;">
            🎛️ Filter Role
        </div>
        """, unsafe_allow_html=True)
        selected_role = st.selectbox(
            "Pilih Role untuk Radar Chart:",
            options=role_names,
            key="riasec_role_filter"
        )

    # ---- HEADER BANNER ----
    st.markdown("""
    <div class="header-section">
        <div class="header-banner">
            <div class="page-title">🧠 RIASEC Analytics & Persona Match</div>
            <div class="page-desc">
                Analisis kecocokan minat dan tipe kepribadian kerja berdasarkan framework Holland Code (RIASEC).
                Pilih sebuah role untuk melihat profil RIASEC-nya, dan eksplorasi distribusi dominasi kepribadian
                di seluruh 68 role yang tersedia.
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ==============================================================
    # CHART 1 — RADAR CHART (filtered by selected role)
    # ==============================================================
    role_row = df_roles[df_roles["role_name"] == selected_role].iloc[0]
    role_scores = [float(role_row[col]) * 100 for col in RIASEC_COLS]

    st.markdown(f"""
    <div class="chart-card">
        <div class="chart-card-header">
            <div class="chart-icon">🕸️</div>
            <div>
                <div class="chart-title">Profil RIASEC: {selected_role}</div>
                <div class="chart-subtitle">Skor dimensi kepribadian kerja untuk role yang dipilih (skala 0 – 100)</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    fig_radar = go.Figure()
    fig_radar.add_trace(go.Scatterpolar(
        r=role_scores + [role_scores[0]],
        theta=RIASEC_CATEGORIES + [RIASEC_CATEGORIES[0]],
        fill="toself",
        name=selected_role,
        fillcolor="rgba(124, 58, 237, 0.25)",
        line=dict(color="#7C3AED", width=2.5)
    ))
    fig_radar.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 100]),
            gridshape="circular"
        ),
        template="plotly_white",
        font_family="Inter",
        height=460,
        margin=dict(l=80, r=80, t=20, b=50),
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        legend=dict(orientation="h", yanchor="bottom", y=-0.18, xanchor="center", x=0.5)
    )
    st.plotly_chart(fig_radar, use_container_width=True)

    # Dominant dimension callout
    dominant = RIASEC_CATEGORIES[role_scores.index(max(role_scores))]
    dominant_score = max(role_scores)
    st.info(f"**Dimensi Dominan untuk '{selected_role}':** {dominant} ({dominant_score:.1f}/100)")

    st.markdown('<hr class="section-divider">', unsafe_allow_html=True)

    # ==============================================================
    # CHART 2 — DISTRIBUTION OF DOMINANT RIASEC PER CATEGORY (GLOBAL / STATIC)
    # ==============================================================
    st.markdown("""
    <div class="chart-card">
        <div class="chart-card-header">
            <div class="chart-icon">📊</div>
            <div>
                <div class="chart-title">Distribusi Peran Dominan per Dimensi RIASEC</div>
                <div class="chart-subtitle">
                    Jumlah role yang memiliki skor tertinggi pada tiap dimensi kepribadian (Global – semua 68 role)
                </div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Calculate dominant RIASEC dimension for every role (NOT affected by sidebar filter)
    df_all = df_roles.copy()
    df_all["dominant_riasec"] = df_all.apply(_get_dominant_riasec, axis=1)

    # Build counts then reindex to ALL 6 categories so zero-count ones still appear
    counts = df_all.groupby("dominant_riasec")["role_id"].count()
    counts = counts.reindex(RIASEC_CATEGORIES, fill_value=0)  # guarantees all 6 rows

    df_dominant_dist = (
        counts
        .reset_index()
        .rename(columns={"role_id": "Jumlah_Role", "dominant_riasec": "Dimensi RIASEC"})
    )
    # Sort ascending so longest bar is at top (horizontal chart)
    df_dominant_dist = df_dominant_dist.sort_values("Jumlah_Role", ascending=True)

    # Assign consistent color per RIASEC category
    color_map = dict(zip(RIASEC_CATEGORIES, RIASEC_COLORS))

    fig_dominant = px.bar(
        df_dominant_dist,
        x="Jumlah_Role",
        y="Dimensi RIASEC",
        orientation="h",
        color="Dimensi RIASEC",
        color_discrete_map=color_map,
        text="Jumlah_Role",     # explicit text so "0" always renders
        labels={"Dimensi RIASEC": "", "Jumlah_Role": "Jumlah Role"}
    )
    fig_dominant.update_traces(textposition="outside", cliponaxis=False)
    fig_dominant.update_layout(
        template="plotly_white",
        xaxis_title="Jumlah Role dengan Dimensi Dominan Ini",
        xaxis=dict(rangemode="tozero"),    # ensure x-axis starts at 0
        yaxis_title="",
        font_family="Inter",
        showlegend=False,
        margin=dict(l=130, r=60, t=10, b=10),
        height=380,
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
    )
    st.plotly_chart(fig_dominant, use_container_width=True)