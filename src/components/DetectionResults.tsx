import React, { useState, useEffect } from "react";
import { Target, ZoomIn, Hash, Landmark, X, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

interface DetectionResultsProps {
    imagePaths: string[];
}

export default function DetectionResults({ imagePaths }: DetectionResultsProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const labels = ["Full w/ box", "Cropped Plate", "Number Segment", "Province Segment"];
    const typeIndicators = [
        <Target className="w-5 h-5 text-cyan-400" />,
        <ZoomIn className="w-5 h-5 text-blue-400" />,
        <Hash className="w-5 h-5 text-indigo-400" />,
        <Landmark className="w-5 h-5 text-purple-400" />,
    ];

    const validImages = imagePaths.filter(Boolean);

    const openModal = (index: number) => {
        setActiveImageIndex(index);
        setModalOpen(true);
        // Disable body scroll when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalOpen(false);
        // Re-enable body scroll when modal is closed
        document.body.style.overflow = 'auto';
    };

    const navigateImage = (direction: number) => {
        const newIndex = (activeImageIndex + direction + validImages.length) % validImages.length;
        setActiveImageIndex(newIndex);
    };

    // Add key event listener for Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && modalOpen) {
                closeModal();
            } else if (e.key === 'ArrowLeft' && modalOpen) {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight' && modalOpen) {
                navigateImage(1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen, activeImageIndex]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {imagePaths.map((path, i) => {
                    if (!path) return null;

                    return (
                        <div
                            key={i}
                            className="bg-gradient-to-br from-gray-900/80 to-gray-950/90 backdrop-blur-md rounded-xl overflow-hidden border border-gray-800/50 hover:border-cyan-500/30 shadow-lg transition-all duration-300 hover:shadow-cyan-900/20 group"
                        >
                            <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800/90 py-3 px-4 border-b border-gray-800/50">
                                <div className="flex items-center space-x-2">
                                    <span>{typeIndicators[i]}</span>
                                    <p className="text-sm font-medium text-gray-200">{labels[i]}</p>
                                </div>
                                <button
                                    onClick={() => openModal(i)}
                                    className="p-1.5 rounded-md bg-gray-800/50 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/70 transition-all duration-200"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => openModal(i)}
                            >
                                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-black/50 to-gray-900/50 group-hover:from-gray-900/70 group-hover:to-black/70 transition-all duration-300">
                                    <img
                                        src={path}
                                        alt={labels[i]}
                                        className="w-full object-contain mx-auto transition-transform duration-500 group-hover:scale-105"
                                        style={{ height: "150px" }}
                                    />
                                    {/* Subtle overlay when hovered */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-black/40 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <ZoomIn className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Fullscreen Modal - now with better controls */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg transition-opacity duration-300"
                    onClick={closeModal} // Close when clicking background
                >
                    {/* Modal content - stop event propagation to prevent close when clicking content */}
                    <div
                        className="relative w-full max-w-4xl p-4 flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation buttons */}
                        {validImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage(-1);
                                    }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage(1);
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/30 shadow-2xl">
                            <img
                                src={validImages[activeImageIndex]}
                                alt={`Enlarged ${labels[activeImageIndex]}`}
                                className="w-full object-contain max-h-[80vh]"
                            />
                        </div>

                        {/* Caption */}
                        <div className="mt-6 bg-gray-900/80 backdrop-blur-sm rounded-lg py-3 px-6 border border-gray-800/50">
                            <div className="flex items-center space-x-3">
                                {typeIndicators[imagePaths.indexOf(validImages[activeImageIndex])]}
                                <p className="text-lg font-medium text-white">
                                    {labels[imagePaths.indexOf(validImages[activeImageIndex])]}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}