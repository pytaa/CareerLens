import tensorflow as tf
import numpy as np
import os

from src.losses    import WeightedMatchingLoss
from src.callbacks import CareerLensCallback

def train_model(
    model         : tf.keras.Model,
    train_dataset : tf.data.Dataset,
    val_data      : tuple,
    epochs        : int  = 50,
    log_dir       : str  = "logs/",
    save_path     : str  = "saved_model/careerlens_best.keras"
) -> tf.keras.Model:
    os.makedirs("saved_model", exist_ok=True)
    os.makedirs(log_dir,       exist_ok=True)

    # Optimizer & Loss 
    optimizer = tf.keras.optimizers.AdamW(
        learning_rate=1e-3,
        weight_decay=1e-4
    )
    loss_fn = WeightedMatchingLoss()   # Custom Loss 

    # Callback 
    callback = CareerLensCallback(     # Custom Callback 
        val_data  = val_data,
        log_dir   = log_dir,
        patience  = 5,
        save_path = save_path
    )
    callback.set_model(model)

    print(f"\n{'='*55}")
    print(f"  Training : {model.name}")
    print(f"  Epochs   : {epochs}")
    print(f"  Log dir  : {log_dir}")
    print(f"  Save     : {save_path}")
    print(f"{'='*55}\n")

    # Training Loop 
    for epoch in range(epochs):
        epoch_losses = []

        for batch in train_dataset:
            X_batch, y_batch = batch

            # GradientTape 
            with tf.GradientTape() as tape:

                # Forward pass
                y_pred = model(X_batch, training=True)

                # Handle dict output (SkillModel)
                # vs tensor output (RIASECModel)
                if isinstance(y_pred, dict):
                    loss = loss_fn(
                        y_batch, y_pred["role_score"]
                    )
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
            grads = tape.gradient(
                total_loss, model.trainable_variables
            )

            # Gradient clipping — stabilitas training
            grads, _ = tf.clip_by_global_norm(
                grads, clip_norm=1.0
            )

            # Update bobot model
            optimizer.apply_gradients(
                zip(grads, model.trainable_variables)
            )

            epoch_losses.append(float(total_loss))

        # Akhir Epoch 
        avg_loss = sum(epoch_losses) / len(epoch_losses)

        # Panggil callback — log + early stopping
        callback.on_epoch_end(
            epoch, logs={"loss": avg_loss}
        )

        # Berhenti kalau early stopping aktif
        if model.stop_training:
            break

    print(f"\n Training selesai.")
    print(f"   Best score : {callback.best_score:.2f}%")
    print(f"   Model      : {save_path}")

    return model
