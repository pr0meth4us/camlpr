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
                        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 group ${
                            previewUrl
                                ? "border-indigo-400 bg-indigo-900/20"
                                : "border-gray-600 bg-gray-800/50 hover:border-indigo-400 hover:bg-gray-700/50"
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="flex flex-col items-center justify-center p-5 text-center z-10">
                            {previewUrl ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
                                        <Camera className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <p className="text-indigo-300 font-medium">Image selected</p>
                                    <p className="text-xs text-indigo-400 mt-2">Click to change</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-4 group-hover:bg-indigo-600/20 transition-colors duration-300">
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-indigo-400 transition-colors duration-300" />
                                    </div>
                                    <p className="mb-2 text-sm font-medium text-gray-300">
                                        <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">PNG, JPG or JPEG</p>
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
                        className={`relative w-full mt-4 py-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300 overflow-hidden ${
                            loading || !previewUrl
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30"
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
                        <div className="mt-4 p-4 bg-red-900/20 border-l-4 border-red-500 rounded-md flex items-start animate-pulse">
                            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-red-300 text-sm">{error}</div>
                        </div>
                    )}
                </div>

                {/* Enhanced Preview Area */}
                <div className="flex flex-col justify-center">
                    {previewUrl ? (
                        <div className="bg-gray-800/70 rounded-lg overflow-hidden border border-gray-700 shadow-lg transform transition-all duration-300 hover:shadow-indigo-500/20">
                            <div className="bg-gradient-to-r from-gray-800 to-gray-700 py-3 px-4 border-b border-gray-700 flex items-center">
                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                <p className="text-xs font-medium text-gray-300 ml-2">Image Preview</p>
                            </div>
                            <div className="p-4 flex justify-center bg-gradient-to-b from-transparent to-gray-800/30">
                                <div className="relative group">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="rounded object-contain max-h-48 border border-gray-700 shadow-md"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800/50 rounded-lg border border-gray-700 h-full flex flex-col items-center justify-center p-8 shadow-inner">
                            <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                                <Camera className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="mb-2 text-gray-400">No image selected</p>
                            <p className="text-xs text-gray-500">Preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}