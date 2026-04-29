-- PostgreSQL schema for CareerLens backend
-- Run with: psql -U postgres -d careerlens -f database/schema.sql

BEGIN;

CREATE TABLE IF NOT EXISTS fields (
  field_id VARCHAR(10) PRIMARY KEY,
  field_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
  role_id VARCHAR(10) PRIMARY KEY,
  field_id VARCHAR(10) NOT NULL,
  role_name VARCHAR(100) NOT NULL,
  R REAL,
  I REAL,
  A REAL,
  S REAL,
  E REAL,
  C REAL,
  CONSTRAINT fk_roles_field
    FOREIGN KEY (field_id)
    REFERENCES fields(field_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_roles_field_id ON roles(field_id);

CREATE TABLE IF NOT EXISTS master_roles (
  role_id VARCHAR(10) PRIMARY KEY,
  field_id VARCHAR(10),
  role_name VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  skill VARCHAR(500),
  estimated_salary VARCHAR(50),
  CONSTRAINT fk_master_roles_field
    FOREIGN KEY (field_id)
    REFERENCES fields(field_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_master_roles_field_id ON master_roles(field_id);

CREATE TABLE IF NOT EXISTS test_questions (
  question_id VARCHAR(10) PRIMARY KEY,
  questions TEXT NOT NULL,
  riasec_type CHAR(1) NOT NULL CHECK (riasec_type IN ('R','I','A','S','E','C'))
);

CREATE TABLE IF NOT EXISTS learning_resources (
  resource_id VARCHAR(10) PRIMARY KEY,
  role_id VARCHAR(10) NOT NULL,
  step_number INTEGER NOT NULL,
  nama_skill VARCHAR(100),
  link_course VARCHAR(500),
  tipe VARCHAR(100),
  platform VARCHAR(50),
  CONSTRAINT fk_learning_resources_role
    FOREIGN KEY (role_id)
    REFERENCES master_roles(role_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_learning_resources_role_id ON learning_resources(role_id);

CREATE TABLE IF NOT EXISTS dummy_projects (
  project_id VARCHAR(10) PRIMARY KEY,
  judul_project VARCHAR(200) NOT NULL,
  brief_case TEXT,
  instructions TEXT,
  tools_used VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS project_role_mapping (
  project_id VARCHAR(10) NOT NULL,
  role_id VARCHAR(10) NOT NULL,
  PRIMARY KEY (project_id, role_id),
  CONSTRAINT fk_project_role_mapping_project
    FOREIGN KEY (project_id)
    REFERENCES dummy_projects(project_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_project_role_mapping_role
    FOREIGN KEY (role_id)
    REFERENCES master_roles(role_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_role_mapping_role_id ON project_role_mapping(role_id);

CREATE TABLE IF NOT EXISTS salary (
  role_id VARCHAR(10) PRIMARY KEY,
  estimated_salary VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS user_test_results (
  result_id SERIAL PRIMARY KEY,
  user_session_id VARCHAR(100) UNIQUE NOT NULL,
  riasec_scores JSONB NOT NULL,
  selected_skills JSONB NOT NULL,
  selected_fields JSONB NOT NULL,
  recommended_roles JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
