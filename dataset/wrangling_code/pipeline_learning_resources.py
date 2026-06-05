"""
===============================================================================
CareerLens - Learning Resources Mapping Pipeline (v2)
===============================================================================
Merges 6 raw course datasets across 4 groups:
  Group A: coursera_all.csv, Creative_Design__detailed.csv,
           digital_marketing_detailed.csv   (identical Coursera schema)
  Group B: udemy_courses_dataset.csv         (Udemy)
  Group C: edx_marketing_resources.csv       (edX)
  Group D: dicoding_learning_resources.csv   (Dicoding)

Strictly filters against master role skills, performs many-to-many
role mapping, assigns step_number (1/3/5), and exports clean CSV.

Author  : CareerLens Data Team
Created : 2026-04-26
Updated : 2026-04-26  (v2 — expanded to 6 datasets)
===============================================================================
"""

import os
import re
import sys
import pandas as pd
import numpy as np
from collections import defaultdict

# Fix Windows console encoding for emoji/unicode output
if sys.stdout.encoding != 'utf-8':
    sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
    sys.stderr = open(sys.stderr.fileno(), mode='w', encoding='utf-8', buffering=1)

# ─────────────────────────────────────────────────────────────
# CONFIG — Paths
# ─────────────────────────────────────────────────────────────
BASE_DIR       = os.path.dirname(os.path.abspath(__file__))        # .../wrangling_code/
DATASET_DIR    = os.path.dirname(BASE_DIR)                         # .../dataset/

# Arahkan ke folder tempat 6 file CSV kursus mentah berada
RAW_DIR        = os.path.join(DATASET_DIR, "learning_resources")   # .../dataset/learning_resources/

# Arahkan ke file master_roles_COMPLETE.csv
# Jika file masternya ada di dalam folder 'wrangling_code', gunakan ini:
MASTER_PATH    = os.path.join(BASE_DIR, "master_roles_COMPLETE.csv")

# TAPI, Jika file masternya ada di luar (di dalam folder 'dataset'), gunakan yang ini:
# MASTER_PATH    = os.path.join(DATASET_DIR, "master_roles_COMPLETE.csv")

OUTPUT_DIR     = BASE_DIR                                           
OUTPUT_PATH    = os.path.join(OUTPUT_DIR, "learning_resources_mapped_v2.csv")

# ─────────────────────────────────────────────────────────────
# Raw dataset filenames
# ─────────────────────────────────────────────────────────────
# Group A — Coursera-schema datasets (identical columns)
COURSERA_FILE       = os.path.join(RAW_DIR, "coursera_all.csv")
CREATIVE_FILE       = os.path.join(RAW_DIR, "Creative_Design__detailed.csv")
DIGITAL_MKT_FILE    = os.path.join(RAW_DIR, "digital_marketing_detailed.csv")

# Group B — Udemy
UDEMY_FILE           = os.path.join(RAW_DIR, "udemy_courses_dataset.csv")

# Group C — edX
EDX_FILE             = os.path.join(RAW_DIR, "edx_marketing_resources.csv")

# Group D — Dicoding
DICODING_FILE        = os.path.join(RAW_DIR, "dicoding_learning_resources.csv")


def print_banner(step_num: int, title: str):
    """Print a formatted step banner."""
    print(f"\n{'='*65}")
    print(f"  STEP {step_num}: {title}")
    print(f"{'='*65}")


# =================================================================
# STEP 1: HARMONIZATION & CONCATENATION
# =================================================================
def _load_coursera_schema(filepath: str, label: str) -> pd.DataFrame:
    """
    Generic loader for any CSV following the Coursera schema:
        course_title, course_url, course_skills, course_difficulty, (course_tools)
    Determines platform from URL; defaults to 'Coursera'.
    """
    df = pd.read_csv(filepath)
    df = df.rename(columns={
        "course_title":      "judul_course",
        "course_url":        "link_course",
        "course_skills":     "skill_yang_diajarkan",
        "course_difficulty": "tingkat_kesulitan",
    })

    # Detect platform from URL when possible
    def _detect_platform(url):
        url = str(url).lower()
        if "udemy.com" in url:
            return "Udemy"
        if "edx.org" in url:
            return "edX"
        if "dicoding.com" in url:
            return "Dicoding"
        return "Coursera"

    df["platform"] = df["link_course"].apply(_detect_platform)

    # Combine skills + tools for richer matching
    if "course_tools" in df.columns:
        df["skill_yang_diajarkan"] = (
            df["skill_yang_diajarkan"].fillna("")
            + "; "
            + df["course_tools"].fillna("")
        )

    df = df[["judul_course", "link_course", "skill_yang_diajarkan",
             "tingkat_kesulitan", "platform"]]
    print(f"       → {len(df):,} rows loaded from {label}")
    return df


