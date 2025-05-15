// src/components/DetectionResults.tsx
import React from "react";
import Image from "next/image";
import { Target, ZoomIn, Hash, Landmark } from "lucide-react";

interface DetectionResultsProps {
    imagePaths: string[];
}

export default function DetectionResults({ imagePaths }: DetectionResultsProps) {
    const labels = [
        "Full w/ box",
        "Cropped Plate",
        "Number Segment",
        "Province Segment",
    ];

    // add a unique key to each React element
    const typeIndicators = [
        <Target   key="icon-full"       className="w-5 h-5 text-indigo-400" />,
        <ZoomIn   key="icon-cropped"    className="w-5 h-5 text-indigo-400" />,
        <Hash     key="icon-number"     className="w-5 h-5 text-indigo-400" />,
        <Landmark key="icon-province"   className="w-5 h-5 text-indigo-400" />,
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
                            {typeIndicators[i]}
                            <p className="text-sm font-semibold text-gray-200">{label}</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="relative h-[120px] bg-gray-800/30 rounded-lg overflow-hidden shadow-inner">
                            <Image
                                src={imagePaths[i]}
                                alt={label}
                                fill
                                className="object-contain"
                                sizes="100vw"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
