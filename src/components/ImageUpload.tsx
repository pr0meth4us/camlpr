import React, { useState } from "react";
import {
    Upload,
    AlertCircle,
    Camera,
    RefreshCw,
    RotateCcw,
    CheckCircle2,
    Image as ImageIcon,
    X
} from "lucide-react";

interface ImageUploadProps {
    onImageChange: (file: File | null) => void;
    previewUrl: string | null;
    onSubmit: () => void;
    loading: boolean;
    error: string | null;
}

export default function ImageUpload({
                                        onImageChange,
                                        previewUrl,
                                        onSubmit,
                                        loading,
                                        error,
                                    }: ImageUploadProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onImageChange(file);
    };

    const handleCancel = () => {
        onImageChange(null);
    };

    const handleRetry = () => {
        // Reset and open file dialog again
        const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
        onImageChange(null);
        setTimeout(() => {
            if (fileInput) fileInput.click();
        }, 100);
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800/50 shadow-xl">
            <div className="flex items-center mb-5">
                <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-white">License Plate Detection</h3>
            </div>

            {/* Upload/Preview Combined Section */}
            <div className="mb-6">
                {previewUrl ? (
                    // Preview Mode
                    <div className="relative">
                        {/* Preview Area */}
                        <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-md rounded-xl overflow-hidden border border-gray-800/50 shadow-lg transition-all duration-300">
                            {/* Header bar */}
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-2.5 px-4 border-b border-gray-800 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                    </div>
                                    <p className="text-xs font-medium text-gray-400">Image Preview</p>
                                </div>
                                <div className="flex space-x-2">
                                    {/* Replace button */}
                                    <label htmlFor="imageUpload" className="cursor-pointer p-1.5 rounded-md bg-gray-800/70 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/70 transition-all duration-200">
                                        <RotateCcw className="w-4 h-4" />
                                    </label>
                                    {/* Remove button */}
                                    <button
                                        onClick={handleCancel}
                                        className="p-1.5 rounded-md bg-gray-800/70 text-gray-400 hover:text-red-400 hover:bg-gray-700/70 transition-all duration-200">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Image container */}
                            <div className="p-6 flex justify-center items-center bg-gradient-to-b from-transparent to-gray-900/30">
                                <div className="relative group rounded-lg overflow-hidden">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="rounded-lg object-contain max-h-64 shadow-lg group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Upload Mode
                    <label
                        htmlFor="imageUpload"
                        className="relative flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group border-gray-700 hover:border-cyan-500/50 bg-black/20 hover:bg-cyan-950/10"
                    >
                        {/* Animated glow effect */}
                        <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-5"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/10 via-blue-600/5 to-indigo-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Content */}
                        <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-cyan-900/20 group-hover:to-blue-900/20 transition-colors duration-300 transform">
                                <Upload className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                            </div>
                            <p className="mb-2 text-sm font-semibold text-gray-200">
                                <span className="text-cyan-400">Upload Image</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 opacity-70">PNG, JPG, or JPEG</p>
                        </div>
                    </label>
                )}

                <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />
            </div>

            {/* Action Button - Always Visible */}
            <div className="flex space-x-3">
                <button
                    onClick={onSubmit}
                    disabled={loading || !previewUrl}
                    className={`relative w-full px-6 py-3 rounded-lg font-medium text-sm flex items-center justify-center transition-all duration-300 ${
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
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 mt-4 bg-red-900/20 backdrop-blur-sm border-l-4 border-red-500 rounded-lg flex items-start shadow-lg animate-fadeIn">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-red-200 text-sm">{error}</div>
                </div>
            )}
        </div>
    );
}