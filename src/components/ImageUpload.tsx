import React from "react";
import Image from "next/image";
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
        onImageChange(e.target.files?.[0] ?? null);
    };

    return (
        <div className="p-8 bg-gradient-to-br from-gray-900/60 to-gray-950 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="flex flex-col space-y-5">
                    <div className="flex items-center mb-1">
                        <div className="w-1 h-6 bg-cyan-500 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-white">Upload Image</h3>
                    </div>
                    <label
                        htmlFor="imageUpload"
                        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group ${
                            previewUrl
                                ? "border-cyan-500/50 bg-cyan-950/30"
                                : "border-gray-700 hover:border-cyan-500/50 bg-black/20 hover:bg-cyan-950/20"
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/0 via-cyan-600/10 to-indigo-600/0 blur opacity-0 group-hover:opacity-70 transition-opacity duration-500 group-hover:animate-glow" />
                        <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                            {previewUrl ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-cyan-600/20 backdrop-blur-xl flex items-center justify-center mb-4 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-500/10">
                                        <Camera className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <p className="text-cyan-300 font-semibold">Image Selected</p>
                                    <p className="text-xs text-cyan-400/80 mt-2">Click to replace</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-gray-800/80 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:bg-cyan-900/20 transition-colors duration-300 group-hover:scale-110 transform">
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                                    </div>
                                    <p className="mb-2 text-sm font-semibold text-gray-200">
                                        <span className="text-cyan-400">Upload Image</span> or drag and
                                        drop
                                    </p>
                                    <p className="text-xs text-gray-400 opacity-70">
                                        PNG, JPG, or JPEG
                                    </p>
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
                        className={`relative px-6 py-3 rounded-lg font-medium text-sm flex items-center justify-center transition-all duration-300 ${
                            loading || !previewUrl
                                ? "bg-gray-800/30 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 shadow-lg hover:shadow-cyan-500/50"
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

                    {error && (
                        <div className="p-4 bg-red-900/20 backdrop-blur-sm border-l-4 border-red-500 rounded-lg flex items-start shadow-lg animate-fadeIn">
                            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                            <div className="text-red-200 text-sm">{error}</div>
                        </div>
                    )}
                </div>

                {/* Preview Section */}
                <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-white">Preview</h3>
                    </div>

                    {previewUrl ? (
                        <div className="bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl transition-all duration-300 hover:shadow-cyan-500/20 h-full">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-2.5 px-4 border-b border-gray-800 flex items-center">
                                <div className="flex space-x-2 mr-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                </div>
                                <p className="text-xs font-medium text-gray-400 ml-1">
                                    image-preview.jpg
                                </p>
                            </div>
                            <div className="p-6 flex justify-center items-center bg-gradient-to-b from-transparent to-gray-900/30 h-full">
                                <div className="relative group rounded-lg overflow-hidden">
                                    <Image
                                        src={previewUrl}
                                        alt="Preview"
                                        fill
                                        className="rounded-lg object-contain max-h-60 shadow-xl group-hover:scale-105 transition-transform duration-500"
                                        sizes="100vw"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-cyan-500/30 h-full flex flex-col items-center justify-center p-8 shadow-inner">
                            <div className="w-20 h-20 rounded-full bg-gray-800/50 backdrop-blur-lg flex items-center justify-center mb-5 opacity-60">
                                <Camera className="w-10 h-10 text-gray-500" />
                            </div>
                            <p className="mb-2 text-gray-400 font-medium">No Image Selected</p>
                            <p className="text-xs text-gray-500 text-center max-w-xs">
                                Upload an image to see the preview here
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
