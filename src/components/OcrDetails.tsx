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
        if (conf > 85) return { bg: "bg-gradient-to-r from-primary to-secondary", text: "text-white", label: "High" };
        if (conf > 70) return { bg: "bg-gradient-to-r from-yellow-500 to-amber-500", text: "text-white", label: "Medium" };
        return { bg: "bg-gradient-to-r from-destructive to-rose-500", text: "text-white", label: "Low" };
    };

    const provinceConf = getConfidenceMeta(province_confidence);
    const numberConf = getConfidenceMeta(number_confidence);
    const overallConf = getConfidenceMeta(confidence);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 gap-4">
                {/* Plate Number Metric */}
                <div className="bg-card/50 rounded-lg p-4 hover:bg-card/80 transition-all duration-200 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <Hash className="w-6 h-6 text-primary mr-3" />
                            <p className="text-sm text-card-foreground font-medium">License Plate</p>
                        </div>
                        {format_valid ? (
                            <span className="flex items-center text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4 mr-1" /> Valid Format
              </span>
                        ) : (
                            <span className="flex items-center text-xs text-amber-400">
                <AlertTriangle className="w-4 h-4 mr-1" /> Format Warning
              </span>
                        )}
                    </div>
                    <p className="text-2xl text-white font-bold tracking-tight">{plate || "—"}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                            <span className="text-xs text-muted-foreground">Number Confidence</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${numberConf.bg} ${numberConf.text}`}>
              {number_confidence.toFixed(1)}%
            </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted/30 rounded-full mt-1.5 overflow-hidden">
                        <div className={`${numberConf.bg} h-full rounded-full shadow-inner transition-all duration-500`}
                             style={{ width: `${number_confidence}%` }} />
                    </div>
                </div>

                {/* Province Metric */}
                <div className="bg-card/50 rounded-lg p-4 hover:bg-card/80 transition-all duration-200 border border-border/50">
                    <div className="flex items-center mb-2">
                        <MapPin className="w-6 h-6 text-secondary mr-3" />
                        <p className="text-sm text-card-foreground font-medium">Province</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl text-white font-bold tracking-tight">
                                {corrected_province || "—"}
                            </p>
                            {detected_province !== corrected_province && detected_province && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Detected as: <span className="text-amber-400">{detected_province}</span>
                                </p>
                            )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${provinceConf.bg} ${provinceConf.text}`}>
              {province_confidence.toFixed(1)}%
            </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted/30 rounded-full mt-2 overflow-hidden">
                        <div className={`${provinceConf.bg} h-full rounded-full shadow-inner transition-all duration-500`}
                             style={{ width: `${province_confidence}%` }} />
                    </div>
                </div>

                {/* Overall Confidence Metric */}
                <div className="bg-card/50 rounded-lg p-4 hover:bg-card/80 transition-all duration-200 border border-border/50">
                    <div className="flex items-center mb-2">
                        <BarChart className="w-6 h-6 text-accent mr-3" />
                        <p className="text-sm text-card-foreground font-medium">Overall Recognition Confidence</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl text-white font-extrabold">{confidence.toFixed(1)}%</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${overallConf.bg} ${overallConf.text}`}>
              {overallConf.label}
            </span>
                    </div>
                    <div className="w-full h-2 bg-muted/30 rounded-full mt-3 overflow-hidden">
                        <div className={`${overallConf.bg} h-full rounded-full shadow-inner transition-all duration-500`}
                             style={{ width: `${confidence}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}