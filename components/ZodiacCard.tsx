import React from "react";

export interface ZodiacInfo {
  name: string;
  hindiName: string;
  symbol: string;
  slug: string;
  svgPath: React.ReactNode;
}

interface ZodiacCardProps {
  zodiac: ZodiacInfo;
  isActive: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const ZodiacCard: React.FC<ZodiacCardProps> = ({
  zodiac,
  isActive,
  onClick,
  onKeyDown,
}) => {
  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${zodiac.name} (${zodiac.hindiName}) Zodiac Sign Selection`}
      aria-pressed={isActive}
      className={`
        flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px] p-4 m-2
        rounded-2xl cursor-pointer transition-all duration-300 outline-none select-none
        border-2 focus-visible:ring-2 focus-visible:ring-[#FF9800] focus-visible:ring-offset-2
        ${
          isActive
            ? "bg-[#FFF8F2] border-[#E65100] shadow-[0_0_15px_rgba(230,81,0,0.2)] scale-105"
            : "bg-white border-transparent hover:border-[#FF9800]/40 shadow-sm hover:shadow-md hover:scale-105"
        }
      `}
      style={{
        boxShadow: isActive ? "0 0 20px rgba(230, 81, 0, 0.25)" : undefined,
      }}
    >
      {/* Premium Circular Icon Wrapper */}
      <div
        className={`
          w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors duration-300
          ${isActive ? "bg-[#FFE0B2] text-[#E65100]" : "bg-[#FAF6F0] text-[#6b5a4b]"}
        `}
      >
        <svg
          className="w-10 h-10 transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {zodiac.svgPath}
        </svg>
      </div>

      {/* Zodiac Name */}
      <span className="text-sm font-semibold text-[#1F2937] leading-none mb-1">
        {zodiac.name}
      </span>
      {/* Hindi Name */}
      <span className="text-xs text-[#6B7280] font-medium leading-none">
        {zodiac.hindiName}
      </span>
    </button>
  );
};
