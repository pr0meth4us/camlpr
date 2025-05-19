"use client";
import { Key, useState} from 'react';
import {Upload, AlertCircle, Check, Image, Loader2, Camera, MapPin, ScanLine, Truck} from 'lucide-react';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';

// Types
interface OcrResult {
  plate: string;
  detected_province: string;
  corrected_province: string;
  confidence: number;
}

interface DetectionData {
  image_paths: string[];
  ocr_results: OcrResult[];
}

// Utility function for class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Main App Component
export default function LicensePlateDetector() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detectionData, setDetectionData] = useState(null);

  // Province translations (Khmer to English)
  const provinceTranslations = {
    'CAMBODIA': {khmer: 'កម្ពុជា', english: 'Cambodia'},
    'BANTEAY MEANCHEY': {khmer: 'បន្ទាយមានជ័យ', english: 'Banteay Meanchey'},
    'BATTAMBANG': {khmer: 'បាត់ដំបង', english: 'Battambang'},
    'KAMPONG CHAM': {khmer: 'កំពង់ចាម', english: 'Kampong Cham'},
    'KAMPONG CHHNANG': {khmer: 'កំពង់ឆ្នាំង', english: 'Kampong Chhnang'},
    'KAMPONG SPEU': {khmer: 'កំពង់ស្ពឺ', english: 'Kampong Speu'},
    'KAMPONG THOM': {khmer: 'កំពង់ធំ', english: 'Kampong Thom'},
    'KAMPOT': {khmer: 'កំពត', english: 'Kampot'},
    'KANDAL': {khmer: 'កណ្តាល', english: 'Kandal'},
    'KOH KONG': {khmer: 'កោះកុង', english: 'Koh Kong'},
    'KRATIE': {khmer: 'ក្រចេះ', english: 'Kratie'},
    'MONDULKIRI': {khmer: 'មណ្ឌលគិរី', english: 'Mondulkiri'},
    'PHNOM PENH': {khmer: 'ភ្នំពេញ', english: 'Phnom Penh'},
    'PREAH VIHEAR': {khmer: 'ព្រះវិហារ', english: 'Preah Vihear'},
    'PREY VENG': {khmer: 'ព្រៃវែង', english: 'Prey Veng'},
    'PURSAT': {khmer: 'ពោធិ៍សាត់', english: 'Pursat'},
    'RATANAKIRI': {khmer: 'រតនៈគិរី', english: 'Ratanakiri'},
    'SIEM REAP': {khmer: 'សៀមរាប', english: 'Siem Reap'},
    'PREAH SIHANOUK': {khmer: 'ព្រះសីហនុ', english: 'Preah Sihanouk'},
    'STUNG TRENG': {khmer: 'ស្ទឹងត្រែង', english: 'Stung Treng'},
    'SVAY RIENG': {khmer: 'ស្វាយរៀង', english: 'Svay Rieng'},
    'TAKEO': {khmer: 'តាកែវ', english: 'Takeo'},
    'TBONG KHMM': {khmer: 'ត្បូងឃ្មុំ', english: 'Tbong Khmm'},
    'ODDAR MEANCHEY': {khmer: 'ឧត្ដរមានជ័យ', english: 'Oddar Meanchey'},
    'KEP': {khmer: 'កែប', english: 'Kep'},
    'PAILIN': {khmer: 'ប៉ៃលិន', english: 'Pailin'},
    'UNREADABLE': {khmer: 'អានមិនដាច់', english: 'Unreadable'},
    'SENATE': {khmer: 'ព្រឹទ្ធសភា', english: 'Senate'},
  };

  const handleFileChange = (e: { target: { files: any[]; }; }) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleDrop = (e: { preventDefault: () => void; dataTransfer: { files: any[]; }; }) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    }
  };

  const uploadImage = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5328/api/inference', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setDetectionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const resetProcess = () => {
    setFile(null);
    setPreview(null);
    setDetectionData(null);
    setError(null);
  };

  // Image Upload Component
  const ImageUpload = () => (
      <div className="w-full max-w-3xl mx-auto">
        <div
            className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                "hover:bg-gray-50 dark:hover:bg-gray-900",
                "border-gray-300 dark:border-gray-700"
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input
              id="fileInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
          />

          <div className="flex flex-col items-center space-y-4">
            {preview ? (
                <div className="relative w-full max-w-lg mx-auto">
                  <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-contain rounded-md"
                  />
                  <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white dark:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetProcess();
                      }}
                  >
                    Change
                  </Button>
                </div>
            ) : (
                <>
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4">
                    <Upload className="h-8 w-8 text-blue-600 dark:text-blue-300"/>
                  </div>
                  <div>
                    <p className="text-lg font-medium">Upload license plate image</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Drag and drop or click to select
                    </p>
                  </div>
                </>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
              onClick={(e) => {
                e.stopPropagation();
                 uploadImage();
              }}
              disabled={!file || isLoading}
              className="w-full md:w-auto"
          >
            {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Processing...
                </>
            ) : (
                <>
                  <Camera className="mr-2 h-4 w-4"/>
                  Detect License Plate
                </>
            )}
          </Button>
        </div>

        {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4"/>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </div>
  );

  // Detection Results Component
  const DetectionResults = ({imagePaths}) => (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {imagePaths.map((path: string, index: number ) => {
        const titles = [
          { name: "Original Detection", icon: <Camera className="h-5 w-5" /> },
          { name: "Cropped Plate", icon: <ScanLine className="h-5 w-5" /> },
          { name: "Number Segment", icon: <Truck className="h-5 w-5" /> },
          { name: "Province Segment", icon: <MapPin className="h-5 w-5" /> }
        ];

        return (
          <Card key={index} className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              {titles[index].icon}
              <h3 className="ml-2 font-medium">{titles[index].name}</h3>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 h-48 flex items-center justify-center">
              <img
                src={path}
                alt={titles[index].name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </Card>
        );
      })}
    </div>
  );

  // OCR Details Component
  const OcrDetails = ({ result }) => {
    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 90) return "text-green-600 dark:text-green-400";
      if (confidence >= 70) return "text-yellow-600 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
    };

    const getConfidenceLabel = (confidence) => {
      if (confidence >= 90) return "High";
      if (confidence >= 70) return "Medium";
      return "Low";
    };

    const province = provinceTranslations[result.corrected_province] ||
      { khmer: result.corrected_province, english: result.corrected_province };

    return (
      <div className="mt-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">OCR Result Details</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Detected Province</p>
              <div className="flex items-end gap-2">
                <p className="text-xl font-bold">{province.khmer}</p>
                <p className="text-lg text-gray-600 dark:text-gray-300">({province.english})</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Confidence Score</p>
                <p className={cn(
                  "text-sm font-medium",
                  getConfidenceColor(result.confidence)
                )}>
                  {getConfidenceLabel(result.confidence)}
                  ({result.confidence.toFixed(1)}%)
                </p>
              </div>
              <Progress
                value={result.confidence}
                className={cn(
                  result.confidence >= 90 ? "bg-green-600" :
                  result.confidence >= 70 ? "bg-yellow-600" : "bg-red-600"
                )}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Improved Plate Card Component based on the provided example
  const PlateCard = ({ result }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Get province data
    const province = provinceTranslations[result.corrected_province.toUpperCase()] ||
      { khmer: result.corrected_province, english: result.corrected_province };

    // Split plate number
    const parts = result.plate.split(/[-\s]/).filter(Boolean);
    const [prefix, number] = parts.length === 2 ? parts : [result.plate, ""];

    return (
      <div className="mt-8 max-w-md mx-auto">
        <div
          className={cn(
            "transition-transform duration-200 cursor-default",
            isHovered ? "scale-102" : "scale-100"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative bg-white border-4 border-blue-900 rounded-lg shadow-lg overflow-hidden">
            {/* Top screws */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-gray-300 border border-gray-400 rounded-full"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-gray-300 border border-gray-400 rounded-full"></div>

            {/* Inner border */}
            <div className="absolute inset-1 rounded border border-blue-600 pointer-events-none"></div>

            {/* Khmer province name */}
            <div className="py-1 text-center font-bold text-4xl text-blue-900">
              {province.khmer}
            </div>

            {/* Plate number section */}
            <div className="flex justify-center items-center py-4 font-mono text-6xl font-bold text-blue-900">
              <span className="text-shadow">{prefix}</span>
              <span className="mx-2 text-blue-900">-</span>
              <span className="text-shadow">{number}</span>
            </div>

            {/* Separator line */}
            <div className="h-0.5 mx-4 bg-blue-600"></div>

            {/* English province name */}
            <div className="py-1.5 text-center font-bold text-sm text-red-600 uppercase">
              {province.english}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Cambodia License Plate Detector</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload an image of a Cambodian license plate for automatic detection and OCR
        </p>
      </div>

      <ImageUpload />

      {detectionData && (
        <>
          <DetectionResults imagePaths={detectionData.image_paths} />
          <OcrDetails result={detectionData.ocr_results[0]} />
          <PlateCard result={detectionData.ocr_results[0]} />

          <div className="mt-8 text-center">
            <Button onClick={resetProcess}>
              Detect Another License Plate
            </Button>
          </div>
        </>
      )}
    </div>
  );
}