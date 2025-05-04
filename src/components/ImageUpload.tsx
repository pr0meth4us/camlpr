import React from "react";
import { Upload, AlertCircle, Camera, RefreshCw } from "lucide-react";

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

    return (
        <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Enhanced Upload Area */}
                <div className="flex flex-col">
                    <label
                        htmlFor="imageUpload"
                        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 group ${
                            previewUrl
                                ? "border-cyan-500 bg-cyan-900/10"
                                : "border-gray-700 bg-gray-900/50 hover:border-cyan-500 hover:bg-gray-800/50"
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-indigo-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex flex-col items-center justify-center p-5 text-center z-10">
                            {previewUrl ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-cyan-600/20 flex items-center justify-center mb-4">
                                        <Camera className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <p className="text-cyan-300 font-semibold">Image Selected</p>
                                    <p className="text-xs text-cyan-400 mt-2">Click to replace</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4 group-hover:bg-cyan-600/20 transition-colors duration-300">
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                                    </div>
                                    <p className="mb-2 text-sm font-semibold text-gray-200">
                                        <span className="text-cyan-400">Upload Image</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">PNG, JPG, or JPEG</p>
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
                    <button
                        onClick={onSubmit}
                        disabled={loading || !previewUrl}
                        className={`relative w-full mt-4 py-4 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 overflow-hidden ${
                            loading || !previewUrl
                                ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-cyan-500/50"
                        }`}
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <span className="absolute inset-0 w-full h-full bg-white/10 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
                                <Camera className="w-5 h-5 mr-2" />
                                Detect License Plate
                            </>
                        )}
                    </button>
                    {error && (
                        <div className="mt-4 p-4 bg-red-900/20 border-l-4 border-red-600 rounded-lg flex items-start shadow-md">
                            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-red-300 text-sm">{error}</div>
                        </div>
                    )}
                </div>
                {/* Enhanced Preview Area */}
                <div className="flex flex-col justify-center">
                    {previewUrl ? (
                        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50 shadow-xl transform transition-all duration-300 hover:shadow-cyan-500/20">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-3 px-4 border-b border-gray-700/50 flex items-center">
                                <div className="w-2 h-2 rounded-full bg-red-600 mr-2"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-600 mr-2"></div>
                                <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
                                <p className="text-xs font-semibold text-gray-200 ml-2">Image Preview</p>
                            </div>
                            <div className="p-4 flex justify-center bg-gradient-to-b from-transparent to-gray-900/30">
                                <div className="relative group">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="rounded object-contain max-h-48 border border-gray-700 shadow-md group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 h-full flex flex-col items-center justify-center p-8 shadow-inner">
                            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                                <Camera className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="mb-2 text-gray-400 font-semibold">No Image Selected</p>
                            <p className="text-xs text-gray-500">Preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}