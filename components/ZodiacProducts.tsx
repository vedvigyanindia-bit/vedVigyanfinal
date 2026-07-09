import React from "react";
import { motion } from "framer-motion";

export interface Product {
  id: string;
  name: string;
  short: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  image: string;
  imageAlt: string;
  url: string;
  zodiacSigns: string[];
}

interface ZodiacProductsProps {
  products: Product[];
  activeZodiacName: string;
}

export const ZodiacProducts: React.FC<ZodiacProductsProps> = ({
  products,
  activeZodiacName,
}) => {
  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 py-8">
      {products.length === 0 ? (
        <div className="text-center py-12 text-[#6b5a4b] font-medium">
          No bracelets found for {activeZodiacName}. Check back soon!
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={activeZodiacName} // Forces key reset and re-trigger animation when zodiac changes
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center"
        >
          {products.slice(0, 4).map((p) => {
            const reviewCount = 40 + (p.id.charCodeAt(p.id.length - 1) * 17) % 200;
            const discountPercent = p.discountPercent || Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

            return (
              <motion.article
                key={p.id}
                variants={cardVariants}
                className="
                  w-full max-w-[300px] bg-white rounded-3xl overflow-hidden border border-[#c79f3c]/20
                  shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group
                "
              >
                {/* Media Container */}
                <div className="relative aspect-square w-full bg-[#FAF6F0] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Floating Certifications */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="bg-[#8a1a23] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Lab Certified
                    </span>
                    <span className="bg-[#c79f3c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      100% Authentic
                    </span>
                  </div>
                  {/* Action Floating Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      aria-label="Add to Wishlist"
                      className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#8a1a23] shadow-md hover:scale-110 transition-transform"
                    >
                      ♡
                    </button>
                  </div>
                </div>

                {/* Product Body */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Stars and Rating */}
                    <div className="flex items-center gap-1.5 text-xs text-[#c79f3c] mb-2 font-medium">
                      <span aria-hidden="true">{renderStars(p.rating)}</span>
                      <span className="text-[#1d150f]">{p.rating}</span>
                      <span className="text-[#6b5a4b] font-normal">({reviewCount})</span>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-base font-semibold text-[#1d150f] mb-1 group-hover:text-[#8a1a23] transition-colors duration-300 line-clamp-1">
                      {p.name}
                    </h3>
                    
                    {/* Product Short Description */}
                    <p className="text-xs text-[#6b5a4b] mb-4 line-clamp-2 leading-relaxed">
                      {p.short}
                    </p>
                  </div>

                  <div>
                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg font-bold text-[#8a1a23]">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      {p.originalPrice > p.price && (
                        <>
                          <span className="text-xs text-[#6b5a4b] line-through">
                            ₹{p.originalPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-[#e65100] font-semibold">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* Actions Footer */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <a
                        href={p.url}
                        className="
                          w-full py-2 text-center text-xs font-semibold text-[#6b5a4b] border border-[#6b5a4b]/30
                          rounded-xl hover:bg-[#FAF6F0] transition-colors duration-300
                        "
                      >
                        View Details
                      </a>
                      <button
                        type="button"
                        className="
                          w-full py-2 bg-[#8a1a23] text-white text-xs font-semibold rounded-xl
                          hover:bg-[#5e0d14] shadow-sm hover:shadow transition-all duration-300
                        "
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
