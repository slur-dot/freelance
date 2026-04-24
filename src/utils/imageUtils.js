/**
 * Image validation and compression utilities.
 * Enforces constraints to prevent heavy files from slowing down the site.
 */

const DEFAULT_MAX_SIZE_MB = 2;
const DEFAULT_MAX_WIDTH = 2000;
const DEFAULT_MAX_HEIGHT = 2000;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validate an image file for type, size, and dimensions.
 * @param {File} file - Image file to validate
 * @param {Object} options - Validation options
 * @returns {Promise<{ valid: boolean, error: string|null, dimensions?: { width: number, height: number } }>}
 */
export const validateImage = (file, options = {}) => {
  const {
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    maxWidth = DEFAULT_MAX_WIDTH,
    maxHeight = DEFAULT_MAX_HEIGHT,
    allowedTypes = ALLOWED_IMAGE_TYPES
  } = options;

  return new Promise((resolve) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const allowed = allowedTypes.map(t => t.split('/')[1]).join(', ');
      resolve({ valid: false, error: `Type d'image non autorisé. Types autorisés: ${allowed}` });
      return;
    }

    // Check file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      resolve({ valid: false, error: `L'image est trop volumineuse. Taille maximale: ${maxSizeMB}MB (actuelle: ${(file.size / 1024 / 1024).toFixed(1)}MB)` });
      return;
    }

    // Check dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const dimensions = { width: img.width, height: img.height };
      
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({ 
          valid: false, 
          error: `Les dimensions de l'image sont trop grandes. Maximum: ${maxWidth}×${maxHeight}px (actuelle: ${img.width}×${img.height}px)`,
          dimensions 
        });
        return;
      }
      
      resolve({ valid: true, error: null, dimensions });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ valid: false, error: 'Fichier image invalide ou corrompu' });
    };
    
    img.src = objectUrl;
  });
};

/**
 * Compress an image on the client side before uploading.
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} Compressed image blob
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    outputType = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down if necessary
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = objectUrl;
  });
};

/**
 * Validate multiple images (for product listings).
 * @param {FileList|File[]} files - Array of image files
 * @param {Object} options - Validation options
 * @returns {Promise<{ valid: boolean, errors: string[], validFiles: File[] }>}
 */
export const validateMultipleImages = async (files, options = {}) => {
  const { maxCount = 5, ...imageOptions } = options;
  
  if (files.length > maxCount) {
    return { 
      valid: false, 
      errors: [`Maximum ${maxCount} images autorisées (${files.length} sélectionnées)`], 
      validFiles: [] 
    };
  }

  const errors = [];
  const validFiles = [];

  for (let i = 0; i < files.length; i++) {
    const result = await validateImage(files[i], imageOptions);
    if (result.valid) {
      validFiles.push(files[i]);
    } else {
      errors.push(`Image ${i + 1}: ${result.error}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    validFiles
  };
};
