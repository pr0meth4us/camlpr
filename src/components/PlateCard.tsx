
import React, { useState } from "react";

interface PlateCardProps {
    plate: string;
    province: string;
    khmerProvince: string;
    qrUrl?: string;
}

export default function PlateCard({ plate, province, khmerProvince, qrUrl }: PlateCardProps) {
    const [isHovered, setIsHovered] = useState(false);

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
                    {khmerProvince}
                </div>

                {/* Plate number - already in uppercase from backend */}
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
                    <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{plate}</span>
                </div>

                {/* Separator */}
                <div style={{
                    height: '2px',
                    backgroundColor: '#2563eb',
                    margin: '0 16px'
                }} />

                {/* English province - already in uppercase from backend */}
                <div style={{
                    padding: '6px 0',
                    textAlign: 'center',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#dc2626',
                    textTransform: 'uppercase'
                }}>
                    {province}
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