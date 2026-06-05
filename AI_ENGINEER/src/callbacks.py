
import os
import numpy as np
import tensorflow as tf
from sklearn.metrics import f1_score, precision_score, recall_score


class CareerLensCallback(tf.keras.callbacks.Callback):
    def __init__(self, val_data, log_dir="logs/",
                 patience=10, save_path="saved_model/model.keras"):
        super().__init__()
        self.val_data   = val_data
        self.patience   = patience
        self.save_path  = save_path
        self.best_score = -999
        self.wait       = 0
        os.makedirs(log_dir, exist_ok=True)
        os.makedirs(os.path.dirname(save_path) or ".", exist_ok=True)
        self.writer = tf.summary.create_file_writer(log_dir)

    def on_epoch_end(self, epoch, logs=None):
        (X_u, X_r), y_val = self.val_data
        preds = self.model.predict([X_u, X_r], verbose=0)

        if isinstance(preds, dict):
            scores = preds.get("role_score", preds)
        else:
            scores = preds

        scores = np.array(scores).flatten() / 100.0
        y_pred = (scores >= 0.5).astype(int)
        y_true = y_val.astype(int)

        # Metrik klasifikasi
        accuracy  = float((y_pred == y_true).mean() * 100)
        f1        = float(f1_score(y_true, y_pred, zero_division=0) * 100)
        precision = float(precision_score(y_true, y_pred, zero_division=0) * 100)
        recall    = float(recall_score(y_true, y_pred, zero_division=0) * 100)

        with self.writer.as_default():
            tf.summary.scalar("val_accuracy",  accuracy,  step=epoch)
            tf.summary.scalar("val_f1",        f1,        step=epoch)
            tf.summary.scalar("val_precision", precision, step=epoch)
            tf.summary.scalar("val_recall",    recall,    step=epoch)
            if logs:
                for k, v in logs.items():
                    tf.summary.scalar(k, v, step=epoch)
        self.writer.flush()

        print(
            f"[Callback] Epoch {epoch+1:3d} | "
            f"Acc: {accuracy:.1f}% | "
            f"F1: {f1:.1f}% | "
            f"Prec: {precision:.1f}% | "
            f"Rec: {recall:.1f}% | "
            f"Loss: {logs.get('loss', 0):.4f}"
        )

        # Simpan berdasarkan F1 score (lebih robust dari accuracy)
        if f1 > self.best_score:
            self.best_score = f1
            self.wait       = 0
            self.model.save(self.save_path)
            print(f"  Saved! Best F1: {self.best_score:.1f}%")
        else:
            self.wait += 1
            print(f"  No improvement ({self.wait}/{self.patience})")
            if self.wait >= self.patience:
                print(f"  Early stopping — best F1: {self.best_score:.1f}%")
                self.model.stop_training = True