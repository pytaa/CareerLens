import pandas as pd
import numpy as np
import os

SKILL_START_IDX = 12
RIASEC_COLS     = ["R", "I", "A", "S", "E", "C"]

class DatasetLoader:
    def __init__(self, data_dir: str):
        self.data_dir     = data_dir  # pakai parameter
        self.df_master    = None
        self.df_resources = None
        self.df_projects  = None
        self.df_mapping   = None
        self.skill_cols   = []
        self.skill_vocab  = []

    def load(self):
        def path(filename):
            return os.path.join(self.data_dir, filename)
        self.df_master    = pd.read_csv(path("master_feature_final.csv"))
        self.df_resources = pd.read_csv(path("learning_resources.csv"))
        self.df_projects  = pd.read_csv(path("dummy_projects.csv"))
        self.df_mapping   = pd.read_csv(path("project_role_mapping.csv"))
        self.skill_cols   = list(self.df_master.columns[SKILL_START_IDX:])
        self.skill_vocab  = self.skill_cols
        print(f"[DatasetLoader] Dataset dimuat dari : {self.data_dir}")
        print(f"[DatasetLoader] Total role          : {len(self.df_master)}")
        print(f"[DatasetLoader] Total skill         : {len(self.skill_vocab)}")
        print(f"[DatasetLoader] Total resource      : {len(self.df_resources)}")
        print(f"[DatasetLoader] Total project       : {len(self.df_projects)}")
        return self

    def get_role_skill_matrix(self):
        return self.df_master[self.skill_cols].values.astype(np.float32)

    def get_role_riasec_matrix(self):
        return self.df_master[RIASEC_COLS].values.astype(np.float32)

    def encode_user_skills(self, user_skills: list):
        user_lower = [s.lower().strip() for s in user_skills]
        vector     = np.zeros((1, len(self.skill_vocab)), dtype=np.float32)
        matched    = []
        for i, skill in enumerate(self.skill_vocab):
            if skill.lower() in user_lower:
                vector[0, i] = 1.0
                matched.append(skill)
        if not matched:
            raise ValueError("Tidak ada skill yang dikenali dari vocabulary.")
        print(f"[encode] Skill cocok ({len(matched)}): {matched}")
        return vector

    def get_roadmap_by_role(self, role_id: str):
        resources = self.df_resources[
            self.df_resources["role_id"] == role_id
        ].sort_values("step_number")
        learning_path = [
            {"step": int(r["step_number"]), "nama_skill": r["nama_skill"],
             "link_course": r["link_course"], "tipe": r["tipe"], "platform": r["platform"]}
            for _, r in resources.iterrows()
        ]
        proj_ids = self.df_mapping[
            self.df_mapping["role_id"] == role_id
        ]["project_id"].tolist()
        projects = self.df_projects[self.df_projects["project_id"].isin(proj_ids)]
        dummy_projects = [
            {"judul": r["judul_project"], "brief_case": r["brief_case"],
             "instructions": r.get("instructions", ""), "tools_used": r["tools_used"]}
            for _, r in projects.iterrows()
        ]
        return {"learning_path": learning_path, "dummy_projects": dummy_projects}
