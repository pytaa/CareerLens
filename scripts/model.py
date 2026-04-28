import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer

# 1. DATASET LOADER
#    Memuat semua sheet dari dataset yang disediakan tim DS

class DatasetLoader:
    """
    Memuat dan menyiapkan data dari file CSV
    yang disediakan tim Data Scientist.

    File yang dibutuhkan (semua di folder data_dir):
    - fields.csv
    - roles.csv
    - master_roles.csv
    - learning_resources.csv
    - dummy_projects.csv
    - project_role_mapping.csv
    """

    def __init__(self, data_dir: str):
        # data_dir = path ke folder CSV, contoh: "data/"
        self.data_dir        = data_dir
        self.df_roles        = None
        self.df_fields       = None
        self.df_master       = None
        self.df_resources    = None
        self.df_projects     = None
        self.df_proj_mapping = None
        self.skill_vocab     = []
        self.mlb             = MultiLabelBinarizer()

    def load(self):
        """
        Muat semua file CSV dari data_dir.
        Dipanggil sekali saat FastAPI startup.
        """
        import os

        self.df_fields       = pd.read_csv(
            os.path.join(self.data_dir, "fields.csv")
        )
        self.df_roles        = pd.read_csv(
            os.path.join(self.data_dir, "roles.csv")
        )
        self.df_master       = pd.read_csv(
            os.path.join(self.data_dir, "master_roles.csv")
        )
        self.df_resources    = pd.read_csv(
            os.path.join(self.data_dir, "learning_resources.csv")
        )
        self.df_projects     = pd.read_csv(
            os.path.join(self.data_dir, "dummy_projects.csv")
        )
        self.df_proj_mapping = pd.read_csv(
            os.path.join(self.data_dir, "project_role_mapping.csv")
        )

        # Normalisasi nama kolom → semua lowercase, hapus spasi
        for df in [self.df_roles, self.df_fields, self.df_master,
                   self.df_resources, self.df_projects, self.df_proj_mapping]:
            df.columns = [c.strip().lower() for c in df.columns]

        # Bangun skill vocabulary
        all_skills = []
        for skill_str in self.df_master["skill"].dropna():
            skills = [s.strip() for s in str(skill_str).split(",") if s.strip()]
            all_skills.extend(skills)

        self.skill_vocab = sorted(list(set(all_skills)))
        self.mlb.fit([self.skill_vocab])

        print(f"[DatasetLoader] Dataset berhasil dimuat dari {self.data_dir}")
        print(f"[DatasetLoader] Total role  : {len(self.df_master)}")
        print(f"[DatasetLoader] Total skill : {len(self.skill_vocab)}")
        print(f"[DatasetLoader] Total field : {len(self.df_fields)}")

        return self

    def get_role_skill_matrix(self):
        """
        Buat matrix skill per role — shape: (n_roles, n_skills)
        Setiap baris = 1 role, setiap kolom = 1 skill.
        Nilai 1 = role butuh skill itu, 0 = tidak.
        Dipakai sebagai role profile di Pipeline 2 (skill matching).
        """
        role_skills = []
        for _, row in self.df_master.iterrows():
            if pd.notna(row.get("skill")):
                skills = [s.strip() for s in str(row["skill"]).split(",")
                          if s.strip()]
            else:
                skills = []
            role_skills.append(skills)

        return self.mlb.transform(role_skills).astype(np.float32)

    def get_role_riasec_matrix(self):
        """
        Buat matrix RIASEC per role — shape: (n_roles, 6)
        Kolom: R, I, A, S, E, C — semua nilai 0-1 (dinormalisasi tim DS).
        Dipakai sebagai role profile di Pipeline 3 (RIASEC matching).
        """
        riasec_cols = ["r", "i", "a", "s", "e", "c"]
        matrix = self.df_roles[riasec_cols].fillna(0).values.astype(np.float32)
        return matrix

    def get_roadmap_by_role(self, role_id: str):
        """
        Ambil roadmap dari dataset berdasarkan role_id.
        Return: learning_path (step by step) + dummy_projects.
        Tidak menggunakan Generative AI, semua dari dataset DS.
        """
        # Learning path dari sheet learning_resources
        resources = self.df_resources[
            self.df_resources["role_id"] == role_id
        ].sort_values("step_number")

        learning_path = [
            {
                "step"      : int(row["step_number"]),
                "nama_skill": row["nama_skill"],
                "link_course": row["link_course"],
                "tipe"      : row["tipe"],
                "platform"  : row["platform"]
            }
            for _, row in resources.iterrows()
        ]

        # Dummy projects dari mapping project_role_mapping
        proj_ids = self.df_proj_mapping[
            self.df_proj_mapping["role_id"] == role_id
        ]["project_id"].tolist()

        projects = self.df_projects[
            self.df_projects["project_id"].isin(proj_ids)
        ]

        dummy_projects = [
            {
                "judul"     : row["judul_project"],
                "brief_case": row["brief_case"],
                "tools_used": row["tools_used"]
            }
            for _, row in projects.iterrows()
        ]

        return {
            "learning_path"  : learning_path,
            "dummy_projects" : dummy_projects
        }

