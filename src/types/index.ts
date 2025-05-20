export interface OCRResult {
  plate: string | null;
  corrected_province: string | null;
  number_confidence: number | null;
  province_confidence: number | null;
  format_valid: boolean;
  detected_province?: string | null;
  khmer_province?: string | null
}

export interface PlateDetectionResponse {
  image_paths: Array<string | null>;
  ocr_results: OCRResult[];
}

export const processingSteps = ["Uploading", "Processing", "Detecting Plate", "OCR Analysis", "Complete"] as const;

export interface ApiError extends Error {
  message: string;
  code?: string;
}

export interface HomeProps {}

export type FileChangeHandler = (file: File | null) => void;
export type NavigationDirection = -1 | 1;
