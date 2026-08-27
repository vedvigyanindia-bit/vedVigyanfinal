const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const productsBaseDir = path.join(projectRoot, 'product', 'Ved vigyan products');
const generatedImgDir = path.join(projectRoot, 'public', 'images', 'generated');
const dataJsPath = path.join(projectRoot, 'public', 'js', 'data.js');

if (!fs.existsSync(generatedImgDir)) {
  fs.mkdirSync(generatedImgDir, { recursive: true });
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  return 'image/jpeg';
}

function getBase64DataUri(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const mime = getMimeType(filePath);
    return `data:${mime};base64,${data.toString('base64')}`;
  } catch (err) {
    console.error('Error reading image for base64:', filePath, err.message);
    return '';
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function sanitizeUrlPath(fullPath) {
  const rel = path.relative(projectRoot, fullPath);
  return '/' + rel.replace(/\\/g, '/');
}

// Precise Folder Metadata & Exact 5 Categories Mapping
const FOLDER_METADATA = {
  "2 Mukhi Rudraksh": { name: "2 Mukhi Rudraksha (Dwi Mukhi)", category: "rudraksha", price: 1999, originalPrice: 2500, short: "Authentic 2 Mukhi Rudraksha for unity, harmony, and peace of mind." },
  "3 Mukhi Rudraksh": { name: "3 Mukhi Rudraksha (Tri Mukhi)", category: "rudraksha", price: 1999, originalPrice: 2500, short: "Authentic 3 Mukhi Rudraksha for self-confidence, energy, and vitality." },
  "4 Mukhi Rudraksh": { name: "4 Mukhi Rudraksha (Chatur Mukhi)", category: "rudraksha", price: 999, short: "Authentic 4 Mukhi Rudraksha for wisdom, communication, and intellect." },
  "5 Mukhi Nepali": { name: "5 Mukhi Nepali Rudraksha", category: "rudraksha", price: 599, short: "Premium 5 Mukhi Nepali Rudraksha bead for health, focus, and daily protection." },
  "5 Mukhi Rudraksh": { name: "5 Mukhi Rudraksha (Panchmukhi)", category: "rudraksha", price: 699, short: "Everyday authentic Panchmukhi Rudraksha for calmness, balance & focus." },
  "6 Mukhi Rudraksh": { name: "6 Mukhi Rudraksha (Shad Mukhi)", category: "rudraksha", price: 999, short: "Authentic 6 Mukhi Rudraksha for willpower, courage, and emotional balance." },
  "7 Mukhi Rudraksh": { name: "7 Mukhi Rudraksha (Sapta Mukhi)", category: "rudraksha", price: 999, short: "Authentic 7 Mukhi Rudraksha for abundance, career growth, and stability." },
  "8 Mukhi Rudraksh": { name: "8 Mukhi Rudraksh (Ashta Mukhi)", category: "rudraksha", price: 2999, short: "Authentic 8 Mukhi Rudraksha to remove obstacles and invoke Lord Ganesha blessings." },
  "9 Mukhi Rudraksh": { name: "9 Mukhi Rudraksh (Nava Mukhi)", category: "rudraksha", price: 2999, short: "Authentic 9 Mukhi Rudraksha for spiritual power, fearlessness, and Goddess Durga protection." },
  "10 Mukhi Rudraksh": { name: "10 Mukhi Rudraksha (Dasha Mukhi)", category: "rudraksha", price: 2999, short: "Authentic 10 Mukhi Rudraksha for divine protection from negative energies & peace." },
  "11 Mukhi Rudraksh": { name: "11 Mukhi Rudraksha (Ekadasha Mukhi)", category: "rudraksha", price: 5999, short: "Authentic 11 Mukhi Rudraksha for courage, devotion, and Lord Hanuman's grace." },
  "12 Mukhi Rudraksh": { name: "12 Mukhi Rudraksha (Dwadasha Mukhi)", category: "rudraksha", price: 5999, short: "Authentic 12 Mukhi Rudraksha (Surya Rudraksha) for leadership, radiant aura, and vitality." },
  "Ganesh Rudraksh": { name: "Original Ganesh Rudraksha", category: "rudraksha", price: 5999, short: "Authentic Ganesh Rudraksha bead with natural trunk formation for success & wisdom." },
  "Gauri Sankar Rudraksh": { name: "Original Gauri Shankar Rudraksha", category: "rudraksha", price: 8999, short: "Rare conjoined Gauri Shankar Rudraksha for strong relationships & family harmony." },

  // Zodiac Rashi Bracelets
  "Dhanu (धनु – Sagittarius) Braclet": { name: "Dhanu (धनु – Sagittarius) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Dhanu (Sagittarius) zodiac luck & focus." },
  "Kanya (कन्या – Virgo) Braclet": { name: "Kanya (कन्या – Virgo) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Kanya (Virgo) zodiac prosperity & clarity." },
  "Karka (कर्क – Cancer) Braclet": { name: "Karka (कर्क – Cancer) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Karka (Cancer) zodiac emotional balance & peace." },
  "Kumbh (कुंभ – Aquarius) Braclet": { name: "Kumbh (कुंभ – Aquarius) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Kumbh (Aquarius) zodiac focus & success." },
  "Makar (मकर – Capricorn) Braclet": { name: "Makar (मकर – Capricorn) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Makar (Capricorn) zodiac stability & ambition." },
  "Meen (मीन – Pisces) Braclet": { name: "Meen (मीन – Pisces) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Meen (Pisces) zodiac intuition & spiritual calm." },
  "Mesh (मेष – Aries) Braclet": { name: "Mesh (मेष – Aries) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Mesh (Aries) zodiac confidence & energy." },
  "Mithun (मिथुन – Gemini) Braclet": { name: "Mithun (मिथुन – Gemini) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Mithun (Gemini) zodiac intelligence & growth." },
  "Singh (सिंह – Leo) Braclet": { name: "Singh (सिंह – Leo) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Singh (Leo) zodiac leadership & magnetic aura." },
  "Tula (तुला – Libra) Braclet": { name: "Tula (तुला – Libra) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Tula (Libra) zodiac harmony & career success." },
  "Vrishabh (वृषभ – Taurus) Braclet": { name: "Vrishabh (वृषभ – Taurus) Rashi Bracelet", category: "zodiac-bracelet", price: 699, short: "Tailored Rashi gemstone bracelet for Vrishabh (Taurus) zodiac stability & luxury." },

  // Gemstone & Rudraksha Bracelets
  "4. Money Magnet": { name: "Money Magnet Bracelet (Pyrite & Citrine)", category: "crystal-bracelet", price: 699, short: "Attract wealth, prosperity, and financial growth with natural pyrite & citrine." },
  "7 Chakra Braclet": { name: "7 Chakra Healing Crystal Bracelet", category: "crystal-bracelet", price: 699, short: "Natural 7 Chakra gemstone bracelet for energy alignment and inner peace." },
  "Amethyst Bracelet": { name: "Natural Amethyst Healing Bracelet", category: "crystal-bracelet", price: 699, short: "Natural Amethyst crystal bracelet for stress relief, deep calm, and intuition." },
  "Gold Rudraksh Bracelet": { name: "Gold Capped Rudraksha Bracelet", category: "crystal-bracelet", price: 999, short: "Premium Rudraksha bracelet with elegant gold-tone capping for spiritual luxury." },
  "Piride Braclet": { name: "Natural Pyrite Wealth Bracelet", category: "crystal-bracelet", price: 699, short: "Natural Pyrite (Fool's Gold) crystal bracelet for money magnet & career luck." },
  "Rose Quartz Close": { name: "Natural Rose Quartz Crystal Bracelet", category: "crystal-bracelet", price: 699, short: "Natural Rose Quartz crystal bracelet for love, emotional healing & self-care." },
  "Tiger Eye Loose Big": { name: "Natural Tiger Eye Protection Bracelet", category: "crystal-bracelet", price: 699, short: "Natural Tiger Eye gemstone bracelet for courage, grounding & shielding negative energy." },
  "Evil Eye Pendant": {
    name: "Evil Eye Protection Pendant",
    category: "crystal-bracelet",
    price: 699,
    short: "Carry a timeless symbol of positivity and mindful living with the Evil Eye Protection Pendant from Ved Vigyan.",
    description: "Carry a timeless symbol of positivity and mindful living with the Evil Eye Protection Pendant from Ved Vigyan. Inspired by traditions found across many cultures, the Evil Eye symbol is widely believed to help ward off negative intentions and encourage positive energy. Crafted with premium materials and carefully selected for quality, this pendant is suitable for everyday wear and complements both casual and traditional outfits.",
    bullets: [
      "🧿 Premium Evil Eye Protection Pendant",
      "✅ Lab Certified Quality",
      "🌿 Energized according to traditional Vedic rituals",
      "📜 Authenticity Certificate Included",
      "💙 Elegant Blue Evil Eye Design",
      "🎁 Ideal for Daily Wear & Gifting",
      "👨 Suitable for Men & Women"
    ],
    detailsHtml: `<div class="pdp-rich-content"><h4 style="color:var(--lux-gold, #d4af37); margin-bottom: 8px;">Evil Eye Protection Pendant — Product Details</h4><p>Carry a timeless symbol of positivity and mindful living with the Evil Eye Protection Pendant from Ved Vigyan. Inspired by traditions found across many cultures, the Evil Eye symbol is widely believed to help ward off negative intentions and encourage positive energy.</p><p>Crafted with premium materials and carefully selected for quality, this pendant is suitable for everyday wear and complements both casual and traditional outfits.</p><p>Whether you're purchasing it for yourself or gifting it to someone special, this elegant pendant combines meaningful symbolism with stylish design.</p><h5 style="margin-top: 16px; margin-bottom: 8px; font-weight:600;">Product Highlights</h5><ul style="list-style: none; padding: 0; line-height: 1.8;"><li>🧿 Premium Evil Eye Protection Pendant</li><li>✅ Lab Certified Quality</li><li>🌿 Energized according to traditional Vedic rituals</li><li>📜 Authenticity Certificate Included</li><li>💙 Elegant Blue Evil Eye Design</li><li>🎁 Ideal for Daily Wear & Gifting</li><li>👨 Suitable for Men & Women</li></ul><h5 style="margin-top: 18px; margin-bottom: 8px; font-weight:600;">🌟 Traditional Significance & Benefits</h5><p>Across many cultures, the Evil Eye symbol has long been regarded as a protective emblem. Traditionally, it is believed to:</p><ul style="list-style: disc; padding-left: 20px; line-height: 1.7;"><li>Encourage positive thoughts and mindful living</li><li>Symbolize protection from negative intentions</li><li>Serve as a meaningful spiritual accessory</li><li>Promote a sense of confidence and emotional balance</li><li>Complement meditation and spiritual practices</li><li>Make a thoughtful gift for loved ones</li></ul><p style="font-size: 12px; opacity: 0.8; font-style: italic; margin-top: 10px;">Disclaimer: These beliefs are based on traditional cultural and spiritual practices and are not scientifically proven. This product is not intended to diagnose, treat, cure, or prevent any disease or guarantee specific outcomes.</p></div>`,
    howToUseHtml: `<div class="pdp-rich-content"><h4 style="color:var(--lux-gold, #d4af37); margin-bottom: 8px;">📿 How to Use</h4><ul style="list-style: none; padding: 0; line-height: 1.8;"><li>1. Clean the pendant with a soft dry cloth before first use.</li><li>2. Many people choose to wear it after a personal prayer or meditation, according to their own traditions.</li><li>3. Wear it comfortably around your neck as part of your everyday accessories.</li><li>4. Keep it clean and dry for long-lasting shine.</li></ul></div>`,
    authenticityHtml: `<div class="pdp-rich-content"><h4 style="color:var(--lux-gold, #d4af37); margin-bottom: 8px;">💎 Why Choose Ved Vigyan?</h4><ul style="list-style: none; padding: 0; line-height: 1.8;"><li>✔ Premium Quality Product</li><li>✔ Laboratory Certified</li><li>✔ 100% Authentic</li><li>✔ Energized Following Traditional Vedic Rituals</li><li>✔ Authenticity Certificate Included</li><li>✔ Carefully Packed</li><li>✔ Trusted Spiritual Brand</li><li>✔ Secure Shopping Experience</li></ul><h5 style="margin-top: 18px; margin-bottom: 8px; font-weight:600;">🔬 Authenticity & Certification</h5><p>Every Evil Eye Protection Pendant from Ved Vigyan is quality-checked before dispatch.</p><p style="margin-bottom: 4px;">Each order includes:</p><ul style="list-style: disc; padding-left: 20px; line-height: 1.7;"><li>Laboratory Certificate</li><li>Authenticity Verification</li><li>Quality Inspection</li><li>Secure Packaging</li></ul></div>`,
    faqs: [
      { q: "What is the significance of the Evil Eye pendant?", a: "Across many cultures, the Evil Eye symbol is traditionally believed to ward off negative intentions, encourage positive energy, and serve as a protective emblem." },
      { q: "Can men and women both wear this pendant?", a: "Yes. The Evil Eye Protection Pendant is designed to be versatile and suitable for both men and women." },
      { q: "Is an Authenticity Certificate included?", a: "Yes. Every order includes an authenticity certificate and usage guide." },
      { q: "How should I clean and maintain the pendant?", a: "Wipe it gently with a soft dry cloth before first use and keep it dry and clean for long-lasting shine." },
      { q: "Is Cash on Delivery available?", a: "Yes. Cash on Delivery is available across most pincodes in India." }
    ]
  },

  // Jaap Malas & Sacred Beads
  "Karungali mala": { name: "Natural Karungali Ebony Wood Mala (108 Beads)", category: "mala", price: 999, short: "Authentic Karungali (Ebony wood) 108 bead mala for positive energy & protection." },
  "Karungali Rudraksh Silver Cap Mala": { name: "Karungali Rudraksha Silver Cap Mala", category: "mala", price: 999, short: "Combination Karungali wood and Rudraksha mala with pure silver cap finish." },
  "Nepali Rudrakasha Mala Close for wearing": {
    name: "5 Mukhi Nepali Rudraksha Mala (108 Beads)",
    category: "mala",
    price: 999,
    short: "Original 5 Mukhi Nepali Rudraksha 108 bead mala for jaap and daily wearing.",
    description: "The 5 Mukhi Nepali Rudraksha Mala (108 Beads) is one of the most revered Rudraksha malas in Hindu tradition. Associated with Lord Shiva (Kalagni Rudra), it is widely used for daily meditation, mantra chanting (Jaap), and spiritual practices.",
    bullets: [
      "100% Original Nepali 5 Mukhi Rudraksha (108 Beads)",
      "Supports a calm & focused mind during meditation",
      "Ideal for daily mantra chanting (108 beads)",
      "Includes Authenticity Certificate & Usage Guide"
    ],
    detailsHtml: `<div class="pdp-rich-content"><h4 style="color:var(--lux-gold, #d4af37); margin-bottom: 8px;">Benefits of 5 Mukhi Nepali Rudraksha Mala</h4><p>The 5 Mukhi Nepali Rudraksha Mala (108 Beads) is one of the most revered Rudraksha malas in Hindu tradition. Associated with Lord Shiva (Kalagni Rudra), it is widely used for daily meditation, mantra chanting (Jaap), and spiritual practices.</p><h5 style="margin-top: 14px; margin-bottom: 8px; font-weight:600;">Key Benefits</h5><ul style="list-style: none; padding: 0; line-height: 1.8;"><li>✅ Supports a calm and focused mind during meditation</li><li>✅ Ideal for daily mantra chanting (108 beads)</li><li>✅ Traditionally believed to promote inner peace and spiritual growth</li><li>✅ Encourages discipline and mindfulness in daily life</li><li>✅ Comfortable for everyday wear</li><li>✅ Suitable for both beginners and experienced spiritual practitioners</li></ul><p style="font-size: 12px; opacity: 0.8; font-style: italic; margin-top: 10px;">Note: These benefits are based on traditional Hindu beliefs and spiritual practices. They are not intended as medical or therapeutic claims.</p><h5 style="margin-top: 18px; margin-bottom: 8px; font-weight:600;">🙏 Who Should Wear This Rudraksha?</h5><p>This Rudraksha Mala is suitable for:</p><ul style="list-style: disc; padding-left: 20px; line-height: 1.7;"><li>Men and women</li><li>Students practicing concentration and meditation</li><li>Professionals seeking a mindful daily routine</li><li>Yoga practitioners</li><li>Spiritual seekers</li><li>Devotees of Lord Shiva</li><li>Individuals who perform daily Jaap</li><li>Anyone looking for an authentic Nepali Rudraksha Mala</li></ul><p style="margin-top:8px;">The 5 Mukhi Rudraksha is traditionally regarded as one of the most universally suitable Rudraksha beads.</p><h5 style="margin-top: 18px; margin-bottom: 8px; font-weight:600;">📦 What's Included?</h5><ul style="list-style: none; padding: 0; line-height: 1.8;"><li>● 1 × Original 5 Mukhi Nepali Rudraksha Mala (108 Beads)</li><li>● Authenticity Certificate</li><li>● Usage Guide</li><li>● Premium Packaging</li></ul></div>`,
    howToUseHtml: `<div class="pdp-rich-content"><h4 style="color:var(--lux-gold, #d4af37); margin-bottom: 8px;">📿 How to Wear the 5 Mukhi Rudraksha Mala</h4><p>To wear and use your Rudraksha Mala:</p><ol style="padding-left: 20px; line-height: 1.8;"><li>Wake up early and bathe before wearing it.</li><li>Offer a prayer to Lord Shiva.</li><li>Chant "Om Namah Shivaya" 108 times (optional but traditionally recommended).</li><li>Wear the mala around your neck or use it for daily Jaap.</li><li>Store it respectfully when not in use.</li></ol><h5 style="margin-top: 16px; margin-bottom: 8px; font-weight:600;">Care Instructions</h5><ul style="list-style: disc; padding-left: 20px; line-height: 1.7;"><li>Avoid exposing it to harsh chemicals.</li><li>Keep away from perfumes and detergents.</li><li>Clean occasionally with a soft cloth.</li><li>Apply a small amount of natural oil every few months to help maintain the beads.</li></ul></div>`,
    authenticityHtml: `<div class="pdp-rich-content"><h4 style="color:var(--lux-gold, #d4af37); margin-bottom: 8px;">Why Choose Ved Vigyan?</h4><ul style="list-style: none; padding: 0; line-height: 1.8;"><li>✔ 100% Original Nepali Rudraksha</li><li>✔ Laboratory Tested Authenticity</li><li>✔ Energized According to Traditional Vedic Rituals</li><li>✔ Premium Quality Beads</li><li>✔ Includes Authenticity Certificate</li><li>✔ Carefully Packed for Safe Delivery</li><li>✔ Trusted by Thousands of Spiritual Seekers</li></ul></div>`,
    faqs: [
      { q: "Is this an original Nepali Rudraksha?", a: "Yes. Every mala is made using authentic Nepali Rudraksha beads and includes an authenticity certificate." },
      { q: "Is the Rudraksha energized?", a: "Yes. It is energized according to traditional Vedic rituals before dispatch." },
      { q: "Can women wear this Rudraksha?", a: "Yes. The 5 Mukhi Rudraksha is traditionally considered suitable for both men and women." },
      { q: "Can I wear it every day?", a: "Yes. It is suitable for regular use and daily spiritual practices." },
      { q: "Can I use it for mantra chanting?", a: "Absolutely. The 108-bead mala is designed for Jaap and meditation." },
      { q: "Does it come with a certificate?", a: "Yes. Every order includes an authenticity certificate." },
      { q: "Is Cash on Delivery available?", a: "If available in your location, Cash on Delivery can be selected during checkout." },
      { q: "What is the delivery time?", a: "Orders are generally delivered within 3–7 business days, depending on your location." },
      { q: "What if I receive a damaged product?", a: "If your product arrives damaged, contact our support team within the return window for assistance." },
      { q: "How do I maintain my Rudraksha Mala?", a: "Keep it clean and dry, avoid harsh chemicals, and occasionally apply a small amount of natural oil to preserve the beads." }
    ]
  },
  "Rudraksh Jap Mala": {
    name: "Original Rudraksha Jaap Mala (108 Beads)",
    category: "mala",
    price: 999,
    short: "Traditional 108 bead Rudraksha jaap mala for daily chanting, meditation & sadhana.",
    description: "The Original Rudraksha Jaap Mala (108 Beads) is handcrafted from authentic Rudraksha beads selected for purity, texture, and spiritual energy. Ideal for daily mantra chanting, meditation, and spiritual sadhana.",
    bullets: [
      "100% Natural & Original 108 Bead Rudraksha Mala",
      "Pioneered GRRL Lab Certification & Siddhi Prakriya Energized",
      "Perfect for Mantra Chaining (Jaap) & Daily Sadhana",
      "Includes Authenticity Certificate & Sacred Packaging"
    ],
    detailsHtml: `<div class="pdp-rich-content"><h4 style="color:var(--lux-gold, #d4af37); margin-bottom: 8px;">Original Rudraksha Jaap Mala (108 Beads) — Product Details</h4><p>The Original Rudraksha Jaap Mala (108 Beads) is one of the most trusted spiritual tools in Vedic tradition. Crafted with carefully selected Rudraksha beads and traditional knotting, it aids in mantra repetition, mental clarity, and spiritual elevation.</p><h5 style="margin-top: 14px; margin-bottom: 8px; font-weight:600;">Key Features & Benefits</h5><ul style="list-style: none; padding: 0; line-height: 1.8;"><li>✅ Traditional 108+1 Guru Bead Stringing</li><li>✅ Ideal for Daily Mantra Jaap & Meditation</li><li>✅ Promotes Inner Peace, Focus & Emotional Stability</li><li>✅ Laboratory Certified & Traditional Siddhi Energized</li><li>✅ Suitable for All Seekers, Men & Women</li></ul><h5 style="margin-top: 18px; margin-bottom: 8px; font-weight:600;">📦 Package Includes</h5><ul style="list-style: none; padding: 0; line-height: 1.8;"><li>● 1 × Original Rudraksha Jaap Mala (108 Beads)</li><li>● Laboratory Verification Certificate</li><li>● Usage & Care Instructions</li><li>● Premium Sacred Packaging</li></ul></div>`,
    howToUseHtml: `<div class="pdp-rich-content"><h4 style="color:var(--lux-gold, #d4af37); margin-bottom: 8px;">📿 How to Perform Jaap</h4><ol style="padding-left: 20px; line-height: 1.8;"><li>Sit in a quiet space facing East or North.</li><li>Hold the mala in your right hand, using your thumb and middle finger to turn each bead.</li><li>Chant your chosen mantra (such as Om Namah Shivaya) for each bead.</li><li>Do not cross over the Guru bead; turn the mala around to continue additional rounds.</li></ol></div>`,
    authenticityHtml: `<div class="pdp-rich-content"><h4 style="color:var(--lux-gold, #d4af37); margin-bottom: 8px;">💎 Why Choose Ved Vigyan?</h4><ul style="list-style: none; padding: 0; line-height: 1.8;"><li>✔ Pioneered GRRL Lab Certification In India</li><li>✔ Introduced Product Siddhi Prakriya</li><li>✔ Focus on Quality with Strict QC</li><li>✔ 100% Authentic & Natural Beads</li></ul></div>`,
    faqs: [
      { q: "Is this mala 100% authentic?", a: "Yes. Every Rudraksha Jaap Mala is lab certified and energized following Vedic rituals before dispatch." },
      { q: "Can I wear this mala around my neck?", a: "Yes. You can wear it as a sacred necklace or keep it exclusively for daily Jaap and meditation." }
    ]
  },
  "Rudraksh Silver Cap Mala": { name: "Rudraksha Silver Capped Mala", category: "mala", price: 2199, short: "Premium 5 Mukhi Rudraksha mala elegantly strung with silver caps." },
  "Rudraksha Mala 10mm 54 Beads": { name: "Rudraksha Mala (10mm, 54 Beads)", category: "mala", price: 899, short: "Compact 10mm 54 bead Rudraksha mala ideal for quick jaap & comfortable wearing." },
  "Spatik Mala": { name: "Natural Sphatik (Quartz Crystal) Mala", category: "mala", price: 3999, short: "Original Sphatik crystal 108 bead mala for cooling energy, mental clarity & jaap." },
  "Tulsi Jap Mala": { name: "Original Tulsi Jaap Mala", category: "mala", price: 899, short: "Pure sacred Tulsi wood jaap mala for Vishnu bhakti, peace & daily chanting." },
  "Tulsi Mala": { name: "Natural Tulsi Bead Mala (108 Beads)", category: "mala", price: 999, short: "Natural sacred Tulsi wood 108 bead mala for spiritual purity and protection." },
  "Silver Cap Karungali Mala": { name: "Silver Cap Original Karungali Mala", category: "mala", price: 999, short: "Authentic Karungali Ebony Wood Mala with pure silver caps for spiritual protection, inner peace & positive energy." },

  // Feng Shui & Crystal Trees
  "7 Chakra Tree": { name: "7 Chakra Crystal Gemstone Tree", category: "gemstone-tree", price: 999, short: "Handcrafted 7 Chakra crystal tree for positive home energy & Vastu harmony." },
  "Rose Quartz Tree": { name: "Rose Quartz Healing Gemstone Tree", category: "gemstone-tree", price: 999, short: "Handcrafted Rose Quartz crystal tree for harmony, warmth & positive Vastu vibes." }
};

const folders = fs.readdirSync(productsBaseDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== 'Broll and Shoots')
  .map(d => d.name);

console.log(`Processing ${folders.length} product folders into 5 custom categories...`);

const productsList = [];

folders.forEach((folderName, idx) => {
  const folderPath = path.join(productsBaseDir, folderName);
  let files = fs.readdirSync(folderPath)
    .filter(f => !f.startsWith('.') && !f.endsWith('.mp4') && !f.endsWith('.MOV'));

  // Handle empty folders (35 & 36 fallback)
  if (files.length === 0) {
    if (folderName.includes('Silver Cap')) {
      const fallbackFolder = path.join(productsBaseDir, 'Karungali Rudraksh Silver Cap Mala');
      files = fs.readdirSync(fallbackFolder).filter(f => !f.startsWith('.'));
      files = files.map(f => path.join('..', 'Karungali Rudraksh Silver Cap Mala', f));
    } else {
      const fallbackFolder = path.join(productsBaseDir, 'Nepali Rudrakasha Mala Close for wearing');
      files = fs.readdirSync(fallbackFolder).filter(f => !f.startsWith('.'));
      files = files.map(f => path.join('..', 'Nepali Rudrakasha Mala Close for wearing', f));
    }
  }

  // Convert files to resolved info objects
  const resolvedFiles = files.map(f => {
    const fullPath = f.startsWith('..')
      ? path.resolve(productsBaseDir, folderName, f)
      : path.join(folderPath, f);
    return {
      name: path.basename(f),
      fullPath,
      url: sanitizeUrlPath(fullPath)
    };
  });

  // Keep only original photo files (excluding generated SVG certificates)
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  const imageFiles = resolvedFiles.filter(rf => {
    const ext = path.extname(rf.name).toLowerCase();
    const isSvgCert = rf.name.toLowerCase().includes('lab-certificate') || ext === '.svg';
    return imageExtensions.includes(ext) && !isSvgCert;
  });

  // Sort image files numerically (e.g. 1.jpg, 2.jpg, 3.jpg, 20260514_...)
  imageFiles.sort((a, b) => {
    const aNum = parseInt(a.name, 10);
    const bNum = parseInt(b.name, 10);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    if (!isNaN(aNum)) return -1;
    if (!isNaN(bNum)) return 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  // Build the images array using original real photo files (up to 4 photos per product)
  const selectedPhotos = imageFiles.slice(0, 4);
  let images = selectedPhotos.map(f => f.url);

  // Certificate image determination
  const certFile = imageFiles.find(rf => rf.name.toLowerCase() === "4.webp") ||
                   imageFiles.find(rf => /cert|lab-certificate|report|authenticity|asli-brand-comparison/.test(rf.name.toLowerCase()));
  const certificate = certFile ? certFile.url : (images.length >= 4 ? images[3] : images[images.length - 1]);

  const productSlug = slugify(folderName);
  const productId = `vv_p${String(idx + 1).padStart(2, '0')}`;

  const meta = FOLDER_METADATA[folderName] || {
    name: folderName,
    category: "rudraksha",
    price: 999,
    short: "Authentic spiritual product from Ved Vigyan."
  };

  let zodiacSigns = [];
  if (meta.category === 'zodiac-bracelet') {
    const zodiacMatch = meta.name.match(/–\s*([a-zA-Z]+)\)/) || meta.name.match(/\(\s*([a-zA-Z]+)\s*–/);
    if (zodiacMatch) {
      zodiacSigns = [zodiacMatch[1]];
    }
  }

  productsList.push({
    id: productId,
    category: meta.category,
    slug: productSlug,
    name: meta.name,
    price: meta.price,
    tags: [meta.category, "authentic", "vedic"],
    image: images[0],
    imageAlt: `${meta.name} - Authentic Ved Vigyan Original Product`,
    images,
    certificate,
    short: meta.short,
    description: meta.description || `${meta.name} is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.`,
    bullets: meta.bullets || [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    ...(meta.detailsHtml ? { detailsHtml: meta.detailsHtml } : {}),
    ...(meta.howToUseHtml ? { howToUseHtml: meta.howToUseHtml } : {}),
    ...(meta.authenticityHtml ? { authenticityHtml: meta.authenticityHtml } : {}),
    ...(meta.faqs ? { faqs: meta.faqs } : {}),
    seoTitle: `${meta.name} - Buy Original Online | Ved Vigyan`,
    seoDescription: `Shop original ${meta.name} online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.`,
    url: `/product/detail.html?id=${productId}`,
    ...(meta.originalPrice ? { originalPrice: meta.originalPrice } : {}),
    ...(zodiacSigns.length > 0 ? { zodiacSigns } : {})
  });
});

// Swap Money Magnet and Gauri Shankar in productsList so Gauri Shankar is in Featured Collection (top 8)
const mmIndex = productsList.findIndex(p => p.name.includes("Money Magnet"));
const gsIndex = productsList.findIndex(p => p.name.includes("Gauri Shankar"));

if (mmIndex !== -1 && gsIndex !== -1) {
  const temp = productsList[mmIndex];
  productsList[mmIndex] = productsList[gsIndex];
  productsList[gsIndex] = temp;

  // Re-assign IDs and URLs sequentially
  productsList.forEach((p, idx) => {
    p.id = `vv_p${String(idx + 1).padStart(2, '0')}`;
    p.url = `/product/detail.html?id=${p.id}`;
  });
}

console.log(`Successfully processed all ${productsList.length} products into 5 categories.`);

const dataJsContent = `// Auto-generated 43-product Ved Vigyan Catalog Data with 5 Dedicated Categories
function deriveMerchandising(products) {
  return products.map((product, index) => {
    const customOriginal = product.originalPrice;
    const discountPercent = customOriginal && product.price
      ? Math.round(((customOriginal - product.price) / customOriginal) * 100)
      : (18 + ((index * 7) % 23));
    const ratingValue = 4.2 + (((index * 13) % 8) / 10);
    const rating = Math.min(5.0, Number(ratingValue.toFixed(1)));
    const originalPrice = customOriginal || (product.price > 0
      ? Math.round(product.price / (1 - discountPercent / 100))
      : 0);

    return {
      ...product,
      discountPercent,
      originalPrice,
      rating
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
    { id: "all", label: "All Products (${productsList.length})" },
    { id: "rudraksha", label: "Rudraksha Beads (14)" },
    { id: "zodiac-bracelet", label: "Zodiac Rashi Bracelets (11)" },
    { id: "crystal-bracelet", label: "Gemstone & Crystals (8)" },
    { id: "mala", label: "Jaap Malas & Sacred Strings (10)" },
    { id: "gemstone-tree", label: "Crystal & Gemstone Trees (2)" }
  ],
  products: deriveMerchandising(${JSON.stringify(productsList, null, 2)})
};
`;

fs.writeFileSync(dataJsPath, dataJsContent);
console.log(`Updated data.js with ${productsList.length} products in 5 custom categories!`);
