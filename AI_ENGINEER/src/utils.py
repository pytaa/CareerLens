import numpy as np

FIELD_NAMES = {
    "F01": "Teknologi Informasi & Software Development",
    "F02": "Data Science & Artificial Intelligence",
    "F03": "Desain Kreatif & UI/UX",
    "F04": "Digital Marketing & Analytics"
}


def normalize_riasec(raw_answers: list) -> dict:
    """
    Normalisasi jawaban tes RIASEC dari raw score ke 0–1.

    raw_answers : list 30 jawaban skala 1–5
                  urutan: 5 R, 5 I, 5 A, 5 S, 5 E, 5 C
    return      : dict {"r": 0.8, "i": 0.9, ...}

    Rumus: skor = (jumlah_5_jawaban - 5) / 20
    Min raw = 5  (semua jawab 1) → 0.0
    Max raw = 25 (semua jawab 5) → 1.0
    """
    if len(raw_answers) != 30:
        raise ValueError(
            f"Jumlah jawaban harus 30, diterima: {len(raw_answers)}"
        )

    categories = ["r", "i", "a", "s", "e", "c"]
    scores     = {}

    for idx, cat in enumerate(categories):
        start       = idx * 5
        end         = start + 5
        raw         = sum(raw_answers[start:end])
        scores[cat] = round((raw - 5) / 20, 4)

    return scores


def get_interest_code(riasec_scores: dict) -> str:
    """
    Ambil 3 huruf RIASEC dengan skor tertinggi
    sebagai Interest Code user.

    Contoh:
      Input : {"r":0.8,"i":0.9,"a":0.4,"s":0.6,"e":0.5,"c":0.7}
      Output: "I R C"
    """
    sorted_riasec = sorted(
        riasec_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )
    top3 = [k.upper() for k, _ in sorted_riasec[:3]]
    return " ".join(top3)


def get_sector_recommendations(
    riasec_scores : dict,
    loader,               # DatasetLoader
    riasec_model          # tf.keras.Model
) -> list:
    """
    Hitung persentase relevansi tiap sektor industri
    berdasarkan rata-rata skor cosine similarity
    role per bidang.

    Ditampilkan sebagai "Rekomendasi Sektor Industri
    yang Relevan" di halaman hasil tes RIASEC.

    Return: list dict diurutkan dari skor tertinggi
    [
      {"field_id": "F02",
       "field_name": "Data Science & AI",
       "relevance_pct": 91.0},
      ...
    ]
    """
    role_riasec_matrix = loader.get_role_riasec_matrix()
    n_roles            = len(role_riasec_matrix)

    # Vektor RIASEC user
    user_vector = np.array([[
        riasec_scores.get("r", 0),
        riasec_scores.get("i", 0),
        riasec_scores.get("a", 0),
        riasec_scores.get("s", 0),
        riasec_scores.get("e", 0),
        riasec_scores.get("c", 0),
    ]], dtype=np.float32)

    # Batch predict semua role sekaligus
    user_matrix = np.repeat(user_vector, n_roles, axis=0)
    all_scores  = riasec_model.predict(
        [user_matrix, role_riasec_matrix], verbose=0
    ).flatten().tolist()

    # Kelompokkan skor per bidang
    sector_scores = {fid: [] for fid in FIELD_NAMES}
    for idx, row in loader.df_master.iterrows():
        fid = row["bidang"]
        if fid in sector_scores and idx < len(all_scores):
            sector_scores[fid].append(all_scores[idx])

    # Hitung rata-rata per sektor
    result = []
    for fid, scores in sector_scores.items():
        if scores:
            result.append({
                "field_id"      : fid,
                "field_name"    : FIELD_NAMES[fid],
                "relevance_pct" : round(
                    sum(scores) / len(scores), 1
                )
            })

    return sorted(
        result, key=lambda x: x["relevance_pct"], reverse=True
    )


def format_salary(gaji_raw) -> str:
    """
    Format gaji dari integer ke string yang readable.
    Contoh: 9116248 → "Rp 9.116.248"
    """
    try:
        return f"Rp {int(gaji_raw):,}".replace(",", ".")
    except (ValueError, TypeError):
        return str(gaji_raw)