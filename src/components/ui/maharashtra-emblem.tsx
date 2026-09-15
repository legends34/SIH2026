import React from 'react';

export function MaharashtraEmblemPlaceholder({ className = '', size = 44 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Government of Maharashtra Official Seal Placeholder"
    >
      {/* Outer concentric rings */}
      <circle cx="50" cy="50" r="48" stroke="#F58220" strokeWidth="2.5" fill="#12355B" />
      <circle cx="50" cy="50" r="43" stroke="#F58220" strokeWidth="1" strokeDasharray="2 2" fill="none" />
      <circle cx="50" cy="50" r="39" stroke="#E8EEF5" strokeWidth="1" fill="#0A1C33" />

      {/* Decorative stars */}
      <polygon points="50,15 52,19 56,19 53,22 54,26 50,23 46,26 47,22 44,19 48,19" fill="#F58220" />
      <polygon points="50,85 52,81 56,81 53,78 54,74 50,77 46,74 47,78 44,81 48,81" fill="#F58220" />

      {/* Center dignified shield / crest */}
      <path
        d="M50 28 L66 35 V52 C66 64 50 72 50 72 C50 72 34 64 34 52 V35 Z"
        fill="#12355B"
        stroke="#F58220"
        strokeWidth="2"
      />

      {/* Cross / Caduceus / Health motif inside shield */}
      <rect x="47" y="38" width="6" height="22" rx="1.5" fill="#FFFFFF" />
      <rect x="39" y="46" width="22" height="6" rx="1.5" fill="#FFFFFF" />

      {/* Seal Ring Label Accents */}
      <text
        x="50"
        y="21"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="800"
        fill="#F58220"
        letterSpacing="0.5"
      >
        महाराष्ट्र शासन
      </text>

      <text
        x="50"
        y="91"
        textAnchor="middle"
        fontSize="5"
        fontWeight="700"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >
        GOVT OF MAHARASHTRA
      </text>
    </svg>
  );
}
