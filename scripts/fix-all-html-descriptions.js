const fs = require('fs');
const path = require('path');

const FRONTEND = path.join(__dirname, '..', 'frontend');

const staticDescriptions = {
  'frontend/product/detail.html': 'Authentic spiritual item ethically sourced and pre-energized with traditional Vedic mantras for daily wear, meditation, and sacred rituals.',
  'frontend/rudraksha/5-mukhi.html': '5 Mukhi Nepali Rudraksha is one of the most commonly used Rudraksha varieties. Traditionally associated with Lord Shiva, it is valued for meditation, spiritual discipline, calmness, and everyday devotional practices.',
  'frontend/rudraksha/7-mukhi.html': '7 Mukhi Rudraksha is traditionally associated with Goddess Lakshmi and is valued in spiritual traditions for prosperity, stability, and abundance.',
  'frontend/rudraksha/product.html': 'Authentic Rudraksha bead carefully sourced from sacred Himalayan forests and energized with Vedic mantras for spiritual protection, balance, and positive energy.',
  'frontend/rudraksha-mala/5-mukhi-mala-108.html': 'This 108-bead mala features 5 Mukhi Nepali Rudraksha beads and is designed for traditional chanting, meditation, prayer, and spiritual practices.',
  'frontend/gem-stone/amethyst-bracelet.html': 'Natural Amethyst Bracelet features beautiful purple-toned crystal beads and is traditionally associated with calmness, meditation, and spiritual awareness.',
  'frontend/gem-stone/tiger-eye-bracelet.html': 'Natural Tiger Eye Bracelet features distinctive golden-brown bands and chatoyancy. Tiger Eye is traditionally associated with courage, confidence, grounding, and protection symbolism.',
  'frontend/mala/tulsi-mala.html': 'Tulsi Jaap Mala is traditionally made from Tulsi wood beads and is commonly used for chanting, prayer, meditation, and devotional practices.',
  'frontend/bracelet/product.html': 'Natural Gemstone Bracelet crafted with authentic crystal beads, traditionally associated with positivity, emotional balance, and mindfulness.',
  'frontend/bracelet/rudraksha-bracelet.html': 'Gold Capped Rudraksha Bracelet features authentic Rudraksha beads encased in elegant gold-capped frames for a majestic spiritual appearance.',
  'frontend/puja-items/gangajal.html': 'Pure & Sacred Gangajal sourced directly from holy Gangotri Himalayan springs, sealed and purified for sacred Vedic poojas and rituals.',
  'frontend/puja-items/product.html': 'Authentic Sacred Puja Item for Vedic rituals, altars, and spiritual ceremonies.'
};

let updatedCount = 0;

Object.entries(staticDescriptions).forEach(([relPath, descText]) => {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace placeholder text
  content = content.replace(/Loading authentic product description\.\.\./g, descText);

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Replaced loading text in ${relPath}`);
  updatedCount++;
});

console.log(`Successfully updated ${updatedCount} HTML files with authentic descriptions.`);
