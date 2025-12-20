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
  passwordHash: string | null;
  image: string | null;
  role: Role;
  emailVerified: boolean;
  otp: string | null;
  otpExpiry: string | null;
  learningStreak: number;
  lastActiveAt: string | null;
  totalTimeSpent: number;
  linkedIn: string | null;
  portfolio: string | null;
  currentJob: string | null;
  company: string | null;
  bio: string | null;
  isAlumni: boolean;
  referralCode: string | null;
  referredBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refreshToken: string | null;
  accessToken: string | null;
  expiresAt: number | null;
  tokenType: string | null;
  scope: string | null;
  idToken: string | null;
}

export interface Internship {
  id: string;
  title: string;
  description: string | null;
  track: Track;
  price: number;
  duration: string;
  isActive: boolean;
  curriculum: Record<string, unknown> | null;
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  internshipId: string;
  mentor_id: string | null;
  status: AppStatus;
  eligibilityScore: number | null;
  interviewScore: number | null;
  interviewLog: Record<string, unknown> | null;
  paymentStatus: PaymentStatus;
  paymentId: string | null;
  discountApplied: number;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewResult {
  id: string;
  userId: string;
  internshipId: string;
  score: number;
  passed: boolean;
  transcript: Record<string, unknown> | null;
  feedback: string | null;
  duration: number | null;
  createdAt: string;
}

export interface Referral {
  id: string;
  code: string;
  referrerId: string;
  referredUserId: string | null;
  discount: number;
  status: ReferralStatus;
  earnedAmount: number;
  createdAt: string;
  usedAt: string | null;
}

export interface Course {
  id: string;
  internshipId: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  order: number;
  createdAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string | null;
  type: LessonType;
  videoUrl: string | null;
  content: string | null;
  duration: number | null;
  order: number;
}

export interface Submission {
  id: string;
  lessonId: string;
  userId: string;
  content: string | null;
  fileUrl: string | null;
  status: SubmissionStatus;
  mentorFeedback: string | null;
  grade: number | null;
  submittedAt: string;
  reviewedAt: string | null;
}

export interface Certificate {
  id: string;
  applicationId: string;
  userId: string;
  uniqueCode: string;
  grade: string | null;
  issuedAt: string;
  certificateUrl: string | null;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
  timeSpent: number;
}

export interface Database {
  public: {
    Tables: {
      User: {
        Row: User;
        Insert: Partial<User> & Pick<User, "email">;
        Update: Partial<User>;
      };
      Account: {
        Row: Account;
        Insert: Partial<Account> &
          Pick<Account, "userId" | "type" | "provider" | "providerAccountId">;
        Update: Partial<Account>;
      };
      Internship: {
        Row: Internship;
        Insert: Partial<Internship> &
          Pick<Internship, "title" | "track" | "price" | "duration">;
        Update: Partial<Internship>;
      };
      Application: {
        Row: Application;
        Insert: Partial<Application> &
          Pick<Application, "userId" | "internshipId">;
        Update: Partial<Application>;
      };
      InterviewResult: {
        Row: InterviewResult;
        Insert: Partial<InterviewResult> &
          Pick<InterviewResult, "userId" | "internshipId" | "score" | "passed">;
        Update: Partial<InterviewResult>;
      };
      Referral: {
        Row: Referral;
        Insert: Partial<Referral> & Pick<Referral, "code" | "referrerId">;
        Update: Partial<Referral>;
      };
      Course: {
        Row: Course;
        Insert: Partial<Course> & Pick<Course, "internshipId" | "title">;
        Update: Partial<Course>;
      };
      Module: {
        Row: Module;
        Insert: Partial<Module> & Pick<Module, "courseId" | "title">;
        Update: Partial<Module>;
      };
      Lesson: {
        Row: Lesson;
        Insert: Partial<Lesson> & Pick<Lesson, "moduleId" | "title" | "type">;
        Update: Partial<Lesson>;
      };
      Submission: {
        Row: Submission;
        Insert: Partial<Submission> & Pick<Submission, "lessonId" | "userId">;
        Update: Partial<Submission>;
      };
      Certificate: {
        Row: Certificate;
        Insert: Partial<Certificate> &
          Pick<Certificate, "applicationId" | "userId" | "uniqueCode">;
        Update: Partial<Certificate>;
      };
      LessonProgress: {
        Row: LessonProgress;
        Insert: Partial<LessonProgress> &
          Pick<LessonProgress, "userId" | "lessonId">;
        Update: Partial<LessonProgress>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      role: Role;
      track: Track;
      app_status: AppStatus;
      paymentStatus: PaymentStatus;
      referral_status: ReferralStatus;
      lesson_type: LessonType;
      submission_status: SubmissionStatus;
    };
  };
}
