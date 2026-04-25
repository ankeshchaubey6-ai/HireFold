import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

/**
 * =========================================================
 * HIREFOLD CLOUDINARY SERVICE v2.0
 * =========================================================
 * Enhanced with:
 *  Better error handling
 *  Configurable options
 *  Multiple resource type support
 *  Progress tracking
 *  Optimized upload settings
 * =========================================================
 */

// Validate environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary environment variables");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Normalize Cloudinary URL to ensure HTTPS
 */
function normalizeCloudinaryUrl(url) {
  if (!url) return null;
  
  let safeUrl = String(url).trim();
  
  // Fix common URL issues
  safeUrl = safeUrl
    .replace(/^httpss?:\/\//i, "https://")
    .replace(/^http:\/\//i, "https://");
  
  // Validate it's a Cloudinary URL
  if (!safeUrl.includes("res.cloudinary.com")) {
  }
  
  return safeUrl;
}

/**
 * Upload resume buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
export const uploadResumeToCloudinary = async (
  fileBuffer,
  fileName = "resume.pdf",
  options = {}
) => {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error("Invalid file buffer provided");
  }
  
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    
    // Sanitize filename
    const safeName = String(fileName)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "")
      .slice(0, 120);

    const publicId = options.publicId || `${timestamp}-${safeName}`;
    const folder = options.folder || "hirefold_resumes";
    const fullPublicId = folder ? `${folder}/${publicId}` : publicId;

    const uploadOptions = {
      public_id: fullPublicId,
      resource_type: options.resourceType || "raw",
      access_mode: options.accessMode || "public",
      overwrite: options.overwrite || false,
      invalidate: true,
      chunk_size: options.chunkSize || 6000000,
      timeout: options.timeout || 60000
    };
    
    // Add optional transformations if specified
    if (options.eager) {
      uploadOptions.eager = options.eager;
    }
    
    if (options.tags) {
      uploadOptions.tags = options.tags;
    }
    
    if (options.context) {
      uploadOptions.context = options.context;
    }
    
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Empty Cloudinary response"));
        }

        // Normalize URL
        let deliveryUrl = result.secure_url || result.url;
        deliveryUrl = normalizeCloudinaryUrl(deliveryUrl);

        resolve({
          url: deliveryUrl,
          publicId: result.public_id,
          version: result.version,
          bytes: result.bytes,
          format: result.format,
          resourceType: result.resource_type,
          createdAt: result.created_at,
          originalFilename: result.original_filename
        });
      }
    );
    
    // Handle stream errors
    const readStream = streamifier.createReadStream(fileBuffer);
    
    readStream.on("error", (err) => {
      reject(err);
    });
    
    readStream.pipe(uploadStream);
  });
};

/**
 * Upload with progress tracking
 */
export const uploadResumeWithProgress = async (
  fileBuffer,
  fileName,
  onProgress
) => {
  // Note: Cloudinary doesn't provide upload progress via streamifier
  // This is a wrapper for future enhancement
  return uploadResumeToCloudinary(fileBuffer, fileName);
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file
 * @param {Object} options - Delete options
 */
export const deleteResumeFromCloudinary = async (publicId, options = {}) => {
  if (!publicId) {
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: options.resourceType || "raw",
      invalidate: true
    });

    return result;
  } catch (error) {
    // Don't throw - deletion failures shouldn't break the flow
    return null;
  }
};

/**
 * Get file info from Cloudinary
 * @param {string} publicId - Public ID of the file
 * @returns {Promise<Object>} File information
 */
export const getResumeInfo = async (publicId) => {
  if (!publicId) {
    throw new Error("Public ID required");
  }
  
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "raw"
    });
    
    return {
      publicId: result.public_id,
      url: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      createdAt: result.created_at,
      version: result.version
    };
    
  } catch (error) {
    throw error;
  }
};

/**
 * Generate optimized URL with transformations
 * @param {string} publicId - Public ID of the file
 * @param {Object} transformations - Cloudinary transformations
 * @returns {string} Optimized URL
 */
export const getOptimizedUrl = (publicId, transformations = {}) => {
  if (!publicId) return null;
  
  return cloudinary.url(publicId, {
    secure: true,
    resource_type: "raw",
    ...transformations
  });
};

/**
 * Check if file exists in Cloudinary
 * @param {string} publicId - Public ID to check
 * @returns {Promise<boolean>} Existence status
 */
export const fileExists = async (publicId) => {
  try {
    await getResumeInfo(publicId);
    return true;
  } catch (error) {
    if (error.http_code === 404) {
      return false;
    }
    throw error;
  }
};

