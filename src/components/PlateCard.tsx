import React from "react";
import { MapPin } from "lucide-react";

interface PlateCardProps {
    plate: string;
    province: string;
    qrUrl?: string;
}

export default function PlateCard({ plate, province, qrUrl }: PlateCardProps) {
    const [prefix, number] = plate.split(/[-\s]/).filter(Boolean);

    const provinceToKhmer: Record<string, string> = {
        "CAMBODIA":           "កម្ពុជា",
        "BANTEAY MEANCHEY":   "បន្ទាយមានជ័យ",
        "BATTAMBANG":         "បាត់ដំបង",
        "KAMPONG CHAM":       "កំពង់ចាម",
        "KAMPONG CHHNANG":    "កំពង់ឆ្នាំង",
        "KAMPONG SPEU":       "កំពង់ស្ពឺ",
        "KAMPONG THOM":       "កំពង់ធំ",
        "KAMPOT":             "កំពត",
        "KANDAL":             "កណ្តាល",
        "KOH KONG":           "កោះកុង",
        "KRATIE":             "ក្រចេះ",
        "MONDULKIRI":         "មណ្ឌលគិរី",
        "PHNOM PENH":         "ភ្នំពេញ",
        "PREAH VIHEAR":       "ព្រះវិហារ",
        "PREY VENG":          "ព្រៃវង់",
        "PURSAT":             "ពោធិ៍សាត់",
        "RATANAKIRI":         "រតនៈគិរី",
        "SIEM REAP":          "សៀមរាប",
        "PREAH SIHANOUK":     "ព្រះសីហនុ",
        "STUNG TRENG":        "ស្ទឹងត្រែង",
        "SVAY RIENG":         "ស្វាយរៀង",
        "TAKEO":              "តាកែវ",
        "TBONG KHMM":         "ត្បូងឃ្មុំ",
        "ODDAR MEANCHEY":     "ឧត្ដរមានជ័យ",
        "KEP":                "កែប",
        "PAILIN":             "ប៉ៃលិន",
    };

    const khmer = provinceToKhmer[province.toUpperCase()] || provinceToKhmer["PHNOM PENH"];

    return (
        <div className="mx-auto w-full max-w-md flex justify-center">
            <div className="relative bg-white border-4 border-blue-600 rounded-lg shadow-xl overflow-hidden w-full">
                {/* Mount holes */}
                <div className="absolute top-3 left-3 w-5 h-5 bg-gray-300 rounded-full border border-gray-400" />
                <div className="absolute top-3 right-3 w-5 h-5 bg-gray-300 rounded-full border border-gray-400" />

                {/* Khmer province line */}
                <div className="h-14 flex items-center justify-center border-b-4 border-blue-600 bg-white pt-2">
                    <span className="text-blue-700 text-2xl font-bold tracking-widest">{khmer}</span>
                </div>

                {/* Plate number area */}
                <div className="relative flex items-center justify-center py-10 bg-white px-6">
                    {qrUrl && (
                        <img
                            src={qrUrl}
                            alt="QR code"
                            className="absolute top-2 right-3 w-8 h-8"
                        />
                    )}
                    <div className="text-blue-700 font-mono text-7xl font-extrabold tracking-widest w-full text-center flex justify-center items-center space-x-4">
                        <span>{prefix}</span>
                        <span className="text-blue-700">-</span>
                        <span>{number}</span>
                    </div>
                </div>

                {/* English province line */}
                <div className="h-12 flex items-center justify-center border-t-4 border-blue-600 bg-white">
                    <span className="text-red-600 text-lg font-bold uppercase tracking-widest">{province}</span>
                </div>
            </div>
            {/* Blue underline accent */}
            <div className="h-2 bg-blue-600 w-full mt-1 rounded-b" />
        </div>
    );
}
