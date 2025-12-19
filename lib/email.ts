import nodemailer from "nodemailer";

// Create transporter - GoDaddy SMTP
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const fromEmail = `"Gryffindors" <${process.env.EMAIL_USER}>`;

// Base email template with Gryffindors branding
function baseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(132, 26, 28, 0.1); }
    .header { background: linear-gradient(135deg, #841a1c 0%, #a52528 50%, #681416 100%); padding: 32px; text-align: center; }
    .logo { font-size: 28px; font-weight: 700; color: white; letter-spacing: 1px; }
    .logo-icon { display: inline-block; width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; margin-bottom: 12px; line-height: 48px; font-size: 24px; }
    .content { padding: 40px 32px; }
    .title { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
    .text { color: #4a5568; line-height: 1.7; font-size: 15px; margin-bottom: 16px; }
    .button { display: inline-block; background: #841a1c; color: white !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .button:hover { background: #681416; }
    .highlight-box { background: linear-gradient(135deg, #841a1c08 0%, #d79c6410 100%); border: 1px solid #841a1c20; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
    .otp-code { font-size: 36px; font-weight: 700; color: #841a1c; letter-spacing: 8px; font-family: monospace; }
    .info-grid { display: grid; gap: 12px; margin: 20px 0; }
    .info-item { background: #f8f9fa; padding: 12px 16px; border-radius: 8px; }
    .info-label { font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-value { font-size: 16px; font-weight: 600; color: #1a1a1a; margin-top: 4px; }
    .footer { background: #f8f9fa; padding: 24px 32px; text-align: center; border-top: 1px solid #edf2f7; }
    .footer-text { font-size: 13px; color: #718096; margin: 4px 0; }
    .divider { height: 1px; background: #edf2f7; margin: 24px 0; }
    .badge { display: inline-block; background: #d79c64; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-icon">🦁</div>
      <div class="logo">GRYFFINDORS</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p class="footer-text">© ${new Date().getFullYear()} Gryffindors. All rights reserved.</p>
      <p class="footer-text">Building the next generation of tech talent.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ============ OTP Email ============
export async function sendOTPEmail(
  email: string,
  otp: string
): Promise<boolean> {
  const content = `
    <h1 class="title">Verify Your Login</h1>
    <p class="text">Use this verification code to complete your sign-in:</p>
    <div class="highlight-box">
      <div class="otp-code">${otp}</div>
    </div>
    <p class="text" style="color: #718096; font-size: 14px;">
      This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
    </p>
    <div class="divider"></div>
    <p class="text" style="font-size: 13px; color: #a0aec0;">
      If you didn't request this code, please ignore this email or contact support.
    </p>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "🔐 Your Verification Code - Gryffindors",
      html: baseTemplate(content, "Verification Code"),
    });
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
}

// ============ Welcome Email (New Registration) ============
export async function sendWelcomeEmail(
  email: string,
  name: string,
  role: string = "STUDENT"
): Promise<boolean> {
  const roleMessages: Record<
    string,
    { title: string; message: string; cta: string; ctaUrl: string }
  > = {
    STUDENT: {
      title: "Welcome to Gryffindors! 🎓",
      message:
        "You're now part of our learning community. Explore internship programs, build real-world projects, and earn verifiable certificates.",
      cta: "Explore Programs",
      ctaUrl: "/internships",
    },
    MENTOR: {
      title: "Welcome, Mentor! 🌟",
      message:
        "Thank you for joining Gryffindors as a mentor. You'll help shape the next generation of tech talent by reviewing submissions and guiding students.",
      cta: "View Dashboard",
      ctaUrl: "/mentor/dashboard",
    },
    ADMIN: {
      title: "Admin Access Granted 🔑",
      message:
        "You now have administrative access to Gryffindors. Manage students, mentors, courses, and certificates from your dashboard.",
      cta: "Admin Dashboard",
      ctaUrl: "/admin/dashboard",
    },
  };

  const roleInfo = roleMessages[role] || roleMessages.STUDENT;

  const content = `
    <h1 class="title">${roleInfo.title}</h1>
    <p class="text">Hi ${name || "there"},</p>
    <p class="text">${roleInfo.message}</p>
    <div style="text-align: center;">
      <a href="https://gryffindors.in${roleInfo.ctaUrl}" class="button">${
    roleInfo.cta
  }</a>
    </div>
    <div class="divider"></div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Your Role</div>
        <div class="info-value"><span class="badge">${role}</span></div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${email}</div>
      </div>
    </div>
    <p class="text" style="font-size: 14px; color: #718096;">
      Need help? Reply to this email or reach out to our support team.
    </p>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: roleInfo.title,
      html: baseTemplate(content, roleInfo.title),
    });
    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return false;
  }
}

// ============ Enrollment Confirmation ============
export async function sendEnrollmentEmail(
  email: string,
  name: string,
  programTitle: string,
  mentorName?: string
): Promise<boolean> {
  const content = `
    <h1 class="title">You're Enrolled! 🎉</h1>
    <p class="text">Hi ${name || "there"},</p>
    <p class="text">Congratulations! Your enrollment in <strong>${programTitle}</strong> has been confirmed.</p>
    
    <div class="highlight-box">
      <div style="font-size: 14px; color: #718096;">Program</div>
      <div style="font-size: 20px; font-weight: 700; color: #841a1c;">${programTitle}</div>
    </div>

    ${
      mentorName
        ? `
    <div class="info-item" style="margin: 20px 0;">
      <div class="info-label">Your Mentor</div>
      <div class="info-value">${mentorName}</div>
    </div>
    `
        : ""
    }

    <div style="text-align: center;">
      <a href="https://gryffindors.in/student/courses" class="button">Start Learning</a>
    </div>

    <div class="divider"></div>
    <p class="text" style="font-size: 14px;">
      <strong>What's next?</strong>
      <br>• Access your course materials from the dashboard
      <br>• Complete lessons and submit tasks for review
      <br>• Earn your certificate upon completion
    </p>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `🎓 Enrolled: ${programTitle} - Gryffindors`,
      html: baseTemplate(content, "Enrollment Confirmed"),
    });
    return true;
  } catch (error) {
    console.error("Failed to send enrollment email:", error);
    return false;
  }
}

// ============ Mentor Assigned ============
export async function sendMentorAssignedEmail(
  email: string,
  studentName: string,
  mentorName: string,
  programTitle: string
): Promise<boolean> {
  const content = `
    <h1 class="title">Mentor Assigned 👨‍🏫</h1>
    <p class="text">Hi ${studentName || "there"},</p>
    <p class="text">Great news! A mentor has been assigned to guide you through your <strong>${programTitle}</strong> journey.</p>
    
    <div class="highlight-box">
      <div style="font-size: 14px; color: #718096;">Your Mentor</div>
      <div style="font-size: 20px; font-weight: 700; color: #841a1c;">${mentorName}</div>
    </div>

    <p class="text">Your mentor will review your submissions and provide feedback to help you succeed.</p>

    <div style="text-align: center;">
      <a href="https://gryffindors.in/student/dashboard" class="button">View Dashboard</a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `👨‍🏫 Mentor Assigned: ${mentorName} - Gryffindors`,
      html: baseTemplate(content, "Mentor Assigned"),
    });
    return true;
  } catch (error) {
    console.error("Failed to send mentor assigned email:", error);
    return false;
  }
}

// ============ Certificate Issued ============
export async function sendCertificateEmail(
  email: string,
  name: string,
  programTitle: string,
  certificateCode: string,
  grade?: string
): Promise<boolean> {
  const content = `
    <h1 class="title">Certificate Earned! 🏆</h1>
    <p class="text">Hi ${name || "there"},</p>
    <p class="text">Congratulations on completing <strong>${programTitle}</strong>! Your certificate has been issued.</p>
    
    <div class="highlight-box">
      <div style="font-size: 14px; color: #718096;">Certificate ID</div>
      <div style="font-size: 20px; font-weight: 700; color: #841a1c; font-family: monospace;">${certificateCode}</div>
      ${
        grade
          ? `<div style="margin-top: 8px;"><span class="badge">${grade}</span></div>`
          : ""
      }
    </div>

    <div style="text-align: center;">
      <a href="https://gryffindors.in/verify-certificate/${certificateCode}" class="button">View Certificate</a>
    </div>

    <div class="divider"></div>
    <p class="text" style="font-size: 14px; color: #718096;">
      Your certificate can be verified by anyone using the link above. Share it on LinkedIn or your portfolio!
    </p>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `🏆 Certificate: ${programTitle} - Gryffindors`,
      html: baseTemplate(content, "Certificate Issued"),
    });
    return true;
  } catch (error) {
    console.error("Failed to send certificate email:", error);
    return false;
  }
}

// ============ Task Reviewed (for students) ============
export async function sendTaskReviewedEmail(
  email: string,
  name: string,
  lessonTitle: string,
  status: "APPROVED" | "REJECTED" | "RESUBMIT",
  feedback?: string
): Promise<boolean> {
  const statusConfig = {
    APPROVED: { emoji: "✅", title: "Task Approved!", color: "#22c55e" },
    REJECTED: { emoji: "❌", title: "Task Needs Work", color: "#ef4444" },
    RESUBMIT: { emoji: "🔄", title: "Resubmission Required", color: "#f59e0b" },
  };

  const config = statusConfig[status];

  const content = `
    <h1 class="title">${config.emoji} ${config.title}</h1>
    <p class="text">Hi ${name || "there"},</p>
    <p class="text">Your submission for <strong>${lessonTitle}</strong> has been reviewed.</p>
    
    <div class="info-item" style="border-left: 4px solid ${
      config.color
    }; margin: 20px 0;">
      <div class="info-label">Status</div>
      <div class="info-value" style="color: ${config.color};">${status.replace(
    "_",
    " "
  )}</div>
    </div>

    ${
      feedback
        ? `
    <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <div style="font-size: 12px; color: #718096; text-transform: uppercase; margin-bottom: 8px;">Mentor Feedback</div>
      <p style="color: #1a1a1a; margin: 0; font-style: italic;">"${feedback}"</p>
    </div>
    `
        : ""
    }

    <div style="text-align: center;">
      <a href="https://gryffindors.in/student/courses" class="button">View Courses</a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `${config.emoji} Task Review: ${lessonTitle} - Gryffindors`,
      html: baseTemplate(content, config.title),
    });
    return true;
  } catch (error) {
    console.error("Failed to send task reviewed email:", error);
    return false;
  }
}

// ============ New Submission (for mentors) ============
export async function sendNewSubmissionEmail(
  mentorEmail: string,
  mentorName: string,
  studentName: string,
  lessonTitle: string
): Promise<boolean> {
  const content = `
    <h1 class="title">New Submission 📝</h1>
    <p class="text">Hi ${mentorName || "Mentor"},</p>
    <p class="text">You have a new task submission to review.</p>
    
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Student</div>
        <div class="info-value">${studentName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Task</div>
        <div class="info-value">${lessonTitle}</div>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="https://gryffindors.in/mentor/submissions" class="button">Review Now</a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: mentorEmail,
      subject: `📝 New Submission: ${studentName} - ${lessonTitle}`,
      html: baseTemplate(content, "New Submission"),
    });
    return true;
  } catch (error) {
    console.error("Failed to send new submission email:", error);
    return false;
  }
}
