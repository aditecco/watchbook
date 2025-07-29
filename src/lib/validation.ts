import DOMPurify from "dompurify";

// Input validation and sanitization utilities
export class InputValidator {
  // Sanitize HTML content to prevent XSS
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "p"],
      ALLOWED_ATTR: ["href", "target"],
      ALLOW_DATA_ATTR: false,
    });
  }

  // Sanitize plain text (remove HTML tags)
  static sanitizeText(text: string): string {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  }

  // Validate and sanitize email
  static validateEmail(email: string): { isValid: boolean; sanitized: string } {
    const sanitized = this.sanitizeText(email.trim().toLowerCase());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(sanitized),
      sanitized,
    };
  }

  // Validate and sanitize password
  static validatePassword(password: string): {
    isValid: boolean;
    sanitized: string;
  } {
    const sanitized = this.sanitizeText(password);
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(sanitized);
    const hasLowerCase = /[a-z]/.test(sanitized);
    const hasNumbers = /\d/.test(sanitized);

    return {
      isValid:
        sanitized.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers,
      sanitized,
    };
  }

  // Validate and sanitize search terms
  static validateSearchTerm(term: string): {
    isValid: boolean;
    sanitized: string;
  } {
    const sanitized = this.sanitizeText(term.trim());
    return {
      isValid: sanitized.length >= 1 && sanitized.length <= 100,
      sanitized,
    };
  }

  // Validate and sanitize note content
  static validateNoteContent(content: string): {
    isValid: boolean;
    sanitized: string;
  } {
    const sanitized = this.sanitizeHtml(content.trim());
    return {
      isValid: sanitized.length >= 1 && sanitized.length <= 1000,
      sanitized,
    };
  }

  // Validate and sanitize tag names
  static validateTagName(name: string): {
    isValid: boolean;
    sanitized: string;
  } {
    const sanitized = this.sanitizeText(name.trim());
    const validChars = /^[a-zA-Z0-9\s\-_]+$/;

    return {
      isValid:
        sanitized.length >= 1 &&
        sanitized.length <= 50 &&
        validChars.test(sanitized),
      sanitized,
    };
  }

  // Validate and sanitize color codes
  static validateColor(color: string): { isValid: boolean; sanitized: string } {
    const sanitized = this.sanitizeText(color.trim());
    const hexRegex = /^#[0-9A-F]{6}$/i;

    return {
      isValid: hexRegex.test(sanitized),
      sanitized: hexRegex.test(sanitized) ? sanitized : "#3B82F6", // Default blue
    };
  }

  // Validate and sanitize rating (1-5)
  static validateRating(rating: number): {
    isValid: boolean;
    sanitized: number;
  } {
    const sanitized = Math.round(rating);
    return {
      isValid: sanitized >= 1 && sanitized <= 5,
      sanitized: sanitized >= 1 && sanitized <= 5 ? sanitized : 1,
    };
  }

  // Validate and sanitize IMDB ID
  static validateImdbId(imdbId: string): {
    isValid: boolean;
    sanitized: string;
  } {
    const sanitized = this.sanitizeText(imdbId.trim());
    const imdbRegex = /^tt\d{7,8}$/;

    return {
      isValid: imdbRegex.test(sanitized),
      sanitized,
    };
  }

  // Validate and sanitize title
  static validateTitle(title: string): { isValid: boolean; sanitized: string } {
    const sanitized = this.sanitizeText(title.trim());
    return {
      isValid: sanitized.length >= 1 && sanitized.length <= 200,
      sanitized,
    };
  }

  // Generic string validation with length limits
  static validateString(
    value: string,
    minLength: number = 1,
    maxLength: number = 255,
  ): { isValid: boolean; sanitized: string } {
    const sanitized = this.sanitizeText(value.trim());
    return {
      isValid: sanitized.length >= minLength && sanitized.length <= maxLength,
      sanitized,
    };
  }

  // Validate numeric input
  static validateNumber(
    value: number,
    min: number = 0,
    max: number = Number.MAX_SAFE_INTEGER,
  ): { isValid: boolean; sanitized: number } {
    const sanitized = Number(value);
    return {
      isValid: !isNaN(sanitized) && sanitized >= min && sanitized <= max,
      sanitized: !isNaN(sanitized) ? sanitized : min,
    };
  }

  // Validate UUID
  static validateUuid(uuid: string): { isValid: boolean; sanitized: string } {
    const sanitized = this.sanitizeText(uuid.trim());
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return {
      isValid: uuidRegex.test(sanitized),
      sanitized,
    };
  }

  // Validate status values
  static validateStatus(status: string): {
    isValid: boolean;
    sanitized: string;
  } {
    const sanitized = this.sanitizeText(status.trim().toLowerCase());
    const validStatuses = ["to_watch", "watched"];

    return {
      isValid: validStatuses.includes(sanitized),
      sanitized: validStatuses.includes(sanitized) ? sanitized : "to_watch",
    };
  }

  // Validate content type
  static validateContentType(type: string): {
    isValid: boolean;
    sanitized: string;
  } {
    const sanitized = this.sanitizeText(type.trim().toLowerCase());
    const validTypes = ["movie", "series", "episode"];

    return {
      isValid: validTypes.includes(sanitized),
      sanitized: validTypes.includes(sanitized) ? sanitized : "movie",
    };
  }
}

// Rate limiting utility
export class RateLimiter {
  private static attempts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  static checkLimit(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 60000,
  ): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  static clearLimit(key: string): void {
    this.attempts.delete(key);
  }
}

// CSRF protection utility
export class CSRFProtection {
  static generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  static validateToken(token: string, storedToken: string): boolean {
    return token === storedToken;
  }
}
