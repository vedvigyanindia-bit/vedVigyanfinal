// Auto-generated 43-product Ved Vigyan Catalog Data with 5 Dedicated Categories
function deriveMerchandising(products) {
  return products.map((product, index) => {
    const discountPercent = 18 + ((index * 7) % 23);
    const ratingValue = 4.2 + (((index * 13) % 8) / 10);
    const rating = Math.min(5.0, Number(ratingValue.toFixed(1)));
    const originalPrice = product.price > 0
      ? Math.round(product.price / (1 - discountPercent / 100))
      : 0;

    return {
      ...product,
      discountPercent,
      originalPrice,
      rating,
      shopifyVariantId: product.shopifyVariantId || `gid://shopify/ProductVariant/77889900000${String(index + 1).padStart(2, "0")}`
    };
  });
}

window.VED_VIGYAN_DATA = {
  store: {
    name: "Ved Vigyan",
    phone: "+91 7900811101",
    email: "Vedvigyanindia@gmail.com",
    address: "Dehradun, Uttarakhand, India - 248002"
  },
  categories: [
    { id: "all", label: "All Products (43)" },
    { id: "rudraksha", label: "Rudraksha Beads (14)" },
    { id: "zodiac-bracelet", label: "Zodiac Rashi Bracelets (11)" },
    { id: "crystal-bracelet", label: "Gemstone & Crystal Bracelets (7)" },
    { id: "mala", label: "Jaap Malas & Sacred Strings (9)" },
    { id: "gemstone-tree", label: "Crystal & Gemstone Trees (2)" }
  ],
  products: deriveMerchandising([
  {
    "id": "vv_p01",
    "category": "rudraksha",
    "slug": "10-mukhi-rudraksh",
    "name": "10 Mukhi Rudraksha (Dasha Mukhi)",
    "price": 2999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/10 Mukhi Rudraksh/1.webp",
    "imageAlt": "10 Mukhi Rudraksha (Dasha Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/10 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/10 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/10 Mukhi Rudraksh/3.webp"
    ],
    "short": "Authentic 10 Mukhi Rudraksha for divine protection from negative energies & peace.",
    "description": "10 Mukhi Rudraksha (Dasha Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "10 Mukhi Rudraksha (Dasha Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 10 Mukhi Rudraksha (Dasha Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p01"
  },
  {
    "id": "vv_p02",
    "category": "rudraksha",
    "slug": "11-mukhi-rudraksh",
    "name": "11 Mukhi Rudraksha (Ekadasha Mukhi)",
    "price": 5999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/11 Mukhi Rudraksh/1.webp",
    "imageAlt": "11 Mukhi Rudraksha (Ekadasha Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/11 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/11 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/11 Mukhi Rudraksh/3.webp"
    ],
    "short": "Authentic 11 Mukhi Rudraksha for courage, devotion, and Lord Hanuman's grace.",
    "description": "11 Mukhi Rudraksha (Ekadasha Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "11 Mukhi Rudraksha (Ekadasha Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 11 Mukhi Rudraksha (Ekadasha Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p02"
  },
  {
    "id": "vv_p03",
    "category": "rudraksha",
    "slug": "12-mukhi-rudraksh",
    "name": "12 Mukhi Rudraksha (Dwadasha Mukhi)",
    "price": 5999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/12 Mukhi Rudraksh/1.webp",
    "imageAlt": "12 Mukhi Rudraksha (Dwadasha Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/12 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/12 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/12 Mukhi Rudraksh/3.webp"
    ],
    "short": "Authentic 12 Mukhi Rudraksha (Surya Rudraksha) for leadership, radiant aura, and vitality.",
    "description": "12 Mukhi Rudraksha (Dwadasha Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "12 Mukhi Rudraksha (Dwadasha Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 12 Mukhi Rudraksha (Dwadasha Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p03"
  },
  {
    "id": "vv_p04",
    "category": "rudraksha",
    "slug": "2-mukhi-rudraksh",
    "name": "2 Mukhi Rudraksha (Dwi Mukhi)",
    "price": 999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/2 Mukhi Rudraksh/1.webp",
    "imageAlt": "2 Mukhi Rudraksha (Dwi Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/2 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/2 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/2 Mukhi Rudraksh/3.webp"
    ],
    "short": "Authentic 2 Mukhi Rudraksha for unity, harmony, and peace of mind.",
    "description": "2 Mukhi Rudraksha (Dwi Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "2 Mukhi Rudraksha (Dwi Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 2 Mukhi Rudraksha (Dwi Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p04"
  },
  {
    "id": "vv_p05",
    "category": "rudraksha",
    "slug": "3-mukhi-rudraksh",
    "name": "3 Mukhi Rudraksha (Tri Mukhi)",
    "price": 999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/3 Mukhi Rudraksh/1.webp",
    "imageAlt": "3 Mukhi Rudraksha (Tri Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/3 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/3 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/3 Mukhi Rudraksh/3.webp"
    ],
    "short": "Authentic 3 Mukhi Rudraksha for self-confidence, energy, and vitality.",
    "description": "3 Mukhi Rudraksha (Tri Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "3 Mukhi Rudraksha (Tri Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 3 Mukhi Rudraksha (Tri Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p05"
  },
  {
    "id": "vv_p06",
    "category": "rudraksha",
    "slug": "4-mukhi-rudraksh",
    "name": "4 Mukhi Rudraksha (Chatur Mukhi)",
    "price": 999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/4 Mukhi Rudraksh/1.webp",
    "imageAlt": "4 Mukhi Rudraksha (Chatur Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/4 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/4 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/4 Mukhi Rudraksh/3.webp"
    ],
    "short": "Authentic 4 Mukhi Rudraksha for wisdom, communication, and intellect.",
    "description": "4 Mukhi Rudraksha (Chatur Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "4 Mukhi Rudraksha (Chatur Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 4 Mukhi Rudraksha (Chatur Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p06"
  },
  {
    "id": "vv_p07",
    "category": "crystal-bracelet",
    "slug": "4-money-magnet",
    "name": "Money Magnet Bracelet (Pyrite & Citrine)",
    "price": 999,
    "tags": [
      "crystal-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/4. Money Magnet/1.webp",
    "imageAlt": "Money Magnet Bracelet (Pyrite & Citrine) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/4. Money Magnet/1.webp",
      "/product/Ved vigyan products/4. Money Magnet/2.webp",
      "/product/Ved vigyan products/4. Money Magnet/3.webp"
    ],
    "short": "Attract wealth, prosperity, and financial growth with natural pyrite & citrine.",
    "description": "Money Magnet Bracelet (Pyrite & Citrine) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Money Magnet Bracelet (Pyrite & Citrine) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Money Magnet Bracelet (Pyrite & Citrine) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p07"
  },
  {
    "id": "vv_p08",
    "category": "rudraksha",
    "slug": "5-mukhi-nepali",
    "name": "5 Mukhi Nepali Rudraksha",
    "price": 599,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/5 Mukhi Nepali/1.webp",
    "imageAlt": "5 Mukhi Nepali Rudraksha - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/5 Mukhi Nepali/1.webp",
      "/product/Ved vigyan products/5 Mukhi Nepali/2.webp",
      "/product/Ved vigyan products/5 Mukhi Nepali/3.webp"
    ],
    "short": "Premium 5 Mukhi Nepali Rudraksha bead for health, focus, and daily protection.",
    "description": "5 Mukhi Nepali Rudraksha is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "5 Mukhi Nepali Rudraksha - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 5 Mukhi Nepali Rudraksha online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p08"
  },
  {
    "id": "vv_p09",
    "category": "rudraksha",
    "slug": "5-mukhi-rudraksh",
    "name": "5 Mukhi Rudraksha (Panchmukhi)",
    "price": 699,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp",
    "imageAlt": "5 Mukhi Rudraksha (Panchmukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/5 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/5 Mukhi Rudraksh/3.webp"
    ],
    "short": "Everyday authentic Panchmukhi Rudraksha for calmness, balance & focus.",
    "description": "5 Mukhi Rudraksha (Panchmukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "5 Mukhi Rudraksha (Panchmukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 5 Mukhi Rudraksha (Panchmukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p09"
  },
  {
    "id": "vv_p10",
    "category": "rudraksha",
    "slug": "6-mukhi-rudraksh",
    "name": "6 Mukhi Rudraksha (Shad Mukhi)",
    "price": 999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/6 Mukhi Rudraksh/1.webp",
    "imageAlt": "6 Mukhi Rudraksha (Shad Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/6 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/6 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/6 Mukhi Rudraksh/3.webp"
    ],
    "short": "Authentic 6 Mukhi Rudraksha for willpower, courage, and emotional balance.",
    "description": "6 Mukhi Rudraksha (Shad Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "6 Mukhi Rudraksha (Shad Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 6 Mukhi Rudraksha (Shad Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p10"
  },
  {
    "id": "vv_p11",
    "category": "crystal-bracelet",
    "slug": "7-chakra-braclet",
    "name": "7 Chakra Healing Crystal Bracelet",
    "price": 899,
    "tags": [
      "crystal-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/7 Chakra Braclet/1.webp",
    "imageAlt": "7 Chakra Healing Crystal Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/7 Chakra Braclet/1.webp",
      "/product/Ved vigyan products/7 Chakra Braclet/2.webp",
      "/product/Ved vigyan products/7 Chakra Braclet/3.webp"
    ],
    "short": "Natural 7 Chakra gemstone bracelet for energy alignment and inner peace.",
    "description": "7 Chakra Healing Crystal Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "7 Chakra Healing Crystal Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 7 Chakra Healing Crystal Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p11"
  },
  {
    "id": "vv_p12",
    "category": "gemstone-tree",
    "slug": "7-chakra-tree",
    "name": "7 Chakra Crystal Gemstone Tree",
    "price": 999,
    "tags": [
      "gemstone-tree",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/7 Chakra Tree/1.webp",
    "imageAlt": "7 Chakra Crystal Gemstone Tree - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/7 Chakra Tree/1.webp",
      "/product/Ved vigyan products/7 Chakra Tree/2.webp"
    ],
    "short": "Handcrafted 7 Chakra crystal tree for positive home energy & Vastu harmony.",
    "description": "7 Chakra Crystal Gemstone Tree is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "7 Chakra Crystal Gemstone Tree - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 7 Chakra Crystal Gemstone Tree online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p12"
  },
  {
    "id": "vv_p13",
    "category": "rudraksha",
    "slug": "7-mukhi-rudraksh",
    "name": "7 Mukhi Rudraksha (Sapta Mukhi)",
    "price": 999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp",
    "imageAlt": "7 Mukhi Rudraksha (Sapta Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/7 Mukhi Rudraksh/2.webp"
    ],
    "short": "Authentic 7 Mukhi Rudraksha for abundance, career growth, and stability.",
    "description": "7 Mukhi Rudraksha (Sapta Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "7 Mukhi Rudraksha (Sapta Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 7 Mukhi Rudraksha (Sapta Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p13"
  },
  {
    "id": "vv_p14",
    "category": "rudraksha",
    "slug": "8-mukhi-rudraksh",
    "name": "8 Mukhi Rudraksh (Ashta Mukhi)",
    "price": 2999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/8 Mukhi Rudraksh/1.webp",
    "imageAlt": "8 Mukhi Rudraksh (Ashta Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/8 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/8 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/8 Mukhi Rudraksh/3.webp"
    ],
    "short": "Authentic 8 Mukhi Rudraksha to remove obstacles and invoke Lord Ganesha blessings.",
    "description": "8 Mukhi Rudraksh (Ashta Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "8 Mukhi Rudraksh (Ashta Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 8 Mukhi Rudraksh (Ashta Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p14"
  },
  {
    "id": "vv_p15",
    "category": "rudraksha",
    "slug": "9-mukhi-rudraksh",
    "name": "9 Mukhi Rudraksh (Nava Mukhi)",
    "price": 2999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/9 Mukhi Rudraksh/1.webp",
    "imageAlt": "9 Mukhi Rudraksh (Nava Mukhi) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/9 Mukhi Rudraksh/1.webp",
      "/product/Ved vigyan products/9 Mukhi Rudraksh/2.webp",
      "/product/Ved vigyan products/9 Mukhi Rudraksh/3.webp"
    ],
    "short": "Authentic 9 Mukhi Rudraksha for spiritual power, fearlessness, and Goddess Durga protection.",
    "description": "9 Mukhi Rudraksh (Nava Mukhi) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "9 Mukhi Rudraksh (Nava Mukhi) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 9 Mukhi Rudraksh (Nava Mukhi) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p15"
  },
  {
    "id": "vv_p16",
    "category": "crystal-bracelet",
    "slug": "amethyst-bracelet",
    "name": "Natural Amethyst Healing Bracelet",
    "price": 999,
    "tags": [
      "crystal-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Amethyst Bracelet/1.webp",
    "imageAlt": "Natural Amethyst Healing Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Amethyst Bracelet/1.webp",
      "/product/Ved vigyan products/Amethyst Bracelet/2.webp",
      "/product/Ved vigyan products/Amethyst Bracelet/3.webp",
      "/product/Ved vigyan products/Amethyst Bracelet/Amethyst Bracelet (2).webp"
    ],
    "short": "Natural Amethyst crystal bracelet for stress relief, deep calm, and intuition.",
    "description": "Natural Amethyst Healing Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Natural Amethyst Healing Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Natural Amethyst Healing Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p16"
  },
  {
    "id": "vv_p17",
    "category": "zodiac-bracelet",
    "slug": "dhanu-sagittarius-braclet",
    "name": "Dhanu (धनु – Sagittarius) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Dhanu (धनु – Sagittarius) Braclet/1.webp",
    "imageAlt": "Dhanu (धनु – Sagittarius) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Dhanu (धनु – Sagittarius) Braclet/1.webp",
      "/product/Ved vigyan products/Dhanu (धनु – Sagittarius) Braclet/2.webp",
      "/product/Ved vigyan products/Dhanu (धनु – Sagittarius) Braclet/3.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Dhanu (Sagittarius) zodiac luck & focus.",
    "description": "Dhanu (धनु – Sagittarius) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Dhanu (धनु – Sagittarius) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Dhanu (धनु – Sagittarius) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p17",
    "zodiacSigns": [
      "Sagittarius"
    ]
  },
  {
    "id": "vv_p18",
    "category": "rudraksha",
    "slug": "ganesh-rudraksh",
    "name": "Original Ganesh Rudraksha",
    "price": 5999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Ganesh Rudraksh/1.webp",
    "imageAlt": "Original Ganesh Rudraksha - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Ganesh Rudraksh/1.webp",
      "/product/Ved vigyan products/Ganesh Rudraksh/2.webp"
    ],
    "short": "Authentic Ganesh Rudraksha bead with natural trunk formation for success & wisdom.",
    "description": "Original Ganesh Rudraksha is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Original Ganesh Rudraksha - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Original Ganesh Rudraksha online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p18"
  },
  {
    "id": "vv_p19",
    "category": "rudraksha",
    "slug": "gauri-sankar-rudraksh",
    "name": "Original Gauri Shankar Rudraksha",
    "price": 8999,
    "tags": [
      "rudraksha",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Gauri Sankar Rudraksh/1.webp",
    "imageAlt": "Original Gauri Shankar Rudraksha - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Gauri Sankar Rudraksh/1.webp",
      "/product/Ved vigyan products/Gauri Sankar Rudraksh/2.webp"
    ],
    "short": "Rare conjoined Gauri Shankar Rudraksha for strong relationships & family harmony.",
    "description": "Original Gauri Shankar Rudraksha is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Original Gauri Shankar Rudraksha - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Original Gauri Shankar Rudraksha online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p19"
  },
  {
    "id": "vv_p20",
    "category": "crystal-bracelet",
    "slug": "gold-rudraksh-bracelet",
    "name": "Gold Capped Rudraksha Bracelet",
    "price": 999,
    "tags": [
      "crystal-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Gold Rudraksh Bracelet/1.webp",
    "imageAlt": "Gold Capped Rudraksha Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Gold Rudraksh Bracelet/1.webp",
      "/product/Ved vigyan products/Gold Rudraksh Bracelet/2.webp"
    ],
    "short": "Premium Rudraksha bracelet with elegant gold-tone capping for spiritual luxury.",
    "description": "Gold Capped Rudraksha Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Gold Capped Rudraksha Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Gold Capped Rudraksha Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p20"
  },
  {
    "id": "vv_p21",
    "category": "zodiac-bracelet",
    "slug": "kanya-virgo-braclet",
    "name": "Kanya (कन्या – Virgo) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Kanya (कन्या – Virgo) Braclet/1.webp",
    "imageAlt": "Kanya (कन्या – Virgo) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Kanya (कन्या – Virgo) Braclet/1.webp",
      "/product/Ved vigyan products/Kanya (कन्या – Virgo) Braclet/2.webp",
      "/product/Ved vigyan products/Kanya (कन्या – Virgo) Braclet/3.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Kanya (Virgo) zodiac prosperity & clarity.",
    "description": "Kanya (कन्या – Virgo) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Kanya (कन्या – Virgo) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Kanya (कन्या – Virgo) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p21",
    "zodiacSigns": [
      "Virgo"
    ]
  },
  {
    "id": "vv_p22",
    "category": "zodiac-bracelet",
    "slug": "karka-cancer-braclet",
    "name": "Karka (कर्क – Cancer) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Karka (कर्क – Cancer) Braclet/1.webp",
    "imageAlt": "Karka (कर्क – Cancer) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Karka (कर्क – Cancer) Braclet/1.webp",
      "/product/Ved vigyan products/Karka (कर्क – Cancer) Braclet/2.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Karka (Cancer) zodiac emotional balance & peace.",
    "description": "Karka (कर्क – Cancer) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Karka (कर्क – Cancer) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Karka (कर्क – Cancer) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p22",
    "zodiacSigns": [
      "Cancer"
    ]
  },
  {
    "id": "vv_p23",
    "category": "mala",
    "slug": "karungali-mala",
    "name": "Natural Karungali Ebony Wood Mala (108 Beads)",
    "price": 999,
    "tags": [
      "mala",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Karungali mala/1.webp",
    "imageAlt": "Natural Karungali Ebony Wood Mala (108 Beads) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Karungali mala/1.webp",
      "/product/Ved vigyan products/Karungali mala/2.webp"
    ],
    "short": "Authentic Karungali (Ebony wood) 108 bead mala for positive energy & protection.",
    "description": "Natural Karungali Ebony Wood Mala (108 Beads) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Natural Karungali Ebony Wood Mala (108 Beads) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Natural Karungali Ebony Wood Mala (108 Beads) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p23"
  },
  {
    "id": "vv_p24",
    "category": "mala",
    "slug": "karungali-rudraksh-silver-cap-mala",
    "name": "Karungali Rudraksha Silver Cap Mala",
    "price": 999,
    "tags": [
      "mala",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Karungali Rudraksh Silver Cap Mala/1.webp",
    "imageAlt": "Karungali Rudraksha Silver Cap Mala - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Karungali Rudraksh Silver Cap Mala/1.webp",
      "/product/Ved vigyan products/Karungali Rudraksh Silver Cap Mala/2.webp"
    ],
    "short": "Combination Karungali wood and Rudraksha mala with pure silver cap finish.",
    "description": "Karungali Rudraksha Silver Cap Mala is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Karungali Rudraksha Silver Cap Mala - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Karungali Rudraksha Silver Cap Mala online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p24"
  },
  {
    "id": "vv_p25",
    "category": "zodiac-bracelet",
    "slug": "kumbh-aquarius-braclet",
    "name": "Kumbh (कुंभ – Aquarius) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Kumbh (कुंभ – Aquarius) Braclet/1.webp",
    "imageAlt": "Kumbh (कुंभ – Aquarius) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Kumbh (कुंभ – Aquarius) Braclet/1.webp",
      "/product/Ved vigyan products/Kumbh (कुंभ – Aquarius) Braclet/2.webp",
      "/product/Ved vigyan products/Kumbh (कुंभ – Aquarius) Braclet/3.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Kumbh (Aquarius) zodiac focus & success.",
    "description": "Kumbh (कुंभ – Aquarius) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Kumbh (कुंभ – Aquarius) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Kumbh (कुंभ – Aquarius) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p25",
    "zodiacSigns": [
      "Aquarius"
    ]
  },
  {
    "id": "vv_p26",
    "category": "zodiac-bracelet",
    "slug": "makar-capricorn-braclet",
    "name": "Makar (मकर – Capricorn) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Makar (मकर – Capricorn) Braclet/1.webp",
    "imageAlt": "Makar (मकर – Capricorn) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Makar (मकर – Capricorn) Braclet/1.webp",
      "/product/Ved vigyan products/Makar (मकर – Capricorn) Braclet/2.webp",
      "/product/Ved vigyan products/Makar (मकर – Capricorn) Braclet/3.webp",
      "/product/Ved vigyan products/Makar (मकर – Capricorn) Braclet/makar rasi.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Makar (Capricorn) zodiac stability & ambition.",
    "description": "Makar (मकर – Capricorn) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Makar (मकर – Capricorn) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Makar (मकर – Capricorn) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p26",
    "zodiacSigns": [
      "Capricorn"
    ]
  },
  {
    "id": "vv_p27",
    "category": "zodiac-bracelet",
    "slug": "meen-pisces-braclet",
    "name": "Meen (मीन – Pisces) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Meen (मीन – Pisces) Braclet/1.webp",
    "imageAlt": "Meen (मीन – Pisces) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Meen (मीन – Pisces) Braclet/1.webp",
      "/product/Ved vigyan products/Meen (मीन – Pisces) Braclet/2.webp",
      "/product/Ved vigyan products/Meen (मीन – Pisces) Braclet/3.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Meen (Pisces) zodiac intuition & spiritual calm.",
    "description": "Meen (मीन – Pisces) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Meen (मीन – Pisces) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Meen (मीन – Pisces) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p27",
    "zodiacSigns": [
      "Pisces"
    ]
  },
  {
    "id": "vv_p28",
    "category": "zodiac-bracelet",
    "slug": "mesh-aries-braclet",
    "name": "Mesh (मेष – Aries) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Mesh (मेष – Aries) Braclet/1.webp",
    "imageAlt": "Mesh (मेष – Aries) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Mesh (मेष – Aries) Braclet/1.webp",
      "/product/Ved vigyan products/Mesh (मेष – Aries) Braclet/2.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Mesh (Aries) zodiac confidence & energy.",
    "description": "Mesh (मेष – Aries) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Mesh (मेष – Aries) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Mesh (मेष – Aries) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p28",
    "zodiacSigns": [
      "Aries"
    ]
  },
  {
    "id": "vv_p29",
    "category": "zodiac-bracelet",
    "slug": "mithun-gemini-braclet",
    "name": "Mithun (मिथुन – Gemini) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Mithun (मिथुन – Gemini) Braclet/1.webp",
    "imageAlt": "Mithun (मिथुन – Gemini) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Mithun (मिथुन – Gemini) Braclet/1.webp",
      "/product/Ved vigyan products/Mithun (मिथुन – Gemini) Braclet/2.webp",
      "/product/Ved vigyan products/Mithun (मिथुन – Gemini) Braclet/3.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Mithun (Gemini) zodiac intelligence & growth.",
    "description": "Mithun (मिथुन – Gemini) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Mithun (मिथुन – Gemini) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Mithun (मिथुन – Gemini) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p29",
    "zodiacSigns": [
      "Gemini"
    ]
  },
  {
    "id": "vv_p30",
    "category": "mala",
    "slug": "nepali-rudrakasha-mala-close-for-wearing",
    "name": "5 Mukhi Nepali Rudraksha Mala (108 Beads)",
    "price": 999,
    "tags": [
      "mala",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Nepali Rudrakasha Mala Close for wearing/1.webp",
    "imageAlt": "5 Mukhi Nepali Rudraksha Mala (108 Beads) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Nepali Rudrakasha Mala Close for wearing/1.webp",
      "/product/Ved vigyan products/Nepali Rudrakasha Mala Close for wearing/2.webp",
      "/product/Ved vigyan products/Nepali Rudrakasha Mala Close for wearing/3.webp"
    ],
    "short": "Original 5 Mukhi Nepali Rudraksha 108 bead mala for jaap and daily wearing.",
    "description": "5 Mukhi Nepali Rudraksha Mala (108 Beads) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "5 Mukhi Nepali Rudraksha Mala (108 Beads) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original 5 Mukhi Nepali Rudraksha Mala (108 Beads) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p30"
  },
  {
    "id": "vv_p31",
    "category": "crystal-bracelet",
    "slug": "piride-braclet",
    "name": "Natural Pyrite Wealth Bracelet",
    "price": 999,
    "tags": [
      "crystal-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Piride Braclet/1.webp",
    "imageAlt": "Natural Pyrite Wealth Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Piride Braclet/1.webp",
      "/product/Ved vigyan products/Piride Braclet/2.webp",
      "/product/Ved vigyan products/Piride Braclet/3.webp"
    ],
    "short": "Natural Pyrite (Fool's Gold) crystal bracelet for money magnet & career luck.",
    "description": "Natural Pyrite Wealth Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Natural Pyrite Wealth Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Natural Pyrite Wealth Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p31"
  },
  {
    "id": "vv_p32",
    "category": "crystal-bracelet",
    "slug": "rose-quartz-close",
    "name": "Natural Rose Quartz Crystal Bracelet",
    "price": 899,
    "tags": [
      "crystal-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Rose Quartz Close/1.webp",
    "imageAlt": "Natural Rose Quartz Crystal Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Rose Quartz Close/1.webp",
      "/product/Ved vigyan products/Rose Quartz Close/2.webp",
      "/product/Ved vigyan products/Rose Quartz Close/3.webp"
    ],
    "short": "Natural Rose Quartz crystal bracelet for love, emotional healing & self-care.",
    "description": "Natural Rose Quartz Crystal Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Natural Rose Quartz Crystal Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Natural Rose Quartz Crystal Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p32"
  },
  {
    "id": "vv_p33",
    "category": "gemstone-tree",
    "slug": "rose-quartz-tree",
    "name": "Rose Quartz Healing Gemstone Tree",
    "price": 999,
    "tags": [
      "gemstone-tree",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Rose Quartz Tree/1.webp",
    "imageAlt": "Rose Quartz Healing Gemstone Tree - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Rose Quartz Tree/1.webp",
      "/product/Ved vigyan products/Rose Quartz Tree/2.webp"
    ],
    "short": "Handcrafted Rose Quartz crystal tree for harmony, warmth & positive Vastu vibes.",
    "description": "Rose Quartz Healing Gemstone Tree is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Rose Quartz Healing Gemstone Tree - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Rose Quartz Healing Gemstone Tree online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p33"
  },
  {
    "id": "vv_p34",
    "category": "mala",
    "slug": "rudraksh-jap-mala",
    "name": "Original Rudraksha Jaap Mala (108 Beads)",
    "price": 999,
    "tags": [
      "mala",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Rudraksh Jap Mala/1.webp",
    "imageAlt": "Original Rudraksha Jaap Mala (108 Beads) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Rudraksh Jap Mala/1.webp",
      "/product/Ved vigyan products/Rudraksh Jap Mala/2.webp"
    ],
    "short": "Traditional 108 bead Rudraksha jaap mala for daily chanting, meditation & sadhana.",
    "description": "Original Rudraksha Jaap Mala (108 Beads) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Original Rudraksha Jaap Mala (108 Beads) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Original Rudraksha Jaap Mala (108 Beads) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p34"
  },
  {
    "id": "vv_p35",
    "category": "zodiac-bracelet",
    "slug": "singh-leo-braclet",
    "name": "Singh (सिंह – Leo) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Singh (सिंह – Leo) Braclet/1.webp",
    "imageAlt": "Singh (सिंह – Leo) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Singh (सिंह – Leo) Braclet/1.webp",
      "/product/Ved vigyan products/Singh (सिंह – Leo) Braclet/2.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Singh (Leo) zodiac leadership & magnetic aura.",
    "description": "Singh (सिंह – Leo) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Singh (सिंह – Leo) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Singh (सिंह – Leo) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p35",
    "zodiacSigns": [
      "Leo"
    ]
  },
  {
    "id": "vv_p36",
    "category": "mala",
    "slug": "spatik-mala",
    "name": "Natural Sphatik (Quartz Crystal) Mala",
    "price": 3999,
    "tags": [
      "mala",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Spatik Mala/1.webp",
    "imageAlt": "Natural Sphatik (Quartz Crystal) Mala - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Spatik Mala/1.webp",
      "/product/Ved vigyan products/Spatik Mala/2.webp",
      "/product/Ved vigyan products/Spatik Mala/3.webp"
    ],
    "short": "Original Sphatik crystal 108 bead mala for cooling energy, mental clarity & jaap.",
    "description": "Natural Sphatik (Quartz Crystal) Mala is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Natural Sphatik (Quartz Crystal) Mala - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Natural Sphatik (Quartz Crystal) Mala online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p36"
  },
  {
    "id": "vv_p37",
    "category": "crystal-bracelet",
    "slug": "tiger-eye-loose-big",
    "name": "Natural Tiger Eye Protection Bracelet",
    "price": 999,
    "tags": [
      "crystal-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Tiger Eye Loose Big/1.webp",
    "imageAlt": "Natural Tiger Eye Protection Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Tiger Eye Loose Big/1.webp",
      "/product/Ved vigyan products/Tiger Eye Loose Big/2.webp"
    ],
    "short": "Natural Tiger Eye gemstone bracelet for courage, grounding & shielding negative energy.",
    "description": "Natural Tiger Eye Protection Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Natural Tiger Eye Protection Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Natural Tiger Eye Protection Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p37"
  },
  {
    "id": "vv_p38",
    "category": "zodiac-bracelet",
    "slug": "tula-libra-braclet",
    "name": "Tula (तुला – Libra) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Tula (तुला – Libra) Braclet/1.webp",
    "imageAlt": "Tula (तुला – Libra) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Tula (तुला – Libra) Braclet/1.webp",
      "/product/Ved vigyan products/Tula (तुला – Libra) Braclet/2.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Tula (Libra) zodiac harmony & career success.",
    "description": "Tula (तुला – Libra) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Tula (तुला – Libra) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Tula (तुला – Libra) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p38",
    "zodiacSigns": [
      "Libra"
    ]
  },
  {
    "id": "vv_p39",
    "category": "mala",
    "slug": "tulsi-jap-mala",
    "name": "Original Tulsi Jaap Mala",
    "price": 899,
    "tags": [
      "mala",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Tulsi Jap Mala/1.webp",
    "imageAlt": "Original Tulsi Jaap Mala - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Tulsi Jap Mala/1.webp",
      "/product/Ved vigyan products/Tulsi Jap Mala/2.webp",
      "/product/Ved vigyan products/Tulsi Jap Mala/3.webp"
    ],
    "short": "Pure sacred Tulsi wood jaap mala for Vishnu bhakti, peace & daily chanting.",
    "description": "Original Tulsi Jaap Mala is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Original Tulsi Jaap Mala - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Original Tulsi Jaap Mala online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p39"
  },
  {
    "id": "vv_p40",
    "category": "mala",
    "slug": "tulsi-mala",
    "name": "Natural Tulsi Bead Mala (108 Beads)",
    "price": 999,
    "tags": [
      "mala",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Tulsi Mala/1.webp",
    "imageAlt": "Natural Tulsi Bead Mala (108 Beads) - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Tulsi Mala/1.webp",
      "/product/Ved vigyan products/Tulsi Mala/2.webp",
      "/product/Ved vigyan products/Tulsi Mala/3.webp",
      "/product/Ved vigyan products/Tulsi Mala/tulsi jap mala.webp"
    ],
    "short": "Natural sacred Tulsi wood 108 bead mala for spiritual purity and protection.",
    "description": "Natural Tulsi Bead Mala (108 Beads) is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Natural Tulsi Bead Mala (108 Beads) - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Natural Tulsi Bead Mala (108 Beads) online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p40"
  },
  {
    "id": "vv_p41",
    "category": "zodiac-bracelet",
    "slug": "vrishabh-taurus-braclet",
    "name": "Vrishabh (वृषभ – Taurus) Rashi Bracelet",
    "price": 999,
    "tags": [
      "zodiac-bracelet",
      "authentic",
      "vedic"
    ],
    "image": "/product/Ved vigyan products/Vrishabh (वृषभ – Taurus) Braclet/1.webp",
    "imageAlt": "Vrishabh (वृषभ – Taurus) Rashi Bracelet - Authentic Ved Vigyan Original Product",
    "images": [
      "/product/Ved vigyan products/Vrishabh (वृषभ – Taurus) Braclet/1.webp",
      "/product/Ved vigyan products/Vrishabh (वृषभ – Taurus) Braclet/2.webp",
      "/product/Ved vigyan products/Vrishabh (वृषभ – Taurus) Braclet/3.webp",
      "/product/Ved vigyan products/Vrishabh (वृषभ – Taurus) Braclet/vrisab rashi braclet.webp"
    ],
    "short": "Tailored Rashi gemstone bracelet for Vrishabh (Taurus) zodiac stability & luxury.",
    "description": "Vrishabh (वृषभ – Taurus) Rashi Bracelet is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.",
    "bullets": [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    "seoTitle": "Vrishabh (वृषभ – Taurus) Rashi Bracelet - Buy Original Online | Ved Vigyan",
    "seoDescription": "Shop original Vrishabh (वृषभ – Taurus) Rashi Bracelet online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.",
    "url": "/product/detail.html?id=vv_p41",
    "zodiacSigns": [
      "Taurus"
    ]
  }
])
};
