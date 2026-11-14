import React from 'react';

interface IllustrationProps {
  variant: 'skyline' | 'mrt' | 'changi' | 'cbd';
  className?: string;
}

export const EditorialIllustration: React.FC<IllustrationProps> = ({ variant, className = '' }) => {
  if (variant === 'skyline') {
    return (
      <svg
        viewBox="0 0 640 360"
        className={`w-full h-full object-cover ${className}`}
        role="img"
        aria-label="Marina Bay Singapore skyline architectural illustration"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="65%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#skyGrad)" />
        {/* Sun */}
        <circle cx="515" cy="84" r="34" fill="#F8FAFC" opacity="0.9" />
        {/* Background towers */}
        <rect x="65" y="135" width="44" height="145" fill="#94A3B8" />
        <rect x="120" y="105" width="52" height="175" fill="#64748B" />
        <rect x="184" y="150" width="40" height="130" fill="#94A3B8" />
        {/* Marina Bay Sands silhouette */}
        <rect x="305" y="110" width="32" height="170" rx="2" fill="#334155" />
        <rect x="352" y="108" width="32" height="172" rx="2" fill="#1E293B" />
        <rect x="399" y="110" width="32" height="170" rx="2" fill="#334155" />
        <path d="M292 108 Q372 95 456 102 L446 116 Q372 110 296 116 Z" fill="#0F172A" />
        {/* ArtScience Lotus */}
        <path d="M472 280 L488 232 L505 268 L522 228 L538 280 Z" fill="#475569" />
        {/* CBD Towers right */}
        <rect x="556" y="128" width="46" height="152" fill="#64748B" />
        {/* Waterfront & Expressway */}
        <rect x="0" y="280" width="640" height="80" fill="url(#waterGrad)" />
        <line x1="0" y1="292" x2="640" y2="292" stroke="#10B981" strokeWidth="2.5" strokeDasharray="18 10" />
        {/* Reflections */}
        <rect x="305" y="302" width="32" height="38" fill="#334155" opacity="0.45" />
        <rect x="352" y="302" width="32" height="44" fill="#475569" opacity="0.45" />
        <rect x="399" y="302" width="32" height="38" fill="#334155" opacity="0.45" />
      </svg>
    );
  }

  if (variant === 'changi') {
    return (
      <svg
        viewBox="0 0 480 360"
        className={`w-full h-full object-cover ${className}`}
        role="img"
        aria-label="Changi Airport botanical glass atrium illustration"
      >
        <rect width="480" height="360" fill="#ECFDF5" />
        {/* Glass dome grid */}
        <path d="M40 320 Q240 40 440 320" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="2" />
        <path d="M90 320 Q240 85 390 320" fill="none" stroke="#6EE7B7" strokeWidth="1.5" />
        <path d="M150 320 Q240 130 330 320" fill="none" stroke="#6EE7B7" strokeWidth="1.5" />
        {/* Vortex column */}
        <path d="M210 130 Q240 210 226 320 L254 320 Q240 210 270 130 Z" fill="#0D9488" opacity="0.22" />
        <line x1="240" y1="120" x2="240" y2="320" stroke="#0F766E" strokeWidth="2" opacity="0.5" />
        {/* Botanical canopy */}
        <circle cx="135" cy="285" r="44" fill="#059669" opacity="0.85" />
        <circle cx="178" cy="298" r="32" fill="#047857" opacity="0.9" />
        <circle cx="345" cy="288" r="46" fill="#059669" opacity="0.85" />
        <circle cx="302" cy="300" r="30" fill="#047857" opacity="0.9" />
        <rect x="0" y="320" width="480" height="40" fill="#0F172A" />
      </svg>
    );
  }

  if (variant === 'mrt') {
    return (
      <svg
        viewBox="0 0 480 360"
        className={`w-full h-full object-cover ${className}`}
        role="img"
        aria-label="Singapore MRT transit corridor illustration"
      >
        <rect width="480" height="360" fill="#F1F5F9" />
        {/* Sheltered transit canopy */}
        <path d="M0 140 L480 95 L480 125 L0 170 Z" fill="#0F172A" />
        <rect x="65" y="155" width="12" height="150" fill="#334155" />
        <rect x="395" y="128" width="12" height="177" fill="#334155" />
        {/* Elevated train */}
        <rect x="90" y="185" width="310" height="62" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="110" y="198" width="48" height="24" rx="3" fill="#0F172A" />
        <rect x="170" y="198" width="48" height="24" rx="3" fill="#0F172A" />
        <rect x="230" y="198" width="48" height="24" rx="3" fill="#0F172A" />
        <rect x="290" y="198" width="48" height="24" rx="3" fill="#0F172A" />
        <rect x="90" y="232" width="310" height="6" fill="#059669" />
        {/* Viaduct */}
        <rect x="0" y="247" width="480" height="26" fill="#64748B" />
        <rect x="0" y="305" width="480" height="55" fill="#E2E8F0" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 480 360"
      className={`w-full h-full object-cover ${className}`}
      role="img"
      aria-label="Singapore Raffles Place financial district illustration"
    >
      <rect width="480" height="360" fill="#F8FAFC" />
      <rect x="55" y="95" width="90" height="235" fill="#CBD5E1" />
      <rect x="165" y="45" width="105" height="285" fill="#1E293B" />
      <rect x="290" y="75" width="88" height="255" fill="#334155" />
      <rect x="392" y="130" width="56" height="200" fill="#94A3B8" />
      {/* Architectural window grid */}
      {[70, 100, 130, 160, 190, 220, 250].map((y) => (
        <line key={y} x1="175" y1={y} x2="260" y2={y} stroke="#475569" strokeWidth="1.5" />
      ))}
      {[100, 130, 160, 190, 220, 250].map((y) => (
        <line key={y} x1="300" y1={y} x2="368" y2={y} stroke="#64748B" strokeWidth="1.5" />
      ))}
      <rect x="0" y="330" width="480" height="30" fill="#0F172A" />
    </svg>
  );
};