# 2. HELPER FUNCTIONS
#    Fungsi pendukung untuk metode RIASEC

def get_interest_code(riasec_scores: dict) -> str:
    """
    Ambil 3 huruf RIASEC dengan skor tertinggi sebagai Interest Code.
    Ditampilkan di halaman hasil tes minat bakat.

    Contoh:
      Input : {"r": 0.8, "i": 0.9, "a": 0.4, "s": 0.6, "e": 0.5, "c": 0.7}
      Output: "I R C"  (karena I=0.9 > R=0.8 > C=0.7)
    """
    sorted_riasec = sorted(
        riasec_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )
    top3 = [k.upper() for k, _ in sorted_riasec[:3]]
    return " ".join(top3)


def get_sector_recommendations(
    riasec_scores: dict,
    loader: DatasetLoader,
    riasec_model: "tf.keras.Model"
) -> list:
    """
    Hitung persentase relevansi tiap sektor industri berdasarkan
    rata-rata skor role per bidang.
    Ditampilkan sebagai "Rekomendasi Sektor Industri yang Relevan".

    Return: list dict diurutkan dari skor tertinggi
    [
      {"field_id": "F02", "field_name": "Data Science & AI", "relevance_pct": 91.0},
      ...
    ]
    """
    role_riasec_matrix = loader.get_role_riasec_matrix()  # (n_roles, 6)

    # Susun vektor RIASEC user
    user_vector = np.array([[
        riasec_scores.get("r", 0),
        riasec_scores.get("i", 0),
        riasec_scores.get("a", 0),
        riasec_scores.get("s", 0),
        riasec_scores.get("e", 0),
        riasec_scores.get("c", 0),
    ]], dtype=np.float32)  # (1, 6)

    # Hitung skor semua role sekaligus (batch)
    n_roles     = len(role_riasec_matrix)
    user_matrix = np.repeat(user_vector, n_roles, axis=0)  # (n_roles, 6)
    all_scores  = riasec_model.predict(
        [user_matrix, role_riasec_matrix], verbose=0
    ).flatten().tolist()

    # Nama bidang
    field_names = {
        "F01": "Teknologi Informasi & Software Development",
        "F02": "Data Science & Artificial Intelligence",
        "F03": "Desain Kreatif & UI/UX",
        "F04": "Digital Marketing & Analytics"
    }

    # Kelompokkan skor per bidang
    sector_scores = {fid: [] for fid in field_names}
    for idx, row in loader.df_master.iterrows():
        role_id  = row["role_id"]
        field_id_match = loader.df_roles[
            loader.df_roles["role_id"] == role_id
        ]["field_id"].values
        if len(field_id_match) > 0:
            fid = field_id_match[0]
            if fid in sector_scores:
                sector_scores[fid].append(all_scores[idx])

    # Hitung rata-rata per sektor
    result = []
    for fid, scores in sector_scores.items():
        if scores:
            result.append({
                "field_id"      : fid,
                "field_name"    : field_names[fid],
                "relevance_pct" : round(sum(scores) / len(scores), 1)
            })

    # Urutkan dari persentase tertinggi
    return sorted(result, key=lambda x: x["relevance_pct"], reverse=True)


