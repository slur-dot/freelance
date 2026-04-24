/**
 * Input sanitization utilities for XSS prevention and file validation.
 * Import and use across all form inputs and file upload handlers.
 */

/**
 * Strips HTML tags and dangerous patterns from user input.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove data: protocol (except data:image for avatars handled separately)
    .replace(/data:(?!image\/)/gi, '')
    // Remove script-related content
    .replace(/(<script[\s\S]*?>[\s\S]*?<\/script>)/gi, '')
    // Trim whitespace
    .trim();
};

/**
 * Sanitize all string values in an object (shallow).
 * @param {Object} obj - Object with string values to sanitize
 * @returns {Object} Object with sanitized string values
 */
export const sanitizeFormData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Allowed file types for different upload contexts.
 */
export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  all: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
};

/**
 * Validates a file's MIME type against an allowed list.
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateFileType = (file, allowedTypes = ALLOWED_FILE_TYPES.images) => {
  if (!file) return { valid: false, error: 'No file provided' };
  
  if (!allowedTypes.includes(file.type)) {
    const allowed = allowedTypes.map(t => t.split('/')[1]).join(', ');
    return { 
      valid: false, 
      error: `Type de fichier non autorisé. Types autorisés: ${allowed}` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validates a file's size against a maximum.
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in megabytes
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateFileSize = (file, maxSizeMB = 2) => {
  if (!file) return { valid: false, error: 'No file provided' };
  
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { 
      valid: false, 
      error: `Le fichier est trop volumineux. Taille maximale: ${maxSizeMB}MB` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Full file validation (type + size).
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateFile = (file, options = {}) => {
  const { 
    allowedTypes = ALLOWED_FILE_TYPES.images, 
    maxSizeMB = 2 
  } = options;
  
  const typeCheck = validateFileType(file, allowedTypes);
  if (!typeCheck.valid) return typeCheck;
  
  const sizeCheck = validateFileSize(file, maxSizeMB);
  if (!sizeCheck.valid) return sizeCheck;
  
  return { valid: true, error: null };
};
