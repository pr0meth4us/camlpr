import React from "react";
import { MapPin, BarChart, Hash, ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";

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
    if (!ocrResults?.length) return null;

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
        if (conf > 85) return {
            bg: "bg-gradient-to-r from-violet-500 to-indigo-500",
            text: "text-white",
            label: "High",
            icon: <ShieldCheck className="w-4 h-4" />
        };
        if (conf > 70) return {
            bg: "bg-gradient-to-r from-amber-500 to-orange-500",
            text: "text-white",
            label: "Medium",
            icon: <AlertCircle className="w-4 h-4" />
        };
        return {
            bg: "bg-gradient-to-r from-red-500 to-rose-500",
            text: "text-white",
            label: "Low",
            icon: <AlertTriangle className="w-4 h-4" />
        };
    };

    const provinceConf = getConfidenceMeta(province_confidence);
    const numberConf = getConfidenceMeta(number_confidence);
    const overallConf = getConfidenceMeta(confidence);

    return (
        <div className="w-full rounded-xl overflow-hidden border border-slate-700/50 transition-all hover:border-indigo-500/30">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-full mr-3"></div>
                    OCR Analysis Results
                </h3>
            </div>

            <div className="bg-slate-900/90 px-6 py-5">
                <div className="grid grid-cols-1 gap-6">
                    {/* Plate Number Metric */}
                    <div className="bg-slate-800/70 rounded-xl p-5 transition-all hover:bg-slate-800/90 hover:shadow-md hover:shadow-violet-900/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <Hash className="w-6 h-6 text-violet-400 mr-3" />
                                <p className="text-sm text-slate-300 font-medium">License Plate</p>
                            </div>
                            {format_valid ? (
                                <span className="flex items-center text-xs bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Valid Format
                </span>
                            ) : (
                                <span className="flex items-center text-xs bg-amber-900/40 text-amber-400 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Format Warning
                </span>
                            )}
                        </div>

                        <div className="flex items-center">
                            <div className="mr-4">
                                <p className="text-3xl text-white font-bold tracking-wider">{plate || "—"}</p>
                            </div>
                            <div className="ml-auto">
                <span className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${numberConf.bg} ${numberConf.text}`}>
                  <span className="mr-1">{numberConf.icon}</span>
                    {number_confidence.toFixed(1)}%
                </span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="w-full h-2 bg-slate-700/60 rounded-full mt-1.5 overflow-hidden">
                                <div
                                    className={`${numberConf.bg} h-full rounded-full shadow-lg transition-all duration-700 ease-out`}
                                    style={{ width: `${number_confidence}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Province Metric */}
                    <div className="bg-slate-800/70 rounded-xl p-5 transition-all hover:bg-slate-800/90 hover:shadow-md hover:shadow-violet-900/20">
                        <div className="flex items-center mb-3">
                            <MapPin className="w-6 h-6 text-indigo-400 mr-3" />
                            <p className="text-sm text-slate-300 font-medium">Province</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl text-white font-bold">
                                    {corrected_province || "—"}
                                </p>
                                {detected_province !== corrected_province && detected_province && (
                                    <p className="text-xs text-slate-400 mt-1">
                                        Initially detected as: <span className="text-amber-400">{detected_province}</span>
                                    </p>
                                )}
                            </div>
                            <span className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${provinceConf.bg} ${provinceConf.text}`}>
                <span className="mr-1">{provinceConf.icon}</span>
                                {province_confidence.toFixed(1)}%
              </span>
                        </div>

                        <div className="mt-4">
                            <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                                <div
                                    className={`${provinceConf.bg} h-full rounded-full shadow-lg transition-all duration-700 ease-out`}
                                    style={{ width: `${province_confidence}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Overall Confidence Metric */}
                    <div className="bg-slate-800/70 rounded-xl p-5 transition-all hover:bg-slate-800/90 hover:shadow-md hover:shadow-violet-900/20">
                        <div className="flex items-center mb-3">
                            <BarChart className="w-6 h-6 text-purple-400 mr-3" />
                            <p className="text-sm text-slate-300 font-medium">Overall Recognition Confidence</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline">
                                <span className="text-3xl text-white font-extrabold">{confidence.toFixed(1)}</span>
                                <span className="text-lg text-white font-bold">%</span>
                            </div>
                            <span className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${overallConf.bg} ${overallConf.text}`}>
                <span className="mr-1">{overallConf.icon}</span>
                                {overallConf.label}
              </span>
                        </div>

                        <div className="mt-4">
                            <div className="w-full h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
                                <div
                                    className={`${overallConf.bg} h-full rounded-full shadow-lg transition-all duration-700 ease-out`}
                                    style={{ width: `${confidence}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}