# 3. CUSTOM COMPONENTS — Requirement Coding Camp ★

class SkillEmbeddingLayer(tf.keras.layers.Layer):
    """
    Custom Layer 
    Proyeksikan multi-hot skill vector ke dense embedding space.
    Mengubah representasi 0/1 skill menjadi representasi bermakna.
    Dipakai di Pipeline 2 (skill matching).

    Input : multi-hot vector ukuran (n_skills,)
    Proses: Dense(embedding_dim) → LayerNorm → GeLU activation
    Output: dense embedding ukuran (embedding_dim,)
    """
    def __init__(self, embedding_dim=128, **kwargs):
        super().__init__(**kwargs)
        self.embedding_dim = embedding_dim
        self.dense = tf.keras.layers.Dense(embedding_dim)
        self.norm  = tf.keras.layers.LayerNormalization()

    def call(self, inputs, training=False):
        x = self.dense(inputs)
        x = self.norm(x, training=training)
        return tf.nn.gelu(x)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"embedding_dim": self.embedding_dim})
        return cfg


class CosineSimilarityLayer(tf.keras.layers.Layer):
    """
    Custom Layer 
    Hitung cosine similarity antara user embedding dan role embedding.
    Dipakai di Pipeline 2 dan Pipeline 3.

    Input : [user_emb, role_emb] — dua tensor ukuran sama
    Proses: L2 normalize keduanya → dot product → skala ke [0, 100]
    Output: similarity score dalam persentase 0-100
    """
    def call(self, inputs):
        user_emb, role_emb = inputs
        user_norm  = tf.nn.l2_normalize(user_emb, axis=-1)
        role_norm  = tf.nn.l2_normalize(role_emb, axis=-1)
        similarity = tf.reduce_sum(
            user_norm * role_norm, axis=-1, keepdims=True
        )
        # Konversi dari rentang [-1, 1] ke [0, 100]
        return (similarity + 1) / 2 * 100

    def get_config(self):
        return super().get_config()


class WeightedMatchingLoss(tf.keras.losses.Loss):
    """
    Custom Loss 
    Weighted Binary Cross Entropy untuk menangani class imbalance.
    Role yang jarang muncul di dataset diberi bobot lebih tinggi
    agar model tetap belajar mengenalinya.

    role_weights: array bobot per role, shape (n_roles,)
                  None = semua role diberi bobot sama
    """
    def __init__(self, role_weights=None, **kwargs):
        super().__init__(**kwargs)
        self.role_weights = role_weights

    def call(self, y_true, y_pred):
        bce = tf.keras.losses.binary_crossentropy(y_true, y_pred)
        if self.role_weights is not None:
            weights = tf.cast(self.role_weights, dtype=tf.float32)
            bce     = bce * weights
        return tf.reduce_mean(bce)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"role_weights": self.role_weights})
        return cfg


class CareerLensCallback(tf.keras.callbacks.Callback):
    """
    Custom Callback 
    Dipanggil otomatis setiap akhir epoch untuk:
    - Monitor similarity score rata-rata di validation set
    - Log metrik ke TensorBoard (val_avg_similarity, loss)
    - Simpan model terbaik ke saved_model/careerlens_best.keras
    - Early stopping jika skor tidak membaik selama `patience` epoch
    """
    def __init__(self, val_data, log_dir="logs/", patience=5):
        super().__init__()
        self.val_data   = val_data
        self.patience   = patience
        self.best_score = -999
        self.wait       = 0
        self.writer     = tf.summary.create_file_writer(log_dir)

    def on_epoch_end(self, epoch, logs=None):
        X_val, y_val = self.val_data
        preds        = self.model.predict(X_val, verbose=0)

        # Handle output dict (SkillModel) vs tensor (RIASECModel)
        if isinstance(preds, dict):
            pred_scores = preds.get("role_score", preds)
        else:
            pred_scores = preds

        avg_score = float(np.mean(pred_scores))

        # Log ke TensorBoard
        with self.writer.as_default():
            tf.summary.scalar("val_avg_similarity", avg_score, step=epoch)
            if logs:
                for key, val in logs.items():
                    tf.summary.scalar(key, val, step=epoch)

        print(f"\n[CareerLensCallback] Epoch {epoch+1} | "
              f"Avg Similarity: {avg_score:.2f}%")

        # Simpan model terbaik + early stopping
        if avg_score > self.best_score:
            self.best_score = avg_score
            self.wait       = 0
            self.model.save("saved_model/careerlens_best.keras")
            print(f"  Model tersimpan - best score: {self.best_score:.2f}%")
        else:
            self.wait += 1
            if self.wait >= self.patience:
                print(f"  ✗ Early stopping di epoch {epoch+1}")
                self.model.stop_training = True


