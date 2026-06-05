import streamlit as st
import pandas as pd
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from DATA_SCIENTIST.dashboard.data_loader import load_roles, load_fields, load_master_roles, load_learning_resources


# ==================== CSS ====================
PAGE_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

:root {
    --muted: #6B7280;
    --card-bg: rgba(128,128,128,0.06);
    --card-border: rgba(128,128,128,0.15);
    --accent: #2563EB;
    --purple: #7C3AED;
    --green: #059669;
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
.header-section { animation: fadeUp 0.6s ease-out forwards; }
.content-section { animation: fadeUp 0.65s ease-out 0.1s forwards; opacity: 0; }

/* HEADER BANNER */
.header-banner {
    background: linear-gradient(135deg, #0F172A 0%, #064E3B 50%, #065F46 100%);
    border-radius: 20px;
    padding: 36px 44px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
}
.header-banner::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(16,185,129,0.18);
}
.header-banner::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 35%;
    width: 150px; height: 150px;
    border-radius: 50%;
    background: rgba(5,150,105,0.15);
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
    max-width: 700px;
    line-height: 1.6;
}

/* ROLE HEADER CARD */
.role-header {
    background: linear-gradient(135deg, rgba(5,150,105,0.1), rgba(37,99,235,0.07));
    border: 1px solid rgba(5,150,105,0.3);
    border-radius: 20px;
    padding: 28px 32px;
    margin-bottom: 24px;
}
.role-header-name {
    font-family: 'Manrope', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: var(--green);
    margin-bottom: 4px;
}
.role-header-field {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 16px;
}
.role-header-salary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(5,150,105,0.12);
    border: 1px solid rgba(5,150,105,0.25);
    border-radius: 99px;
    padding: 6px 18px;
    font-family: 'Manrope', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--green);
}

/* SECTION CARDS */
.section-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 18px;
    padding: 24px 28px;
    margin-bottom: 18px;
}
.section-card-title {
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 14px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* SKILL TAGS */
.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
}
.skill-tag {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 99px;
    background: rgba(37,99,235,0.1);
    border: 1px solid rgba(37,99,235,0.25);
    color: var(--accent);
}

/* ROADMAP STEPS */
.roadmap-step {
    display: flex;
    gap: 16px;
    margin-bottom: 14px;
    align-items: flex-start;
}
.step-badge {
    min-width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563EB, #7C3AED);
    color: white;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.step-content {
    flex: 1;
    background: rgba(37,99,235,0.04);
    border: 1px solid rgba(37,99,235,0.12);
    border-radius: 12px;
    padding: 12px 16px;
}
.step-skill {
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 4px;
}
.step-platform {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 6px;
}
.step-link {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--purple);
    text-decoration: none;
}
.step-link:hover { text-decoration: underline; }

.section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(128,128,128,0.2), transparent);
    border: none;
    margin: 4px 0 20px 0;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--muted);
    font-family: 'Inter', sans-serif;
}
.empty-icon { font-size: 48px; margin-bottom: 12px; }

