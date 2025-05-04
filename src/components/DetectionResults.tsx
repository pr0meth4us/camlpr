import React from "react";

interface DetectionResultsProps {
  imagePaths: string[];
}

export default function DetectionResults({ imagePaths }: DetectionResultsProps) {
  const labels = ["Full w/ box", "Cropped Plate", "Number Segment", "Province Segment"];

  return (
    <div className="w-full max-w-4xl mb-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">
          Detection & Segmentation
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {labels.map((label, i) => (
            <div key={i} className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
              <h3 className="mb-2 font-medium text-gray-700">{label}</h3>
              <img
                src={imagePaths[i]}
                alt={label}
                className="rounded-lg border border-gray-200 object-contain"
                style={{ height: "120px", width: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}