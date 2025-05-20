import React from "react";
import {
    Upload,
    AlertCircle,
    Camera,
    RefreshCw,
    X,
    RotateCcw,
    CheckCircle2,
    Image as ImageIcon,
    Eye
} from "lucide-react";

interface ImageUploadProps {
    onImageChange: (file: File | null) => void;
    previewUrl: string | null;
    onSubmit: () => void;
    loading: boolean;
    error: string | null;
    progress: number; // Added progress prop for upload progress
}

export default function ImageUpload({
                                        onImageChange,
                                        previewUrl,
                                        onSubmit,
                                        loading,
                                        error,
                                        progress = 0, // Default to 0 if not provided
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
        <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800/50 shadow-xl">
            {/* Main content wrapper */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="flex flex-col space-y-5">
                    <div className="flex items-center mb-1">
                        <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-indigo-500 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-white">Upload Image</h3>
                    </div>

                    {/* Upload Area */}
                    <label
                        htmlFor="imageUpload"
                        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
                            previewUrl
                                ? "border-violet-500/50 bg-violet-950/20"
                                : "border-slate-700 hover:border-violet-500/50 bg-black/20 hover:bg-violet-950/10"
                        }`}
                    >
                        <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-5"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-purple-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Content */}
                        <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                            {previewUrl ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 backdrop-blur-xl flex items-center justify-center mb-4 ring-2 ring-violet-500/20 shadow-lg shadow-violet-500/10">
                                        <CheckCircle2 className="w-8 h-8 text-violet-400" />
                                    </div>
                                    <p className="text-violet-300 font-semibold">Image Selected</p>
                                    <p className="text-xs text-violet-400/80 mt-2">Click to replace</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-violet-900/20 group-hover:to-indigo-900/20 transition-colors duration-300 transform">
                                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-violet-400 transition-colors duration-300" />
                                    </div>
                                    <p className="mb-2 text-sm font-semibold text-slate-200">
                                        <span className="text-violet-400">Upload Image</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-slate-400 opacity-70">PNG, JPG, or JPEG</p>
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
                                    ? "bg-slate-800/30 text-slate-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30 transform hover:-translate-y-1"
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
                                    className="p-3 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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

                    {/* Progress Bar - Only show when loading */}
                    {loading && (
                        <div className="mt-2">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-violet-400">Processing</span>
                                <span className="text-xs font-medium text-violet-400">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-900/20 backdrop-blur-sm border-l-4 border-red-500 rounded-lg flex items-start shadow-lg animate-fadeIn">
                            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="text-red-200 text-sm">{error}</div>
                        </div>
                    )}
                </div>

                {/* Preview Section */}
                <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                        <div className="w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-white">Preview</h3>
                    </div>

                    {previewUrl ? (
                        <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md rounded-xl overflow-hidden border border-slate-800/50 shadow-2xl transition-all duration-300 h-full">
                            {/* Header bar */}
                            <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-2.5 px-4 border-b border-slate-800 flex items-center">
                                <div className="flex space-x-2 mr-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                </div>
                                <p className="text-xs font-medium text-slate-400 ml-1">image-preview.jpg</p>
                            </div>

                            {/* Image container */}
                            <div className="p-6 flex justify-center items-center bg-gradient-to-b from-transparent to-slate-900/30 h-full">
                                <div className="relative group rounded-lg overflow-hidden">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="rounded-lg object-contain max-h-60 shadow-xl group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <Eye className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-slate-900/60 to-black/40 backdrop-blur-sm rounded-xl border border-slate-800/50 h-full flex flex-col items-center justify-center p-8 shadow-inner">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg flex items-center justify-center mb-5 opacity-60">
                                <ImageIcon className="w-10 h-10 text-slate-500" />
                            </div>
                            <p className="mb-2 text-slate-400 font-medium">No Image Selected</p>
                            <p className="text-xs text-slate-500 text-center max-w-xs">Upload an image to see the preview here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}