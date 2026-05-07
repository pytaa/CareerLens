import tensorflow as tf
from src.layers import SkillEmbeddingLayer, CosineSimilarityLayer

def build_skill_model(n_skills: int = 390) -> tf.keras.Model:

    # Input 
    skill_input = tf.keras.Input(
        shape=(n_skills,), name="skill_input"
    )
    role_input  = tf.keras.Input(
        shape=(n_skills,), name="role_skill_profile"
    )

    # User Branch 
    x = SkillEmbeddingLayer(128, name="skill_embedding")(skill_input)
    x = tf.keras.layers.Dense(256, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    user_embedding = tf.keras.layers.Dense(64, name="user_emb")(x)

    # Role Branch 
    y = tf.keras.layers.Dense(128, activation="relu")(role_input)
    y = tf.keras.layers.Dense(64)(y)
    role_embedding = y

    # Cosine Similarity → Role Score 
    role_score = CosineSimilarityLayer(
        name="role_score"
    )([user_embedding, role_embedding])

    # Skill Gap 
    # Sigmoid → probability tiap skill perlu ditingkatkan
    skill_gap = tf.keras.layers.Dense(
        n_skills, activation="sigmoid", name="skill_gap"
    )(user_embedding)

    model = tf.keras.Model(
        inputs=[skill_input, role_input],
        outputs={"role_score": role_score, "skill_gap": skill_gap},
        name="SkillModel"
    )

    return model


def build_riasec_model() -> tf.keras.Model:
    
    # Input 
    riasec_input = tf.keras.Input(
        shape=(6,), name="riasec_input"
    )
    role_riasec  = tf.keras.Input(
        shape=(6,), name="role_riasec_profile"
    )

    # User Branch 
    x = tf.keras.layers.Dense(32, activation="relu")(riasec_input)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(64, activation="relu")(x)
    x = tf.keras.layers.Dense(32)(x)
    user_riasec_emb = x

    # Role Branch 
    y = tf.keras.layers.Dense(32, activation="relu")(role_riasec)
    y = tf.keras.layers.Dense(32)(y)
    role_riasec_emb = y

    # Cosine Similarity 
    riasec_score = CosineSimilarityLayer(
        name="riasec_score"
    )([user_riasec_emb, role_riasec_emb])

    model = tf.keras.Model(
        inputs=[riasec_input, role_riasec],
        outputs=riasec_score,
        name="RIASECModel"
    )

    return model