import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer

# ══════════════════════════════════════════════════════════════
# 1. DATASET LOADER
# ══════════════════════════════════════════════════════════════

class DatasetLoader:

    # Kolom skill di master_feature_final mulai dari index 12
    SKILL_START_IDX = 12

    def __init__(self, data_dir: str):
        self.data_dir        = data_dir
        self.df_master       = None   # master_feature_final.csv
        self.df_roles        = None   # roles.csv
        self.df_fields       = None   # fields.csv
        self.df_resources    = None   # learning_resources.csv
        self.df_projects     = None   # dummy_projects.csv
        self.df_mapping      = None   # project_role_mapping.csv
        self.skill_vocab     = []     # list 390 skill unik
        self.skill_cols      = []     # nama kolom skill di master

    def load(self):
        """
        Muat semua CSV dan siapkan skill vocabulary.
        Dipanggil sekali saat awal — di notebook atau saat FastAPI startup.
        """
        import os

        self.df_master    = pd.read_csv(
            os.path.join(self.data_dir, "master_feature_final.csv")
        )
        self.df_roles     = pd.read_csv(
            os.path.join(self.data_dir, "roles.csv")
        )
        self.df_fields    = pd.read_csv(
            os.path.join(self.data_dir, "fields.csv")
        )
        self.df_resources = pd.read_csv(
            os.path.join(self.data_dir, "learning_resources.csv")
        )
        self.df_projects  = pd.read_csv(
            os.path.join(self.data_dir, "dummy_projects.csv")
        )
        self.df_mapping   = pd.read_csv(
            os.path.join(self.data_dir, "project_role_mapping.csv")
        )
        self.df_salary   = pd.read_csv(
            os.path.join(self.data_dir, "salary.csv")
        )


        # Skill vocabulary = semua kolom mulai index 12
        # Contoh: ['2d/3d animation', '3d mathematics', ..., 'zbrush']
        self.skill_cols  = list(self.df_master.columns[self.SKILL_START_IDX:])
        self.skill_vocab = list(self.df_master.columns[12:])

        print(f"[DatasetLoader] Dataset berhasil dimuat dari: {self.data_dir}")
        print(f"[DatasetLoader] Total role    : {len(self.df_master)}")
        print(f"[DatasetLoader] Total skill   : {len(self.skill_vocab)}")
        print(f"[DatasetLoader] Total field   : {len(self.df_fields)}")
        print(f"[DatasetLoader] Total resource: {len(self.df_resources)}")
        print(f"[DatasetLoader] Total project : {len(self.df_projects)}")

        return self

    def get_role_skill_matrix(self):
        skill_cols = self.df_master.columns[12:]  # kolom skill mulai index 12
        return self.df_master[skill_cols].values.astype(np.float32)

    def get_role_riasec_matrix(self):
        riasec_cols = ["R", "I", "A", "S", "E", "C"]
        return self.df_roles[riasec_cols].values.astype(np.float32)

    def encode_user_skills(self, user_skills: list) -> np.ndarray:
        """
        Encode skill user menjadi multi-hot vector (1, 390).
        Skill yang tidak ada di vocabulary diabaikan.

        user_skills: list skill user, contoh ["python", "sql"]
        return     : np.ndarray shape (1, 390)
        """
        # Normalisasi ke lowercase untuk matching
        user_skills_lower = [s.lower().strip() for s in user_skills]
        vector = np.zeros((1, len(self.skill_vocab)), dtype=np.float32)

        matched = []
        for i, skill in enumerate(self.skill_vocab):
            if skill.lower() in user_skills_lower:
                vector[0, i] = 1.0
                matched.append(skill)

        if not matched:
            raise ValueError(
                f"Tidak ada skill yang dikenali. "
                f"Pastikan skill sesuai dengan vocabulary dataset."
            )

        print(f"[encode_user_skills] Skill dikenali: {matched}")
        return vector

    def get_roadmap_by_role(self, role_id: str) -> dict:
        """
        Ambil roadmap dari dataset berdasarkan role_id.
        Roadmap dari dataset DS — bukan dari Generative AI.
        """
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
                "judul"      : row["judul_project"],
                "brief_case" : row["brief_case"],
                "instructions": row["instructions"],
                "tools_used" : row["tools_used"]
            }
            for _, row in projects.iterrows()
        ]

        return {
            "learning_path"  : learning_path,
            "dummy_projects" : dummy_projects
        }


# ══════════════════════════════════════════════════════════════
# 2. HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════════

