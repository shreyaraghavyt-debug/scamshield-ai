import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { seedAwarenessArticles } from './seed.ts';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'scamshield.db');
export const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email_verified INTEGER NOT NULL DEFAULT 1,
    reset_token_hash TEXT,
    reset_token_expires INTEGER,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    theme TEXT NOT NULL DEFAULT 'light',
    notification_preferences TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS analyses (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    guest_session_id TEXT,
    input_type TEXT NOT NULL,
    analysis_type TEXT NOT NULL,
    company_name TEXT NOT NULL DEFAULT '',
    job_title TEXT NOT NULL DEFAULT '',
    recruiter_email TEXT NOT NULL DEFAULT '',
    website_url TEXT NOT NULL DEFAULT '',
    submitted_content TEXT NOT NULL,
    risk_score INTEGER NOT NULL,
    risk_category TEXT NOT NULL,
    confidence_level TEXT NOT NULL,
    ai_verdict TEXT NOT NULL,
    summary TEXT NOT NULL,
    most_important_warning TEXT NOT NULL,
    detected_flags TEXT NOT NULL,
    positive_indicators TEXT NOT NULL,
    category_breakdown TEXT NOT NULL,
    recommendations TEXT NOT NULL,
    next_steps TEXT NOT NULL,
    limitations TEXT NOT NULL,
    verification_notes TEXT NOT NULL,
    share_id TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_analyses_user_created ON analyses(user_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_analyses_share_id ON analyses(share_id);
  CREATE INDEX IF NOT EXISTS idx_analyses_guest ON analyses(guest_session_id);

  CREATE TABLE IF NOT EXISTS scam_reports (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    is_anonymous INTEGER NOT NULL DEFAULT 0,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    website_url TEXT NOT NULL DEFAULT '',
    recruiter_contact TEXT NOT NULL DEFAULT '',
    scam_category TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence TEXT NOT NULL DEFAULT '',
    moderation_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_reports_created ON scam_reports(created_at DESC);

  CREATE TABLE IF NOT EXISTS awareness_articles (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    read_time TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    example_scam TEXT NOT NULL,
    warning_signs TEXT NOT NULL,
    prevention_tips TEXT NOT NULL,
    quiz TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

seedAwarenessArticles(db);
