import React from "react";

interface DetectionResultsProps {
    imagePaths: string[];
}

export default function DetectionResults({ imagePaths }: DetectionResultsProps) {
    const labels = ["Full w/ box", "Cropped Plate", "Number Segment", "Province Segment"];

    // Icons/indicators for each detection type
    const typeIndicators = [
        "🎯", // Target/detection
        "🔍", // Magnifying glass for cropped
        "🔢", // Numbers
        "🏛️", // Building/province
    ];

    return (
        <div className="space-y-4">
            {labels.map((label, i) => (
                <div
                    key={i}
                    className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-700 transition-all hover:border-indigo-500/50"
                >
                    <div className="flex items-center justify-between bg-gray-800 py-2 px-3 border-b border-gray-700">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg" aria-hidden="true">{typeIndicators[i]}</span>
                            <p className="text-xs font-medium text-gray-300">{label}</p>
                        </div>
                    </div>
                    <div className="p-3">
                        <div className="bg-black/30 rounded-lg overflow-hidden">
                            <img
                                src={imagePaths[i]}
                                alt={label}
                                className="w-full object-contain mx-auto"
                                style={{ height: "100px" }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}