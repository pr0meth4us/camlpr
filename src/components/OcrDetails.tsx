import React from "react";
import { OcrResult } from "@/types";
import { Shield, MapPin, CheckCircle, BarChart } from "lucide-react";

interface OcrDetailsProps {
    ocrResults: OcrResult[];
}

export default function OcrDetails({ ocrResults }: OcrDetailsProps) {
    if (!ocrResults.length) return null;

    // We'll just show the first result
    const ocr = ocrResults[0];

    // Helper function for confidence color
    const getConfidenceColor = (confidence: number) => {
        if (confidence > 85) return { bg: "bg-emerald-500", text: "text-emerald-400" };
        if (confidence > 70) return { bg: "bg-amber-500", text: "text-amber-400" };
        return { bg: "bg-rose-500", text: "text-rose-400" };
    };

    const confidenceColors = getConfidenceColor(ocr.confidence);

    return (
        <div className="space-y-4">
            {/* Plate number display */}
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-medium text-gray-300">License Plate</span>
                </div>
                <div className="pl-8">
                    <span className="text-2xl font-bold text-white tracking-wider">{ocr.plate || "–"}</span>
                </div>
            </div>

            {/* Province information */}
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-medium text-gray-300">Province Information</span>
                </div>
                <div className="pl-8 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Detected:</span>
                        <span className="text-sm font-medium text-gray-200">{ocr.detected_province || "–"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-xs text-gray-400">Corrected:</span>
                            {ocr.detected_province !== ocr.corrected_province && (
                                <CheckCircle className="w-3 h-3 text-emerald-400 ml-1" />
                            )}
                        </div>
                        <span className="text-sm font-medium text-white">{ocr.corrected_province || "–"}</span>
                    </div>
                </div>
            </div>

            {/* Confidence score */}
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                    <BarChart className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-medium text-gray-300">Recognition Confidence</span>
                </div>
                <div className="pl-8">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Score:</span>
                        <span className={`text-sm font-medium ${confidenceColors.text}`}>
              {ocr.confidence.toFixed(2)}%
            </span>
                    </div>
                    <div className="w-full h-2 bg-gray-600 rounded-full">
                        <div
                            className={`h-full rounded-full ${confidenceColors.bg}`}
                            style={{ width: `${ocr.confidence}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}