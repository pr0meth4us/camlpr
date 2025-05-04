import React from "react";
import { MapPin } from "lucide-react";

interface PlateCardProps {
    plate: string;
    province: string;
    qrUrl?: string;  // optional QR code image URL
}

export default function PlateCard({ plate, province, qrUrl }: PlateCardProps) {
    // Split the plate number into parts for better styling
    const parts = plate.split(/[-\s]/).filter(Boolean);
    const firstPart = parts[0] || "";
    const secondPart = parts[1] || "";

    // Mapping of provinces to Khmer script (can be expanded)
    const provinceToKhmer = {
        "CAMBODIA": "កម្ពុជា",
        "BANTEAY MEANCHEY": "បន្ទាយមានជ័យ",
        "BATTAMBANG": "បាត់ដំបង",
        "KAMPONG CHAM": "កំពង់ចាម",
        "KAMPONG CHHNANG": "កំពង់ឆ្នាំង",
        "KAMPONG SPEU": "កំពង់ស្ពឺ",
        "KAMPONG THOM": "កំពង់ធំ",
        "KAMPOT": "កំពត",
        "KANDAL": "កណ្តាល",
        "KEP": "កែប",
        "KOH KONG": "កោះកុង",
        "KRATIE": "ក្រចេះ",
        "MONDULKIRI": "មណ្ឌលគិរី",
        "ODDAR MEANCHEY": "ឧត្តរមានជ័យ",
        "PAILIN": "ប៉ៃលិន",
        "PHNOM PENH": "ភ្នំពេញ",
        "PREAH SIHANOUK": "ព្រះសីហនុ",
        "PREAH VIHEAR": "ព្រះវិហារ",
        "PREY VENG": "ព្រៃវែង",
        "PURSAT": "ពោធិ៍សាត់",
        "RATANAKIRI": "រតនគិរី",
        "SIEM REAP": "សៀមរាប",
        "STUNG TRENG": "ស្ទឹងត្រែង",
        "SVAY RIENG": "ស្វាយរៀង",
        "TAKEO": "តាកែវ",
        "TBONG KHMUM": "ត្បូងឃ្មុំ"
    }

    // Get Khmer script for province, default to "ភ្នំពេញ" if not found
    // @ts-ignore
    const khmerProvince = provinceToKhmer[province.toUpperCase()] || "ភ្នំពេញ";

    return (
        <div className="relative w-full max-w-sm overflow-hidden">
            {/* Card container with shadow effect */}
            <div className="relative overflow-hidden rounded-lg shadow-lg">
                {/* Main plate background */}
                <div className="bg-gradient-to-b from-blue-950 to-gray-900 pt-10 pb-4 px-4">
                    {/* Khmer province name on top */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-indigo-600 flex items-center justify-center">
                        <span className="text-xl font-medium text-white">{khmerProvince}</span>
                    </div>

                    {/* QR code if provided */}
                    {qrUrl && (
                        <div className="absolute top-1 right-2">
                            <img src={qrUrl} alt="QR code" className="w-8 h-8 object-contain" />
                        </div>
                    )}

                    {/* Plate number */}
                    <div className="text-center py-4 px-4 bg-gray-100 rounded-lg shadow-inner">
                        <div className="flex items-center justify-center">
              <span className="text-5xl font-bold text-gray-900 tracking-widest">
                {firstPart}
                  <span className="px-2">-</span>
                  {secondPart}
              </span>
                        </div>
                    </div>
                </div>

                {/* Province name at bottom */}
                <div className="bg-gray-800 p-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-indigo-400 mr-2" />
                        <span className="text-sm text-gray-300">Province:</span>
                    </div>
                    <span className="text-base font-semibold text-white uppercase">{province}</span>
                </div>
            </div>

            {/* Add a subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
        </div>
    );
}