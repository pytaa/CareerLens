import pandas as pd
import numpy as np
import os

SKILL_START_IDX = 12

# Kolom RIASEC
RIASEC_COLS = ["R", "I", "A", "S", "E", "C"]

# Nama bidang
FIELD_NAMES = {
    "F01": "Teknologi Informasi & Software Development",
    "F02": "Data Science & Artificial Intelligence",
    "F03": "Desain Kreatif & UI/UX",
    "F04": "Digital Marketing & Analytics"
}


class DatasetLoader:
    def __init__(self, data_dir: str):
        self.data_dir    = "dataset/"
        self.df_master   = None   # master_feature_final.csv
        self.df_resources = None  # learning_resources.csv
        self.df_projects  = None  # dummy_projects.csv
        self.df_mapping   = None  # project_role_mapping.csv
        self.skill_cols   = []    # nama 390 kolom skill
        self.skill_vocab  = []    # sama dengan skill_cols

    def load(self):
        def path(filename):
            return os.path.join(self.data_dir, filename)

        # Load CSV 
        self.df_master    = pd.read_csv(
            path("master_feature_final.csv")
        )
        self.df_resources = pd.read_csv(
            path("learning_resources.csv")
        )
        self.df_projects  = pd.read_csv(
            path("dummy_projects.csv")
        )
        self.df_mapping   = pd.read_csv(
            path("project_role_mapping.csv")
        )
        self.skill_cols  = list(
            self.df_master.columns[SKILL_START_IDX:]
        )
        self.skill_vocab = self.skill_cols  # alias

        # Print info 
        print(f"[DatasetLoader] Dataset dimuat dari: {self.data_dir}")
        print(f"[DatasetLoader] Total role    : {len(self.df_master)}")
        print(f"[DatasetLoader] Total skill   : {len(self.skill_vocab)}")
        print(f"[DatasetLoader] Total resource: {len(self.df_resources)}")
        print(f"[DatasetLoader] Total project : {len(self.df_projects)}")

        return self

    # Matrix getters 

    def get_role_skill_matrix(self) -> np.ndarray:
        return self.df_master[self.skill_cols].values.astype(
            np.float32
        )

    def get_role_riasec_matrix(self) -> np.ndarray:
        return self.df_master[RIASEC_COLS].values.astype(
            np.float32
        )

    # Encoding 

    def encode_user_skills(self, user_skills: list) -> np.ndarray:
        user_lower = [s.lower().strip() for s in user_skills]
        vector     = np.zeros(
            (1, len(self.skill_vocab)), dtype=np.float32
        )

        matched   = []
        unmatched = []
        for i, skill in enumerate(self.skill_vocab):
            if skill.lower() in user_lower:
                vector[0, i] = 1.0
                matched.append(skill)

        for s in user_skills:
            if s.lower() not in [m.lower() for m in matched]:
                unmatched.append(s)

        if not matched:
            raise ValueError(
                "Tidak ada skill yang dikenali dari vocabulary. "
                "Pastikan nama skill sesuai dengan daftar skill dataset."
            )

        if unmatched:
            print(f"[encode] Skill tidak dikenali: {unmatched}")

        print(f"[encode] Skill dikenali ({len(matched)}): {matched}")
        return vector

    # Roadmap getter 

    def get_roadmap_by_role(self, role_id: str) -> dict:
        # Learning path dari learning_resources.csv
        resources = self.df_resources[
            self.df_resources["role_id"] == role_id
        ].sort_values("step_number")

        learning_path = [
            {
                "step"       : int(row["step_number"]),
                "nama_skill" : row["nama_skill"],
                "link_course": row["link_course"],
                "tipe"       : row["tipe"],
                "platform"   : row["platform"]
            }
            for _, row in resources.iterrows()
        ]

        # Dummy projects dari project_role_mapping.csv
        proj_ids = self.df_mapping[
            self.df_mapping["role_id"] == role_id
        ]["project_id"].tolist()

        projects = self.df_projects[
            self.df_projects["project_id"].isin(proj_ids)
        ]

        dummy_projects = [
            {
                "judul"       : row["judul_project"],
                "brief_case"  : row["brief_case"],
                "instructions": row.get("instructions", ""),
                "tools_used"  : row["tools_used"]
            }
            for _, row in projects.iterrows()
        ]

        return {
            "learning_path"  : learning_path,
            "dummy_projects" : dummy_projects
        }
