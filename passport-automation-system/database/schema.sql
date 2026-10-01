-- =====================================================================
-- Passport Automation System - PostgreSQL schema
-- Run:  psql -U postgres -f database/schema.sql
-- NOTE: the Spring Boot app also creates/updates these tables automatically
--       (spring.jpa.hibernate.ddl-auto=update), so running this file is optional.
--       The default STATUS_CHANGER user is created by the application on first start
--       (see DataInitializer.java) because its password must be BCrypt-hashed.
-- =====================================================================

-- Create the database (run this part while connected to the default "postgres" database)
-- CREATE DATABASE passport_automation;
-- \c passport_automation

CREATE TABLE IF NOT EXISTS users (
    id             BIGSERIAL PRIMARY KEY,
    full_name      VARCHAR(100) NOT NULL,
    date_of_birth  DATE,
    gender         VARCHAR(20),
    email          VARCHAR(150) NOT NULL UNIQUE,
    mobile         VARCHAR(15),
    address        VARCHAR(500),
    password       VARCHAR(255) NOT NULL,          -- BCrypt hash
    role           VARCHAR(20)  NOT NULL CHECK (role IN ('APPLICANT', 'STATUS_CHANGER')),
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passport_applications (
    id                        BIGSERIAL PRIMARY KEY,
    application_number        VARCHAR(40)  NOT NULL UNIQUE,
    user_id                   BIGINT       NOT NULL REFERENCES users(id),
    full_name                 VARCHAR(100) NOT NULL,
    date_of_birth             DATE         NOT NULL,
    gender                    VARCHAR(20)  NOT NULL,
    father_name               VARCHAR(100) NOT NULL,
    mother_name               VARCHAR(100) NOT NULL,
    marital_status            VARCHAR(20)  NOT NULL,
    email                     VARCHAR(150) NOT NULL,
    mobile                    VARCHAR(15)  NOT NULL,
    address                   VARCHAR(500) NOT NULL,
    city                      VARCHAR(100) NOT NULL,
    state                     VARCHAR(100) NOT NULL,
    pincode                   VARCHAR(10)  NOT NULL,
    passport_type             VARCHAR(20)  NOT NULL CHECK (passport_type IN ('ORDINARY', 'TATKAL')),
    application_type          VARCHAR(20)  NOT NULL CHECK (application_type IN ('FRESH', 'RENEWAL')),
    previous_passport_number  VARCHAR(30),
    place_of_birth            VARCHAR(100) NOT NULL,
    country_of_birth          VARCHAR(100) NOT NULL,
    nationality               VARCHAR(100) NOT NULL,
    status                    VARCHAR(30)  NOT NULL CHECK (status IN
        ('SUBMITTED','UNDER_REVIEW','DOCUMENT_VERIFICATION','APPROVED','REJECTED','PASSPORT_DISPATCHED','COMPLETED')),
    remarks                   VARCHAR(500),
    created_at                TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_status_history (
    id               BIGSERIAL PRIMARY KEY,
    application_id   BIGINT      NOT NULL REFERENCES passport_applications(id) ON DELETE CASCADE,
    previous_status  VARCHAR(30),
    new_status       VARCHAR(30) NOT NULL,
    changed_by       BIGINT      NOT NULL REFERENCES users(id),
    remarks          VARCHAR(500),
    changed_at       TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_user    ON passport_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_app_status  ON passport_applications(status);
CREATE INDEX IF NOT EXISTS idx_hist_app    ON application_status_history(application_id);
