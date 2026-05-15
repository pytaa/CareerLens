DROP VIEW IF EXISTS v_role_roadmap CASCADE;
DROP TABLE IF EXISTS recommendation_events CASCADE;
DROP TABLE IF EXISTS user_outputs CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS user_emails CASCADE;
DROP TABLE IF EXISTS role_project_mapping CASCADE;
DROP TABLE IF EXISTS learning_resources CASCADE;
DROP TABLE IF EXISTS role_skills CASCADE;
DROP TABLE IF EXISTS dummy_projects CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS industry_categories CASCADE;
DROP TABLE IF EXISTS career_fields CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- gen_random_uuid() membutuhkan PostgreSQL 13+ (built-in) atau ekstensi pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_ref    TEXT UNIQUE,
    email           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_external_ref ON users (external_ref);

CREATE TABLE user_emails (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users (id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
    verified        BOOLEAN NOT NULL DEFAULT FALSE,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (email)
);

CREATE INDEX idx_user_emails_user ON user_emails (user_id);
CREATE INDEX idx_user_emails_email ON user_emails (email);

CREATE TABLE test_results (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
    test_name       TEXT NOT NULL,
    test_payload    JSONB NOT NULL DEFAULT '{}'::jsonb,
    result_payload  JSONB,
    score           NUMERIC,
    passed          BOOLEAN,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_test_results_user ON test_results (user_id);
CREATE INDEX idx_test_results_name ON test_results (test_name);

CREATE TABLE user_outputs (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
    output_type     TEXT NOT NULL,
    output_value    JSONB NOT NULL DEFAULT '{}'::jsonb,
    context         JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_outputs_user ON user_outputs (user_id);
CREATE INDEX idx_user_outputs_type ON user_outputs (output_type);

CREATE TABLE career_fields (
    field_id       CHAR(3) PRIMARY KEY CHECK (field_id ~ '^F[0-9]{2}$'),
    name           TEXT NOT NULL,
    description    TEXT,
    sort_order     SMALLINT NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO career_fields (field_id, name, description, sort_order) VALUES
    ('F01', 'Teknologi Informasi & Software Development',
     'Perangkat lunak, cloud, dan sistem digital.', 1),
    ('F02', 'Data Science & Artificial Intelligence',
     'Analitik data, machine learning, dan AI.', 2),
    ('F03', 'Desain Kreatif & UI/UX',
     'Pengalaman pengguna dan desain produk digital.', 3),
    ('F04', 'Digital Marketing & Analytics',
     'Pemasaran digital berbasis data dan pertumbuhan.', 4);

CREATE TABLE industry_categories (
    slug           TEXT PRIMARY KEY,
    field_id       CHAR(3) NOT NULL REFERENCES career_fields (field_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    display_title  TEXT NOT NULL
);

INSERT INTO industry_categories (slug, field_id, display_title) VALUES
    ('it_software',        'F01', 'Teknologi Informasi & Software Development'),
    ('data_science',       'F02', 'Data Science & Artificial Intelligence'),
    ('design_uiux',        'F03', 'Desain Kreatif & UI/UX Design'),
    ('digital_marketing',  'F04', 'Digital Marketing & Analytics');

CREATE TABLE roles (
    role_id         TEXT PRIMARY KEY,
    field_id        CHAR(3) NOT NULL REFERENCES career_fields (field_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    role_name       TEXT NOT NULL,
    description     TEXT,
    salary_range    TEXT,
    riasec_r        DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (riasec_r >= 0 AND riasec_r <= 1),
    riasec_i        DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (riasec_i >= 0 AND riasec_i <= 1),
    riasec_a        DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (riasec_a >= 0 AND riasec_a <= 1),
    riasec_s        DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (riasec_s >= 0 AND riasec_s <= 1),
    riasec_e        DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (riasec_e >= 0 AND riasec_e <= 1),
    riasec_c        DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (riasec_c >= 0 AND riasec_c <= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_roles_field ON roles (field_id);
CREATE INDEX idx_roles_name_lower ON roles (lower(role_name));

CREATE TABLE skills (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL UNIQUE,
    normalized_name TEXT GENERATED ALWAYS AS (lower(trim(name))) STORED
);

CREATE INDEX idx_skills_normalized ON skills (normalized_name);

CREATE TABLE role_skills (
    role_id         TEXT NOT NULL REFERENCES roles (role_id) ON UPDATE CASCADE ON DELETE CASCADE,
    skill_id        BIGINT NOT NULL REFERENCES skills (id) ON UPDATE CASCADE ON DELETE CASCADE,
    weight          DOUBLE PRECISION NOT NULL CHECK (weight >= 0 AND weight <= 1),
    PRIMARY KEY (role_id, skill_id)
);

CREATE INDEX idx_role_skills_skill ON role_skills (skill_id);
CREATE INDEX idx_role_skills_weight ON role_skills (role_id) WHERE weight > 0;

CREATE TABLE learning_resources (
    id              BIGSERIAL PRIMARY KEY,
    role_id         TEXT NOT NULL REFERENCES roles (role_id) ON UPDATE CASCADE ON DELETE CASCADE,
    step_number     INTEGER NOT NULL CHECK (step_number >= 1),
    nama_skill      TEXT NOT NULL,
    link_course     TEXT NOT NULL,
    tipe            TEXT,
    platform        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (role_id, step_number)
);

CREATE INDEX idx_learning_resources_role ON learning_resources (role_id);

CREATE TABLE dummy_projects (
    project_id      TEXT PRIMARY KEY,
    judul_project   TEXT NOT NULL,
    brief_case      TEXT,
    instructions    TEXT,
    tools_used      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE role_project_mapping (
    role_id         TEXT NOT NULL REFERENCES roles (role_id) ON UPDATE CASCADE ON DELETE CASCADE,
    project_id      TEXT NOT NULL REFERENCES dummy_projects (project_id) ON UPDATE CASCADE ON DELETE CASCADE,
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    PRIMARY KEY (role_id, project_id)
);

CREATE INDEX idx_role_project_role ON role_project_mapping (role_id);

CREATE TABLE recommendation_events (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
    method          TEXT NOT NULL CHECK (method IN ('interest', 'skill', 'riasec')),
    request_payload JSONB NOT NULL DEFAULT '{}',
    response_payload JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rec_events_user ON recommendation_events (user_id);
CREATE INDEX idx_rec_events_created ON recommendation_events (created_at DESC);

CREATE VIEW v_role_roadmap AS
SELECT
    r.role_id,
    r.role_name,
    r.field_id,
    COALESCE(lp.learning_path, '[]'::json)   AS learning_path,
    COALESCE(dpj.dummy_projects, '[]'::json) AS dummy_projects
FROM roles r
LEFT JOIN LATERAL (
    SELECT json_agg(
        json_build_object(
            'step', lr.step_number,
            'title', lr.nama_skill,
            'resource', lr.link_course,
            'tipe', lr.tipe,
            'platform', lr.platform
        ) ORDER BY lr.step_number
    ) AS learning_path
    FROM learning_resources lr
    WHERE lr.role_id = r.role_id
) lp ON true
LEFT JOIN LATERAL (
    SELECT json_agg(
        json_build_object(
            'project_id', dp.project_id,
            'judul', dp.judul_project,
            'brief_case', dp.brief_case,
            'tools_used', dp.tools_used
        ) ORDER BY rpm.sort_order, dp.project_id
    ) AS dummy_projects
    FROM role_project_mapping rpm
    JOIN dummy_projects dp ON dp.project_id = rpm.project_id
    WHERE rpm.role_id = r.role_id
) dpj ON true;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_roles_updated
    BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER tr_users_updated
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER tr_user_emails_updated
    BEFORE UPDATE ON user_emails
    FOR EACH ROW EXECUTE PROCEDURE set_updated_at();


COMMENT ON TABLE career_fields IS 'Bidang F01–F04; selaras FIELD_NAMES pada DatasetLoader.';
COMMENT ON TABLE industry_categories IS 'Slug industri dari UI MinatKarir → field_id.';
COMMENT ON TABLE roles IS 'Master peran dari master_feature_final.csv (tanpa vektor skill lebar).';
COMMENT ON TABLE skills IS '390+ nama skill unik dari header kolom skill CSV.';
COMMENT ON TABLE role_skills IS 'Matriks role×skill sparse; impor dari nilai non-nol CSV.';
COMMENT ON TABLE learning_resources IS 'Baris learning_resources.csv per role_id + step_number.';
COMMENT ON TABLE dummy_projects IS 'Katalog proyek latihan dari dummy_projects.csv.';
COMMENT ON TABLE role_project_mapping IS 'Relasi many-to-many role–proyek.';
COMMENT ON TABLE recommendation_events IS 'Log opsional untuk endpoint prediksi / rekomendasi.';
COMMENT ON TABLE user_emails IS 'Riwayat email user, termasuk status verifikasi dan email utama.';
COMMENT ON TABLE test_results IS 'Hasil tes pengguna, termasuk payload input dan output skor/hasil.';
COMMENT ON TABLE user_outputs IS 'Output pengguna yang dihasilkan atau disimpan dari berbagai proses.';
COMMENT ON VIEW v_role_roadmap IS 'Gabungan learning path + proyek untuk respons API mirip data_loader.get_roadmap_by_role.';
