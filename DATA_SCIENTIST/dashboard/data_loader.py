import pandas as pd
import streamlit as st

@st.cache_data
def load_fields():
    """Tabel 1: Memuat referensi master bidang industri"""
    df = pd.read_csv("../dataset/fields.csv")
    return df

@st.cache_data
def load_roles():
    """Tabel 2: Memuat skor psikometrik RIASEC tiap peran"""
    df = pd.read_csv("../dataset/roles.csv")
    return df

@st.cache_data
def load_master_roles():
    """Tabel 3: Memuat data induk teks deskripsi, skill, dan gaji"""
    df = pd.read_csv("../dataset/master_roles.csv")
    return df

@st.cache_data
def load_learning_resources(role_id=None):
    """Tabel 4: Memuat data resource belajar"""
    df = pd.read_csv("../dataset/learning_resources.csv")
    if role_id:
        return df[df['role_id'] == role_id]
    return df

@st.cache_data
def load_career_projects(role_id=None):
    """Tabel 5 & 6: Menggabungkan berkas studi kasus proyek dengan tabel relasi"""
    df_project = pd.read_csv("../dataset/dummy_projects.csv")
    df_mapping = pd.read_csv("../dataset/project_role_mapping.csv")
    
    merged = pd.merge(df_project, df_mapping, on='project_id')
    
    if role_id:
        return merged[merged['role_id'] == role_id]
    return merged

@st.cache_data
def load_test_questions():
    """Tabel 7: Memuat bank kuesioner kuis minat bakat RIASEC"""
    df = pd.read_csv("../dataset/test_question.csv")
    return df

@st.cache_data
def load_master_feature_final():
    """Tabel 8: Memuat data matriks biner final siap pakai untuk model AI"""
    df = pd.read_csv("../dataset/master_feature_final.csv")
    return df

# Fungsi agregasi makro untuk komponen st.metric di landing page
@st.cache_data
def get_platform_stats():
    """Menghitung metrik agregasi makro untuk komponen st.metric di halaman utama"""
    df_master = pd.read_csv("../dataset/master_roles.csv")
    df_resources = pd.read_csv("../dataset/learning_resources.csv")
    
    total_roles = int(df_master['role_id'].nunique())

    # 'gaji' is stored as "Rp 9.116.248" → strip prefix and thousand-separator dots
    gaji_numeric = (
        df_master['gaji']
        .astype(str)
        .str.replace(r'[Rp\s]', '', regex=True)   # remove "Rp" and spaces
        .str.replace('.', '', regex=False)           # remove thousand-separator dots
        .pipe(pd.to_numeric, errors='coerce')
    )
    avg_salary = int(gaji_numeric.mean())
    avg_salary_format = f"Rp {avg_salary:,.0f}".replace(",", ".")
    
    total_resources = int(df_resources['resource_id'].nunique())
    
    all_skills = df_master['skill'].str.split(',').explode().str.strip()
    top_skill = all_skills.value_counts().idxmax().title()
    
    return {
        "total_roles": total_roles,
        "avg_salary": avg_salary_format,
        "total_resources": total_resources,
        "top_skill": top_skill
    }