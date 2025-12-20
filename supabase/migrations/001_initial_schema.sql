CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE "Role" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN');
CREATE TYPE "Track" AS ENUM ('FULL_STACK', 'AI_ML', 'WEB3');
CREATE TYPE "AppStatus" AS ENUM ('PENDING', 'ELIGIBILITY_PASSED', 'INTERVIEW_PASSED', 'ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'USED', 'PAID');
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'TASK', 'READING', 'QUIZ');
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMIT');


CREATE TABLE public."User" (
  id text NOT NULL PRIMARY KEY,
  email text NOT NULL,
  name text,
  "passwordHash" text,
  image text,
  role "Role" NOT NULL DEFAULT 'STUDENT'::"Role",
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp without time zone NOT NULL,
  "emailVerified" boolean NOT NULL DEFAULT false,
  otp text,
  "otpExpiry" timestamp without time zone,
  bio text,
  company text,
  "currentJob" text,
  "isAlumni" boolean NOT NULL DEFAULT false,
  "lastActiveAt" timestamp without time zone,
  "learningStreak" integer NOT NULL DEFAULT 0,
  "linkedIn" text,
  portfolio text,
  "referralCode" text,
  "referredBy" text,
  "totalTimeSpent" integer NOT NULL DEFAULT 0
);

CREATE TABLE public."Internship" (
  id text NOT NULL PRIMARY KEY,
  title text NOT NULL,
  description text,
  track "Track" NOT NULL,
  price double precision NOT NULL,
  duration text NOT NULL,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  curriculum jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE public."Account" (
  id text NOT NULL PRIMARY KEY,
  "userId" text NOT NULL REFERENCES public."User"(id),
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text
);

CREATE TABLE public."Application" (
  id text NOT NULL PRIMARY KEY,
  "userId" text NOT NULL REFERENCES public."User"(id),
  "internshipId" text NOT NULL REFERENCES public."Internship"(id),
  status "AppStatus" NOT NULL DEFAULT 'PENDING'::"AppStatus",
  "eligibilityScore" double precision,
  "interviewScore" double precision,
  "interviewLog" jsonb,
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING'::"PaymentStatus",
  "paymentId" text,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp without time zone NOT NULL,
  "mentorId" text REFERENCES public."User"(id),
  "discountApplied" double precision NOT NULL DEFAULT 0
);

CREATE TABLE public."Certificate" (
  id text NOT NULL PRIMARY KEY,
  "applicationId" text NOT NULL REFERENCES public."Application"(id),
  "userId" text NOT NULL REFERENCES public."User"(id),
  "uniqueCode" text NOT NULL,
  grade text,
  "issuedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "certificateUrl" text
);

CREATE TABLE public."Course" (
  id text NOT NULL PRIMARY KEY,
  "internshipId" text NOT NULL REFERENCES public."Internship"(id),
  title text NOT NULL,
  description text,
  thumbnail text,
  "order" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public."InterviewResult" (
  id text NOT NULL PRIMARY KEY,
  "userId" text NOT NULL REFERENCES public."User"(id),
  "internshipId" text NOT NULL REFERENCES public."Internship"(id),
  score double precision NOT NULL,
  passed boolean NOT NULL,
  transcript jsonb,
  feedback text,
  duration integer,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public."Module" (
  id text NOT NULL PRIMARY KEY,
  "courseId" text NOT NULL REFERENCES public."Course"(id),
  title text NOT NULL,
  description text,
  "order" integer NOT NULL DEFAULT 0
);

CREATE TABLE public."Lesson" (
  id text NOT NULL PRIMARY KEY,
  "moduleId" text NOT NULL REFERENCES public."Module"(id),
  title text NOT NULL,
  description text,
  type "LessonType" NOT NULL,
  "videoUrl" text,
  content text,
  duration integer,
  "order" integer NOT NULL DEFAULT 0
);

CREATE TABLE public."LessonProgress" (
  id text NOT NULL PRIMARY KEY,
  "userId" text NOT NULL REFERENCES public."User"(id),
  "lessonId" text NOT NULL REFERENCES public."Lesson"(id),
  completed boolean NOT NULL DEFAULT false,
  "completedAt" timestamp without time zone,
  "timeSpent" integer NOT NULL DEFAULT 0
);

CREATE TABLE public."Referral" (
  id text NOT NULL PRIMARY KEY,
  code text NOT NULL,
  "referrerId" text NOT NULL REFERENCES public."User"(id),
  "referredUserId" text REFERENCES public."User"(id),
  discount double precision NOT NULL DEFAULT 200,
  status "ReferralStatus" NOT NULL DEFAULT 'PENDING'::"ReferralStatus",
  "earnedAmount" double precision NOT NULL DEFAULT 0,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "usedAt" timestamp without time zone
);

CREATE TABLE public."Submission" (
  id text NOT NULL PRIMARY KEY,
  "lessonId" text NOT NULL REFERENCES public."Lesson"(id),
  "userId" text NOT NULL REFERENCES public."User"(id),
  content text,
  "fileUrl" text,
  status "SubmissionStatus" NOT NULL DEFAULT 'PENDING'::"SubmissionStatus",
  "mentorFeedback" text,
  grade integer,
  "submittedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" timestamp without time zone
);
