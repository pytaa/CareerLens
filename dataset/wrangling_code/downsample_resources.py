"""
===============================================================================
CareerLens - Learning Resources Downsampler
===============================================================================
Takes learning_resources_mapped_v2.csv (11K+ rows) and produces a curated,
UX-ready dataset with:
  1. Steps redistributed from {1,3,5} → {1,2,3,4,5}
  2. Max 3 courses per (role_id, step_number)
  3. Sequential resource_id re-indexing

Output: bismillah/learning_resources_FINAL_READY.csv

Author  : CareerLens Data Team
Created : 2026-04-26
===============================================================================
"""

import os
import sys
import pandas as pd

# Fix Windows console encoding for emoji/unicode output
if sys.stdout.encoding != 'utf-8':
    sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
    sys.stderr = open(sys.stderr.fileno(), mode='w', encoding='utf-8', buffering=1)

# ─────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
INPUT_PATH  = os.path.join(BASE_DIR, "learning_resources_mapped_v2.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "learning_resources_FINAL_READY.csv")


def print_banner(title: str):
    print(f"\n{'='*65}")
    print(f"  {title}")
    print(f"{'='*65}")


# =================================================================
# TASK 1: STEP REDISTRIBUTION  (1,3,5) → (1,2,3,4,5)
# =================================================================
def redistribute_steps(df: pd.DataFrame) -> pd.DataFrame:
    """
    Within each role_id:
      - Step 1 courses → sort by link_course, first 50% keep step 1, rest → step 2
      - Step 3 courses → unchanged
      - Step 5 courses → sort by link_course, first 50% → step 4, rest keep step 5
    """
    print_banner("TASK 1: STEP REDISTRIBUTION (1,3,5 → 1,2,3,4,5)")

    result_frames = []

    for role_id, grp in df.groupby("role_id", sort=False):
        # --- Step 1 → split into 1 and 2 ---
        s1 = grp[grp["step_number"] == 1].sort_values("link_course").reset_index(drop=True)
        if len(s1) > 0:
            midpoint = len(s1) // 2  # first 50%
            s1.loc[s1.index[:midpoint], "step_number"] = 1
            s1.loc[s1.index[midpoint:], "step_number"] = 2
        result_frames.append(s1)

        # --- Step 3 → stays as 3 ---
        s3 = grp[grp["step_number"] == 3].copy()
        result_frames.append(s3)

        # --- Step 5 → split into 4 and 5 ---
        s5 = grp[grp["step_number"] == 5].sort_values("link_course").reset_index(drop=True)
        if len(s5) > 0:
            midpoint = len(s5) // 2  # first 50%
            s5.loc[s5.index[:midpoint], "step_number"] = 4
            s5.loc[s5.index[midpoint:], "step_number"] = 5
        result_frames.append(s5)

    df_redistributed = pd.concat(result_frames, ignore_index=True)

    # Report distribution
    print(f"\n  📊 Step distribution after redistribution:")
    for step in sorted(df_redistributed["step_number"].unique()):
        count = (df_redistributed["step_number"] == step).sum()
        print(f"       Step {step}: {count:,} rows")

    return df_redistributed


# =================================================================
# TASK 2: DOWNSAMPLING  (Max 3 courses per step per role)
# =================================================================
def downsample(df: pd.DataFrame) -> pd.DataFrame:
    """Keep at most 3 courses per (role_id, step_number) group."""
    print_banner("TASK 2: DOWNSAMPLING (max 3 per role × step)")

    df_sampled = (
        df
        .groupby(["role_id", "step_number"], sort=False)
        .head(3)
        .reset_index(drop=True)
    )

    print(f"  Before downsampling: {len(df):,} rows")
    print(f"  After downsampling:  {len(df_sampled):,} rows")
    print(f"  Rows removed:        {len(df) - len(df_sampled):,}")

    return df_sampled


# =================================================================
# TASK 3: RE-FORMATTING & RE-INDEXING
# =================================================================
def reformat(df: pd.DataFrame) -> pd.DataFrame:
    """Sort, re-index resource_id, and enforce column order."""
    print_banner("TASK 3: RE-FORMATTING & RE-INDEXING")

    # Sort by role_id (natural), then step_number
    df = df.sort_values(
        by=["role_id", "step_number"],
        key=lambda col: col.map(lambda x: (
            # Natural sort for role_id: extract numeric part
            int(x.replace("R", "")) if isinstance(x, str) and x.startswith("R") else x
        )) if col.name == "role_id" else col
    ).reset_index(drop=True)

    # Re-generate sequential resource_id
    df["resource_id"] = [f"RES{str(i+1).zfill(4)}" for i in range(len(df))]

    # Enforce column order
    final_cols = ["resource_id", "role_id", "step_number",
                  "nama_skill", "link_course", "tipe", "platform"]
    df = df[final_cols]

    # Report
    roles_covered = df["role_id"].nunique()
    print(f"  Roles covered:       {roles_covered}/68")
    print(f"  Resource IDs:        RES0001 → RES{str(len(df)).zfill(4)}")

    print(f"\n  📊 Final step distribution:")
    for step in sorted(df["step_number"].unique()):
        count = (df["step_number"] == step).sum()
        print(f"       Step {step}: {count:,} rows")

    print(f"\n  📊 Platform distribution:")
    for plat, count in df["platform"].value_counts().items():
        print(f"       {plat}: {count:,}")

    return df


# =================================================================
# MAIN
# =================================================================
def main():
    print("\n" + "#" * 65)
    print("  CareerLens -- Learning Resources Downsampler")
    print("#" * 65)

    # Load
    df = pd.read_csv(INPUT_PATH)
    original_count = len(df)
    print(f"\n  📂 Loaded: {INPUT_PATH}")
    print(f"  📊 Original row count: {original_count:,}")

    # Task 1
    df = redistribute_steps(df)

    # Task 2
    df = downsample(df)

    # Task 3
    df = reformat(df)

    # Save
    print_banner("OUTPUT")
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8-sig")
    final_count = len(df)

    print(f"  💾 Saved to: {OUTPUT_PATH}")
    print(f"  📄 File size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")

    # Summary
    print(f"\n{'='*65}")
    print(f"  FINAL SUMMARY")
    print(f"{'='*65}")
    print(f"  Original rows:  {original_count:,}")
    print(f"  Final rows:     {final_count:,}")
    print(f"  Reduction:      {original_count - final_count:,} rows removed "
          f"({(1 - final_count/original_count)*100:.1f}%)")
    print(f"  Avg per role:   {final_count / df['role_id'].nunique():.1f} courses")
    print(f"{'='*65}")

    # Preview
    print(f"\n  🔍 Preview (first 15 rows):")
    print(df.head(15).to_string(index=False))

    print(f"\n  ✅ Done!\n")


if __name__ == "__main__":
    main()