def get_interest_code(riasec_scores: dict) -> str:
    """
    Ambil 3 huruf RIASEC dengan skor tertinggi.

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
    loader        : DatasetLoader,
    riasec_model  : "tf.keras.Model"
) -> list:
    """
    Hitung persentase relevansi tiap sektor berdasarkan
    rata-rata skor cosine similarity role per bidang.
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

    # Batch predict semua role sekaligus
    user_matrix = np.repeat(user_vector, n_roles, axis=0)
    all_scores  = riasec_model.predict(
        [user_matrix, role_riasec_matrix], verbose=0
    ).flatten().tolist()

    field_names = {
        "F01": "Teknologi Informasi & Software Development",
        "F02": "Data Science & Artificial Intelligence",
        "F03": "Desain Kreatif & UI/UX",
        "F04": "Digital Marketing & Analytics"
    }

    # Kelompokkan skor per bidang
    sector_scores = {fid: [] for fid in field_names}
    for idx, row in loader.df_master.iterrows():
        fid = row["bidang"]
        if fid in sector_scores:
            sector_scores[fid].append(all_scores[idx])

    result = []
    for fid, scores in sector_scores.items():
        if scores:
            result.append({
                "field_id"      : fid,
                "field_name"    : field_names[fid],
                "relevance_pct" : round(sum(scores) / len(scores), 1)
            })

    return sorted(result, key=lambda x: x["relevance_pct"], reverse=True)


# ══════════════════════════════════════════════════════════════
# 3. CUSTOM COMPONENTS — Requirement Coding Camp ★
# ══════════════════════════════════════════════════════════════

class SkillEmbeddingLayer(tf.keras.layers.Layer):
    """
    Custom Layer ★
    Proyeksikan multi-hot skill vector (390 dimensi) ke
    dense embedding space yang lebih bermakna.

    Input : (batch, 390) — binary skill vector
    Output: (batch, embedding_dim) — dense embedding
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
    Custom Layer ★
    Hitung cosine similarity antara user embedding dan role embedding.
    Output dalam persentase 0-100%.

    Input : [user_emb, role_emb] — shape sama
    Output: similarity score (0-100)
    """
    def call(self, inputs):
        user_emb, role_emb = inputs
        user_norm  = tf.nn.l2_normalize(user_emb, axis=-1)
        role_norm  = tf.nn.l2_normalize(role_emb, axis=-1)
        similarity = tf.reduce_sum(
            user_norm * role_norm, axis=-1, keepdims=True
        )
        return (similarity + 1) / 2 * 100

    def get_config(self):
        return super().get_config()