# 4. PIPELINE 1 — Input Minat Karir
#    Filtering berbasis dataset
#    Alasan: input deterministik (pilih bidang → tampilkan role)
#    tidak membutuhkan prediksi probabilistik

def recommend_by_interest(field_id: str, loader: DatasetLoader, top_k=5):
    """
    Pipeline 1: user pilih minat karir (field_id).
    Filter role berdasarkan bidang, kembalikan top_k=5 role.
    Roadmap diambil langsung dari dataset learning_resources.

    field_id : "F01" | "F02" | "F03" | "F04"
    top_k    : 5 (sesuai desain UI)
    """
    # Ambil semua role_id yang termasuk field ini
    role_ids_in_field = loader.df_roles[
        loader.df_roles["field_id"] == field_id
    ]["role_id"].tolist()

    # Filter master_roles berdasarkan role_id
    filtered = loader.df_master[
        loader.df_master["role_id"].isin(role_ids_in_field)
    ].head(top_k)

    results = []
    for _, row in filtered.iterrows():
        roadmap = loader.get_roadmap_by_role(row["role_id"])
        results.append({
            "role_id"      : row["role_id"],
            "role_name"    : row["nama_role"],
            "match_pct"    : None,   # Tidak ada skor untuk metode ini
            "description"  : row.get("deskripsi", ""),
            "salary_range" : row.get("gaji", ""),
            "skill_relevant": [
                s.strip()
                for s in str(row.get("skill", "")).split(",")
                if s.strip()
            ],
            "skill_gap"    : [],     # Tidak ada skill gap untuk metode ini
            "roadmap"      : roadmap
        })

    return results


# 5. PIPELINE 2 — Input Skill (Deep Learning)
#    SkillModel: Siamese-like network dengan Cosine Similarity

def build_skill_model(n_skills: int):
    """
    Pipeline 2: model Deep Learning untuk skill matching.

    Arsitektur: Siamese-like network — dua branch terpisah
    (user dan role) diproyeksikan ke embedding 64 dimensi,
    lalu dihitung cosine similarity-nya.

    Input  : skill_input (n_skills,) + role_skill_profile (n_skills,)
    Output : role_score (0-100%) + skill_gap (sigmoid per skill)

    n_skills : jumlah total skill unik dalam vocabulary
               → diisi dari len(loader.skill_vocab) setelah dataset DS tersedia
    """
    # Input 
    skill_input = tf.keras.Input(shape=(n_skills,), name="skill_input")
    role_input  = tf.keras.Input(shape=(n_skills,), name="role_skill_profile")

    # User Branch 
    # Proyeksikan skill user ke embedding space
    x = SkillEmbeddingLayer(128)(skill_input)          # Custom Layer ★
    x = tf.keras.layers.Dense(256, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.3)(x)               # Cegah overfitting
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    user_embedding = tf.keras.layers.Dense(64)(x)     # (batch, 64)

    # Role Branch 
    # Proyeksikan skill profile role ke embedding space yang sama
    y = tf.keras.layers.Dense(128, activation="relu")(role_input)
    y = tf.keras.layers.Dense(64)(y)
    role_embedding = y                                 # (batch, 64)

    # Cosine Similarity → Role Score
    role_score = CosineSimilarityLayer(                # Custom Layer ★
        name="role_score"
    )([user_embedding, role_embedding])                # (batch, 1), range 0-100

    # Skill Gap 
    # Prediksi skill mana yang perlu ditingkatkan
    # Sigmoid → probability per skill (0=sudah punya, 1=perlu belajar)
    skill_gap = tf.keras.layers.Dense(
        n_skills, activation="sigmoid", name="skill_gap"
    )(user_embedding)                                  # (batch, n_skills)

    return tf.keras.Model(
        inputs=[skill_input, role_input],
        outputs={"role_score": role_score, "skill_gap": skill_gap},
        name="SkillModel"
    )


