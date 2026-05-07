import tensorflow as tf
import numpy as np
import os

class CareerLensCallback(tf.keras.callbacks.Callback):
    def __init__(
        self,
        val_data  : tuple,
        log_dir   : str = "logs/",
        patience  : int = 5,
        save_path : str = "saved_model/careerlens_best.keras"
    ):
        super().__init__()
        self.val_data   = val_data
        self.patience   = patience
        self.save_path  = save_path
        self.best_score = -999
        self.wait       = 0

        # Buat folder jika belum ada
        os.makedirs(log_dir,                          exist_ok=True)
        os.makedirs(os.path.dirname(save_path) or ".", exist_ok=True)

        # TensorBoard writer
        self.writer = tf.summary.create_file_writer(log_dir)

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
            tf.summary.scalar(
                "val_avg_similarity", avg_score, step=epoch
            )
            if logs:
                for key, val in logs.items():
                    tf.summary.scalar(key, val, step=epoch)
        self.writer.flush()

        print(
            f"\n[CareerLensCallback] Epoch {epoch+1:3d} | "
            f"Avg Similarity : {avg_score:.2f}% | "
            f"Loss           : {logs.get('loss', 0):.4f}"
        )

        # Simpan model terbaik + early stopping 
        if avg_score > self.best_score:
            self.best_score = avg_score
            self.wait       = 0
            self.model.save(self.save_path)
            print(
                f" Model tersimpan → {self.save_path} "
                f"(best: {self.best_score:.2f}%)"
            )
        else:
            self.wait += 1
            print(
                f"  Tidak ada peningkatan "
                f"({self.wait}/{self.patience})"
            )
            if self.wait >= self.patience:
                print(
                    f" Early stopping di epoch {epoch+1} "
                    f"— best score: {self.best_score:.2f}%"
                )
                self.model.stop_training = True
