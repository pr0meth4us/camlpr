// OCR Result Type
export interface OCRResult {
  plate: string | null;
  corrected_province: string | null;
  number_confidence: number | null;
  province_confidence: number | null;
  format_valid: boolean;
  detected_province?: string | null;
}


// API Response Type
export interface PlateDetectionResponse {
  image_paths: Array<string | null>;
  ocr_results: OCRResult[];
}

// Image upload API function response type
export interface UploadImageResponse extends PlateDetectionResponse {}

// Processing steps for progress indicator
export const processingSteps = ["Uploading", "Processing", "Detecting Plate", "OCR Analysis", "Complete"] as const;
export type ProcessingStep = typeof processingSteps[number];

// Function parameter types
export interface UploadImageParams {
  image: File;
}

// Error types
export interface ApiError extends Error {
  message: string;
  code?: string;
}

// For the result image gallery
export interface GalleryImageItem {
  path: string;
  label: string;
  icon: JSX.Element;
}

// Props for the main component
export interface HomeProps {}

// Helper types for event handlers
export type FileChangeHandler = (file: File | null) => void;
export type NavigationDirection = -1 | 1;

// Used for the image parameters
export interface ImageIndex {
  index: number;
}

// Used for validating indices
export interface ValidIndices {
  [key: number]: number;
}