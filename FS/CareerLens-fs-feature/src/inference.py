import numpy as np
import tensorflow as tf

from AI_ENGINEER.src.data_loader import DatasetLoader
from AI_ENGINEER.src.utils       import (
    get_interest_code,
    get_sector_recommendations,
    format_salary
)

# Pipeline 1 — Metode Minat Karir 

def recommend_by_interest(
    field_id : str,
    loader   : DatasetLoader,
    top_k    : int = 5
) -> list:
    """
    Pipeline 1: user pilih bidang minat karir.
    Tidak pakai Deep Learning — filter berbasis dataset.
    Return top_k=5 role tanpa skor kecocokan.

    field_id: "F01" | "F02" | "F03" | "F04"
    """
    filtered = loader.df_master[
        loader.df_master["bidang"] == field_id
    ].head(top_k)

    results = []
    for _, row in filtered.iterrows():
        roadmap    = loader.get_roadmap_by_role(row["role_id"])
        skill_list = [
            s.strip()
            for s in str(row.get("skill", "")).split(",")
            if s.strip()
        ]
        results.append({
            "role_id"       : row["role_id"],
            "role_name"     : row["nama_role"],
            "match_pct"     : None,
            "description"   : row.get("deskripsi", ""),
            "salary_range"  : format_salary(row.get("gaji", "")),
            "skill_relevant": skill_list,
            "skill_gap"     : [],
            "roadmap"       : roadmap
        })

    return results


# Pipeline 2 — Metode Skill 

def predict_by_skill(
    user_skills : list,
    loader      : DatasetLoader,
    skill_model : tf.keras.Model,
    top_k       : int = 3
) -> tuple:
    """
    Pipeline 2: pencocokan skill user dengan role.
    Menggunakan SkillModel (Deep Learning).
    Return top_k=3 role dengan skor dan skill gap.

    user_skills: list skill user, contoh ["python", "sql"]
    Return     : (results, chart_data)
    """
    role_skill_matrix = loader.get_role_skill_matrix()  # (68, 390)
    n_roles           = len(role_skill_matrix)

    # Encode skill user → (1, 390)
    user_vector = loader.encode_user_skills(user_skills)

    # Batch inference — semua role sekaligus
    user_matrix = np.repeat(user_vector, n_roles, axis=0)
    preds       = skill_model.predict(
        [user_matrix, role_skill_matrix], verbose=0
    )
    all_scores  = preds["role_score"].flatten().tolist()

    # Urutkan dan ambil top_k
    sorted_idx = np.argsort(all_scores)[::-1][:top_k]

    user_lower = [s.lower().strip() for s in user_skills]

    results = []
    for idx in sorted_idx:
        row = loader.df_master.iloc[idx]

        role_skills = [
            s.strip()
            for s in str(row.get("skill", "")).split(",")
            if s.strip()
        ]

        # Skill gap = skill role yang belum dimiliki user
        skill_gap_list = [
            s for s in role_skills
            if s.lower() not in user_lower
        ]

        roadmap = loader.get_roadmap_by_role(row["role_id"])

        results.append({
            "role_id"       : row["role_id"],
            "role_name"     : row["nama_role"],
            "match_pct"     : round(all_scores[idx], 1),
            "description"   : row.get("deskripsi", ""),
            "salary_range"  : format_salary(row.get("gaji", "")),
            "skill_relevant": role_skills,
            "skill_gap"     : skill_gap_list,
            "roadmap"       : roadmap
        })

    chart_data = {
        "labels": [r["role_name"] for r in results],
        "scores": [r["match_pct"]  for r in results]
    }

    return results, chart_data


# Pipeline 3 — Metode RIASEC 

