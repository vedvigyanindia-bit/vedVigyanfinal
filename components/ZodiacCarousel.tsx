import React, { useRef, useEffect } from "react";
import { ZodiacCard, ZodiacInfo } from "./ZodiacCard";

interface ZodiacCarouselProps {
  zodiacs: ZodiacInfo[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onActivate: (index: number) => void;
}

export const ZodiacCarousel: React.FC<ZodiacCarouselProps> = ({
  zodiacs,
  activeIndex,
  onSelect,
  onActivate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Mouse wheel horizontal scroll handler
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;

    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = containerRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5; // multiplier to adjust scroll speed
    el.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    const el = containerRef.current;
    if (!el) return;
    el.style.cursor = "grab";
    el.style.removeProperty("user-select");
  };

  // Keyboard navigation handler for changing active zodiac using arrow keys
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % zodiacs.length;
      onSelect(nextIndex);
      focusCard(nextIndex);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + zodiacs.length) % zodiacs.length;
      onSelect(prevIndex);
      focusCard(prevIndex);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate(index);
    }
  };

  const focusCard = (index: number) => {
    setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const cardButtons = el.querySelectorAll("button");
      const targetCard = cardButtons[index] as HTMLButtonElement | undefined;
      if (targetCard) {
        targetCard.focus();
        targetCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 50);
  };

  return (
    <div className="relative w-full max-w-[1320px] mx-auto px-4 my-8">
      {/* Horizontally scrollable wrapper */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="
          flex items-center overflow-x-auto overflow-y-hidden gap-1 py-4 px-2
          cursor-grab scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent
          snap-x snap-mandatory scroll-smooth
        "
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none", // Hide default scrollbar
        }}
      >
        {zodiacs.map((zodiac, index) => (
          <div key={zodiac.slug} className="snap-center flex-shrink-0">
            <ZodiacCard
              zodiac={zodiac}
              isActive={index === activeIndex}
              onClick={() => onActivate(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          </div>
        ))}
      </div>

      {/* Tailwind Hide Scrollbar Utility */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
