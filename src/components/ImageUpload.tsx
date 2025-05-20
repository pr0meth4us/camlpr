import React, { useState } from "react";
import {
    Upload,
    AlertCircle,
    Camera,
    RefreshCw,
    X,
    RotateCcw,
    CheckCircle2,
    Image as ImageIcon
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
        <div className="p-6 bg-gradient-to-br from-primary/20 to-gray-950 rounded-xl border border-border/50 shadow-xl">
            {/* Main content wrapper */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center mb-1">
                        <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-white">Upload Image</h3>
                    </div>

                    {/* Upload Area */}
                    <label
                        htmlFor="imageUpload"
                        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
                            previewUrl
                                ? "border-primary/50 bg-primary/10"
                                : "border-gray-700 hover:border-primary/50 bg-black/20 hover:bg-primary/10"
                        }`}
                    >
                        {/* Animated glow effect */}
                        <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-5"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Content */}
                        <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                            {previewUrl ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl flex items-center justify-center mb-4 ring-2 ring-primary/20 shadow-lg shadow-primary/10">
                                        <CheckCircle2 className="w-8 h-8 text-primary" />
                                    </div>
                                    <p className="text-primary font-semibold">Image Selected</p>
                                    <p className="text-xs text-primary/80 mt-2">Click to replace</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors duration-300 transform">
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                                    </div>
                                    <p className="mb-2 text-sm font-semibold text-gray-200">
                                        <span className="text-primary">Upload Image</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400 opacity-70">PNG, JPG, or JPEG</p>
                                </>
                            )}
                        </div>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        {/* Detect Button */}
                        <button
                            onClick={onSubmit}
                            disabled={loading || !previewUrl}
                            className={`relative flex-1 px-6 py-3 rounded-lg font-medium text-sm flex items-center justify-center transition-all duration-300 ${
                                loading || !previewUrl
                                    ? "bg-gray-800/30 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-primary via-secondary to-primary text-white hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
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

                        {/* Control buttons for when image is selected */}
                        {previewUrl && (
                            <div className="flex space-x-2">
                                {/* Cancel button */}
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive-foreground transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Retry button */}
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

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-destructive/10 backdrop-blur-sm border-l-4 border-destructive rounded-lg flex items-start shadow-lg animate-fadeIn">
                            <AlertCircle className="w-5 h-5 text-destructive mr-3 mt-0.5 flex-shrink-0" />
                            <div className="text-destructive-foreground text-sm">{error}</div>
                        </div>
                    )}
                </div>

                {/* Preview Section */}
                <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                        <div className="w-1 h-6 bg-gradient-to-b from-secondary to-accent rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-white">Preview</h3>
                    </div>

                    {previewUrl ? (
                        <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-md rounded-xl overflow-hidden border border-border/50 shadow-2xl transition-all duration-300 h-full">
                            {/* Header bar */}
                            <div className="bg-gradient-to-r from-background to-gray-800 py-2.5 px-4 border-b border-border flex items-center">
                                <div className="flex space-x-2 mr-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-destructive"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground ml-1">image-preview.jpg</p>
                            </div>

                            {/* Image container */}
                            <div className="p-6 flex justify-center items-center bg-gradient-to-b from-transparent to-gray-900/30 h-full">
                                <div className="relative group rounded-lg overflow-hidden">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="rounded-lg object-contain max-h-60 shadow-xl group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-gray-900/60 to-black/40 backdrop-blur-sm rounded-xl border border-border/50 h-full flex flex-col items-center justify-center p-8 shadow-inner">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg flex items-center justify-center mb-5 opacity-60">
                                <ImageIcon className="w-10 h-10 text-gray-500" />
                            </div>
                            <p className="mb-2 text-gray-400 font-medium">No Image Selected</p>
                            <p className="text-xs text-gray-500 text-center max-w-xs">Upload an image to see the preview here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}