class WeightedMatchingLoss(tf.keras.losses.Loss):
    """
    Custom Loss ★
    Weighted Binary Cross Entropy.
    Role yang jarang diberi bobot lebih tinggi
    untuk kompensasi class imbalance.
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
    Custom Callback ★
    Monitoring training per epoch:
    - Log metrik ke TensorBoard
    - Simpan model terbaik
    - Early stopping
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

        print(f"\n[Callback] Epoch {epoch+1} | "
              f"Avg Similarity: {avg_score:.2f}% | "
              f"Loss: {logs.get('loss', 0):.4f}")

        # Simpan model terbaik + early stopping
        if avg_score > self.best_score:
            self.best_score = avg_score
            self.wait       = 0
            self.model.save("saved_model/careerlens_best.keras")
            print(f"  ✅ Model tersimpan — best: {self.best_score:.2f}%")
        else:
            self.wait += 1
            if self.wait >= self.patience:
                print(f"  ⛔ Early stopping di epoch {epoch+1}")
                self.model.stop_training = True


# ══════════════════════════════════════════════════════════════
# 4. PIPELINE 1 — Metode Minat Karir
#    Filter berbasis database — tidak pakai Deep Learning
#    Alasan: input deterministik (pilih bidang → tampilkan role)
# ══════════════════════════════════════════════════════════════

def recommend_by_interest(field_id: str, loader: DatasetLoader, top_k=5):
    """
    Filter role berdasarkan bidang yang dipilih user.
    Return top_k=5 role tanpa skor kecocokan.

    field_id: "F01" | "F02" | "F03" | "F04"
    """
    # Filter master berdasarkan bidang
    filtered = loader.df_master[
        loader.df_master["bidang"] == field_id
    ].head(top_k)

    results = []
    for _, row in filtered.iterrows():
        roadmap = loader.get_roadmap_by_role(row["role_id"])

        # Ambil gaji dari kolom gaji di master
        gaji = row.get("gaji", "")

        # Ambil skill dari kolom skill (string) bukan matrix
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
            "salary_range"  : gaji,
            "skill_relevant": skill_list,
            "skill_gap"     : [],
            "roadmap"       : roadmap
        })

    return results


# ══════════════════════════════════════════════════════════════
# 5. PIPELINE 2 — Metode Skill (Deep Learning)
#    SkillModel: Siamese Network dengan Cosine Similarity
# ══════════════════════════════════════════════════════════════

def build_skill_model(n_skills: int = 390):
    """
    Bangun SkillModel untuk pencocokan skill user dengan role.

    n_skills: 390 (dari dataset final DS)

    Arsitektur: Two-branch network
    - User branch  : SkillEmbeddingLayer → Dense → Dropout → Dense → embedding (64)
    - Role branch  : Dense → embedding (64)
    - Output       : CosineSimilarityLayer → role_score (0-100%)
                     Dense sigmoid → skill_gap (390 dimensi)
    """
    # ── Input ──────────────────────────────────────────────
    skill_input = tf.keras.Input(
        shape=(n_skills,), name="skill_input"
    )
    role_input  = tf.keras.Input(
        shape=(n_skills,), name="role_skill_profile"
    )

    # ── User Branch ────────────────────────────────────────
    x = SkillEmbeddingLayer(128, name="skill_embedding")(skill_input)
    x = tf.keras.layers.Dense(256, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    user_embedding = tf.keras.layers.Dense(64, name="user_emb")(x)

    # ── Role Branch ────────────────────────────────────────
    y = tf.keras.layers.Dense(128, activation="relu")(role_input)
    y = tf.keras.layers.Dense(64)(y)
    role_embedding = y

    # ── Cosine Similarity → Role Score ─────────────────────
    role_score = CosineSimilarityLayer(
        name="role_score"
    )([user_embedding, role_embedding])

    # ── Skill Gap ──────────────────────────────────────────
    skill_gap = tf.keras.layers.Dense(
        n_skills, activation="sigmoid", name="skill_gap"
    )(user_embedding)

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
    Inference Pipeline 2 — Metode Skill.

    user_skills: list skill user, contoh ["python", "sql"]
    top_k      : 3 role teratas (sesuai desain UI)
    Return     : (results, chart_data)
    """
    role_skill_matrix = loader.get_role_skill_matrix()  # (68, 390)
    n_roles           = len(role_skill_matrix)

    # Encode skill user → (1, 390)
    user_vector = loader.encode_user_skills(user_skills)

    # Batch inference — semua role sekaligus
    user_matrix = np.repeat(user_vector, n_roles, axis=0)  # (68, 390)
    preds       = skill_model.predict(
        [user_matrix, role_skill_matrix], verbose=0
    )
    all_scores  = preds["role_score"].flatten().tolist()

    # Top k role
    sorted_idx = np.argsort(all_scores)[::-1][:top_k]

    results = []
    for idx in sorted_idx:
        row = loader.df_master.iloc[idx]

        # Skill dari kolom string
        role_skills = [
            s.strip()
            for s in str(row.get("skill", "")).split(",")
            if s.strip()
        ]

        # Skill gap = skill role yang tidak dimiliki user
        user_skills_lower = [s.lower().strip() for s in user_skills]
        skill_gap_list    = [
            s for s in role_skills
            if s.lower() not in user_skills_lower
        ]

        roadmap = loader.get_roadmap_by_role(row["role_id"])

        results.append({
            "role_id"       : row["role_id"],
            "role_name"     : row["nama_role"],
            "match_pct"     : round(all_scores[idx], 1),
            "description"   : row.get("deskripsi", ""),
            "salary_range"  : row.get("gaji", ""),
            "skill_relevant": role_skills,
            "skill_gap"     : skill_gap_list,
            "roadmap"       : roadmap
        })

    chart_data = {
        "labels": [r["role_name"] for r in results],
        "scores": [r["match_pct"]  for r in results]
    }

    return results, chart_data


# ══════════════════════════════════════════════════════════════
# 6. PIPELINE 3 — Metode RIASEC (Deep Learning)
#    RIASECModel: Compact Siamese Network
#    Untuk user yang belum tahu minat maupun skill-nya
# ══════════════════════════════════════════════════════════════

def build_riasec_model():
    """
    Bangun RIASECModel untuk pencocokan kepribadian user dengan role.

    Input : riasec_input (6,) + role_riasec_profile (6,)
    Output: riasec_score (0-100%)

    Skor RIASEC user dari tes 30 soal (5 per kategori).
    Normalisasi: (jumlah_5_jawaban - 5) / 20 → range 0-1
    """
    riasec_input = tf.keras.Input(shape=(6,), name="riasec_input")
    role_riasec  = tf.keras.Input(shape=(6,), name="role_riasec_profile")

    # ── User Branch ────────────────────────────────────────
    x = tf.keras.layers.Dense(32, activation="relu")(riasec_input)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(64, activation="relu")(x)
    x = tf.keras.layers.Dense(32)(x)
    user_riasec_emb = x

    # ── Role Branch ────────────────────────────────────────
    y = tf.keras.layers.Dense(32, activation="relu")(role_riasec)
    y = tf.keras.layers.Dense(32)(y)
    role_riasec_emb = y

    # ── Cosine Similarity ──────────────────────────────────
    riasec_score = CosineSimilarityLayer(
        name="riasec_score"
    )([user_riasec_emb, role_riasec_emb])

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
    Inference Pipeline 3 — Metode RIASEC.

    riasec_scores: dict skor 0-1, contoh:
                   {"r":0.8,"i":0.9,"a":0.4,"s":0.6,"e":0.5,"c":0.7}
    top_k        : 3 role teratas (sesuai desain UI)
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
            "salary_range"  : row.get("gaji", ""),
            "skill_relevant": skill_list,
            "skill_gap"     : [],   # RIASEC tidak mengukur skill
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


