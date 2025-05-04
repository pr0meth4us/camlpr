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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-blue-800 text-white p-6 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-center">
            <Camera className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">License Plate Detection & OCR</h1>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6 flex flex-col items-center">
          <ImageUpload
              onImageChange={handleImageChange}
              previewUrl={previewUrl}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
          />

          {ocrResults && ocrResults[0] && (
              <div className="w-full flex justify-center mb-8">
                <PlateCard
                    plate={ocrResults[0].plate}
                    province={ocrResults[0].corrected_province}
                    qrUrl={undefined}
                />
              </div>
          )}

          {results && results.length >= 4 && <DetectionResults imagePaths={results} />}

          {ocrResults && <OcrDetails ocrResults={ocrResults} />}
        </main>

        <footer className="bg-blue-900 text-white py-4 mt-auto">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm opacity-75">
            License Plate Detection & OCR System © {new Date().getFullYear()}
          </div>
        </footer>
      </div>
  );
}