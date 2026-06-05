"""
===============================================================================
CareerLens - Learning Resources Refinement Pipeline (ULTIMATE)
===============================================================================
Applies domain-specific blacklists, pedagogical sanity checks, step
redistribution (1,3,5 → 1,2,3,4,5), and top-3 downsampling on the
pre-mapped dataset to produce a clean, UX-ready output.

Pipeline:
  Task 1  — Merge field_id from master_roles_COMPLETE
  Task 2  — Anti-Noise Domain Blacklist
  Task 3  — Pedagogical Sanity Check (force step 1 / step 5)
  Task 4  — Step Redistribution & Downsampling
  Task 5  — Re-format & Save

Input:
  learning_resources_mapped_v2.csv
  master_roles_COMPLETE.csv

Output:
  learning_resources_ULTIMATE.csv

Author  : CareerLens Data Team
Created : 2026-04-26
===============================================================================
"""

import os
import sys
import re
import pandas as pd

# Fix Windows console encoding for emoji/unicode output
if sys.stdout.encoding != 'utf-8':
    sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
    sys.stderr = open(sys.stderr.fileno(), mode='w', encoding='utf-8', buffering=1)

# ─────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
INPUT_PATH   = os.path.join(BASE_DIR, "learning_resources_mapped_v2.csv")
MASTER_PATH  = os.path.join(BASE_DIR, "master_roles_COMPLETE.csv")
OUTPUT_PATH  = os.path.join(BASE_DIR, "learning_resources_ULTIMATE.csv")

# ── Domain Blacklists ────────────────────────────────────────
GLOBAL_BLACKLIST = [
    # HAPUS tanda hubung (-) di depan kode bahasa agar Regex bisa mendeteksinya sebagai token mandiri di URL!
    "arabic", "de", "korean", "es", "fr", "spanish", "french", "german", "portuguese", "russian", "datos", "tecnica", "exam"
    
    # Filter Niche / di luar scope IT & Design
    "bioinformatics", "biology", "healthcare", "medical", "finance", "aspectos", "básicos"
]

BLACKLISTS = {
    "F03": [  # Creative Design — drop heavy backend/data tech
        "django", "java", "backend", "sql", "database", "python",
        "machine-learning", "machine learning", "data-science", "data science",
        "c++", "aws", "cloud", "langchain", "llms"
    ],
    "F04": [  # Digital Marketing — drop deep engineering tech
        "java", "backend", "kubernetes", "docker", "c++",
        "react", "aws", "azure", "python", "sql"
    ],
    "F02": [  # Data/AI — drop pure frontend fluff
        "css", "html", "react", "ui-ux", "figma", "frontend",
    ],
    # Tambahkan F01 (Software Eng) agar tidak dapat marketing
    "F01": [
        "seo", "digital-marketing", "content-marketing", "social-media"
    ]
}

# ── Pedagogical Keyword Overrides ────────────────────────────
FORCE_STEP1_KEYWORDS = [
    "intro", "basic", "fundamental", "beginner",
    "foundation", "dasar", "pemula" # Hapus "everyone" dari sini
]
FORCE_STEP5_KEYWORDS = [
    "advanced", "expert", "master", "mahir",
    # Paksa semua course AI / LLM / Prompt Engineering ke Step 4 atau 5
    "ai-code", "generative", "langchain", "llms", "prompt-engineering", "chatgpt"
]


def print_banner(title: str):
    print(f"\n{'='*65}")
    print(f"  {title}")
    print(f"{'='*65}")


# =================================================================
# TASK 1 — Merge field_id
# =================================================================
def merge_field_id(df: pd.DataFrame, df_master: pd.DataFrame) -> pd.DataFrame:
    print_banner("TASK 1: MERGE field_id FROM MASTER ROLES")

    role_map = df_master[["role_id", "field_id"]].copy()
    role_map["role_id"] = role_map["role_id"].astype(str).str.strip()

    df["role_id"] = df["role_id"].astype(str).str.strip()
    df = df.merge(role_map, on="role_id", how="left")

    unmapped = df["field_id"].isna().sum()
    print(f"  Rows merged: {len(df):,}  |  Unmapped role_ids: {unmapped}")
    print(f"  field_id distribution:\n{df['field_id'].value_counts().to_string()}")
    return df