def predict_by_skill(
    user_skills : list,
    loader      : DatasetLoader,
    skill_model : tf.keras.Model,
    top_k       : int = 3
):
    """
    Inference Pipeline 2.

    user_skills : list skill user, contoh ["Python", "SQL"]
    top_k       : 3 role teratas (sesuai desain UI)
    Return      : (results, chart_data)
    """
    role_skill_matrix = loader.get_role_skill_matrix()  # (n_roles, n_skills)
    n_roles           = len(role_skill_matrix)

    # Encode skill user → multi-hot vector (1, n_skills)
    user_vector = loader.mlb.transform([user_skills]).astype(np.float32)

    # Batch inference — prediksi semua role sekaligus (lebih efisien)
    user_matrix = np.repeat(user_vector, n_roles, axis=0)  # (n_roles, n_skills)
    preds       = skill_model.predict(
        [user_matrix, role_skill_matrix], verbose=0
    )
    all_scores = preds["role_score"].flatten().tolist()    # (n_roles,)

    # Urutkan berdasarkan skor tertinggi, ambil top_k
    sorted_idx = np.argsort(all_scores)[::-1][:top_k]

    results = []
    for idx in sorted_idx:
        row = loader.df_master.iloc[idx]

        # Skill gap = skill yang dibutuhkan role tapi belum dimiliki user
        role_skills_list = [
            s.strip()
            for s in str(row.get("skill", "")).split(",")
            if s.strip()
        ]
        skill_gap_list = [s for s in role_skills_list if s not in user_skills]

        roadmap = loader.get_roadmap_by_role(row["role_id"])

        results.append({
            "role_id"      : row["role_id"],
            "role_name"    : row["nama_role"],
            "match_pct"    : round(all_scores[idx], 1),
            "description"  : row.get("deskripsi", ""),
            "salary_range" : row.get("gaji", ""),
            "skill_relevant": role_skills_list,
            "skill_gap"    : skill_gap_list,
            "roadmap"      : roadmap
        })

    # Data untuk bar chart di frontend
    chart_data = {
        "labels": [r["role_name"] for r in results],
        "scores": [r["match_pct"]  for r in results]
    }

    return results, chart_data


# 6. PIPELINE 3 — Input RIASEC (Deep Learning)
#    RIASECModel: Compact Siamese Network
#    Untuk user yang belum tahu minat maupun skill-nya
#    RIASEC tidak mengukur skill — hanya kepribadian/minat

def build_riasec_model():
    """
    Pipeline 3: model Deep Learning untuk RIASEC matching.

    Input  : riasec_input (6,) + role_riasec_profile (6,)
    Output : riasec_score (0-100%)

    Skor RIASEC user berasal dari tes minat bakat (30 soal, 5 per kategori).
    Normalisasi: skor = (jumlah_5_jawaban - 5) / 20  → range 0-1
    Profil RIASEC tiap role diisi tim DS dari O*NET database.
    """
    # Input 
    riasec_input = tf.keras.Input(shape=(6,), name="riasec_input")
    role_riasec  = tf.keras.Input(shape=(6,), name="role_riasec_profile")

    # User Branch 
    x = tf.keras.layers.Dense(32, activation="relu")(riasec_input)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(64, activation="relu")(x)
    x = tf.keras.layers.Dense(32)(x)
    user_riasec_emb = x                                # (batch, 32)

    # Role Branch 
    y = tf.keras.layers.Dense(32, activation="relu")(role_riasec)
    y = tf.keras.layers.Dense(32)(y)
    role_riasec_emb = y                                # (batch, 32)

    # Cosine Similarity → Match Score 
    riasec_score = CosineSimilarityLayer(              # Custom Layer ★
        name="riasec_score"
    )([user_riasec_emb, role_riasec_emb])              # (batch, 1), range 0-100

    return tf.keras.Model(
        inputs=[riasec_input, role_riasec],
        outputs=riasec_score,
        name="RIASECModel"
    )


