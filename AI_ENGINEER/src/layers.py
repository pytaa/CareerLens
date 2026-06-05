import tensorflow as tf

class SkillEmbeddingLayer(tf.keras.layers.Layer):
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