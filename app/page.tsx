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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 ">
        {/* Sleek Header */}
        <header className="bg-gradient-to-r from-indigo-900 to-gray-900 py-4 shadow-xl border-b border-gray-800/50">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="h-8 w-8 text-cyan-400 animate-pulse" />
              <h1 className="text-3xl font-extrabold text-white tracking-tight">PlateDetect</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          {/* Upload Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-1.5 h-8 bg-cyan-500 rounded mr-3"></span>
              Upload License Plate Image
            </h2>
            <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
              <ImageUpload
                  onImageChange={handleImageChange}
                  previewUrl={previewUrl}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
              />
            </div>
          </div>

          {/* Results Section */}
          {(results || ocrResults) && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-1.5 h-8 bg-cyan-500 rounded mr-3"></span>
                  Detection Results
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* License Plate Card */}
                  {ocrResults && ocrResults[0] && (
                      <div className="bg-gray-900/80 rounded-xl shadow-2xl p-8 flex justify-center items-center w-full max-w-2xl mx-auto">
                          <PlateCard
                              plate={ocrResults[0].plate}
                              province={ocrResults[0].corrected_province}
                              qrUrl={undefined}
                          />
                      </div>
                  )}
                  {/* OCR Details */}
                  {ocrResults && (
                      <div className="bg-gray-900/80 rounded-xl shadow-2xl p-6 flex flex-col min-h-[300px]">
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4 self-start">OCR Analysis</h3>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-full max-w-lg mx-auto bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300">
                            <OcrDetails ocrResults={ocrResults} />
                          </div>
                        </div>
                      </div>
                  )}
                  {/* Detection Images */}
                  {results && results.length >= 4 && (
                      <div className="lg:col-span-1 bg-gray-900/80 rounded-xl shadow-2xl p-6">
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Image Processing</h3>
                        <DetectionResults imagePaths={results} />
                      </div>
                  )}
                </div>
              </div>
          )}
        </main>

        <footer className="bg-gray-950 py-6 border-t border-gray-800/50">
          <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} PlateDetect AI • License Plate Recognition System</p>
            <div className="mt-2 flex justify-center space-x-4">
              <a href="#" className="hover:text-cyan-400 transition-colors">About</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
  );
}