def load_and_harmonize() -> pd.DataFrame:
    """Load 6 raw datasets, rename columns to standard names, concatenate."""
    print_banner(1, "HARMONIZATION & CONCATENATION")

    frames = []
    counter = 0

    # ─── Group A: Coursera-schema datasets (3 files) ──────────
    group_a_files = [
        (COURSERA_FILE,    "coursera_all.csv"),
        (CREATIVE_FILE,    "Creative_Design__detailed.csv"),
        (DIGITAL_MKT_FILE, "digital_marketing_detailed.csv"),
    ]
    for filepath, label in group_a_files:
        counter += 1
        print(f"\n  [{counter}/6] Loading Group A — {label}...")
        frames.append(_load_coursera_schema(filepath, label))

    # ─── Group B: Udemy ───────────────────────────────────────
    counter += 1
    print(f"\n  [{counter}/6] Loading Group B — udemy_courses_dataset.csv...")
    df_u = pd.read_csv(UDEMY_FILE)
    df_u = df_u.rename(columns={
        "course_title":  "judul_course",
        "url":           "link_course",
        "subject":       "skill_yang_diajarkan",
        "level":         "tingkat_kesulitan",
    })
    df_u["platform"] = "Udemy"
    # Udemy 'subject' is very broad (e.g. "Web Development");
    # augment with title for better matching
    df_u["skill_yang_diajarkan"] = (
        df_u["skill_yang_diajarkan"].fillna("")
        + "; "
        + df_u["judul_course"].fillna("")
    )
    df_u = df_u[["judul_course", "link_course", "skill_yang_diajarkan",
                  "tingkat_kesulitan", "platform"]]
    print(f"       → {len(df_u):,} rows loaded")
    frames.append(df_u)

    # ─── Group C: edX ─────────────────────────────────────────
    counter += 1
    print(f"\n  [{counter}/6] Loading Group C — edx_marketing_resources.csv...")
    df_e = pd.read_csv(EDX_FILE)
    df_e = df_e.rename(columns={
        "title":      "judul_course",
        "course_url": "link_course",
        "level":      "tingkat_kesulitan",
    })
    df_e["platform"] = "edX"
    # Combine curriculum + title for skill matching
    curriculum_col = df_e["curriculum"].fillna("") if "curriculum" in df_e.columns else ""
    df_e["skill_yang_diajarkan"] = (
        curriculum_col
        + "; "
        + df_e["judul_course"].fillna("")
    )
    df_e = df_e[["judul_course", "link_course", "skill_yang_diajarkan",
                  "tingkat_kesulitan", "platform"]]
    print(f"       → {len(df_e):,} rows loaded")
    frames.append(df_e)

    # ─── Group D: Dicoding ────────────────────────────────────
    counter += 1
    print(f"\n  [{counter}/6] Loading Group D — dicoding_learning_resources.csv...")
    df_d = pd.read_csv(DICODING_FILE)
    df_d = df_d.rename(columns={
        "title":  "judul_course",
        "url":    "link_course",
        "level":  "tingkat_kesulitan",
    })
    df_d["platform"] = "Dicoding"
    # Combine topic + learning_tools + title for matching
    topic_col = df_d["topic"].fillna("") if "topic" in df_d.columns else ""
    tools_col = df_d["learning_tools"].fillna("") if "learning_tools" in df_d.columns else ""
    df_d["skill_yang_diajarkan"] = (
        topic_col
        + "; "
        + tools_col
        + "; "
        + df_d["judul_course"].fillna("")
    )
    df_d = df_d[["judul_course", "link_course", "skill_yang_diajarkan",
                  "tingkat_kesulitan", "platform"]]
    print(f"       → {len(df_d):,} rows loaded")
    frames.append(df_d)

    # ─── Concatenate ──────────────────────────────────────────
    df_raw = pd.concat(frames, ignore_index=True)
    print(f"\n  ✅ Total raw courses after concatenation: {len(df_raw):,}")

    # ─── Text cleaning ────────────────────────────────────────
    df_raw["judul_course"]        = df_raw["judul_course"].fillna("").astype(str).str.lower().str.strip()
    df_raw["skill_yang_diajarkan"] = df_raw["skill_yang_diajarkan"].fillna("").astype(str).str.lower().str.strip()
    df_raw["tingkat_kesulitan"]   = df_raw["tingkat_kesulitan"].fillna("").astype(str).str.lower().str.strip()
    df_raw["link_course"]         = df_raw["link_course"].fillna("").astype(str).str.strip()

    # Remove rows with no title and no URL
    df_raw = df_raw[df_raw["judul_course"].str.len() > 0].reset_index(drop=True)
    print(f"  ✅ After cleaning empty titles: {len(df_raw):,}")

    return df_raw