def predict_by_riasec(
    riasec_scores : dict,
    loader        : DatasetLoader,
    riasec_model  : tf.keras.Model,
    top_k         : int = 3
) -> tuple:
    """
    Pipeline 3: pencocokan kepribadian RIASEC user dengan role.
    Menggunakan RIASECModel (Deep Learning).
    Return top_k=3 role + interest_code + sector_recs.

    riasec_scores: dict skor 0–1
                   {"r":0.8,"i":0.9,"a":0.4,"s":0.6,"e":0.5,"c":0.7}
    Return       : (results, chart_data, interest_code, sector_recs)
    """
    role_riasec_matrix = loader.get_role_riasec_matrix()  # (68, 6)
    n_roles            = len(role_riasec_matrix)

    user_vector = np.array([[
        riasec_scores.get("r", 0),
        riasec_scores.get("i", 0),
        riasec_scores.get("a", 0),
        riasec_scores.get("s", 0),
        riasec_scores.get("e", 0),
        riasec_scores.get("c", 0),
    ]], dtype=np.float32)

    # Batch inference
    user_matrix = np.repeat(user_vector, n_roles, axis=0)
    all_scores  = riasec_model.predict(
        [user_matrix, role_riasec_matrix], verbose=0
    ).flatten().tolist()

    sorted_idx = np.argsort(all_scores)[::-1][:top_k]

    results = []
    for idx in sorted_idx:
        row = loader.df_master.iloc[idx]

        skill_list = [
            s.strip()
            for s in str(row.get("skill", "")).split(",")
            if s.strip()
        ]
        roadmap = loader.get_roadmap_by_role(row["role_id"])

        results.append({
            "role_id"       : row["role_id"],
            "role_name"     : row["nama_role"],
            "match_pct"     : round(all_scores[idx], 1),
            "description"   : row.get("deskripsi", ""),
            "salary_range"  : format_salary(row.get("gaji", "")),
            "skill_relevant": skill_list,
            "skill_gap"     : [],   # RIASEC tidak ukur skill user
            "roadmap"       : roadmap
        })

    chart_data = {
        "labels": [r["role_name"] for r in results],
        "scores": [r["match_pct"]  for r in results]
    }

    interest_code = get_interest_code(riasec_scores)
    sector_recs   = get_sector_recommendations(
        riasec_scores, loader, riasec_model
    )

    return results, chart_data, interest_code, sector_recs


# Unified Router 

def predict(
    method       : str,
    payload      : dict,
    loader       : DatasetLoader,
    skill_model  : tf.keras.Model = None,
    riasec_model : tf.keras.Model = None,
) -> dict:
    """
    Router utama — dipanggil dari FastAPI Susi.
    Merutekan ke pipeline yang sesuai berdasarkan method.

    method : "interest" | "skill" | "riasec"
    payload: isi request body sesuai API contract
    """
    if method == "interest":
        field_id        = payload.get("interest_id", "F01")
        recommendations = recommend_by_interest(
            field_id, loader, top_k=5
        )
        chart_data = None
        extra      = None

    elif method == "skill":
        user_skills = payload.get("skills", [])
        if not user_skills:
            raise ValueError("Payload 'skills' tidak boleh kosong")
        recommendations, chart_data = predict_by_skill(
            user_skills, loader, skill_model, top_k=3
        )
        extra = None

    elif method == "riasec":
        riasec_scores = payload.get("riasec_scores", {})
        if not riasec_scores:
            raise ValueError(
                "Payload 'riasec_scores' tidak boleh kosong"
            )
        recommendations, chart_data, interest_code, sector_recs \
            = predict_by_riasec(
                riasec_scores, loader, riasec_model, top_k=3
            )
        extra = {
            "interest_code"         : interest_code,
            "sector_recommendations": sector_recs
        }

    else:
        raise ValueError(
            f"Method '{method}' tidak valid. "
            f"Gunakan: interest | skill | riasec"
        )

    return _format_output(method, recommendations, chart_data, extra)


def _format_output(
    method          : str,
    recommendations : list,
    chart_data      = None,
    extra           : dict = None
) -> dict:
    """
    Format response unified sesuai API contract.
    Sama untuk semua metode — Frontend cukup 1 logic handling.
    """
    response = {
        "status"      : "success",
        "method_used" : method,
        "data"        : {
            "chart_data"     : chart_data,
            "recommendations": [
                {
                    "role_id"       : r["role_id"],
                    "role_name"     : r["role_name"],
                    "match_pct"     : r["match_pct"],
                    "description"   : r["description"],
                    "salary_range"  : r["salary_range"],
                    "skill_relevant": r["skill_relevant"],
                    "skill_gap"     : r.get("skill_gap", []),
                    "roadmap"       : r["roadmap"]
                }
                for r in recommendations
            ]
        }
    }

    # Tambahan khusus metode RIASEC
    if method == "riasec" and extra:
        response["data"]["interest_code"] = extra.get(
            "interest_code"
        )
        response["data"]["sector_recommendations"] = extra.get(
            "sector_recommendations", []
        )

    return response