# =================================================================
# TASK 2 — Anti-Noise Domain Filter
# =================================================================
def _contains_any(text: str, keywords: list[str]) -> bool:
    """Return True if any keyword appears as a word/slug token in text."""
    text_lower = text.lower()
    for kw in keywords:
        # Match whole words or hyphen-delimited slug segments
        if re.search(r'(?<![a-zA-Z0-9])' + re.escape(kw) + r'(?![a-zA-Z0-9])', text_lower):
            return True
    return False


def apply_blacklist(df: pd.DataFrame) -> pd.DataFrame:
    print_banner("TASK 2: ANTI-NOISE DOMAIN FILTER (BLACKLIST)")

    before = len(df)

    # Build a combined search text per row (URL slug + skill text)
    df["_search"] = (
        df["link_course"].fillna("").astype(str).str.lower()
        + " "
        + df["nama_skill"].fillna("").astype(str).str.lower()
    )

    drop_mask = pd.Series(False, index=df.index)
    
    # ==============================================================
    # INI ADALAH KODE YANG TERLEWAT: 
    # 1. Terapkan Global Blacklist (Memanggil daftar bahasa asing)
    global_drop = df["_search"].apply(lambda txt: _contains_any(txt, GLOBAL_BLACKLIST))
    drop_mask |= global_drop
    # ==============================================================

    # 2. Terapkan Specific Domain Blacklist
    for field_id, keywords in BLACKLISTS.items():
        field_mask = df["field_id"] == field_id
        blacklisted = df[field_mask]["_search"].apply(
            lambda txt: _contains_any(txt, keywords)
        )
        drop_mask |= (field_mask & blacklisted)

    df = df[~drop_mask].reset_index(drop=True)
    df.drop(columns=["_search"], inplace=True)

    after = len(df)
    print(f"  Rows before: {before:,}  |  Rows dropped: {before - after:,}  |  Rows after: {after:,}")
    return df


# =================================================================
# TASK 3 — Pedagogical Sanity Check
# =================================================================
def apply_sanity_check(df: pd.DataFrame) -> pd.DataFrame:
    print_banner("TASK 3: PEDAGOGICAL SANITY CHECK (FORCE STEP LEVELS)")

    slug = df["link_course"].fillna("").astype(str).str.lower()

    # Force Step 1 for beginner-indicator slugs
    force1_mask = slug.apply(lambda s: _contains_any(s, FORCE_STEP1_KEYWORDS))
    # Force Step 5 for advanced-indicator slugs
    force5_mask = slug.apply(lambda s: _contains_any(s, FORCE_STEP5_KEYWORDS))

    # Step 5 overrides Step 1 if both match (e.g. "advanced-fundamentals")
    df.loc[force1_mask,  "step_number"] = 1
    df.loc[force5_mask,  "step_number"] = 5

    forced1 = force1_mask.sum()
    forced5 = force5_mask.sum()
    print(f"  Rows forced → Step 1 (beginner slug): {forced1:,}")
    print(f"  Rows forced → Step 5 (advanced slug):  {forced5:,}")
    print(f"  Step distribution after sanity check:")
    for step in sorted(df["step_number"].unique()):
        print(f"    Step {step}: {(df['step_number'] == step).sum():,}")
    return df