# =================================================================
# STEP 2: MASTER SKILL EXTRACTION
# =================================================================
def extract_master_skills() -> tuple[dict, pd.DataFrame]:
    """
    Load master_roles_COMPLETE.csv and build a dict:
        { role_id: [list of lowercase, stripped skills] }
    Also returns the master DataFrame for later reference.
    """
    print_banner(2, "MASTER SKILL EXTRACTION")

    df_master = pd.read_csv(MASTER_PATH)
    print(f"  Loaded master dataset: {len(df_master)} roles")

    role_skills = {}
    all_skills_set = set()

    for _, row in df_master.iterrows():
        role_id = str(row["role_id"]).strip()
        raw_skills = str(row.get("skill_rekomendasi_industri", ""))

        # Parse comma-separated skills, lowercase & strip
        skills = [s.strip().lower() for s in raw_skills.split(",") if s.strip()]
        role_skills[role_id] = skills
        all_skills_set.update(skills)

    print(f"  ✅ Extracted skills for {len(role_skills)} roles")
    print(f"  ✅ Total unique skills across all roles: {len(all_skills_set)}")
    print(f"  📋 Sample → R001: {role_skills.get('R001', [])[:5]}")
    print(f"  📋 Sample → R028: {role_skills.get('R028', [])[:5]}")

    return role_skills, df_master


# =================================================================
# STEP 3: STRICT FILTERING & MANY-TO-MANY MAPPING
# =================================================================
def build_skill_patterns(role_skills: dict) -> dict:
    """
    Pre-compile regex patterns for each skill to enable word-boundary matching.
    Returns { role_id: [(skill_name, compiled_regex), ...] }
    """
    role_patterns = {}
    for role_id, skills in role_skills.items():
        patterns = []
        for skill in skills:
            escaped = re.escape(skill)

            # Skills with special chars (c++, c#, .net) — use non-alnum boundaries
            if any(ch in skill for ch in ['+', '#', '/', '.']):
                pattern = re.compile(
                    r'(?<![a-zA-Z0-9])' + escaped + r'(?![a-zA-Z0-9])',
                    re.IGNORECASE
                )
            # Very short skills (1-2 chars like "r") — strict non-alpha boundaries
            elif len(skill) <= 2:
                pattern = re.compile(
                    r'(?<![a-zA-Z])' + escaped + r'(?![a-zA-Z])',
                    re.IGNORECASE
                )
            # Standard skills — use word boundaries
            else:
                pattern = re.compile(
                    r'\b' + escaped + r'\b',
                    re.IGNORECASE
                )

            patterns.append((skill, pattern))
        role_patterns[role_id] = patterns
    return role_patterns