def predict_by_riasec(
    riasec_scores : dict,
    loader        : DatasetLoader,
    riasec_model  : tf.keras.Model,
    top_k         : int = 3
):
    """
    Inference Pipeline 3.

    riasec_scores : dict skor ternormalisasi 0-1
                    contoh: {"r":0.8,"i":0.9,"a":0.4,"s":0.6,"e":0.5,"c":0.7}
    top_k         : 3 role teratas (sesuai desain UI)
    Return        : (results, chart_data, interest_code, sector_recommendations)
    """
    role_riasec_matrix = loader.get_role_riasec_matrix()  # (n_roles, 6)
    n_roles            = len(role_riasec_matrix)

    # Susun vektor RIASEC user sesuai urutan R, I, A, S, E, C
    user_vector = np.array([[
        riasec_scores.get("r", 0),
        riasec_scores.get("i", 0),
        riasec_scores.get("a", 0),
        riasec_scores.get("s", 0),
        riasec_scores.get("e", 0),
        riasec_scores.get("c", 0),
    ]], dtype=np.float32)  # (1, 6)

    # Batch inference — prediksi semua role sekaligus
    user_matrix = np.repeat(user_vector, n_roles, axis=0)  # (n_roles, 6)
    all_scores  = riasec_model.predict(
        [user_matrix, role_riasec_matrix], verbose=0
    ).flatten().tolist()                                    # (n_roles,)

    # Urutkan berdasarkan skor tertinggi, ambil top_k
    sorted_idx = np.argsort(all_scores)[::-1][:top_k]

    results = []
    for idx in sorted_idx:
        row = loader.df_master.iloc[idx]

        skill_relevant = [
            s.strip()
            for s in str(row.get("skill", "")).split(",")
            if s.strip()
        ]

        roadmap = loader.get_roadmap_by_role(row["role_id"])

        results.append({
            "role_id"      : row["role_id"],
            "role_name"    : row["nama_role"],
            "match_pct"    : round(all_scores[idx], 1),
            "description"  : row.get("deskripsi", ""),
            "salary_range" : row.get("gaji", ""),
            "skill_relevant": skill_relevant,
            "skill_gap"    : [],    # RIASEC tidak mengukur skill user
            "roadmap"      : roadmap
        })

    # Data untuk bar chart di frontend
    chart_data = {
        "labels": [r["role_name"] for r in results],
        "scores": [r["match_pct"]  for r in results]
    }

    # Interest Code — 3 huruf RIASEC dominan (ditampilkan di UI)
    interest_code = get_interest_code(riasec_scores)

    # Rekomendasi sektor per bidang (ditampilkan di UI)
    sector_recs = get_sector_recommendations(riasec_scores, loader, riasec_model)

    return results, chart_data, interest_code, sector_recs


# 7. CUSTOM TRAINING LOOP — GradientTape ★
#    Training dari awal tanpa AutoML atau model jadi

