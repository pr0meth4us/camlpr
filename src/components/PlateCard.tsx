// src/components/PlateCard.tsx
import React, { useState } from "react";
import Image from "next/image";

interface PlateCardProps {
    plate: string;
    province: string;
    qrUrl?: string;
}

const provinceToKhmer: Record<string, string> = {
    CAMBODIA: "កម្ពុជា",
    BANTEAY_MEANCHEY: "បន្ទាយមានជ័យ",
    BATTAMBANG: "បាត់ដំបង",
    KAMPONG_CHAM: "កំពង់ចាម",
    KAMPONG_CHHNANG: "កំពង់ឆ្នាំង",
    KAMPONG_SPEU: "កំពង់ស្ពឺ",
    KAMPONG_THOM: "កំពង់ធំ",
    KAMPOT: "កំពត",
    KANDAL: "កណ្តាល",
    KOH_KONG: "កោះកុង",
    KRATIE: "ក្រចេះ",
    MONDULKIRI: "មណ្ឌលគិរី",
    PHNOM_PENH: "ភ្នំពេញ",
    PREAH_VIHEAR: "ព្រះវិហារ",
    PREY_VENG: "ព្រៃវែង",
    PURSAT: "ពោធិ៍សាត់",
    RATANAKIRI: "រតនៈគិរី",
    SIEM_REAP: "សៀមរាប",
    PREAH_SIHANOUK: "ព្រះសីហនុ",
    STUNG_TRENG: "ស្ទឹងត្រែង",
    SVAY_RIENG: "ស្វាយរៀង",
    TAKEO: "តាកែវ",
    TBONG_KHMUM: "ត្បូងឃ្មុំ",
    ODDAR_MEANCHEY: "ឧត្ដរមានជ័យ",
    KEP: "កែប",
    PAILIN: "ប៉ៃលិន",
    UNREADABLE: "អានមិនដាច់",
};

export default function PlateCard({ plate, province, qrUrl }: PlateCardProps) {
    const [hover, setHover] = useState(false);

    // split plate into prefix / number
    const parts = plate.split(/[-\s]/).filter(Boolean);
    const [prefix, number] =
        parts.length === 2 ? parts : ["1FW", "9554"];

    // normalize province key
    const key = province.toUpperCase().replace(/\s+/g, "_");
    const khmer = provinceToKhmer[key] ?? provinceToKhmer.UNREADABLE;

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                margin: "0 auto",
                maxWidth: 400,
                transform: hover ? "scale(1.02)" : "scale(1)",
                transition: "transform 0.2s ease",
            }}
        >
            <div
                style={{
                    position: "relative",
                    border: "4px solid #1e3a8a",
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
            >
                {/* Top screws */}
                <div style={styles.screwLeft} />
                <div style={styles.screwRight} />

                {/* Inner border */}
                <div style={styles.innerBorder} />

                {/* Khmer province line */}
                <div style={styles.khmer}>{khmer}</div>

                {/* Plate number */}
                <div style={styles.plateNumber}>
                    <span style={styles.textShadow}>{prefix}</span>
                    <span style={styles.dash}>-</span>
                    <span style={styles.textShadow}>{number}</span>
                </div>

                {/* Separator */}
                <div style={styles.separator} />

                {/* English province */}
                <div style={styles.english}>{province.toUpperCase()}</div>

                {/* Optional QR code */}
                {qrUrl && (
                    <div style={styles.qrContainer}>
                        <Image
                            src={qrUrl}
                            alt="QR code"
                            width={24}
                            height={24}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    screwLeft: {
        position: "absolute" as const,
        top: 8,
        left: 8,
        width: 12,
        height: 12,
        backgroundColor: "#d1d5db",
        borderRadius: "50%",
        border: "1px solid #9ca3af",
    },
    screwRight: {
        position: "absolute" as const,
        top: 8,
        right: 8,
        width: 12,
        height: 12,
        backgroundColor: "#d1d5db",
        borderRadius: "50%",
        border: "1px solid #9ca3af",
    },
    innerBorder: {
        position: "absolute" as const,
        top: 4,
        left: 4,
        right: 4,
        bottom: 4,
        border: "1px solid #2563eb",
        borderRadius: 4,
        pointerEvents: "none" as const,
    },
    khmer: {
        padding: "4px 0",
        textAlign: "center" as const,
        fontFamily: "'Noto Serif Khmer', serif",
        fontSize: 40,
        fontWeight: 700,
        color: "#1e3a8a",
    },
    plateNumber: {
        display: "flex",
        justifyContent: "center" as const,
        alignItems: "center" as const,
        padding: "16px 0",
        fontFamily: "monospace",
        fontSize: 75,
        fontWeight: 700,
        color: "#1e3a8a",
    },
    textShadow: {
        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
    },
    dash: {
        margin: "0 8px",
        color: "#1e3a8a",
    },
    separator: {
        height: 2,
        backgroundColor: "#2563eb",
        margin: "0 16px",
    },
    english: {
        padding: "6px 0",
        textAlign: "center" as const,
        fontFamily: "Roboto, sans-serif",
        fontSize: 14,
        fontWeight: 700,
        color: "#dc2626",
        textTransform: "uppercase" as const,
    },
    qrContainer: {
        position: "absolute" as const,
        top: 12,
        right: 12,
    },
};
