import React from "react";
import { MapPin, BarChart, Hash, ShieldCheck, AlertTriangle } from "lucide-react";

interface OcrResult {
    plate: string;
    detected_province: string;
    corrected_province: string;
    province_confidence: number;
    number_confidence: number;
    format_valid: boolean;
}

interface OcrDetailsProps {
    ocrResults: OcrResult[];
}

export default function OcrDetails({ ocrResults }: OcrDetailsProps) {
    if (!ocrResults.length) return null;

    const {
        detected_province,
        corrected_province,
        plate,
        province_confidence,
        number_confidence,
        format_valid
    } = ocrResults[0];

    // Calculate overall confidence as average of the two scores
    const confidence = (province_confidence + number_confidence) / 2;

    const getConfidenceMeta = (conf: number) => {
        if (conf > 85) return { bg: "bg-gradient-to-r from-cyan-500 to-teal-500", text: "text-white", label: "High" };
        if (conf > 70) return { bg: "bg-gradient-to-r from-yellow-500 to-amber-500", text: "text-white", label: "Medium" };
        return { bg: "bg-gradient-to-r from-red-500 to-rose-500", text: "text-white", label: "Low" };
    };

    const provinceConf = getConfidenceMeta(province_confidence);
    const numberConf = getConfidenceMeta(number_confidence);
    const overallConf = getConfidenceMeta(confidence);

    return (
        <div className="grid grid-cols-1 gap-3">
            {/* Plate Number Metric */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-lg overflow-hidden border border-gray-700/50 hover:border-cyan-800/50 transition-all duration-300 shadow-md">
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 px-4 py-3 border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Hash className="w-5 h-5 text-cyan-400 mr-2" />
                            <p className="text-sm text-gray-300 font-medium">License Plate</p>
                        </div>
                        {format_valid ? (
                            <span className="flex items-center text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full">
                                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Valid Format
                            </span>
                        ) : (
                            <span className="flex items-center text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded-full">
                                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Format Warning
                            </span>
                        )}
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-2xl text-white font-bold tracking-tight">{plate || "—"}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${numberConf.bg} ${numberConf.text}`}>
                            {number_confidence.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <div className={`${numberConf.bg} h-full rounded-full shadow-lg shadow-cyan-900/30 transition-all duration-500`}
                             style={{ width: `${number_confidence}%` }} />
                    </div>
                </div>
            </div>

            {/* Province Metric */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-lg overflow-hidden border border-gray-700/50 hover:border-purple-800/50 transition-all duration-300 shadow-md">
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 px-4 py-3 border-b border-gray-700/50">
                    <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-purple-400 mr-2" />
                        <p className="text-sm text-gray-300 font-medium">Province</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <p className="text-xl text-white font-bold tracking-tight">
                                {corrected_province || "—"}
                            </p>
                            {detected_province !== corrected_province && detected_province && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Detected as: <span className="text-amber-400">{detected_province}</span>
                                </p>
                            )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${provinceConf.bg} ${provinceConf.text}`}>
                            {province_confidence.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <div className={`${provinceConf.bg} h-full rounded-full shadow-lg shadow-purple-900/30 transition-all duration-500`}
                             style={{ width: `${province_confidence}%` }} />
                    </div>
                </div>
            </div>

            {/* Overall Confidence Metric */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-lg overflow-hidden border border-gray-700/50 hover:border-indigo-800/50 transition-all duration-300 shadow-md">
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 px-4 py-3 border-b border-gray-700/50">
                    <div className="flex items-center">
                        <BarChart className="w-5 h-5 text-indigo-400 mr-2" />
                        <p className="text-sm text-gray-300 font-medium">Overall Recognition Confidence</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl text-white font-extrabold">{confidence.toFixed(1)}%</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${overallConf.bg} ${overallConf.text}`}>
                            {overallConf.label}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div className={`${overallConf.bg} h-full rounded-full shadow-lg shadow-indigo-900/30 transition-all duration-500`}
                             style={{ width: `${confidence}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}