
import tensorflow as tf


class WeightedMatchingLoss(tf.keras.losses.Loss):
    def __init__(self, pos_weight=2.0, **kwargs):
        super().__init__(**kwargs)
        self.pos_weight = pos_weight

    def call(self, y_true, y_pred):
        y_pred = tf.clip_by_value(y_pred, 1e-7, 1 - 1e-7)
        bce    = -(
            self.pos_weight * y_true * tf.math.log(y_pred) +
            (1 - y_true) * tf.math.log(1 - y_pred)
        )
        return tf.reduce_mean(bce)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"pos_weight": self.pos_weight})
        return cfg
