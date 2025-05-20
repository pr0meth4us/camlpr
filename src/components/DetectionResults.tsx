import React, { useState } from "react";
import { Target, ZoomIn, Hash, Landmark, X, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

interface DetectionResultsProps {
    imagePaths: string[];
}

export default function DetectionResults({ imagePaths }: DetectionResultsProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const labels = ["Full w/ box", "Cropped Plate", "Number Segment", "Province Segment"];
    const typeIndicators = [
        <Target className="w-5 h-5 text-violet-400" />,
        <ZoomIn className="w-5 h-5 text-indigo-400" />,
        <Hash className="w-5 h-5 text-purple-400" />,
        <Landmark className="w-5 h-5 text-fuchsia-400" />,
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

    // Handle keyboard navigation
    React.useEffect(() => {
        if (!modalOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateImage(-1);
            if (e.key === 'ArrowRight') navigateImage(1);
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
                            className="bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-md rounded-xl overflow-hidden border border-slate-800/50 hover:border-violet-500/30 shadow-lg transition-all duration-300 hover:shadow-violet-900/20 group"
                        >
                            <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800/90 py-3 px-4 border-b border-slate-800/50">
                                <div className="flex items-center space-x-2">
                                    <span>{typeIndicators[i]}</span>
                                    <p className="text-sm font-medium text-slate-200">{labels[i]}</p>
                                </div>
                                <button
                                    onClick={() => openModal(i)}
                                    className="p-1.5 rounded-md bg-slate-800/50 text-slate-400 hover:text-violet-400 hover:bg-slate-700/70 transition-all duration-200"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => openModal(i)}
                            >
                                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-black/50 to-slate-900/50 group-hover:from-slate-900/70 group-hover:to-black/70 transition-all duration-300">
                                    <img
                                        src={path}
                                        alt={labels[i]}
                                        className="w-full object-contain mx-auto transition-transform duration-500 group-hover:scale-105"
                                        style={{ height: "150px" }}
                                    />
                                    {/* Subtle overlay when hovered */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-violet-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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

            {/* Fullscreen Modal - Much improved for accessibility and mobile */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg transition-opacity duration-300 animate-fadeIn"
                    onClick={closeModal} // Close when clicking outside
                >
                    {/* Content container - stop propagation on content clicks */}
                    <div
                        className="relative w-full max-w-5xl p-4 mx-4 rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-0 right-0 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 z-10 -mt-4 -mr-4 shadow-lg"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation buttons */}
                        {validImages.length > 1 && (
                            <>
                                <button
                                    onClick={() => navigateImage(-1)}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 z-10 -ml-2 sm:ml-4 shadow-lg"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => navigateImage(1)}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 z-10 -mr-2 sm:mr-4 shadow-lg"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Modal content with improved animation */}
                        <div className="relative w-full flex flex-col items-center animate-fadeZoomIn">
                            <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900/50 to-black/50 border border-slate-700/30 shadow-2xl">
                                <img
                                    src={validImages[activeImageIndex]}
                                    alt={`Enlarged ${labels[imagePaths.indexOf(validImages[activeImageIndex])]}`}
                                    className="w-full object-contain max-h-[80vh]"
                                />
                            </div>

                            {/* Caption with indicator for current image and total */}
                            <div className="mt-6 bg-slate-900/80 backdrop-blur-sm rounded-lg py-3 px-6 border border-slate-800/50 flex items-center justify-between w-full max-w-md mx-auto">
                                <div className="flex items-center space-x-3">
                                    {typeIndicators[imagePaths.indexOf(validImages[activeImageIndex])]}
                                    <p className="text-lg font-medium text-white">
                                        {labels[imagePaths.indexOf(validImages[activeImageIndex])]}
                                    </p>
                                </div>

                                {validImages.length > 1 && (
                                    <div className="px-3 py-1 bg-slate-800/70 rounded-full text-sm text-slate-300">
                                        {activeImageIndex + 1} / {validImages.length}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}