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

export function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

export function sanitizeInput(input: string): string {
  if (!input) return "";

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/<(iframe|embed|object|form|input|button)[^>]*>/gi, "")
    .trim();
}

export function sanitizeEmail(email: string): string | null {
  if (!email) return null;

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) return null;
  if (trimmed.length > 254) return null;

  return trimmed;
}

export function sanitizeUrl(url: string): string | null {
  if (!url) return null;

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

export function hasSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|EXEC|EXECUTE)\b)/i,
    /(--.*)$/,
    /(;|\||\$\()/,
    /('|")\s*(OR|AND)\s*('|"|\d)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

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

export function getRateLimitKey(ip: string, endpoint: string): string {
  return `rate_limit:${endpoint}:${ip}`;
}

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

  if (!allowedExtensions.includes(ext)) {
    return { valid: false, error: `File type ${ext} not allowed` };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (size > maxBytes) {
    return { valid: false, error: `File too large. Max ${maxSizeMB}MB` };
  }

  if (ext === ".svg") {
    return {
      valid: false,
      error: "SVG files not allowed for security reasons",
    };
  }

  return { valid: true };
}
