"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  OCRResult,
  ApiError,
  HomeProps,
  FileChangeHandler,
  NavigationDirection,
  processingSteps,
} from "@/types";
import {
  Camera,
  Upload,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  ImageIcon,
  Target,
  ZoomIn,
  Hash,
  Landmark,
  BarChart,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { uploadImage } from "@/utils/api";
import PlateCard from "@/components/PlateCard";

export default function Home({}: HomeProps) {
  // State variables
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<Array<string | null> | null>(null);
  const [ocrResults, setOcrResults] = useState<OCRResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Handle image file changes
  const handleImageChange: FileChangeHandler = useCallback((file) => {
    setImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setResults(null);
    setOcrResults(null);
    setError(null);
    setUploadProgress(0);
    setActiveStep(0);
  }, []);

  // Simulate upload progress and update active step
  const simulateProgress = useCallback(() => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
      setActiveStep((prev) => {
        // Step calculation based on current uploadProgress might lag a bit
        // So just increment if possible to max 4 steps
        const newStep = Math.floor(((uploadProgress || 0) / 100) * 4);
        return newStep > prev ? newStep : prev;
      });
    }, 100);
    return interval;
  }, [uploadProgress]);

  // Handle submit image and fetch results
  const handleSubmit = useCallback(async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }
    setLoading(true);
    setError(null);
    const progressInterval = simulateProgress();
    try {
      const data = await uploadImage(image);
      setResults(data.image_paths);
      setOcrResults(
        // Defensive: ensure fields have fallback values for safe rendering
        data.ocr_results?.map((res: OCRResult) => ({
          plate: res.plate || "N/A",
          corrected_province: res.corrected_province || "Unknown",
          detected_province: res.detected_province || "Unknown",
          number_confidence: res.number_confidence ?? 0,
          province_confidence: res.province_confidence ?? 0,
          khmer_province: res.khmer_province || "Unknown",
          format_valid: res.format_valid ?? false,
        })) || null
      );
      setActiveStep(4);
      setUploadProgress(100);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || "Unknown error");
    } finally {
      setLoading(false);
      clearInterval(progressInterval);
    }
  }, [image, simulateProgress]);
  useCallback(() => {
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement | null;
    if (fileInput) fileInput.click();
  }, []);
  const handleCancel = useCallback(() => {
    handleImageChange(null);
  }, [handleImageChange]);

  const handleRetry = useCallback(() => {
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement | null;
    handleImageChange(null);
    setTimeout(() => {
      if (fileInput) fileInput.click();
    }, 100);
  }, [handleImageChange]);

  // Open modal to show enlarged image
  const openModal = useCallback(
    (index: number) => {
      if (!results) return;
      const validIndices = results.reduce<number[]>((acc, path, idx) => {
        if (path) acc.push(idx);
        return acc;
      }, []);
      const validIndex = validIndices.findIndex((i) => i === index);
      if (validIndex !== -1) {
        setActiveImageIndex(validIndex);
        setModalOpen(true);
        document.body.style.overflow = "hidden";
      }
    },
    [results]
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  // Navigate images in modal
  const navigateImage = useCallback(
    (direction: NavigationDirection) => {
      if (!results) return;
      const validIndices = results.reduce<number[]>((acc, path, idx) => {
        if (path) acc.push(idx);
        return acc;
      }, []);
      if (validIndices.length === 0) return;
      const newIndex = (activeImageIndex + direction + validIndices.length) % validIndices.length;
      setActiveImageIndex(newIndex);
    },
    [results, activeImageIndex]
  );

  // Memoize valid image indices
  const validIndices = useMemo(() => {
    if (!results) return [];
    return results.reduce<number[]>((acc, path, index) => {
      if (path) acc.push(index);
      return acc;
    }, []);
  }, [results]);

  // Labels and icons for images
  const imageLabels = ["Detection", "Cropped Plate", "Numbers Only", "Province"];
  const typeIndicators = [
    <Target key="target" className="w-4 h-4 text-cyan-400" />,
    <ZoomIn key="zoom" className="w-4 h-4 text-blue-400" />,
    <Hash key="hash" className="w-4 h-4 text-indigo-400" />,
    <Landmark key="landmark" className="w-4 h-4 text-purple-400" />,
  ];

  // Helper for confidence bar classes
  const confidenceClass = (val: number) => {
    if (val > 85) return "bg-gradient-to-r from-emerald-500 to-green-600 text-white";
    if (val > 70) return "bg-gradient-to-r from-amber-500 to-yellow-600 text-white";
    return "bg-gradient-to-r from-red-500 to-rose-600 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 to-gray-900 py-4 shadow-xl border-b border-gray-800/50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="h-8 w-8 text-cyan-400 animate-pulse" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">PlateDetect</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Card */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700/50 mb-10">
          <div className="border-b border-gray-800/70">
            <div className="flex p-4">
              <div className="flex items-center">
                <div className="w-1.5 h-8 bg-cyan-500 rounded mr-3"></div>
                <h2 className="text-2xl font-bold text-white">License Plate Recognition</h2>
              </div>
            </div>

            {/* Progress */}
            {(loading || (results && ocrResults)) && (
              <div className="px-6 pb-5 pt-1">
                <div className="flex items-center justify-between mb-2">
                  {processingSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          index <= activeStep
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                            : "bg-gray-800 text-gray-500"
                        }`}
                      >
                        {index < activeStep ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <p className={`text-xs mt-2 font-medium ${index <= activeStep ? "text-cyan-400" : "text-gray-500"}`}>
                        {step}
                      </p>
                      {index < processingSteps.length - 1 && (
                        <div className="absolute left-full top-4 w-full h-0.5 -translate-y-1/2">
                          <div
                            className={`h-full ${index < activeStep ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-gray-800"}`}
                            style={{ width: index < activeStep ? "100%" : "0%" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-0">
            {/* Upload Section */}
            <div className="p-6 border-r border-gray-800/50">
              <div className="flex flex-col space-y-5">
                <div className="flex items-center mb-1">
                  <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-white">Upload License Plate Image</h3>
                </div>

                <label
                  htmlFor="imageUpload"
                  className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
                    previewUrl ? "border-cyan-500/50 bg-cyan-950/20" : "border-gray-700 hover:border-cyan-500/50 bg-black/20 hover:bg-cyan-950/10"
                  }`}
                >
                  <div className="absolute inset-0 w-full h-full opacity-5"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/10 via-blue-600/5 to-indigo-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                    {previewUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl flex items-center justify-center mb-4 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-500/10">
                          <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                        </div>
                        <p className="text-cyan-300 font-semibold">Image Selected</p>
                        <p className="text-xs text-cyan-400/80 mt-2">Click to replace</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-cyan-900/20 group-hover:to-blue-900/20 transition-colors duration-300 transform">
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                        </div>
                        <p className="mb-2 text-sm font-semibold text-gray-200">
                          <span className="text-cyan-400">Upload Image</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 opacity-70">PNG, JPG, or JPEG</p>
                      </>
                    )}
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !previewUrl}
                    className={`relative flex-1 px-6 py-3 rounded-lg font-medium text-sm flex items-center justify-center transition-all duration-300 ${
                      loading || !previewUrl
                        ? "bg-gray-800/30 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transform hover:-translate-y-1"
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <div className="flex items-center">
                        <Camera className="w-4 h-4 mr-2" />
                        <span>Detect License Plate</span>
                      </div>
                    )}
                  </button>

                  {previewUrl && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="p-3 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <button
                        onClick={handleRetry}
                        disabled={loading}
                        className="p-3 rounded-lg bg-amber-950/30 hover:bg-amber-900/40 text-amber-400 hover:text-amber-300 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-900/20 backdrop-blur-sm border-l-4 border-red-500 rounded-lg flex items-start shadow-lg animate-fadeIn">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-red-200 text-sm">{error}</div>
                  </div>
                )}
              </div>

              {previewUrl && (
                <div className="mt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-white">Preview</h3>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-md rounded-xl overflow-hidden border border-gray-800/50 shadow-xl">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-2.5 px-4 border-b border-gray-800 flex items-center">
                      <div className="flex space-x-2 mr-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                      </div>
                      <p className="text-xs font-medium text-gray-400 ml-1">image-preview.jpg</p>
                    </div>

                    <div className="p-4 flex justify-center items-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="rounded-lg object-contain max-h-52 shadow-xl"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-950/50">
              {!results && !ocrResults ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center mb-6">
                    <Camera className="w-10 h-10 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Detection Results</h3>
                  <p className="text-gray-500 max-w-md">
                    Upload an image and click "Detect License Plate" to see the recognition results here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-white">Recognition Results</h3>
                  </div>

                  {ocrResults && ocrResults[0] && (
                    <div className="mb-6">
                      <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/90 rounded-xl p-6 border border-gray-700/50 shadow-lg">
                        <PlateCard
                          plate={ocrResults[0].plate || "N/A"}
                            province={ocrResults[0].corrected_province || "Unreadable"}
                          khmerProvince={ocrResults[0].khmer_province || "អានមិនដាច់"}
                        />

                        <div className="mt-6">
                          <h4 className="text-sm uppercase text-gray-400 font-semibold mb-3 flex items-center">
                            <BarChart className="w-4 h-4 mr-2 text-cyan-400" />
                            Recognition Analysis
                          </h4>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/80 transition-all duration-200">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center">
                                  <Hash className="w-4 h-4 text-cyan-400 mr-2" />
                                  <p className="text-xs text-gray-400 font-medium">Number Confidence</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-semibold ${confidenceClass(ocrResults[0].number_confidence ?? 0)}`}>
                                  {(ocrResults[0].number_confidence ?? 0).toFixed(1)}%
                                </div>
                              </div>
                              <div className="w-full h-1.5 bg-gray-900/80 rounded-full mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${confidenceClass(ocrResults[0].number_confidence ?? 0)}`}
                                  style={{ width: `${ocrResults[0].number_confidence ?? 0}%` }}
                                />
                              </div>
                            </div>

                            <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/80 transition-all duration-200">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 text-purple-400 mr-2" />
                                  <p className="text-xs text-gray-400 font-medium">Province Confidence</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-semibold ${confidenceClass(ocrResults[0].province_confidence ?? 0)}`}>
                                  {(ocrResults[0].province_confidence ?? 0).toFixed(1)}%
                                </div>
                              </div>
                              <div className="w-full h-1.5 bg-gray-900/80 rounded-full mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${confidenceClass(ocrResults[0].province_confidence ?? 0)}`}
                                  style={{ width: `${ocrResults[0].province_confidence ?? 0}%` }}
                                />
                              </div>
                            </div>

                            <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/80 transition-all duration-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
                                  <p className="text-xs text-gray-400 font-medium">Format Validation</p>
                                </div>
                                {ocrResults[0].format_valid ? (
                                  <div className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded text-xs font-semibold flex items-center">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Valid
                                  </div>
                                ) : (
                                  <div className="bg-amber-900/30 text-amber-400 px-2 py-1 rounded text-xs font-semibold flex items-center">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Warning
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/80 transition-all duration-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Landmark className="w-4 h-4 text-blue-400 mr-2" />
                                  <p className="text-xs text-gray-400 font-medium">Province</p>
                                </div>
                                <div className="text-white text-xs font-semibold">
                                  {ocrResults[0].corrected_province || "Unknown"}
                                </div>
                              </div>
                              {ocrResults[0].detected_province !== ocrResults[0].corrected_province && (
                                <div className="mt-1 flex items-center justify-end">
                                  <p className="text-xs text-amber-400">
                                    Detected: {ocrResults[0].detected_province || "Unknown"}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 bg-gray-800/70 rounded-lg p-4 border border-gray-700/30">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <BarChart className="w-5 h-5 text-cyan-400 mr-2" />
                                <p className="text-sm text-white font-medium">Overall Recognition Confidence</p>
                              </div>

                              {(() => {
                                const overallConfidence =
                                  ((ocrResults[0].province_confidence ?? 0) + (ocrResults[0].number_confidence ?? 0)) / 2;
                                let confidenceClassOverall: string;
                                let confidenceLabel: string;

                                if (overallConfidence > 85) {
                                  confidenceClassOverall = "bg-gradient-to-r from-emerald-500 to-cyan-600";
                                  confidenceLabel = "High";
                                } else if (overallConfidence > 70) {
                                  confidenceClassOverall = "bg-gradient-to-r from-amber-500 to-yellow-600";
                                  confidenceLabel = "Medium";
                                } else {
                                  confidenceClassOverall = "bg-gradient-to-r from-red-500 to-rose-600";
                                  confidenceLabel = "Low";
                                }

                                return (
                                  <div className="flex items-center">
                                    <span className="text-xl font-bold text-white mr-3">
                                      {overallConfidence.toFixed(1)}%
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${confidenceClassOverall}`}>
                                      {confidenceLabel}
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="w-full h-2 bg-gray-900/70 rounded-full mt-2 overflow-hidden">
                              {(() => {
                                const overallConfidence =
                                  ((ocrResults[0].province_confidence ?? 0) + (ocrResults[0].number_confidence ?? 0)) / 2;
                                let confidenceClassOverall: string;

                                if (overallConfidence > 85) {
                                  confidenceClassOverall = "bg-gradient-to-r from-emerald-500 to-cyan-600";
                                } else if (overallConfidence > 70) {
                                  confidenceClassOverall = "bg-gradient-to-r from-amber-500 to-yellow-600";
                                } else {
                                  confidenceClassOverall = "bg-gradient-to-r from-red-500 to-rose-600";
                                }

                                return (
                                  <div
                                    className={`h-full ${confidenceClassOverall} rounded-full shadow-inner transition-all duration-500`}
                                    style={{ width: `${overallConfidence}%` }}
                                  />
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {results && results.length >= 4 && (
                    <div className="mt-auto">
                      <h4 className="text-sm uppercase text-gray-400 font-semibold mb-3 flex items-center">
                        <ImageIcon className="w-4 h-4 mr-2 text-indigo-400" />
                        Image Processing Steps
                      </h4>

                      <div className="flex space-x-4 pb-2 overflow-x-auto hide-scrollbar">
                        {results.map((path, i) => {
                          if (!path) return null;
                          return (
                            <div
                              key={i}
                              className="flex-shrink-0 w-48 bg-gray-800/50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                              onClick={() => openModal(i)}
                            >
                              <div className="relative">
                                <img src={path} alt={imageLabels[i]} className="w-full h-32 object-cover" />
                                <div className="absolute top-2 right-2 bg-gray-900/80 rounded-full p-1.5">
                                  {typeIndicators[i]}
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-sm font-medium text-white">{imageLabels[i]}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="relative max-w-4xl w-full mx-4">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-900/80 hover:bg-gray-800 text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center justify-center">
                <button
                  onClick={() => navigateImage(-1)}
                  className="absolute left-4 p-2 rounded-full bg-gray-900/80 hover:bg-gray-800 text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <img
                  src={results![validIndices[activeImageIndex]]!}
                  alt="Enlarged view"
                  className="max-h-[80vh] object-contain rounded-lg"
                />

                <button
                  onClick={() => navigateImage(1)}
                  className="absolute right-4 p-2 rounded-full bg-gray-900/80 hover:bg-gray-800 text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-white text-lg font-medium">{imageLabels[validIndices[activeImageIndex]]}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
