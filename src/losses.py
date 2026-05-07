import tensorflow as tf

class WeightedMatchingLoss(tf.keras.losses.Loss):
    def __init__(self, role_weights=None, **kwargs):
        super().__init__(**kwargs)
        self.role_weights = role_weights

    def call(self, y_true, y_pred):
        bce = tf.keras.losses.binary_crossentropy(
            y_true, y_pred
        )
        if self.role_weights is not None:
            weights = tf.cast(self.role_weights, dtype=tf.float32)
            bce     = bce * weights
        return tf.reduce_mean(bce)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"role_weights": self.role_weights})
        return cfg
