CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE role AS ENUM ('STUDENT', 'MENTOR', 'ADMIN');
CREATE TYPE track AS ENUM ('FULL_STACK', 'AI_ML', 'WEB3');
CREATE TYPE app_status AS ENUM ('PENDING', 'ELIGIBILITY_PASSED', 'INTERVIEW_PASSED', 'ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE referral_status AS ENUM ('PENDING', 'USED', 'PAID');
CREATE TYPE lesson_type AS ENUM ('VIDEO', 'TASK', 'READING', 'QUIZ');
CREATE TYPE submission_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMIT');

CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  image TEXT,
  role role DEFAULT 'STUDENT',
  email_verified BOOLEAN DEFAULT FALSE,
  otp TEXT,
  otp_expiry TIMESTAMPTZ,
  learning_streak INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  total_time_spent INTEGER DEFAULT 0,
  linked_in TEXT,
  portfolio TEXT,
  current_job TEXT,
  company TEXT,
  bio TEXT,
  is_alumni BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE internships (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  track track NOT NULL,
  price DECIMAL NOT NULL,
  duration TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  curriculum JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id),
  internship_id TEXT NOT NULL REFERENCES internships(id),
  mentor_id TEXT REFERENCES users(id),
  status app_status DEFAULT 'PENDING',
  eligibility_score DECIMAL,
  interview_score DECIMAL,
  interview_log JSONB,
  payment_status payment_status DEFAULT 'PENDING',
  payment_id TEXT,
  discount_applied DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE interview_results (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id),
  internship_id TEXT NOT NULL REFERENCES internships(id),
  score DECIMAL NOT NULL,
  passed BOOLEAN NOT NULL,
  transcript JSONB,
  feedback TEXT,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, internship_id)
);

CREATE TABLE referrals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  referrer_id TEXT NOT NULL REFERENCES users(id),
  referred_user_id TEXT UNIQUE REFERENCES users(id),
  discount DECIMAL DEFAULT 200,
  status referral_status DEFAULT 'PENDING',
  earned_amount DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

CREATE TABLE courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  internship_id TEXT NOT NULL REFERENCES internships(id),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE modules (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE lessons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type lesson_type NOT NULL,
  video_url TEXT,
  content TEXT,
  duration INTEGER,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  lesson_id TEXT NOT NULL REFERENCES lessons(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  content TEXT,
  file_url TEXT,
  status submission_status DEFAULT 'PENDING',
  mentor_feedback TEXT,
  grade INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE certificates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  application_id TEXT UNIQUE NOT NULL REFERENCES applications(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  unique_code TEXT UNIQUE NOT NULL,
  grade TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  certificate_url TEXT
);

CREATE TABLE lesson_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id),
  lesson_id TEXT NOT NULL REFERENCES lessons(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  time_spent INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_internship_id ON applications(internship_id);
CREATE INDEX idx_applications_mentor_id ON applications(mentor_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_lesson_id ON submissions(lesson_id);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_certificates_unique_code ON certificates(unique_code);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internships are viewable by everyone" ON internships FOR SELECT USING (true);
CREATE POLICY "Courses are viewable by everyone" ON courses FOR SELECT USING (true);
CREATE POLICY "Modules are viewable by everyone" ON modules FOR SELECT USING (true);
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);
CREATE POLICY "Certificates are viewable by everyone" ON certificates FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
