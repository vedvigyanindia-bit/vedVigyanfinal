const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'frontend', 'public', 'js', 'data.js');
let content = fs.readFileSync(dataFilePath, 'utf8');

const blogPosts = [
  {
    id: "blog_01",
    slug: "benefits-of-wearing-rudraksha",
    title: "Benefits of Wearing Rudraksha: Ancient Wisdom for Modern Living",
    date: "2026-06-15",
    category: "Rudraksha",
    categorySlug: "rudraksha",
    readTime: 4,
    image: "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp",
    imageAlt: "Authentic 5 Mukhi Nepali Rudraksha Bead",
    excerpt: "Discover the sacred spiritual, mental, and physical benefits of authentic Rudraksha beads according to ancient Vedic scriptures.",
    seoTitle: "Benefits of Wearing Rudraksha | Ved Vigyan Sacred Journal",
    seoDescription: "Explore traditional benefits of wearing Rudraksha, how people use it daily, and beginner-friendly tips for choosing the right bead.",
    content: [
      "Rudraksha beads, revered in Vedic scriptures as the tears of Lord Shiva, are sacred botanical gems that have guided sages and spiritual seekers for millennia. Originating predominantly from the lush Himalayan foothills of Nepal, each authentic bead carries unique electromagnetic vibrations that harmonise the human nervous system and energy field.",
      "One of the foremost benefits of wearing Rudraksha is its profound calming effect on the nervous system. In contemporary research and traditional Ayurvedic medicine, the bead's subtle bio-electric frequency has been observed to help regulate blood pressure, alleviate chronic stress, and foster laser-sharp mental concentration.",
      "From an energetic standpoint, Rudraksha acts as a powerful energetic shield. It deflects negative atmospheric vibrations and preserves one's vital prana, making it especially beneficial for individuals who travel frequently or work in high-demand, crowded environments.",
      "For beginners stepping onto the spiritual path, the 5 Mukhi Nepali Rudraksha is universally recommended. Governed by Kalagni Rudra, it purifies the mind, balances the throat chakra (Vishuddha), and brings emotional equilibrium to wearers of all ages and walks of life without astrological restrictions.",
      "To experience optimal benefits, wear your Rudraksha after a gentle morning bath following simple cleansing with pure water or gangajal, accompanied by chanting 'Om Namah Shivaya' nine or 108 times."
    ]
  },
  {
    id: "blog_02",
    slug: "how-to-identify-original-rudraksha",
    title: "How to Identify an Original Rudraksha: A Practical Buyer's Guide",
    date: "2026-06-20",
    category: "Guide",
    categorySlug: "guide",
    readTime: 5,
    image: "/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp",
    imageAlt: "Natural Mukhi lines of certified Rudraksha",
    excerpt: "A practical guide to checking authentic Rudraksha beads, identifying artificial lines, and understanding authentic lab certifications.",
    seoTitle: "How to Identify Original Rudraksha | Ved Vigyan Guide",
    seoDescription: "A practical guide to checking authentic Rudraksha beads, identifying artificial lines, and understanding authentic lab certifications.",
    content: [
      "With the growing demand for authentic spiritual beads worldwide, the market has unfortunately seen a surge in counterfeit, carved, or chemically treated fake Rudraksha. Learning how to identify genuine beads protects your spiritual journey and hard-earned resources.",
      "First, let us dispel the famous water and copper coin myths. The traditional belief that an authentic Rudraksha sinks in water or rotates between copper coins is scientifically unproven. An unripe or artificially hollowed wooden bead can sink or float depending on air pockets and moisture content, making simple water immersion an unreliable test of authenticity.",
      "Genuine identification begins with careful observation of the mukhis (facial segments). In natural Nepali beads, the facet lines run organically from the natural top aperture (mouth) down to the stem (tail). The contours between the ridges are naturally textured with organic groves and varied depths, unlike artificially glued or manually carved grooves that appear unnaturally straight or glued.",
      "The gold standard for certifying rare mukhis (such as 1 Mukhi, Gauri Shankar, or higher Mukhi beads) is non-destructive X-Ray and CT-scan analysis. A certified gemological laboratory can verify the internal seed chambers (locules), which must match the exact number of external mukhi lines without internal adhesives or lead filings.",
      "At Ved Vigyan, each Nepali Rudraksha bead is individually inspected, lab-certified with verifiable QR documentation, and energized in accordance with ancient Vedic rituals before reaching your altar."
    ]
  },
  {
    id: "blog_03",
    slug: "healing-crystals-guide",
    title: "Healing Crystals & Gemstones: A Guide to Energy, Prosperity & Balance",
    date: "2026-07-02",
    category: "Crystals",
    categorySlug: "crystals",
    readTime: 4,
    image: "/product/Ved vigyan products/7 Chakra Tree/1.webp",
    imageAlt: "7 Chakra Natural Crystal Tree",
    excerpt: "Learn how Pyrite, Amethyst, and Rose Quartz crystals help balance your chakras and invite wealth, love, and emotional peace.",
    seoTitle: "Healing Crystals & Gemstones Guide | Ved Vigyan",
    seoDescription: "Learn how natural healing crystals help balance your chakras and invite prosperity, emotional balance, and clarity into your life.",
    content: [
      "Crystals are Mother Earth's structured crystalline resonators. Each crystal holds a stable, repeating lattice of microscopic mineral geometry that emits steady, coherent vibrational frequencies.",
      "Pyrite, affectionately dubbed the 'Stone of Abundance', is renowned for its solar plexus stimulation. Its golden metallic lustre encourages confidence, sharp business acumen, and financial discipline, making it an essential desk companion for entrepreneurs and career professionals.",
      "For emotional equilibrium and deep sleep, Amethyst remains unparalleled. Carrying tranquil violet light, it soothes overactive mental chatter, stimulates the third eye chakra, and transforms restless nights into rejuvenating sleep.",
      "Placing a 7 Chakra Gemstone Tree in your living area or meditation corner balances the seven energetic vortices of the body—from root grounding to crown transcendence—harmonising the flow of prana throughout your sacred space."
    ]
  },
  {
    id: "blog_04",
    slug: "sacred-jaap-mala-meditation",
    title: "The Sacred 108: How to Meditate with a Jaap Mala for Transformation",
    date: "2026-07-10",
    category: "Meditation",
    categorySlug: "meditation",
    readTime: 4,
    image: "/product/Ved vigyan products/Nepali Rudrakasha Mala Close for wearing/1.webp",
    imageAlt: "Sacred 108 Bead Rudraksha Jaap Mala",
    excerpt: "How to hold, chant, and maintain the sanctity of a 108-bead Rudraksha or Tulsi Jaap Mala for profound inner transformation.",
    seoTitle: "Sacred 108 Jaap Mala Meditation Practice | Ved Vigyan",
    seoDescription: "A comprehensive guide on how to hold, chant, and maintain a 108-bead Jaap Mala for mantra meditation.",
    content: [
      "In sacred Vedic tradition, the number 108 represents the cosmic wholeness of the universe—connecting the distance between Earth and the Sun, the 108 Upanishads, and the 108 sacred energy channels (nadis) culminating at the spiritual heart (Hridaya).",
      "When chanting japa, the mala is gently rested on the middle finger of the right hand, with the beads drawn inward toward the heart using the thumb. In traditional practice, the index finger—representing ego (ahamkara)—is kept raised and does not touch the beads.",
      "Upon reaching the 108th bead at the Meru (guru bead), the seeker does not cross over it. Instead, the mala is rotated 180 degrees, honouring the lineage and beginning the next cycle in reverent awareness.",
      "Whether using energized Nepali Rudraksha for Shiva mantras or pure Vrindavan Tulsi beads for Krishna bhakti, keeping your jaap mala in a dedicated silk bag preserves its accumulated spiritual potency."
    ]
  },
  {
    id: "blog_05",
    slug: "astrology-rashi-rudraksha-guide",
    title: "Vedic Astrology: Aligning Your Rashi with the Right Rudraksha & Gems",
    date: "2026-07-18",
    category: "Astrology",
    categorySlug: "astrology",
    readTime: 5,
    image: "/product/Ved vigyan products/Mesh (मेष – Aries) Braclet/1.webp",
    imageAlt: "Zodiac Rashi Bracelet",
    excerpt: "Understand which Mukhi Rudraksha and gemstone best balances your planetary positions according to your Vedic moon sign.",
    seoTitle: "Vedic Astrology Rashi & Rudraksha Guide | Ved Vigyan",
    seoDescription: "Match your zodiac sign with the perfect Rudraksha mukhi and gemstone bracelet for planetary harmony.",
    content: [
      "Vedic Astrology (Jyotish) teaches that our earthly experiences are deeply influenced by planetary placements at the exact moment of birth. Each astrological planet vibrates at specific vibrational frequencies that align with sacred Rudraksha mukhis.",
      "For Aries (Mesh) and Scorpio (Vrishchik), ruled by courageous Mars (Mangal), the 3 Mukhi Rudraksha and Carnelian or Bloodstone dispel lethargy and enhance vitality.",
      "Taurus (Vrishabh) and Libra (Tula), governed by graceful Venus (Shukra), flourish with 6 Mukhi Rudraksha and Rose Quartz or Opal, fostering loving relationships, artistic creativity, and aesthetic luxury.",
      "Wearing a bracelet specifically energized for your Janma Rashi (moon sign) creates an aura of balance, harmonising difficult planetary transits like Sade Sati and Dhaiya with natural divine grace."
    ]
  }
];

const targetPattern = /\]\)\r?\n\};?\s*$/;
if (targetPattern.test(content)) {
  const replacement = ']),\r\n  blogPosts: ' + JSON.stringify(blogPosts, null, 2) + '\r\n};\r\n';
  content = content.replace(targetPattern, replacement);
  fs.writeFileSync(dataFilePath, content, 'utf8');
  console.log('Successfully added blogPosts to data.js!');
} else {
  console.error('Target pattern not found at the end of data.js');
}
