BEGIN;

CREATE TABLE IF NOT EXISTS fields (
  field_id VARCHAR(10) PRIMARY KEY,
  field_name VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS roles (
  role_id VARCHAR(10) PRIMARY KEY, 
  field_id VARCHAR(10) NOT NULL,
  role_name VARCHAR(100) NOT NULL,
  R REAL DEFAULT 0,
  I REAL DEFAULT 0,
  A REAL DEFAULT 0,
  S REAL DEFAULT 0,
  E REAL DEFAULT 0,
  C REAL DEFAULT 0,
  CONSTRAINT fk_roles_field FOREIGN KEY (field_id) REFERENCES fields(field_id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS master_roles (
  role_id VARCHAR(10) PRIMARY KEY,
  field_id VARCHAR(10),
  role_name VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  skill TEXT, 
  estimated_salary VARCHAR(100),
  CONSTRAINT fk_master_roles_field FOREIGN KEY (field_id) REFERENCES fields(field_id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS test_questions (
  question_id VARCHAR(10) PRIMARY KEY,
  questions TEXT NOT NULL,
  riasec_type CHAR(1) NOT NULL CHECK (riasec_type IN ('R','I','A','S','E','C'))
);


CREATE TABLE IF NOT EXISTS learning_resources (
  resource_id VARCHAR(10) PRIMARY KEY,
  role_id VARCHAR(10) NOT NULL,
  step_number INTEGER NOT NULL,
  nama_skill VARCHAR(255),
  link_course TEXT,
  tipe VARCHAR(100),
  platform VARCHAR(100),
  CONSTRAINT fk_resources_role FOREIGN KEY (role_id) REFERENCES master_roles(role_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS dummy_projects (
  project_id VARCHAR(10) PRIMARY KEY,
  judul_project VARCHAR(255) NOT NULL,
  brief_case TEXT,
  instructions TEXT,
  tools_used TEXT
);


CREATE TABLE IF NOT EXISTS project_role_mapping (
  project_id VARCHAR(10) NOT NULL,
  role_id VARCHAR(10) NOT NULL,
  PRIMARY KEY (project_id, role_id),
  CONSTRAINT fk_map_project FOREIGN KEY (project_id) REFERENCES dummy_projects(project_id) ON DELETE CASCADE,
  CONSTRAINT fk_map_role FOREIGN KEY (role_id) REFERENCES master_roles(role_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_test_results (
  result_id SERIAL PRIMARY KEY,
  user_id VARCHAR(100),
  method VARCHAR(20) NOT NULL,
  riasec_scores JSONB, 
  selected_skills JSONB, 
  selected_fields JSONB,
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roles_field ON roles(field_id);
CREATE INDEX IF NOT EXISTS idx_master_roles_field ON master_roles(field_id);
CREATE INDEX IF NOT EXISTS idx_resources_role ON learning_resources(role_id);

COMMIT;

