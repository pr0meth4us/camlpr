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
        if (conf > 85) return { bg: "bg-gradient-to-r from-cyan-500 to-teal-500", text: "text-white", label: "High" };
        if (conf > 70) return { bg: "bg-gradient-to-r from-yellow-500 to-amber-500", text: "text-white", label: "Medium" };
        return { bg: "bg-gradient-to-r from-red-500 to-rose-500", text: "text-white", label: "Low" };
    };

    const { bg, text, label } = getConfidenceMeta(confidence);

    return (
        <div className="w-full max-w-lg mx-auto bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Province Metric */}
                <div className="flex items-center bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/80 transition-all duration-200">
                    <MapPin className="w-6 h-6 text-cyan-400 mr-4" />
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Province</p>
                        <p className="text-lg text-white font-bold tracking-tight">{corrected_province || detected_province || "—"}</p>
                    </div>
                </div>

                {/* Confidence Metric */}
                <div className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/80 transition-all duration-200">
                    <p className="text-xs text-gray-400 font-medium mb-1">Recognition Confidence</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl text-white font-extrabold">{confidence.toFixed(1)}%</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text} shadow-md`}>{label}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700/50 rounded-full mt-3 overflow-hidden">
                        <div className={`${bg} h-full rounded-full shadow-inner transition-all duration-500`} style={{ width: `${confidence}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}