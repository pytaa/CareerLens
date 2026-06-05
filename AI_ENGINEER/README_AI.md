# CareerLens AI Service

Repository ini berisi pengembangan model Artificial Intelligence yang digunakan pada platform CareerLens untuk menganalisis keterampilan, minat, dan bakat pengguna guna menghasilkan rekomendasi karier yang personal.

---

## Overview

CareerLens AI menggabungkan dua model utama:

### Skill Recommendation Model

Digunakan untuk:

* Analisis keterampilan pengguna
* Career matching
* Skill gap analysis

### RIASEC Personality Model

Digunakan untuk:

* Analisis minat dan bakat
* Holland Code profiling
* Career recommendation

Framework yang digunakan:

* TensorFlow 2.20.0
* Keras
* Scikit-Learn
* FastAPI
* Docker

---

## Dataset

Dataset terdiri dari data profesi, keterampilan, sumber belajar, dan pemetaan RIASEC.

### Dataset Statistics

| Component          | Total |
| ------------------ | ----- |
| Career Roles       | 68    |
| Unique Skills      | 390   |
| Learning Resources | 978   |
| Career Projects    | 68    |

### Generated Training Samples

| Model                      | Total Samples | Training | Validation |
| -------------------------- | ------------- | -------- | ---------- |
| Skill Recommendation Model | 30,000        | 24,000   | 6,000      |
| RIASEC Personality Model   | 5,000         | 4,000    | 1,000      |

Dataset utama:

```text
dataset/
├── master_feature_final.csv
└── master_roles.csv
```

---

## Model Architecture

CareerLens menggunakan TensorFlow Functional API dengan beberapa komponen custom:

* SkillEmbeddingLayer
* CosineSimilarityLayer
* WeightedMatchingLoss
* CareerLensCallback

### Skill Recommendation Model

Model mengevaluasi pasangan:

```text
(User Skill Vector, Role Vector)
```

Output model:

| Output           | Shape        |
| ---------------- | ------------ |
| Role Match Score | (batch, 1)   |
| Skill Gap Vector | (batch, 390) |

### RIASEC Personality Model

Input model:

```text
[R, I, A, S, E, C]
```

Dimana:

* R = Realistic
* I = Investigative
* A = Artistic
* S = Social
* E = Enterprising
* C = Conventional

Output model:

| Output      | Shape      |
| ----------- | ---------- |
| Match Score | (batch, 1) |

### Saved Models

```text
saved_model/
├── skill_model_best.keras
├── skill_model_final.keras
├── riasec_model_best.keras
└── riasec_model_final.keras
```

---

## Training & Evaluation

### Skill Recommendation Model

| Metric    | Score  |
| --------- | ------ |
| Accuracy  | 85.9%  |
| Precision | 78.0%  |
| Recall    | 100.0% |
| F1-Score  | 87.6%  |

### Ranking Performance

| Metric      | Score  |
| ----------- | ------ |
| Precision@1 | 71.0%  |
| Precision@3 | 98.0%  |
| Precision@5 | 100.0% |

### RIASEC Personality Model

| Metric    | Score |
| --------- | ----- |
| Accuracy  | 95.8% |
| Precision | 96.2% |
| Recall    | 95.4% |
| F1-Score  | 95.8% |

---

## Usage

### Clone Repository

```bash
git clone https://github.com/your-username/CareerLens.git

cd CareerLens
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run API Service

```bash
python -m api.main
```

atau

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

API akan berjalan pada:

```text
http://localhost:8000
```

### Production Endpoint

```text
https://shusiee-careerlens-api.hf.space
```

---

## Project Structure

```text
CareerLens/
├── api/
├── dataset/
├── logs/
├── notebooks/
├── saved_model/
├── src/
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## Contributors

| Nama          | ID             | Peran       |
| ------------- | -------------- | ----------- |
| Nazwa Nabila  | CACC319D6X0515 | AI Engineer |
| Susi Pujiarti | CACC319D6X0883 | AI Engineer |

---

Capstone Project – CareerLens
Coding Camp 2025 powered by DBS Foundation
