
import numpy as np
import tensorflow as tf


def generate_skill_training_data(
    role_skill_matrix,
    n_samples=30000,
    seed=42
):
    np.random.seed(seed)
    n_roles, n_skills = role_skill_matrix.shape
    X_user, X_role, y_label = [], [], []

    n_pos  = int(n_samples * 0.50)
    n_med  = int(n_samples * 0.30)
    n_hard = n_samples - n_pos - n_med

    # Positive samples
    for _ in range(n_pos):
        role_idx  = np.random.randint(0, n_roles)
        role_vec  = role_skill_matrix[role_idx]
        skill_idx = np.where(role_vec == 1)[0]
        if len(skill_idx) == 0:
            continue
        # User punya 50-100% skill dari role
        keep = np.random.uniform(0.5, 1.0)
        n_k  = max(1, int(len(skill_idx) * keep))
        kept = np.random.choice(skill_idx, n_k, replace=False)
        u    = np.zeros(n_skills, dtype=np.float32)
        u[kept] = 1.0
        X_user.append(u)
        X_role.append(role_vec.astype(np.float32))
        y_label.append(1.0)

    # Medium negative: skill dari role lain
    for _ in range(n_med):
        role_idx  = np.random.randint(0, n_roles)
        role_vec  = role_skill_matrix[role_idx]
        other_idx = (role_idx + np.random.randint(1, n_roles)) % n_roles
        other_vec = role_skill_matrix[other_idx]
        other_ski = np.where(other_vec == 1)[0]
        if len(other_ski) == 0:
            continue
        keep = np.random.uniform(0.4, 0.9)
        n_k  = max(1, int(len(other_ski) * keep))
        kept = np.random.choice(other_ski, n_k, replace=False)
        u    = np.zeros(n_skills, dtype=np.float32)
        u[kept] = 1.0
        X_user.append(u)
        X_role.append(role_vec.astype(np.float32))
        y_label.append(0.0)

    # Hard negative: sedikit skill random
    for _ in range(n_hard):
        role_idx  = np.random.randint(0, n_roles)
        role_vec  = role_skill_matrix[role_idx]
        # User punya 1-3 skill random 
        n_rand = np.random.randint(1, 4)
        rand_i = np.random.choice(n_skills, n_rand, replace=False)
        u      = np.zeros(n_skills, dtype=np.float32)
        u[rand_i] = 1.0
        X_user.append(u)
        X_role.append(role_vec.astype(np.float32))
        y_label.append(0.0)

    # Shuffle
    idx = np.random.permutation(len(X_user))
    return (
        np.array(X_user,  dtype=np.float32)[idx],
        np.array(X_role,  dtype=np.float32)[idx],
        np.array(y_label, dtype=np.float32)[idx]
    )


def generate_riasec_training_data(
    role_riasec_matrix,
    n_samples=5000,
    seed=42
):
    """Generate RIASEC binary training data."""
    np.random.seed(seed)
    n_roles = len(role_riasec_matrix)
    X_user, X_role, y_label = [], [], []

    for i in range(n_samples):
        role_idx = np.random.randint(0, n_roles)
        role_vec = role_riasec_matrix[role_idx]

        if i % 2 == 0:
            # Positive: noise kecil
            noise    = np.random.normal(0, 0.05, 6).astype(np.float32)
            user_vec = np.clip(role_vec + noise, 0.0, 1.0)
            label    = 1.0
        else:
            # Negative: role berbeda
            other    = (role_idx + np.random.randint(1, n_roles)) % n_roles
            user_vec = role_riasec_matrix[other].copy()
            label    = 0.0

        X_user.append(user_vec)
        X_role.append(role_vec.astype(np.float32))
        y_label.append(label)

    idx = np.random.permutation(len(X_user))
    return (
        np.array(X_user,  dtype=np.float32)[idx],
        np.array(X_role,  dtype=np.float32)[idx],
        np.array(y_label, dtype=np.float32)[idx]
    )


def train_val_split(X_user, X_role, y, val_ratio=0.2, seed=42):
    np.random.seed(seed)
    n        = len(X_user)
    idx      = np.random.permutation(n)
    val_size = int(n * val_ratio)
    return (
        X_user[idx[val_size:]], X_role[idx[val_size:]], y[idx[val_size:]],
        X_user[idx[:val_size]], X_role[idx[:val_size]], y[idx[:val_size]]
    )


def make_tf_dataset(X_user, X_role, y, batch_size=64, shuffle=True):
    ds = tf.data.Dataset.from_tensor_slices(((X_user, X_role), y))
    if shuffle:
        ds = ds.shuffle(buffer_size=len(X_user))
    return ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)
