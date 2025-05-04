import React from "react";
import { OcrResult } from "@/types";

interface OcrDetailsProps {
  ocrResults: OcrResult[];
}

export default function OcrDetails({ ocrResults }: OcrDetailsProps) {
  return (
    <div className="w-full max-w-md mb-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">OCR Details</h2>
        {ocrResults.map((ocr, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Plate:</span>
              <span className="font-bold text-xl text-blue-900">{ocr.plate || "–"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Detected Province:</span>
              <span className="font-semibold text-blue-800">{ocr.detected_province || "–"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Corrected Province:</span>
              <span className="font-semibold text-blue-800">{ocr.corrected_province || "–"}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Confidence:</span>
              <div className="flex items-center">
                <div
                  className={`h-2 w-16 rounded-full mr-2 ${
                    ocr.confidence > 85
                      ? "bg-green-500"
                      : ocr.confidence > 70
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${
                      ocr.confidence > 85
                        ? "bg-green-700"
                        : ocr.confidence > 70
                        ? "bg-yellow-700"
                        : "bg-red-700"
                    }`}
                    style={{ width: `${ocr.confidence}%` }}
                  />
                </div>
                <span
                  className={`font-medium ${
                    ocr.confidence > 85
                      ? "text-green-700"
                      : ocr.confidence > 70
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {ocr.confidence.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}