/* ── Override selectbox focus border to blue ── */
div[data-baseweb="select"] > div {
    border-color: rgba(128,128,128,0.3) !important;
}
div[data-baseweb="select"] > div:focus-within,
div[data-baseweb="select"] > div:hover {
    border-color: #2563EB !important;
    box-shadow: 0 0 0 1px #2563EB !important;
}
</style>
"""


def render_career_explorer():
    st.markdown(PAGE_CSS, unsafe_allow_html=True)

    # ==================== LOAD DATA ====================
    df_roles   = load_roles()
    df_fields  = load_fields()
    df_master  = load_master_roles()
    df_lr      = load_learning_resources()

    # Merge roles + fields to get field_name alongside role info
    df_roles_enriched = df_roles.merge(df_fields, on="field_id", how="left")

    # ==================== SIDEBAR FILTER ====================
    role_names = sorted(df_roles_enriched["role_name"].unique().tolist())
    with st.sidebar:
        st.markdown("""
        <div style="font-family:'Manrope',sans-serif; font-weight:700; font-size:14px;
                    color:#059669; margin-bottom:6px;">
            🗺️ Pilih Role Karier
        </div>
        """, unsafe_allow_html=True)
        selected_role = st.selectbox(
            "Eksplorasi detail karier:",
            options=role_names,
            key="explorer_role_filter"
        )

    # ==================== HEADER BANNER ====================
    st.markdown("""
    <div class="header-section">
        <div class="header-banner">
            <div class="page-title">🗺️ Career Explorer</div>
            <div class="page-desc">
                Eksplorasi mendalam tiap peran karier — mulai dari skills yang dibutuhkan,
                estimasi gaji pasar, deskripsi pekerjaan, hingga roadmap pembelajaran bertahap
                yang siap Anda ikuti.
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ==================== FETCH SELECTED ROLE DATA ====================
    role_info = df_roles_enriched[df_roles_enriched["role_name"] == selected_role].iloc[0]
    role_id   = role_info["role_id"]
    field_nm  = role_info["field_name"]

    # From master_roles: deskripsi, skill, gaji
    master_row = df_master[df_master["role_id"] == role_id]
    if master_row.empty:
        st.error(f"Data detail untuk role **{selected_role}** tidak ditemukan di master_roles.csv.")
        return
    master_row = master_row.iloc[0]

    deskripsi   = master_row.get("deskripsi", "Deskripsi tidak tersedia.")
    skills_raw  = master_row.get("skill", "")
    gaji_raw    = str(master_row.get("gaji", ""))

    # Parse skills
    skills_list = [s.strip() for s in str(skills_raw).split(",") if s.strip()]

    # Learning resources for this role
    df_resources = df_lr[df_lr["role_id"] == role_id].copy()
    df_resources = df_resources.sort_values("step_number", ascending=True)

    # ==================== CONTENT ====================
    st.markdown("<div class='content-section'>", unsafe_allow_html=True)

    # ---- ROLE HEADER CARD ----
    st.markdown(f"""
    <div class="role-header">
        <div class="role-header-name">💼 {selected_role}</div>
        <div class="role-header-field">📂 Bidang: {field_nm}</div>
        <div class="role-header-salary">💰 Estimasi Gaji: {gaji_raw}</div>
    </div>
    """, unsafe_allow_html=True)

    # ---- TWO COLUMNS: Skills + Description ----
    col1, col2 = st.columns([1, 1.6], gap="large")

    with col1:
        skills_html = "".join([f'<span class="skill-tag">{s.title()}</span>' for s in skills_list])
        st.markdown(f"""
        <div class="section-card">
            <div class="section-card-title">🔧 Core Skills yang Dibutuhkan</div>
            <div class="skill-tags">{skills_html}</div>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown(f"""
        <div class="section-card" style="height:100%;">
            <div class="section-card-title">📋 Deskripsi Role</div>
            <p style="font-family:'Inter',sans-serif; font-size:14px; line-height:1.75;
                      color:var(--muted); margin:0;">
                {deskripsi}
            </p>
        </div>
        """, unsafe_allow_html=True)

    st.markdown('<hr class="section-divider">', unsafe_allow_html=True)

    # ---- LEARNING ROADMAP ----
    st.markdown("""
    <div class="section-card-title" style="font-family:'Manrope',sans-serif; font-size:19px;
          font-weight:700; margin-bottom:18px;">
        🎓 Step-by-Step Learning Roadmap
    </div>
    """, unsafe_allow_html=True)

    if df_resources.empty:
        st.markdown("""
        <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p>Belum ada learning resource yang tersedia untuk role ini.</p>
        </div>
        """, unsafe_allow_html=True)
    else:
        # Group resources by step_number
        steps = df_resources["step_number"].unique()
        for step in sorted(steps):
            step_df = df_resources[df_resources["step_number"] == step]
            for _, res_row in step_df.iterrows():
                skill_label  = str(res_row.get("nama_skill", "Resource")).strip()
                platform     = str(res_row.get("platform", "")).strip()
                course_type  = str(res_row.get("tipe", "")).strip()
                link         = str(res_row.get("link_course", "#")).strip()

                platform_icon = {
                    "Coursera": "🎓",
                    "Udemy": "🟣",
                    "edX": "🔵",
                    "Dicoding": "🟡"
                }.get(platform, "📚")

                st.markdown(f"""
                <div class="roadmap-step">
                    <div class="step-badge">{step}</div>
                    <div class="step-content">
                        <div class="step-skill">{skill_label}</div>
                        <div class="step-platform">{platform_icon} {platform} · {course_type}</div>
                        <a class="step-link" href="{link}" target="_blank">
                            🔗 Akses Course →
                        </a>
                    </div>
                </div>
                """, unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)