# =================================================================
# TASK 4 — Step Redistribution & Downsampling
# =================================================================
def redistribute_steps(df: pd.DataFrame) -> pd.DataFrame:
    """
    Within each role_id:
      Step 1 → first 50% stay Step 1, rest become Step 2
      Step 3 → unchanged
      Step 5 → first 50% become Step 4, rest stay Step 5
    """
    result_frames = []

    for role_id, grp in df.groupby("role_id", sort=False):
        # Step 1 → 1 & 2
        s1 = grp[grp["step_number"] == 1].sort_values("link_course").reset_index(drop=True)
        if len(s1) > 0:
            mid = max(1, len(s1) // 2)        # at least 1 row in step 1
            s1.loc[s1.index[:mid],  "step_number"] = 1
            s1.loc[s1.index[mid:],  "step_number"] = 2
        result_frames.append(s1)

        # Step 3 → 3
        result_frames.append(grp[grp["step_number"] == 3].copy())

        # Step 5 → 4 & 5
        s5 = grp[grp["step_number"] == 5].sort_values("link_course").reset_index(drop=True)
        if len(s5) > 0:
            mid = max(1, len(s5) // 2)
            s5.loc[s5.index[:mid],  "step_number"] = 4
            s5.loc[s5.index[mid:],  "step_number"] = 5
        result_frames.append(s5)

    return pd.concat(result_frames, ignore_index=True)


def redistribute_and_downsample(df: pd.DataFrame) -> pd.DataFrame:
    print_banner("TASK 4: STEP REDISTRIBUTION & DOWNSAMPLING")

    before = len(df)

    # Redistribute
    df = redistribute_steps(df)
    print(f"  Step distribution after redistribution:")
    for step in sorted(df["step_number"].unique()):
        print(f"    Step {step}: {(df['step_number'] == step).sum():,}")

    # Downsample: max 3 per (role_id, step_number)
    df_sampled = (
        df
        .groupby(["role_id", "step_number"], sort=False)
        .head(3)
        .reset_index(drop=True)
    )

    after = len(df_sampled)
    print(f"\n  Before downsampling: {before:,}  |  After: {after:,}  "
          f"|  Removed: {before - after:,}")
    return df_sampled


# =================================================================
# TASK 5 — Re-format & Save
# =================================================================
def reformat_and_save(df: pd.DataFrame, original_count: int):
    print_banner("TASK 5: RE-FORMATTING & OUTPUT")

    # Drop helper column
    df = df.drop(columns=["field_id"], errors="ignore")

    # Sort: natural order on role_id numeric part, then step_number
    df["_role_sort"] = df["role_id"].str.extract(r'(\d+)').astype(int)
    df = df.sort_values(["_role_sort", "step_number"]).drop(columns=["_role_sort"])
    df = df.reset_index(drop=True)

    # Re-generate resource_id
    df["resource_id"] = [f"RES{str(i+1).zfill(4)}" for i in range(len(df))]

    # Enforce column order
    final_cols = ["resource_id", "role_id", "step_number",
                  "nama_skill", "link_course", "tipe", "platform"]
    df = df[final_cols]

    # Save
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8-sig")

    final_count = len(df)
    roles_covered = df["role_id"].nunique()

    print(f"  💾 Saved to: {OUTPUT_PATH}")
    print(f"  📄 File size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")

    print(f"\n{'='*65}")
    print(f"  FINAL SUMMARY")
    print(f"{'='*65}")
    print(f"  Original rows (v2):  {original_count:,}")
    print(f"  Final rows (ULTIMATE): {final_count:,}")
    print(f"  Reduction:           {original_count - final_count:,} rows "
          f"({(1 - final_count / original_count) * 100:.1f}%)")
    print(f"  Roles covered:       {roles_covered}/68")
    print(f"  Avg courses / role:  {final_count / roles_covered:.1f}")
    print(f"{'='*65}")

    print(f"\n  📊 Final step distribution:")
    for step in sorted(df["step_number"].unique()):
        count = (df["step_number"] == step).sum()
        print(f"    Step {step}: {count:,} rows")

    print(f"\n  📊 Platform distribution:")
    for plat, cnt in df["platform"].value_counts().items():
        print(f"    {plat}: {cnt:,}")

    print(f"\n  🔍 Preview (first 15 rows):")
    print(df.head(15).to_string(index=False))

    return df


# =================================================================
# MAIN
# =================================================================
def main():
    print("\n" + "#" * 65)
    print("  CareerLens -- Learning Resources Refinement (ULTIMATE)")
    print("#" * 65)

    # Load inputs
    df        = pd.read_csv(INPUT_PATH)
    df_master = pd.read_csv(MASTER_PATH)
    original_count = len(df)
    print(f"\n  📂 Loaded mapped v2:  {len(df):,} rows")
    print(f"  📂 Loaded master:     {len(df_master)} roles")

    # Task 1
    df = merge_field_id(df, df_master)

    # Task 2
    df = apply_blacklist(df)

    # Task 3
    df = apply_sanity_check(df)

    # Task 4
    df = redistribute_and_downsample(df)

    # Task 5
    reformat_and_save(df, original_count)

    print("\n  ✅ ULTIMATE pipeline completed successfully!\n")


if __name__ == "__main__":
    main()