def train_model(
    model         : tf.keras.Model,
    train_dataset : tf.data.Dataset,
    val_data      : tuple,
    epochs        : int = 50,
    log_dir       : str = "logs/"
):
    """
    Custom training loop menggunakan tf.GradientTape ★
    Tanpa AutoML atau model jadi — dilatih dari awal.

    model         : skill_model atau riasec_model
    train_dataset : tf.data.Dataset berisi (X_batch, y_batch)
    val_data      : tuple (X_val, y_val) untuk evaluasi per epoch
    epochs        : jumlah epoch maksimum (default 50)
    log_dir       : folder untuk log TensorBoard

    Fitur:
    - L2 regularization untuk cegah overfitting
    - Gradient clipping untuk stabilitas training
    - Early stopping via CareerLensCallback
    - Auto-save model terbaik via CareerLensCallback
    """
    optimizer = tf.keras.optimizers.AdamW(
        learning_rate=1e-3,
        weight_decay=1e-4
    )
    loss_fn  = WeightedMatchingLoss()               # Custom Loss 
    callback = CareerLensCallback(val_data, log_dir) # Custom Callback 
    callback.set_model(model)

    print(f"\n[Training] Mulai training: {model.name}")
    print(f"[Training] Epochs: {epochs} | Log: {log_dir}\n")

    for epoch in range(epochs):
        epoch_losses = []

        for batch in train_dataset:
            X_batch, y_batch = batch

            with tf.GradientTape() as tape:
                y_pred = model(X_batch, training=True)

                # Handle dict output (SkillModel punya 2 output)
                if isinstance(y_pred, dict):
                    loss = loss_fn(y_batch, y_pred["role_score"])
                else:
                    loss = loss_fn(y_batch, y_pred)

                # L2 regularization — cegah bobot terlalu besar
                reg_loss = tf.add_n([
                    tf.nn.l2_loss(v)
                    for v in model.trainable_variables
                    if "bias" not in v.name
                ])
                total_loss = loss + 1e-4 * reg_loss

            # Hitung gradients
            grads = tape.gradient(total_loss, model.trainable_variables)

            # Gradient clipping — stabilitas training
            grads, _ = tf.clip_by_global_norm(grads, clip_norm=1.0)

            # Update bobot model
            optimizer.apply_gradients(
                zip(grads, model.trainable_variables)
            )
            epoch_losses.append(float(total_loss))

        avg_loss = sum(epoch_losses) / len(epoch_losses)
        print(f"Epoch {epoch+1:3d}/{epochs} | Loss: {avg_loss:.4f}")

        # Jalankan callback — log TensorBoard + early stopping
        callback.on_epoch_end(epoch, logs={"loss": avg_loss})

        if model.stop_training:
            break

    print(f"\n[Training] Selesai. Model terbaik tersimpan di saved_model/")
    return model


# 8. UNIFIED PREDICT ROUTER
#    Satu fungsi router untuk semua metode
#    Dipanggil dari FastAPI endpoint /predict (oleh Susi)

def predict(
    method       : str,
    payload      : dict,
    loader       : DatasetLoader,
    skill_model  : tf.keras.Model = None,
    riasec_model : tf.keras.Model = None,
):
    """
    Router utama — menerima request dari FastAPI endpoint /predict.
    Merutekan ke pipeline yang sesuai berdasarkan method.
    Mengembalikan unified output format untuk semua metode.

    method  : "interest" | "skill" | "riasec"
    payload : isi dari request body sesuai API contract
    """
    if method == "interest":
        field_id        = payload.get("interest_id", "F01")
        recommendations = recommend_by_interest(field_id, loader, top_k=5)
        chart_data      = None
        extra           = None

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
            raise ValueError("Payload 'riasec_scores' tidak boleh kosong")
        recommendations, chart_data, interest_code, sector_recs = predict_by_riasec(
            riasec_scores, loader, riasec_model, top_k=3
        )
        extra = {
            "interest_code"          : interest_code,
            "sector_recommendations" : sector_recs
        }

    else:
        raise ValueError(
            f"Method '{method}' tidak valid. Gunakan: interest | skill | riasec"
        )

    return format_output(method, recommendations, chart_data, extra)


# 9. FORMAT OUTPUT — Unified response untuk semua metode
#    Format sama agar Frontend cukup handle 1 logic saja

def format_output(
    method          : str,
    recommendations : list,
    chart_data      = None,
    extra           : dict = None
):
    """
    Unified output format — sesuai API contract yang disepakati.

    Perbedaan per metode:
    - interest : match_pct=None, chart_data=None, skill_gap=[]
    - skill    : match_pct ada, chart_data ada, skill_gap ada
    - riasec   : match_pct ada, chart_data ada, skill_gap=[],
                 + interest_code dan sector_recommendations
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
        response["data"]["interest_code"] = extra.get("interest_code")
        response["data"]["sector_recommendations"] = extra.get(
            "sector_recommendations", []
        )

    return response