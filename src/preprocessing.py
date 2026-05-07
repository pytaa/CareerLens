import numpy as np
import tensorflow as tf

def generate_skill_training_data(
    role_skill_matrix : np.ndarray,
    n_samples         : int = 5000,
    seed              : int = 42
) -> tuple:
    np.random.seed(seed)
    n_roles, n_skills = role_skill_matrix.shape

    X_user, X_role, y_label = [], [], []

    for _ in range(n_samples):
        # Pilih role secara acak
        role_idx = np.random.randint(0, n_roles)
        role_vec = role_skill_matrix[role_idx]  # (390,)

        # Simulasi user: punya 40–80% skill dari role
        keep_prob = np.random.uniform(0.4, 0.8)
        mask      = np.random.binomial(1, keep_prob, size=n_skills)
        user_vec  = (role_vec * mask).astype(np.float32)

        # Label: cosine similarity
        norm_u = np.linalg.norm(user_vec)
        norm_r = np.linalg.norm(role_vec)
        label  = float(
            np.dot(user_vec, role_vec) / (norm_u * norm_r)
        ) if norm_u > 0 and norm_r > 0 else 0.0

        X_user.append(user_vec)
        X_role.append(role_vec)
        y_label.append(label)

    return (
        np.array(X_user,  dtype=np.float32),
        np.array(X_role,  dtype=np.float32),
        np.array(y_label, dtype=np.float32)
    )


def generate_riasec_training_data(
    role_riasec_matrix : np.ndarray,
    n_samples          : int = 2000,
    seed               : int = 42
) -> tuple:
    np.random.seed(seed)
    n_roles = len(role_riasec_matrix)

    X_user, X_role, y_label = [], [], []

    for _ in range(n_samples):
        role_idx = np.random.randint(0, n_roles)
        role_vec = role_riasec_matrix[role_idx]  # (6,)

        # Simulasi user: skor RIASEC + noise Gaussian
        noise    = np.random.normal(0, 0.15, size=6)
        user_vec = np.clip(
            role_vec + noise, 0, 1
        ).astype(np.float32)

        # Label: cosine similarity
        norm_u = np.linalg.norm(user_vec)
        norm_r = np.linalg.norm(role_vec)
        label  = float(
            np.dot(user_vec, role_vec) / (norm_u * norm_r)
        ) if norm_u > 0 and norm_r > 0 else 0.0

        X_user.append(user_vec)
        X_role.append(role_vec)
        y_label.append(label)

    return (
        np.array(X_user,  dtype=np.float32),
        np.array(X_role,  dtype=np.float32),
        np.array(y_label, dtype=np.float32)
    )


def make_tf_dataset(
    X_user   : np.ndarray,
    X_role   : np.ndarray,
    y_label  : np.ndarray,
    batch_size: int = 32,
    shuffle  : bool = True
) -> tf.data.Dataset:
    dataset = tf.data.Dataset.from_tensor_slices(
        ((X_user, X_role), y_label)
    )
    if shuffle:
        dataset = dataset.shuffle(buffer_size=len(X_user))
    dataset = dataset.batch(batch_size).prefetch(
        tf.data.AUTOTUNE
    )
    return dataset


def train_val_split(
    X_user  : np.ndarray,
    X_role  : np.ndarray,
    y_label : np.ndarray,
    val_ratio: float = 0.2,
    seed    : int = 42
) -> tuple:
    np.random.seed(seed)
    n         = len(X_user)
    idx       = np.random.permutation(n)
    val_size  = int(n * val_ratio)

    val_idx   = idx[:val_size]
    train_idx = idx[val_size:]

    return (
        X_user[train_idx],  X_role[train_idx],  y_label[train_idx],
        X_user[val_idx],    X_role[val_idx],     y_label[val_idx]
    )