# ══════════════════════════════════════════════════════════════
# 7. CUSTOM TRAINING LOOP — GradientTape ★
# ══════════════════════════════════════════════════════════════

def train_model(
    model         : tf.keras.Model,
    train_dataset : tf.data.Dataset,
    val_data      : tuple,
    epochs        : int = 50,
    log_dir       : str = "logs/"
):
    """
    Custom training loop menggunakan tf.GradientTape ★
    Tanpa AutoML — dilatih dari awal.

    model        : skill_model atau riasec_model
    train_dataset: tf.data.Dataset berisi (X_batch, y_batch)
    val_data     : tuple (X_val, y_val)
    epochs       : maksimum epoch (early stopping aktif)
    log_dir      : folder log TensorBoard
    """
    import os
    os.makedirs("saved_model", exist_ok=True)
    os.makedirs(log_dir, exist_ok=True)

    optimizer = tf.keras.optimizers.AdamW(
        learning_rate=1e-3,
        weight_decay=1e-4
    )
    loss_fn  = WeightedMatchingLoss()
    callback = CareerLensCallback(val_data, log_dir)
    callback.set_model(model)

    print(f"\n{'='*50}")
    print(f"Training: {model.name}")
    print(f"Epochs  : {epochs}")
    print(f"Log dir : {log_dir}")
    print(f"{'='*50}\n")

    for epoch in range(epochs):
        epoch_losses = []

        for batch in train_dataset:
            X_batch, y_batch = batch

            with tf.GradientTape() as tape:
                y_pred = model(X_batch, training=True)

                if isinstance(y_pred, dict):
                    loss = loss_fn(y_batch, y_pred["role_score"])
                else:
                    loss = loss_fn(y_batch, y_pred)

                # L2 regularization
                reg_loss   = tf.add_n([
                    tf.nn.l2_loss(v)
                    for v in model.trainable_variables
                    if "bias" not in v.name
                ])
                total_loss = loss + 1e-4 * reg_loss

            grads = tape.gradient(total_loss, model.trainable_variables)
            grads, _ = tf.clip_by_global_norm(grads, clip_norm=1.0)
            optimizer.apply_gradients(
                zip(grads, model.trainable_variables)
            )
            epoch_losses.append(float(total_loss))

        avg_loss = sum(epoch_losses) / len(epoch_losses)
        callback.on_epoch_end(epoch, logs={"loss": avg_loss})

        if model.stop_training:
            break

    print(f"\n✅ Training selesai. Model tersimpan di saved_model/")
    return model


# ══════════════════════════════════════════════════════════════
# 8. UNIFIED PREDICT ROUTER
#    Dipanggil dari FastAPI Susi
# ══════════════════════════════════════════════════════════════

def predict(
    method       : str,
    payload      : dict,
    loader       : DatasetLoader,
    skill_model  : tf.keras.Model = None,
    riasec_model : tf.keras.Model = None,
):
    """
    Router utama — satu fungsi untuk semua metode.
    Dipanggil dari endpoint FastAPI /predict.

    method : "interest" | "skill" | "riasec"
    payload: isi request body
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
            "interest_code"         : interest_code,
            "sector_recommendations": sector_recs
        }

    else:
        raise ValueError(
            f"Method '{method}' tidak valid. "
            f"Gunakan: interest | skill | riasec"
        )

    return format_output(method, recommendations, chart_data, extra)


# ══════════════════════════════════════════════════════════════
# 9. FORMAT OUTPUT — Unified response
# ══════════════════════════════════════════════════════════════

def format_output(
    method          : str,
    recommendations : list,
    chart_data      = None,
    extra           : dict = None
):
    """
    Unified output format sesuai API contract.
    Format sama untuk semua metode — Frontend cukup 1 logic handling.
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

    # Tambahan khusus RIASEC
    if method == "riasec" and extra:
        response["data"]["interest_code"] = extra.get("interest_code")
        response["data"]["sector_recommendations"] = extra.get(
            "sector_recommendations", []
        )

    return response