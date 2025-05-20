import React, { useState } from "react";
import { MapPin } from "lucide-react";

interface PlateCardProps {
    plate: string;
    province: string;
    qrUrl?: string;
}

export default function PlateCard({ plate, province, qrUrl }: PlateCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Split plate
    const parts = plate.split(/[-\s]/).filter(Boolean);
    const [prefix, number] = parts.length === 2 ? parts : ["1FW", "9554"];

    // Province mapping
    const provinceToKhmer: Record<string, string> = {
        "CAMBODIA": "កម្ពុជា",
        "BANTEAY MEANCHEY": "បន្ទាយមានជ័យ",
        "BATTAMBANG": "បាត់ដំបង",
        "KAMPONG CHAM": "កំពង់ចាម",
        "KAMPONG CHHNANG": "កំពង់ឆ្នាំង",
        "KAMPONG SPEU": "កំពង់ស្ពឺ",
        "KAMPONG THOM": "កំពង់ធំ",
        "KAMPOT": "កំពត",
        "KANDAL": "កណ្តាល",
        "KOH KONG": "កោះកុង",
        "KRATIE": "ក្រចេះ",
        "MONDULKIRI": "មណ្ឌលគិរី",
        "PHNOM PENH": "ភ្នំពេញ",
        "PREAH VIHEAR": "ព្រះវិហារ",
        "PREY VENG": "ព្រៃវែង",
        "PURSAT": "ពោធិ៍សាត់",
        "RATANAKIRI": "រតនៈគិរី",
        "SIEM REAP": "សៀមរាប",
        "PREAH SIHANOUK": "ព្រះសីហនុ",
        "STUNG TRENG": "ស្ទឹងត្រែង",
        "SVAY RIENG": "ស្វាយរៀង",
        "TAKEO": "តាកែវ",
        "TBONG KHMM": "ត្បូងឃ្មុំ",
        "ODDAR MEANCHEY": "ឧត្ដរមានជ័យ",
        "KEP": "កែប",
        "PAILIN": "ប៉ៃលិន",
        "UNREADABLE": "អានមិនដាច់"
    };
    const normalized = province.toUpperCase();
    const khmerText = provinceToKhmer[normalized] || provinceToKhmer["UNREADABLE"];

    return (
        <div
            style={{
                margin: '0 auto',
                width: '100%',
                maxWidth: '400px',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.2s ease',
                cursor: 'default'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                position: 'relative',
                backgroundColor: '#fff',
                border: '4px solid #1e3a8a',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
            }}>
                {/* Top screws */}
                <div style={{
                    position: 'absolute', top: '8px', left: '8px',
                    width: '12px', height: '12px',
                    backgroundColor: '#d1d5db', borderRadius: '50%',
                    border: '1px solid #9ca3af'
                }} />
                <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    width: '12px', height: '12px',
                    backgroundColor: '#d1d5db', borderRadius: '50%',
                    border: '1px solid #9ca3af'
                }} />

                {/* Inner border */}
                <div style={{
                    position: 'absolute',
                    top: '4px', left: '4px', right: '4px', bottom: '4px',
                    border: '1px solid #2563eb',
                    borderRadius: '4px',
                    pointerEvents: 'none'
                }} />

                {/* Khmer line */}
                <div style={{
                    padding: '4px 0',
                    textAlign: 'center',
                    fontFamily: 'Noto Serif Khmer, serif',
                    fontSize: '40px',
                    fontWeight: 700,
                    color: '#1e3a8a'
                }}>
                    {khmerText}
                </div>

                {/* Plate number */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 0',
                    fontFamily: 'monospace',
                    fontSize: '75px',
                    fontWeight: 700,
                    color: '#1e3a8a'
                }}>
                    <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{prefix}</span>
                    <span style={{ margin: '0 8px', color: '#1e3a8a' }}>-</span>
                    <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{number}</span>
                </div>

                {/* Separator */}
                <div style={{
                    height: '2px',
                    backgroundColor: '#2563eb',
                    margin: '0 16px'
                }} />

                {/* English province */}
                <div style={{
                    padding: '6px 0',
                    textAlign: 'center',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#dc2626',
                    textTransform: 'uppercase'
                }}>
                    {normalized}
                </div>

                {/* Optional QR */}
                {qrUrl && (
                    <img
                        src={qrUrl}
                        alt="QR code"
                        style={{
                            position: 'absolute',
                            top: '12px', right: '12px',
                            width: '24px', height: '24px'
                        }}
                    />
                )}
            </div>
        </div>
    );
}
