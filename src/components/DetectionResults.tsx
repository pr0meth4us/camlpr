import React from "react";
import { Target, ZoomIn, Hash, Landmark } from "lucide-react";

interface DetectionResultsProps {
    imagePaths: string[];
}

export default function DetectionResults({ imagePaths }: DetectionResultsProps) {
    const labels = ["Full w/ box", "Cropped Plate", "Number Segment", "Province Segment"];
    const typeIndicators = [
        <Target className="w-5 h-5 text-indigo-400" />,
        <ZoomIn className="w-5 h-5 text-indigo-400" />,
        <Hash className="w-5 h-5 text-indigo-400" />,
        <Landmark className="w-5 h-5 text-indigo-400" />,
    ];

    return (
        <div className="space-y-4">
            {labels.map((label, i) => (
                <div
                    key={i}
                    className="bg-gray-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/70 transition-all duration-300 hover:scale-[1.02]"
                >
                    <div className="flex items-center justify-between bg-gray-800/50 py-3 px-4 border-b border-gray-700/50">
                        <div className="flex items-center space-x-2">
                            <span>{typeIndicators[i]}</span>
                            <p className="text-sm font-semibold text-gray-200">{label}</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="bg-gray-800/30 rounded-lg overflow-hidden shadow-inner">
                            <img
                                src={imagePaths[i]}
                                alt={label}
                                className="w-full object-contain mx-auto"
                                style={{ height: "120px" }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}