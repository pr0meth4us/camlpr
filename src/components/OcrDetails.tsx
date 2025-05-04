import React from "react";
import { MapPin, BarChart } from "lucide-react";

interface OcrResult {
    detected_province: string;
    corrected_province: string;
    confidence: number;
}

interface OcrDetailsProps {
    ocrResults: OcrResult[];
}

export default function OcrDetails({ ocrResults }: OcrDetailsProps) {
    if (!ocrResults.length) return null;
    const { detected_province, corrected_province, confidence } = ocrResults[0];

    const getConfidenceMeta = (conf: number) => {
        if (conf > 85) return { bg: "bg-emerald-500", text: "text-emerald-50", label: "High" };
        if (conf > 70) return { bg: "bg-amber-500", text: "text-amber-50", label: "Medium" };
        return { bg: "bg-rose-500", text: "text-rose-50", label: "Low" };
    };

    const { bg, text, label } = getConfidenceMeta(confidence);

    return (
        <div className="w-full max-w-lg mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Province Metric */}
                <div className="flex items-center bg-gray-700 rounded-md p-4">
                    <MapPin className="w-6 h-6 text-green-400 mr-4" />
                    <div>
                        <p className="text-xs text-gray-400">Province</p>
                        <p className="text-lg text-white font-semibold">{corrected_province || detected_province || "—"}</p>
                    </div>
                </div>

                {/* Confidence Metric */}
                <div className="bg-gray-700 rounded-md p-4">
                    <p className="text-xs text-gray-400 mb-1">Recognition Confidence</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl text-white font-bold">{confidence.toFixed(1)}%</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>{label}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-600 rounded-full mt-3 overflow-hidden">
                        <div className={`${bg} h-full`} style={{ width: `${confidence}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
