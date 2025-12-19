// Security utilities for input sanitization and XSS prevention

// HTML entities to escape for XSS prevention
const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Sanitize user input - removes potentially dangerous patterns
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";

  return (
    input
      // Remove script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove on* event handlers
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
      // Remove javascript: and data: URLs
      .replace(/javascript:/gi, "")
      .replace(/data:/gi, "")
      // Remove dangerous tags
      .replace(/<(iframe|embed|object|form|input|button)[^>]*>/gi, "")
      // Trim whitespace
      .trim()
  );
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string | null {
  if (!email) return null;

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) return null;
  if (trimmed.length > 254) return null;

  return trimmed;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null;

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    // Only allow http and https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Check for SQL injection patterns (even though Prisma handles this)
 */
export function hasSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|EXEC|EXECUTE)\b)/i,
    /(--.*)$/,
    /(;|\||\$\()/,
    /('|")\s*(OR|AND)\s*('|"|\d)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
}

/**
 * Rate limit key generator
 */
export function getRateLimitKey(ip: string, endpoint: string): string {
  return `rate_limit:${endpoint}:${ip}`;
}

/**
 * Validate file upload (check extension and size)
 */
export function validateFileUpload(
  filename: string,
  size: number,
  allowedExtensions: string[] = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".pdf",
    ".doc",
    ".docx",
  ],
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));

  // Check extension
  if (!allowedExtensions.includes(ext)) {
    return { valid: false, error: `File type ${ext} not allowed` };
  }

  // Check size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (size > maxBytes) {
    return { valid: false, error: `File too large. Max ${maxSizeMB}MB` };
  }

  // Block SVG files (potential XSS vector)
  if (ext === ".svg") {
    return {
      valid: false,
      error: "SVG files not allowed for security reasons",
    };
  }

  return { valid: true };
}
