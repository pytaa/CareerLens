import tensorflow as tf
import numpy as np
import os

from AI_ENGINEER.src.losses    import WeightedMatchingLoss   
from AI_ENGINEER.src.callbacks import CareerLensCallback


def train_model(
    model         : tf.keras.Model,
    train_dataset : tf.data.Dataset,
    val_data      : tuple,
    epochs        : int = 50,
    log_dir       : str = "logs/",
    save_path     : str = "saved_model/careerlens_best.keras"
) -> tf.keras.Model:

    os.makedirs("saved_model", exist_ok=True)
    os.makedirs(log_dir,       exist_ok=True)

    optimizer = tf.keras.optimizers.AdamW(
        learning_rate=1e-3,
        weight_decay=1e-4
    )
    loss_fn = WeightedMatchingLoss()

    callback = CareerLensCallback(
        val_data  = val_data,
        log_dir   = log_dir,
        patience  = 15,         
        save_path = save_path
    )
    callback.set_model(model)

    print(f"\n{'='*55}")
    print(f"  Training : {model.name}")
    print(f"  Epochs   : {epochs}")
    print(f"  Log dir  : {log_dir}")
    print(f"  Save     : {save_path}")
    print(f"{'='*55}\n")

    for epoch in range(epochs):
        epoch_losses = []

        for batch in train_dataset:
            X_batch, y_batch = batch

            with tf.GradientTape() as tape:
                y_pred = model(X_batch, training=True)

                if isinstance(y_pred, dict):
                    role_score = tf.squeeze(y_pred["role_score"], axis=-1)
                    loss = loss_fn(y_batch, role_score / 100.0)
                else:
                    loss = loss_fn(y_batch, y_pred / 100.0)

                reg_loss = tf.add_n([
                    tf.nn.l2_loss(v)
                    for v in model.trainable_variables
                    if "bias" not in v.name
                ])
                total_loss = loss + 5e-5 * reg_loss   # koefisien lebih kecil

            grads = tape.gradient(total_loss, model.trainable_variables)
            grads, _ = tf.clip_by_global_norm(grads, clip_norm=1.0)
            optimizer.apply_gradients(zip(grads, model.trainable_variables))
            epoch_losses.append(float(total_loss))

        avg_loss = sum(epoch_losses) / len(epoch_losses)
        callback.on_epoch_end(epoch, logs={"loss": avg_loss})

        if model.stop_training:
            break

    print(f"\nTraining selesai.")
    print(f"  Best score : {callback.best_score:.2f}%")
    print(f"  Model      : {save_path}")

    return model
