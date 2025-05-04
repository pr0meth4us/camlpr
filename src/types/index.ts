export interface OcrResult {
  plate: string;
  detected_province: string;
  corrected_province: string;
  confidence: number;
}