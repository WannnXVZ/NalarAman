// Input validation utility for text analysis

export const MAX_TEXT_LENGTH = 2000;
export const MIN_TEXT_LENGTH = 5;

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  charCount: number;
  wordCount: number;
}

export function validateInputText(text: string, maxLength = MAX_TEXT_LENGTH): ValidationResult {
  const trimmed = text.trim();
  const charCount = text.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  if (charCount === 0) {
    return {
      isValid: false,
      errorMessage: 'Pesan belum dimasukkan. Silakan ketik atau tempelkan teks pesan.',
      charCount,
      wordCount,
    };
  }

  if (trimmed.length < MIN_TEXT_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Pesan terlalu pendek (minimal ${MIN_TEXT_LENGTH} karakter).`,
      charCount,
      wordCount,
    };
  }

  if (charCount > maxLength) {
    return {
      isValid: false,
      errorMessage: `Pesan melebihi batas maksimum ${maxLength} karakter (saat ini ${charCount}).`,
      charCount,
      wordCount,
    };
  }

  return {
    isValid: true,
    charCount,
    wordCount,
  };
}
