import tensorflow as tf
from AI_ENGINEER.src.layers import SkillEmbeddingLayer, CosineSimilarityLayer

def build_skill_model(n_skills=390):
    skill_input = tf.keras.Input(shape=(n_skills,), name="skill_input")
    role_input  = tf.keras.Input(shape=(n_skills,), name="role_skill_profile")

    # User Branch — sederhana tapi efektif
    x = SkillEmbeddingLayer(128, name="skill_embedding")(skill_input)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    x = tf.keras.layers.Dense(64, activation="relu")(x)
    user_emb = tf.keras.layers.Dense(32, name="user_emb")(x)

    # Role Branch — simetris dengan user branch
    y = SkillEmbeddingLayer(128)(role_input)
    y = tf.keras.layers.Dense(128, activation="relu")(y)
    y = tf.keras.layers.Dropout(0.2)(y)
    y = tf.keras.layers.Dense(64, activation="relu")(y)
    role_emb = tf.keras.layers.Dense(32, name="role_emb")(y)

    # Cosine Similarity
    role_score = CosineSimilarityLayer(name="role_score")([user_emb, role_emb])

    # Skill Gap dengan loss terpisah
    skill_gap = tf.keras.layers.Dense(
        n_skills, activation="sigmoid", name="skill_gap"
    )(user_emb)

    return tf.keras.Model(
        inputs=[skill_input, role_input],
        outputs={"role_score": role_score, "skill_gap": skill_gap},
        name="SkillModel"
    )

def build_riasec_model():
    riasec_input = tf.keras.Input(shape=(6,), name="riasec_input")
    role_riasec  = tf.keras.Input(shape=(6,), name="role_riasec_profile")
    x = tf.keras.layers.Dense(32, activation="relu")(riasec_input)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(64, activation="relu")(x)
    x = tf.keras.layers.Dense(32)(x)
    user_emb = x
    y = tf.keras.layers.Dense(32, activation="relu")(role_riasec)
    y = tf.keras.layers.Dense(32)(y)
    role_emb = y
    riasec_score = CosineSimilarityLayer(name="riasec_score")([user_emb, role_emb])
    return tf.keras.Model(
        inputs=[riasec_input, role_riasec],
        outputs=riasec_score,
        name="RIASECModel"
    )
