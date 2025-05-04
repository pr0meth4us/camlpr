import React from "react";
import { Upload, AlertCircle } from "lucide-react";

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
                {/* Upload Area */}
                <div>
                    <label
                        htmlFor="imageUpload"
                        className={`flex flex-col items-center justify-center w-full h-60 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                            previewUrl
                                ? "border-indigo-400 bg-indigo-900/20"
                                : "border-gray-600 bg-gray-800/50 hover:border-indigo-400 hover:bg-gray-700/50"
                        }`}
                    >
                        <div className="flex flex-col items-center justify-center p-5 text-center">
                            <Upload className={`w-12 h-12 mb-4 ${previewUrl ? "text-indigo-400" : "text-gray-400"}`} />
                            {previewUrl ? (
                                <p className="text-indigo-300 font-medium">Image selected</p>
                            ) : (
                                <>
                                    <p className="mb-2 text-sm font-medium text-gray-300">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
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
                        className={`w-full mt-4 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                            loading || !previewUrl
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-transparent mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            "Detect License Plate"
                        )}
                    </button>

                    {error && (
                        <div className="mt-4 p-4 bg-red-900/20 border-l-4 border-red-500 rounded-md flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-red-300 text-sm">{error}</div>
                        </div>
                    )}
                </div>

                {/* Preview Area */}
                <div className="flex flex-col justify-center">
                    {previewUrl ? (
                        <div className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600">
                            <div className="bg-gray-800 py-2 px-3 border-b border-gray-700">
                                <p className="text-xs font-medium text-gray-300">Image Preview</p>
                            </div>
                            <div className="p-4 flex justify-center">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="rounded object-contain max-h-48"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                            <p className="mb-2">No image selected</p>
                            <p className="text-xs">Preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}