def filter_and_map(df_raw: pd.DataFrame, role_skills: dict) -> pd.DataFrame:
    """
    For each course, check if judul_course or skill_yang_diajarkan
    matches any skill from any role. Build many-to-many mapping.
    """
    print_banner(3, "STRICT FILTERING & MANY-TO-MANY MAPPING")

    total_raw = len(df_raw)

    # Pre-compile patterns
    print("  Compiling skill patterns...")
    role_patterns = build_skill_patterns(role_skills)

    # Combine text fields for matching
    df_raw["_search_text"] = df_raw["judul_course"] + " " + df_raw["skill_yang_diajarkan"]

    mapped_rows = []
    matched_course_indices = set()

    print("  Matching courses to roles (this may take a minute)...")

    for idx, row in df_raw.iterrows():
        search_text = row["_search_text"]

        for role_id, patterns in role_patterns.items():
            matched_skills = []
            for skill_name, pattern in patterns:
                if pattern.search(search_text):
                    matched_skills.append(skill_name)

            if matched_skills:
                matched_course_indices.add(idx)
                mapped_rows.append({
                    "judul_course":        row["judul_course"],
                    "link_course":         row["link_course"],
                    "skill_yang_diajarkan": row["skill_yang_diajarkan"],
                    "tingkat_kesulitan":   row["tingkat_kesulitan"],
                    "platform":            row["platform"],
                    "role_id":             role_id,
                    "matched_skills":      matched_skills,
                })

        # Progress indicator
        if (idx + 1) % 1000 == 0:
            print(f"       ... processed {idx + 1:,}/{total_raw:,} courses")

    df_mapped = pd.DataFrame(mapped_rows)
    dropped = total_raw - len(matched_course_indices)

    print(f"\n  ✅ Courses matched to at least 1 role: {len(matched_course_indices):,}")
    print(f"  🗑️  Courses dropped as noise:          {dropped:,}")
    print(f"  📊 Total rows after many-to-many:      {len(df_mapped):,}")

    return df_mapped, dropped


# =================================================================
# STEP 4: FORMATTING & LEVELING
# =================================================================
def map_step_number(level_str: str) -> int:
    """Map difficulty string → step_number (1, 3, or 5)."""
    level = str(level_str).lower().strip()

    # Step 1: Beginner
    beginner_kw = ["beginner", "intro", "fundamental", "dasar", "pemula",
                   "basic", "pengenalan", "all level"]
    if any(kw in level for kw in beginner_kw):
        return 1

    # Step 3: Intermediate
    intermediate_kw = ["intermediate", "menengah", "mid", "medium"]
    if any(kw in level for kw in intermediate_kw):
        return 3

    # Step 5: Advanced
    advanced_kw = ["advanced", "expert", "mahir", "profesional",
                   "professional", "sertifikasi", "mastery"]
    if any(kw in level for kw in advanced_kw):
        return 5

    # Default
    return 1


def format_skills_string(matched_skills: list, max_skills: int = 5) -> str:
    """
    Take the list of matched skills, deduplicate, limit to max_skills,
    and return a clean Title Case comma-separated string.
    """
    # Deduplicate while preserving order
    seen = set()
    unique = []
    for s in matched_skills:
        s_lower = s.lower()
        if s_lower not in seen:
            seen.add(s_lower)
            unique.append(s)

    # Limit and format
    truncated = unique[:max_skills]
    return ", ".join(s.title() for s in truncated)


def get_tipe(platform: str) -> str:
    """Assign course type based on platform norms."""
    platform_types = {
        "Coursera": "Video Course + Certificate",
        "Udemy":    "Video Course + Certificate",
        "edX":      "Video Course + Certificate",
        "Dicoding": "Interactive Course + Certificate",
    }
    return platform_types.get(platform, "Video Course + Certificate")


