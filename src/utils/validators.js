/**
 * VeriFi Input Validation & Hash Utilities
 */

export const MAX_QR_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
export const ALLOWED_QR_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

export function validateTextInput(text) {
  if (!text || typeof text !== 'string') return false;
  return text.trim().length >= 3;
}

export function validateUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
  return urlPattern.test(trimmed);
}

export function validateQrFile(file) {
  if (!file) return { valid: false, error: 'No file uploaded.' };

  const fileName = file.name.toLowerCase();
  const hasValidExt = ALLOWED_QR_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  if (!hasValidExt) {
    return {
      valid: false,
      error: 'Unsupported format. Please upload a PNG, JPG, or WebP image.',
    };
  }

  if (file.size > MAX_QR_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  return { valid: true };
}

/**
 * Generate a deterministic hash representing the user's active input state.
 */
export function computeInputFingerprint(inputType, payload, scenarioId) {
  let content = '';
  if (inputType === 'text') {
    content = `text:${String(payload || '').trim()}:${scenarioId || ''}`;
  } else if (inputType === 'url') {
    content = `url:${String(payload || '').trim()}:${scenarioId || ''}`;
  } else if (inputType === 'qr') {
    const name = payload && payload.name ? payload.name : String(payload || '');
    content = `qr:${name}:${scenarioId || ''}`;
  } else {
    content = `custom:${String(payload || '')}`;
  }

  // Simple, fast string hashing for state comparison
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}
