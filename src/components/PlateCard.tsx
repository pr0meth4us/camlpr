import React from "react";
import { Flag } from "lucide-react";

interface PlateCardProps {
    plate: string;
    province: string;
    qrUrl?: string;  // optional QR code image URL
}

export default function PlateCard({ plate, province, qrUrl }: PlateCardProps) {
    // Split the plate number into parts for better styling
    // Assuming standard format like "2A-1234" or similar
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
        <div className="w-96 h-48 bg-white border-4 border-blue-800 rounded-md shadow-xl overflow-hidden relative">
            {/* Top blue bar with Khmer province name */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-blue-800 flex items-center justify-center">
                <span className="text-xl font-semibold text-white">{khmerProvince}</span>
            </div>

            {/* QR code (if provided) */}
            {qrUrl && (
                <div className="absolute top-1 right-2">
                    <img src={qrUrl} alt="QR code" className="w-8 h-8 object-contain" />
                </div>
            )}

            {/* Main plate number */}
            <div className="flex items-center justify-center h-full">
                <div className="flex items-baseline">
                    <span className="text-6xl font-bold text-blue-900 tracking-wider">{firstPart}</span>
                    <span className="mx-2 text-6xl font-bold text-blue-900">-</span>
                    <span className="text-6xl font-bold text-blue-900 tracking-wider">{secondPart}</span>
                </div>
            </div>

            {/* Province name at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
                <div className="bg-red-600 px-6 py-1 rounded-t-md">
                    <span className="text-lg font-bold text-white uppercase tracking-wide">{province}</span>
                </div>
            </div>
        </div>
    );
}