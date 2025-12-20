export type Role = "STUDENT" | "MENTOR" | "ADMIN";
export type Track = "FULL_STACK" | "AI_ML" | "WEB3";
export type AppStatus =
  | "PENDING"
  | "ELIGIBILITY_PASSED"
  | "INTERVIEW_PASSED"
  | "ENROLLED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export type ReferralStatus = "PENDING" | "USED" | "PAID";
export type LessonType = "VIDEO" | "TASK" | "READING" | "QUIZ";
export type SubmissionStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "RESUBMIT";

export interface User {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  image: string | null;
  role: Role;
  email_verified: boolean;
  otp: string | null;
  otp_expiry: string | null;
  learning_streak: number;
  last_active_at: string | null;
  total_time_spent: number;
  linked_in: string | null;
  portfolio: string | null;
  current_job: string | null;
  company: string | null;
  bio: string | null;
  is_alumni: boolean;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  type: string;
  provider: string;
  provider_account_id: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
}

export interface Internship {
  id: string;
  title: string;
  description: string | null;
  track: Track;
  price: number;
  duration: string;
  is_active: boolean;
  curriculum: Record<string, unknown> | null;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  internship_id: string;
  mentor_id: string | null;
  status: AppStatus;
  eligibility_score: number | null;
  interview_score: number | null;
  interview_log: Record<string, unknown> | null;
  payment_status: PaymentStatus;
  payment_id: string | null;
  discount_applied: number;
  created_at: string;
  updated_at: string;
}

export interface InterviewResult {
  id: string;
  user_id: string;
  internship_id: string;
  score: number;
  passed: boolean;
  transcript: Record<string, unknown> | null;
  feedback: string | null;
  duration: number | null;
  created_at: string;
}

export interface Referral {
  id: string;
  code: string;
  referrer_id: string;
  referred_user_id: string | null;
  discount: number;
  status: ReferralStatus;
  earned_amount: number;
  created_at: string;
  used_at: string | null;
}

export interface Course {
  id: string;
  internship_id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  order: number;
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  type: LessonType;
  video_url: string | null;
  content: string | null;
  duration: number | null;
  order: number;
}

export interface Submission {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string | null;
  file_url: string | null;
  status: SubmissionStatus;
  mentor_feedback: string | null;
  grade: number | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface Certificate {
  id: string;
  application_id: string;
  user_id: string;
  unique_code: string;
  grade: string | null;
  issued_at: string;
  certificate_url: string | null;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  time_spent: number;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Partial<User> & Pick<User, "email">;
        Update: Partial<User>;
      };
      accounts: {
        Row: Account;
        Insert: Partial<Account> &
          Pick<
            Account,
            "user_id" | "type" | "provider" | "provider_account_id"
          >;
        Update: Partial<Account>;
      };
      internships: {
        Row: Internship;
        Insert: Partial<Internship> &
          Pick<Internship, "title" | "track" | "price" | "duration">;
        Update: Partial<Internship>;
      };
      applications: {
        Row: Application;
        Insert: Partial<Application> &
          Pick<Application, "user_id" | "internship_id">;
        Update: Partial<Application>;
      };
      interview_results: {
        Row: InterviewResult;
        Insert: Partial<InterviewResult> &
          Pick<
            InterviewResult,
            "user_id" | "internship_id" | "score" | "passed"
          >;
        Update: Partial<InterviewResult>;
      };
      referrals: {
        Row: Referral;
        Insert: Partial<Referral> & Pick<Referral, "code" | "referrer_id">;
        Update: Partial<Referral>;
      };
      courses: {
        Row: Course;
        Insert: Partial<Course> & Pick<Course, "internship_id" | "title">;
        Update: Partial<Course>;
      };
      modules: {
        Row: Module;
        Insert: Partial<Module> & Pick<Module, "course_id" | "title">;
        Update: Partial<Module>;
      };
      lessons: {
        Row: Lesson;
        Insert: Partial<Lesson> & Pick<Lesson, "module_id" | "title" | "type">;
        Update: Partial<Lesson>;
      };
      submissions: {
        Row: Submission;
        Insert: Partial<Submission> & Pick<Submission, "lesson_id" | "user_id">;
        Update: Partial<Submission>;
      };
      certificates: {
        Row: Certificate;
        Insert: Partial<Certificate> &
          Pick<Certificate, "application_id" | "user_id" | "unique_code">;
        Update: Partial<Certificate>;
      };
      lesson_progress: {
        Row: LessonProgress;
        Insert: Partial<LessonProgress> &
          Pick<LessonProgress, "user_id" | "lesson_id">;
        Update: Partial<LessonProgress>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      role: Role;
      track: Track;
      app_status: AppStatus;
      payment_status: PaymentStatus;
      referral_status: ReferralStatus;
      lesson_type: LessonType;
      submission_status: SubmissionStatus;
    };
  };
}
