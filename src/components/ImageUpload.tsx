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
    <div className="w-full max-w-md mb-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <label
          htmlFor="imageUpload"
          className="flex flex-col items-center justify-center w-full h-40 mb-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-blue-500" />
            <p className="mb-2 text-sm text-blue-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-blue-500">PNG, JPG or JPEG</p>
          </div>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {previewUrl && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full rounded-lg object-contain"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={loading || !previewUrl}
          className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center ${
            loading || !previewUrl ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            "Detect License Plate"
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-red-700">{error}</div>
        </div>
      )}
    </div>
  );
}