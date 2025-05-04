"use client";
import React, { useState } from "react";
import { Camera } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import PlateCard from "@/components/PlateCard";
import DetectionResults from "@/components/DetectionResults";
import OcrDetails from "@/components/OcrDetails";
import { OcrResult } from "@/types";
import { uploadImage } from "@/utils/api";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<string[] | null>(null);
  const [ocrResults, setOcrResults] = useState<OcrResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setResults(null);
    setOcrResults(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await uploadImage(image);
      setResults(data.image_paths);
      setOcrResults(data.ocr_results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-gray-200">
        {/* Sleek Header */}
        <header className="bg-gray-950 py-4 shadow-lg border-b border-gray-800">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="h-6 w-6 text-indigo-400" />
              <h1 className="text-2xl font-bold text-white">PlateDetect</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <span className="text-indigo-400">AI-Powered</span>
              <span>•</span>
              <span>Real-time Processing</span>
              <span>•</span>
              <span>High Accuracy</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Upload Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-indigo-500 rounded mr-2"></span>
              Upload License Plate Image
            </h2>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <ImageUpload
                  onImageChange={handleImageChange}
                  previewUrl={previewUrl}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
              />
            </div>
          </div>

          {/* Results Section - Only shown when there are results */}
          {(results || ocrResults) && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-indigo-500 rounded mr-2"></span>
                  Detection Results
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* License Plate Card - Column 1 */}
                  {ocrResults && ocrResults[0] && (
                      <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex justify-center">
                        <PlateCard
                            plate={ocrResults[0].plate}
                            province={ocrResults[0].corrected_province}
                            qrUrl={undefined}
                        />
                      </div>
                  )}

                  {/* OCR Details - Column 2 */}
                  {ocrResults && (
                      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-medium text-indigo-400 mb-4">OCR Analysis</h3>
                        <OcrDetails ocrResults={ocrResults} />
                      </div>
                  )}

                  {/* Detection Images - Column 3 (spans full width on smaller screens) */}
                  {results && results.length >= 4 && (
                      <div className="lg:col-span-1 bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-medium text-indigo-400 mb-4">Image Processing</h3>
                        <DetectionResults imagePaths={results} />
                      </div>
                  )}
                </div>
              </div>
          )}
        </main>

        <footer className="bg-gray-950 py-4 border-t border-gray-800 mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} PlateDetect AI • License Plate Recognition System</p>
          </div>
        </footer>
      </div>
  );
}