def format_output(df_mapped: pd.DataFrame) -> pd.DataFrame:
    """Create final formatted DataFrame with all required columns."""
    print_banner(4, "FORMATTING & LEVELING")

    df = df_mapped.copy()

    # step_number
    df["step_number"] = df["tingkat_kesulitan"].apply(map_step_number)

    # Gabungkan skill yang di-match dengan judul asli course agar spesifik!
    # Contoh output: "Python - Intro To Data Science"
    df["nama_skill"] = df["matched_skills"].apply(format_skills_string) + " - " + df["judul_course"].str.title()

    # tipe
    df["tipe"] = df["platform"].apply(get_tipe)

    # Rename link_course (already correct name)
    # Select and order final columns
    df_final = df[["role_id", "step_number", "nama_skill",
                   "link_course", "tipe", "platform"]].copy()

    # --- Deduplicate: no duplicate URLs within the same role_id ---
    before_dedup = len(df_final)
    df_final = df_final.drop_duplicates(subset=["role_id", "link_course"], keep="first")
    df_final = df_final.reset_index(drop=True)
    dupes_removed = before_dedup - len(df_final)

    # Generate unique resource_id
    df_final.insert(0, "resource_id", [f"RES{str(i+1).zfill(4)}" for i in range(len(df_final))])

    print(f"  ✅ Duplicates removed (same URL+role_id): {dupes_removed:,}")
    print(f"  ✅ Final row count: {len(df_final):,}")

    # Step distribution
    print(f"\n  📊 step_number distribution:")
    for step, count in df_final["step_number"].value_counts().sort_index().items():
        label = {1: "Beginner", 3: "Intermediate", 5: "Advanced"}.get(step, "?")
        print(f"       Step {step} ({label}): {count:,}")

    # Platform distribution
    print(f"\n  📊 Platform distribution:")
    for plat, count in df_final["platform"].value_counts().items():
        print(f"       {plat}: {count:,}")

    # Roles covered
    roles_covered = df_final["role_id"].nunique()
    print(f"\n  📊 Roles with at least 1 resource: {roles_covered}/68")

    return df_final


# =================================================================
# STEP 5: OUTPUT & VERIFICATION
# =================================================================
def save_output(df_final: pd.DataFrame, noise_dropped: int):
    """Save final CSV and print summary."""
    print_banner(5, "OUTPUT & VERIFICATION")

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    df_final.to_csv(OUTPUT_PATH, index=False, encoding="utf-8-sig")
    print(f"  💾 Saved to: {OUTPUT_PATH}")
    print(f"  📄 File size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")

    # Final summary
    print(f"\n{'='*65}")
    print(f"  PIPELINE SUMMARY")
    print(f"{'='*65}")
    print(f"  Courses dropped as noise : {noise_dropped:,}")
    print(f"  Final rows in output     : {len(df_final):,}")
    print(f"  Unique courses (URLs)    : {df_final['link_course'].nunique():,}")
    print(f"  Roles covered            : {df_final['role_id'].nunique()}/68")
    print(f"  Output file              : {OUTPUT_PATH}")
    print(f"{'='*65}")

    # Identify uncovered roles (if any)
    try:
        df_master = pd.read_csv(MASTER_PATH)
        all_role_ids = set(df_master["role_id"].astype(str).str.strip())
        covered_ids = set(df_final["role_id"].astype(str).str.strip())
        uncovered = sorted(all_role_ids - covered_ids)
        if uncovered:
            print(f"\n  ⚠️  Uncovered role_ids ({len(uncovered)}):")
            # Show role names for uncovered
            role_name_map = dict(zip(
                df_master["role_id"].astype(str).str.strip(),
                df_master["role_name"]
            ))
            for rid in uncovered:
                print(f"       {rid}: {role_name_map.get(rid, '?')}")
        else:
            print(f"\n  🎉 All 68 roles are covered!")
    except Exception:
        pass

    # Preview
    print(f"\n  🔍 Preview (first 10 rows):")
    print(df_final.head(10).to_string(index=False))


# =================================================================
# MAIN
# =================================================================
def main():
    print("\n" + "#" * 65)
    print("  CareerLens -- Learning Resources Mapping Pipeline v2")
    print("  (6 datasets: Coursera + Creative Design + Digital Marketing")
    print("   + Udemy + edX + Dicoding)")
    print("#" * 65)

    # Step 1
    df_raw = load_and_harmonize()

    # Step 2
    role_skills, df_master = extract_master_skills()

    # Step 3
    df_mapped, noise_dropped = filter_and_map(df_raw, role_skills)

    if df_mapped.empty:
        print("\n  ⚠️ No courses matched any skills! Check your data.")
        return

    # Step 4
    df_final = format_output(df_mapped)

    # Step 5
    save_output(df_final, noise_dropped)

    print("\n  ✅ Pipeline v2 completed successfully!\n")


if __name__ == "__main__":
    main()
