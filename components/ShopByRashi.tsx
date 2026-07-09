"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ZodiacCarousel } from "./ZodiacCarousel";
import { ZodiacProducts, Product } from "./ZodiacProducts";
import { ZodiacInfo } from "./ZodiacCard";

// Detailed SVG Glyph Paths for each Zodiac Sign
const ZODIACS: ZodiacInfo[] = [
  {
    name: "Aries",
    hindiName: "मेष",
    symbol: "♈",
    slug: "aries",
    svgPath: <path d="M 5 6 A 4 4 0 0 1 12 10 A 4 4 0 0 1 19 6 M 12 10 L 12 21" />
  },
  {
    name: "Taurus",
    hindiName: "वृषभ",
    symbol: "♉",
    slug: "taurus",
    svgPath: <path d="M 12 9 A 6 6 0 1 1 12 21 A 6 6 0 1 1 12 9 M 5 4 A 7 7 0 0 1 19 4" />
  },
  {
    name: "Gemini",
    hindiName: "मिथुन",
    symbol: "♊",
    slug: "gemini",
    svgPath: <path d="M 8 4 L 16 4 M 8 20 L 16 20 M 10 4 L 10 20 M 14 4 L 14 20" />
  },
  {
    name: "Cancer",
    hindiName: "कर्क",
    symbol: "♋",
    slug: "cancer",
    svgPath: <path d="M 16 9 A 3 3 0 1 0 16 3 M 8 15 A 3 3 0 1 0 8 21 M 8 9 C 14 9 16 15 16 15 M 16 15 C 10 15 8 9 8 9" />
  },
  {
    name: "Leo",
    hindiName: "सिंह",
    symbol: "♌",
    slug: "leo",
    svgPath: <path d="M 6 17 A 2 2 0 1 0 8 19 A 2 2 0 1 0 6 17 M 7 18 C 11 13 13 5 18 10 C 21 13 18 20 18 20" />
  },
  {
    name: "Virgo",
    hindiName: "कन्या",
    symbol: "♍",
    slug: "virgo",
    svgPath: <path d="M 6 6 L 6 18 M 6 8 C 8 4 10 8 10 12 M 10 8 C 12 4 14 8 14 14 M 14 8 C 16 4 18 8 18 14 C 18 17 15 20 13 18 L 17 21" />
  },
  {
    name: "Libra",
    hindiName: "तुला",
    symbol: "♎",
    slug: "libra",
    svgPath: <path d="M 5 20 L 19 20 M 5 15 C 8 10 16 10 19 15 M 9 13 A 3 3 0 0 1 15 13" />
  },
  {
    name: "Scorpio",
    hindiName: "वृश्चिक",
    symbol: "♏",
    slug: "scorpio",
    svgPath: <path d="M 6 6 L 6 16 M 6 8 C 8 4 10 8 10 12 M 10 8 C 12 4 14 8 14 12 M 14 8 C 16 4 18 8 18 16 L 16 14 L 20 14" />
  },
  {
    name: "Sagittarius",
    hindiName: "धनु",
    symbol: "♐",
    slug: "sagittarius",
    svgPath: <path d="M 5 19 L 19 5 M 12 5 L 19 5 L 19 12 M 9 9 L 15 15" />
  },
  {
    name: "Capricorn",
    hindiName: "मकर",
    symbol: "♑",
    slug: "capricorn",
    svgPath: <path d="M 6 5 L 10 15 C 12 19 14 15 14 12 M 14 12 C 16 8 18 12 18 15 A 2 2 0 1 1 14 16" />
  },
  {
    name: "Aquarius",
    hindiName: "कुंभ",
    symbol: "♒",
    slug: "aquarius",
    svgPath: <path d="M 4 8 L 8 4 L 12 8 L 16 4 L 20 8 M 4 16 L 8 12 L 12 16 L 16 12 L 20 16" />
  },
  {
    name: "Pisces",
    hindiName: "मीन",
    symbol: "♓",
    slug: "pisces",
    svgPath: <path d="M 6 4 C 10 8 10 16 6 20 M 18 4 C 14 8 14 16 18 20 M 4 12 L 20 12" />
  }
];

interface ShopByRashiProps {
  initialProducts: Product[];
}

export default function ShopByRashi({ initialProducts }: ShopByRashiProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Parse URL Search Parameter for deep linking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryZodiac = params.get("zodiac")?.toLowerCase();
      if (queryZodiac) {
        const foundIndex = ZODIACS.findIndex((z) => z.slug === queryZodiac);
        if (foundIndex !== -1) {
          setActiveIndex(foundIndex);
        }
      }
    }
  }, []);

  const activeZodiac = ZODIACS[activeIndex];

  // Memoize filtered products matching the active zodiac sign
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Check if product belongs to zodiacSigns list
      if (!product.zodiacSigns || !Array.isArray(product.zodiacSigns)) return false;
      return product.zodiacSigns.some(
        (sign) => sign.toLowerCase() === activeZodiac.name.toLowerCase()
      );
    });
  }, [initialProducts, activeZodiac]);

  const handleSelectZodiac = (index: number) => {
    setActiveIndex(index);
    
    // Optional: Update browser history state without full page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("zodiac", ZODIACS[index].slug);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleActivateZodiac = (index: number) => {
    const activeZodiac = ZODIACS[index];
    // Find the product matching category: "zodiac-bracelet" and the zodiac sign
    let foundProduct = initialProducts.find((p) => 
      p.category === "zodiac-bracelet" &&
      p.zodiacSigns &&
      p.zodiacSigns.some((sign) => sign.toLowerCase() === activeZodiac.name.toLowerCase())
    );
    if (!foundProduct) {
      // Fallback: any product matching the zodiac sign name
      foundProduct = initialProducts.find((p) => 
        p.zodiacSigns &&
        p.zodiacSigns.some((sign) => sign.toLowerCase() === activeZodiac.name.toLowerCase())
      );
    }

    if (foundProduct && typeof window !== "undefined") {
      window.location.href = foundProduct.url;
    }
  };

  return (
    <section className="w-full bg-[#FFFDF9] py-16 border-t border-[#c79f3c]/10" id="rashi-section">
      <div className="max-w-[1320px] mx-auto px-4 text-center">
        {/* Section Heading */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            <span className="text-[#1F2937]">Shop by Your </span>
            <span className="bg-gradient-to-r from-[#E65100] to-[#FF9800] bg-clip-text text-transparent">
              Rashi
            </span>
          </h2>
          <p className="text-sm md:text-base text-[#6B7280] max-w-2xl mx-auto font-medium">
            Discover Rudraksha bracelets specially recommended according to your zodiac sign.
          </p>
        </div>

        {/* Zodiac Carousel */}
        <ZodiacCarousel
          zodiacs={ZODIACS}
          activeIndex={activeIndex}
          onSelect={handleSelectZodiac}
          onActivate={handleActivateZodiac}
        />

        {/* Product Grid */}
        <ZodiacProducts
          products={filteredProducts}
          activeZodiacName={activeZodiac.name}
        />

        {/* View All Button */}
        <div className="mt-10">
          <a
            href={`/shop?zodiac=${activeZodiac.slug}`}
            className="
              inline-flex items-center justify-center px-8 py-3.5 border-2 border-[#E65100]
              text-[#E65100] font-bold text-sm rounded-full transition-all duration-300
              hover:bg-[#E65100] hover:text-white shadow-md hover:shadow-lg hover:-translate-y-0.5
            "
          >
            View All {activeZodiac.name} Bracelets
          </a>
        </div>
      </div>
    </section>
  );
}
