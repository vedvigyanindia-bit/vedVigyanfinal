const fs = require('fs');
const path = require('path');

const tabsData = {
  "vv_p01": {
    description: "10 Mukhi Rudraksha, also known as Dasha Mukhi, is traditionally associated with Lord Vishnu and is valued for spiritual protection, stability, and inner balance. Its natural texture and distinct mukhi lines make it a meaningful choice for spiritual practices and everyday wear.",
    specs: [
      { label: "Type", value: "10 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Lord Vishnu" },
      { label: "Material / Origin", value: "100% Natural Himalayan Rudraksha" },
      { label: "Usage", value: "Meditation, spiritual practices, personal wear" },
      { label: "Finish", value: "Natural Unpolished Bead" },
      { label: "Certification", value: "Govt. Lab Certified with QR Code Test Report" }
    ],
    benefits: [
      { title: "Spiritual Protection", desc: "Traditionally believed to provide divine spiritual protection against negative energies.", icon: "🛡️" },
      { title: "Inner Balance", desc: "Supports a sense of inner balance, peace, and emotional stability.", icon: "🧘" },
      { title: "Meditation Aid", desc: "Commonly used during meditation, prayer, and sacred mantra recitation.", icon: "✨" },
      { title: "Positive Vibrations", desc: "Considered helpful for maintaining positive spiritual aura and focus.", icon: "⚡" }
    ],
    faqs: [
      { q: "Is 10 Mukhi Rudraksha suitable for daily wear?", a: "Yes, it can be worn regularly as part of spiritual practice." },
      { q: "Who can wear it?", a: "It is traditionally worn by people seeking spiritual protection and balance." },
      { q: "Can it be used for meditation?", a: "Yes, it is ideal for meditation and prayer." },
      { q: "How should it be cared for?", a: "Keep it clean, oil occasionally with natural oil, and keep away from harsh chemicals." },
      { q: "Is it natural?", a: "Yes, 100% naturally sourced Himalayan Rudraksha with lab test report." }
    ]
  },
  "vv_p02": {
    description: "11 Mukhi Rudraksha, or Ekadasha Mukhi, is traditionally associated with Lord Hanuman and is valued for courage, confidence, and spiritual strength. It is commonly used for meditation, prayer, and personal spiritual practices.",
    specs: [
      { label: "Type", value: "11 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Lord Hanuman" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" },
      { label: "Certification", value: "Govt. Lab Certified with Test Report" }
    ],
    benefits: [
      { title: "Courage & Confidence", desc: "Traditionally associated with courage, bravery, and self-confidence.", icon: "🦁" },
      { title: "Spiritual Strength", desc: "Supports spiritual discipline and devotion to Lord Hanuman.", icon: "🧘" },
      { title: "Meditation Aid", desc: "Commonly used during deep meditation and prayer sessions.", icon: "✨" },
      { title: "Mental Strength", desc: "Believed to encourage mental resilience and determination.", icon: "⚡" }
    ],
    faqs: [
      { q: "What is 11 Mukhi Rudraksha associated with?", a: "Traditionally, it is associated with Lord Hanuman." },
      { q: "Can I wear it daily?", a: "Yes, it is suitable for regular daily wear." },
      { q: "Can it be used for meditation?", a: "Yes." },
      { q: "How do I maintain it?", a: "Keep it dry, clean with a soft brush, and apply sandalwood or oil occasionally." },
      { q: "Can beginners wear it?", a: "It is commonly worn by both beginners and experienced practitioners." }
    ]
  },
  "vv_p03": {
    description: "12 Mukhi Rudraksha, known as Dwadasha Mukhi, is traditionally associated with Surya, the Sun God. It is valued in spiritual traditions for qualities such as confidence, vitality, leadership, and positive energy.",
    specs: [
      { label: "Type", value: "12 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Surya (The Sun God)" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Spiritual practice, meditation, personal wear" },
      { label: "Finish", value: "Natural" },
      { label: "Certification", value: "Lab Certified with Individual Test Report" }
    ],
    benefits: [
      { title: "Radiant Confidence", desc: "Traditionally associated with leadership qualities and self-confidence.", icon: "☀️" },
      { title: "Vitality & Aura", desc: "Associated with vitality, radiant aura, and positive spiritual energy.", icon: "⚡" },
      { title: "Positive Mindset", desc: "Supports a focused, positive mindset during daily activities.", icon: "🧠" },
      { title: "Devotional Use", desc: "Suitable for sun worship, daily rituals, and meditation.", icon: "🧘" }
    ],
    faqs: [
      { q: "What does 12 Mukhi represent?", a: "It is traditionally associated with Surya (the Sun God)." },
      { q: "Can it be worn every day?", a: "Yes, daily wear is recommended for spiritual resonance." },
      { q: "Is it suitable for meditation?", a: "Yes." },
      { q: "How should it be stored?", a: "Store it in a clean, dry silk or velvet pouch when not in use." },
      { q: "How can I protect its natural surface?", a: "Avoid perfumes, chemicals, and prolonged moisture." }
    ]
  },
  "vv_p04": {
    description: "2 Mukhi Rudraksha, or Dwi Mukhi, is traditionally associated with unity, harmony, and emotional balance. It is often chosen for spiritual practices focused on relationships, inner peace, and balance.",
    specs: [
      { label: "Type", value: "2 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Ardhanarishvara (Shiva & Shakti)" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" },
      { label: "Certification", value: "100% Lab Tested & Verified" }
    ],
    benefits: [
      { title: "Harmony & Unity", desc: "Traditionally associated with relational harmony and togetherness.", icon: "🤝" },
      { title: "Emotional Balance", desc: "Supports a sense of emotional equilibrium and peace of mind.", icon: "💖" },
      { title: "Inner Alignment", desc: "Associated with balancing dualities (Shiva & Shakti energy).", icon: "☯️" },
      { title: "Prayer & Meditation", desc: "Ideal for couple prayer sessions and peaceful meditation.", icon: "🧘" }
    ],
    faqs: [
      { q: "What is 2 Mukhi Rudraksha traditionally associated with?", a: "Unity, harmony, and Ardhanarishvara." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it suitable for couples?", a: "It is traditionally associated with harmony and togetherness." },
      { q: "Can it be used during prayer?", a: "Yes." },
      { q: "How should it be cared for?", a: "Keep it clean and dry." }
    ]
  },
  "vv_p05": {
    description: "3 Mukhi Rudraksha, also called Tri Mukhi, is traditionally associated with Agni, the fire element. It is valued in spiritual traditions for transformation, confidence, and letting go of negative experiences.",
    specs: [
      { label: "Type", value: "3 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Agni (Fire Element)" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Inner Transformation", desc: "Traditionally associated with purifying past karma and inner fire.", icon: "🔥" },
      { title: "Focused Mindset", desc: "Supports a positive and focused mindset during daily routines.", icon: "🧠" },
      { title: "Self-Confidence", desc: "Associated with self-confidence, energy, and vitality.", icon: "💪" },
      { title: "Discipline", desc: "Encourages spiritual discipline and enthusiasm.", icon: "✨" }
    ],
    faqs: [
      { q: "What does 3 Mukhi represent?", a: "It is traditionally associated with Agni (the Fire God)." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can it be used during meditation?", a: "Yes." },
      { q: "How should I clean it?", a: "Gently wipe it with a soft cloth and apply oil periodically." },
      { q: "Should I expose it to chemicals?", a: "Avoid harsh chemicals and soaps." }
    ]
  },
  "vv_p06": {
    description: "4 Mukhi Rudraksha is traditionally associated with Lord Brahma and is valued for knowledge, creativity, concentration, and learning. It is a popular choice among students, professionals, and spiritual practitioners.",
    specs: [
      { label: "Type", value: "4 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Lord Brahma" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, study, spiritual practice" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Wisdom & Knowledge", desc: "Traditionally associated with Lord Brahma, the creator of wisdom.", icon: "📚" },
      { title: "Focus & Concentration", desc: "Supports mental clarity, focus, and study routines.", icon: "🎓" },
      { title: "Creative Expression", desc: "Associated with creativity, communication, and learning.", icon: "💡" },
      { title: "Student Choice", desc: "Popular choice for students, teachers, and researchers.", icon: "✍️" }
    ],
    faqs: [
      { q: "Who is 4 Mukhi Rudraksha associated with?", a: "Lord Brahma." },
      { q: "Is it suitable for students?", a: "Traditionally, it is commonly chosen by students and professionals." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can it be used during study or meditation?", a: "Yes." },
      { q: "How should it be maintained?", a: "Keep it clean and dry." }
    ]
  },
  "vv_p07": {
    description: "Gauri Shankar Rudraksha is a naturally joined Rudraksha formation traditionally associated with Lord Shiva and Goddess Parvati. It symbolizes unity, harmony, and spiritual connection and is highly valued for devotional practices.",
    specs: [
      { label: "Type", value: "Gauri Shankar Rudraksha" },
      { label: "Formation", value: "Naturally Joined Twin Rudraksha" },
      { label: "Traditional Association", value: "Shiva-Parvati Divine Union" },
      { label: "Usage", value: "Meditation, prayer, spiritual practices" },
      { label: "Finish", value: "Natural Unpolished" }
    ],
    benefits: [
      { title: "Divine Harmony", desc: "Symbolizes the eternal union of Lord Shiva and Goddess Parvati.", icon: "🌺" },
      { title: "Relationship Peace", desc: "Traditionally associated with family harmony, trust, and love.", icon: "🏡" },
      { title: "Devotional Connection", desc: "Considered highly meaningful for sacred rituals and meditation.", icon: "🧘" },
      { title: "Collector Bead", desc: "Rare and prized addition for spiritual seekers and collectors.", icon: "💎" }
    ],
    faqs: [
      { q: "What makes Gauri Shankar special?", a: "Its two naturally joined Rudraksha beads forming a single holy unit." },
      { q: "Is it suitable for meditation?", a: "Yes, it is revered for deep devotional meditation." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "How should it be stored?", a: "In a clean, dry altar or velvet pouch." },
      { q: "Should the bead be polished?", a: "Avoid excessive polishing that alters its natural structure." }
    ]
  },
  "vv_p08": {
    description: "5 Mukhi Nepali Rudraksha is one of the most commonly used Rudraksha varieties. Traditionally associated with Lord Shiva, it is valued for meditation, spiritual discipline, calmness, and everyday devotional practices.",
    specs: [
      { label: "Type", value: "5 Mukhi Nepali Rudraksha" },
      { label: "Origin", value: "Nepal" },
      { label: "Traditional Association", value: "Lord Shiva (Kalagni Rudra)" },
      { label: "Material", value: "Natural Nepali Rudraksha" },
      { label: "Usage", value: "Daily wear, meditation, prayer" }
    ],
    benefits: [
      { title: "Calmness & Focus", desc: "Traditionally associated with peace of mind and mental balance.", icon: "🧘" },
      { title: "Everyday Protection", desc: "Popular for daily protection and general well-being.", icon: "🛡️" },
      { title: "Meditation Routine", desc: "Easy to incorporate into daily prayer and chanting.", icon: "📿" },
      { title: "Universal Wear", desc: "Suitable for beginners and experienced wearers alike.", icon: "✨" }
    ],
    faqs: [
      { q: "What is Nepali Rudraksha?", a: "Rudraksha beads harvested directly from Nepal, known for deep grooves." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is 5 Mukhi popular?", a: "It is the most popular and versatile Rudraksha variety." },
      { q: "Can beginners wear it?", a: "Yes." },
      { q: "How should it be maintained?", a: "Keep it clean and oil periodically." }
    ]
  },
  "vv_p09": {
    description: "Panchmukhi Rudraksha has five natural mukhi lines and is traditionally associated with Lord Shiva. It is widely used for meditation, prayer, chanting, and everyday spiritual practices.",
    specs: [
      { label: "Type", value: "5 Mukhi Rudraksha (Panchmukhi)" },
      { label: "Traditional Association", value: "Lord Shiva" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, chanting, daily wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Mind Calmness", desc: "Traditionally associated with inner tranquility and stress reduction.", icon: "🕊️" },
      { title: "Chanting Companion", desc: "Ideal for Om Namah Shivaya mantra japa.", icon: "📿" },
      { title: "Positive Resonance", desc: "Encourages positive spiritual energy throughout the day.", icon: "⚡" },
      { title: "Versatile Wear", desc: "Suitable for all age groups and spiritual traditions.", icon: "🌟" }
    ],
    faqs: [
      { q: "What is Panchmukhi Rudraksha?", a: "A Rudraksha with five naturally formed mukhi lines." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can it be used for chanting?", a: "Yes." },
      { q: "Is it suitable for beginners?", a: "Yes, Panchmukhi is ideal for everyone." },
      { q: "How should it be cleaned?", a: "Use a soft brush and clean water, dry immediately." }
    ]
  },
  "vv_p10": {
    description: "6 Mukhi Rudraksha, or Shad Mukhi, is traditionally associated with Lord Kartikeya. It is valued in spiritual traditions for focus, discipline, confidence, and inner balance.",
    specs: [
      { label: "Type", value: "6 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Lord Kartikeya (Skanda)" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Willpower & Focus", desc: "Traditionally associated with Lord Kartikeya for focus and willpower.", icon: "🎯" },
      { title: "Emotional Stability", desc: "Believed to support emotional balance and grounding.", icon: "🧘" },
      { title: "Confidence", desc: "Associated with courage and steadfast determination.", icon: "🦁" },
      { title: "Study & Work", desc: "Great for students and career professionals.", icon: "💼" }
    ],
    faqs: [
      { q: "Who is 6 Mukhi associated with?", a: "Lord Kartikeya." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can students use it?", a: "Yes, it is traditionally associated with focus and discipline." },
      { q: "Can it be used during meditation?", a: "Yes." },
      { q: "How should it be stored?", a: "Keep it away from moisture and harsh chemicals." }
    ]
  },
  "vv_p13": {
    description: "7 Mukhi Rudraksha is traditionally associated with Goddess Lakshmi and is valued in spiritual traditions for prosperity, stability, and abundance.",
    specs: [
      { label: "Type", value: "7 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Goddess Lakshmi" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Prosperity Symbol", desc: "Traditionally associated with Goddess Lakshmi for prosperity.", icon: "💰" },
      { title: "Financial Stability", desc: "Symbolizes abundance, good fortune, and financial peace.", icon: "⚖️" },
      { title: "Spiritual Growth", desc: "Supports steady progress in business and spiritual pursuits.", icon: "🌱" },
      { title: "Daily Wear", desc: "Comfortable for daily wear in gold or silver thread.", icon: "✨" }
    ],
    faqs: [
      { q: "What is 7 Mukhi associated with?", a: "Goddess Lakshmi." },
      { q: "Is it related to prosperity?", a: "Traditionally, yes." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can business owners wear it?", a: "It is traditionally chosen for prosperity-related spiritual practices." },
      { q: "How should it be maintained?", a: "Keep it clean and dry." }
    ]
  },
  "vv_p14": {
    description: "8 Mukhi Rudraksha is traditionally associated with Lord Ganesha and is valued for wisdom, new beginnings, confidence, and overcoming traditional spiritual obstacles.",
    specs: [
      { label: "Type", value: "8 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Lord Ganesha" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Obstacle Removal", desc: "Traditionally associated with Lord Ganesha (Vighnaharta).", icon: "🐘" },
      { title: "New Beginnings", desc: "Symbolizes auspicious starts for new ventures and careers.", icon: "🌅" },
      { title: "Wisdom & Clarity", desc: "Associated with wisdom, intellect, and clear thinking.", icon: "💡" },
      { title: "Meditation Support", desc: "Calms the mind for deeper spiritual reflection.", icon: "🧘" }
    ],
    faqs: [
      { q: "What is 8 Mukhi associated with?", a: "Lord Ganesha." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it suitable for new beginnings?", a: "It is traditionally associated with new ventures." },
      { q: "Can it be used for meditation?", a: "Yes." },
      { q: "How should it be cared for?", a: "Keep it away from chemicals and excessive water." }
    ]
  },
  "vv_p15": {
    description: "9 Mukhi Rudraksha is traditionally associated with Goddess Durga and is valued for courage, strength, determination, and spiritual confidence.",
    specs: [
      { label: "Type", value: "9 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Goddess Durga (Navadurga)" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Prayer, meditation, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Fearlessness & Courage", desc: "Traditionally associated with Goddess Durga for fearlessness.", icon: "⚔️" },
      { title: "Inner Strength", desc: "Symbolizes spiritual resilience, power, and determination.", icon: "💪" },
      { title: "Protection", desc: "Believed to shield the wearer from negative influences.", icon: "🛡️" },
      { title: "Devotional Practice", desc: "Highly prized during Navratri and daily Durga worship.", icon: "🌺" }
    ],
    faqs: [
      { q: "Who is 9 Mukhi associated with?", a: "Goddess Durga." },
      { q: "Can it be worn every day?", a: "Yes." },
      { q: "Is it suitable for meditation?", a: "Yes." },
      { q: "What does it symbolize?", a: "Traditionally, courage, strength, and divine protection." },
      { q: "How should it be maintained?", a: "Keep it clean and dry." }
    ]
  },
  "vv_p19": {
    description: "Ganesh Rudraksha is a naturally formed Rudraksha featuring a trunk-like protrusion that resembles Lord Ganesha. It is traditionally valued as a symbol of wisdom, auspicious beginnings, and spiritual growth.",
    specs: [
      { label: "Type", value: "Ganesh Rudraksha" },
      { label: "Formation", value: "Natural Trunk-like Protrusion" },
      { label: "Traditional Association", value: "Lord Ganesha" },
      { label: "Usage", value: "Prayer, meditation, collection" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Auspicious Beginnings", desc: "Naturally formed bead symbolizing Lord Ganesha's blessings.", icon: "🐘" },
      { title: "Intellect & Wisdom", desc: "Associated with sharp intellect, wisdom, and decision making.", icon: "🧠" },
      { title: "Devotional Collection", desc: "Prized spiritual item for altar worship and prayer.", icon: "🕯️" },
      { title: "Daily Wear", desc: "Can be worn around neck or wrist in silver cap.", icon: "✨" }
    ],
    faqs: [
      { q: "What is Ganesh Rudraksha?", a: "A Rudraksha with a naturally occurring trunk-like formation." },
      { q: "Is the shape natural?", a: "Yes, authentic specimens have natural protrusions." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "Can it be used for prayer?", a: "Yes." },
      { q: "How should it be preserved?", a: "Keep it dry and protected from chemicals." }
    ]
  },
  "vv_p11": {
    description: "The 7 Chakra Crystal Bracelet features a combination of colourful gemstone beads traditionally associated with the seven chakras. It is designed as a spiritual accessory for meditation, mindfulness, and everyday wear.",
    specs: [
      { label: "Type", value: "7 Chakra Crystal Gemstone Bracelet" },
      { label: "Chakra Coverage", value: "7 Primary Body Chakras" },
      { label: "Bead Material", value: "Natural Gemstone Beads (Amethyst, Lapis, Turquoise, etc.)" },
      { label: "Design", value: "Durable Stretch Cord" },
      { label: "Usage", value: "Meditation, mindfulness, daily wear" }
    ],
    benefits: [
      { title: "Chakra Balancing", desc: "Traditionally associated with aligning the seven body energy centers.", icon: "🌈" },
      { title: "Mindfulness Tool", desc: "Supports daily meditation, yoga, and mindfulness routines.", icon: "🧘" },
      { title: "Vibrant Aesthetics", desc: "Colorful, elegant accessory that complements any attire.", icon: "✨" },
      { title: "Thoughtful Gift", desc: "Excellent spiritual gift for friends and family.", icon: "🎁" }
    ],
    faqs: [
      { q: "What are the seven chakras?", a: "Traditional energy centres used in several Indian spiritual practices." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Is it adjustable?", a: "Stretch designs generally accommodate different wrist sizes." },
      { q: "Can it be used during meditation?", a: "Yes." },
      { q: "Is it a medical product?", a: "No, it is a spiritual/aesthetic crystal accessory." }
    ]
  },
  "vv_p16": {
    description: "Natural Amethyst Bracelet features beautiful purple-toned crystal beads and is traditionally associated with calmness, meditation, and spiritual awareness. Its elegant appearance also makes it suitable for everyday styling.",
    specs: [
      { label: "Stone", value: "Natural Amethyst" },
      { label: "Type", value: "Crystal Gemstone Bracelet" },
      { label: "Color", value: "Deep Purple" },
      { label: "Design", value: "Beaded Stretch Bracelet" },
      { label: "Usage", value: "Meditation, mindfulness, daily wear" }
    ],
    benefits: [
      { title: "Tranquility & Peace", desc: "Traditionally associated with calming stress and promoting peaceful sleep.", icon: "💜" },
      { title: "Meditation Focus", desc: "Enhances intuitive awareness during meditation and reflection.", icon: "🧘" },
      { title: "Elegant Style", desc: "Rich purple hue provides a sophisticated look for daily wear.", icon: "✨" },
      { title: "Spiritual Gift", desc: "Popular gift for crystal lovers and wellness enthusiasts.", icon: "🎁" }
    ],
    faqs: [
      { q: "Is the bracelet made with Amethyst?", a: "Yes, it is crafted with genuine Amethyst beads." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Can Amethyst colour vary?", a: "Natural stones show natural variations in shade." },
      { q: "Can it be used for meditation?", a: "Yes." },
      { q: "How should I clean it?", a: "Wipe gently with a soft dry cloth." }
    ]
  },
  "vv_p18": {
    description: "The Evil Eye Protection Pendant is inspired by the traditional evil-eye symbol, widely used across cultures as a protective talisman. Its stylish design allows it to be worn as both a spiritual accessory and everyday jewellery.",
    specs: [
      { label: "Type", value: "Evil Eye Protection Pendant" },
      { label: "Design", value: "Traditional Evil Eye Protection Talisman" },
      { label: "Material", value: "Enamel & Metal Alloy / Silver Finish" },
      { label: "Usage", value: "Daily wear, gifting" },
      { label: "Style", value: "Spiritual / Modern Fashion Accessory" }
    ],
    benefits: [
      { title: "Aura Shield", desc: "Traditionally regarded as a symbol to ward off envy and evil eye (Buri Nazar).", icon: "👁️" },
      { title: "Stylish Versatility", desc: "Chic design suitable for everyday wear with modern outfits.", icon: "✨" },
      { title: "Positivity", desc: "Reminds the wearer to maintain positive thoughts and boundaries.", icon: "🌟" },
      { title: "Unisex Gift", desc: "Popular protective gift for men, women, and youth.", icon: "🎁" }
    ],
    faqs: [
      { q: "What does the Evil Eye symbolize?", a: "Traditionally, protection against negative influence and envy." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Is it suitable as a gift?", a: "Yes, it makes a thoughtful gift." },
      { q: "Can men and women wear it?", a: "Yes." },
      { q: "How should it be stored?", a: "Keep it in a dry jewellery box when not in use." }
    ]
  },
  "vv_p20": {
    description: "The Money Magnet Bracelet combines Pyrite and Citrine-inspired gemstone elements in a stylish design traditionally associated with abundance, confidence, and prosperity symbolism.",
    specs: [
      { label: "Stones", value: "Natural Pyrite & Citrine Crystal Beads" },
      { label: "Type", value: "Abundance Gemstone Bracelet" },
      { label: "Design", value: "Elastic Stretch Bracelet" },
      { label: "Finish", value: "Metallic Gold & Golden Yellow" },
      { label: "Usage", value: "Daily wear, business meetings, meditation" }
    ],
    benefits: [
      { title: "Abundance Symbol", desc: "Combines two legendary stones associated with prosperity and wealth.", icon: "💰" },
      { title: "Confidence Boost", desc: "Pyrite's metallic sheen symbolizes willpower and confidence.", icon: "🦁" },
      { title: "Positive Mindset", desc: "Citrine's warm tone encourages optimism and creative ideas.", icon: "☀️" },
      { title: "Professional Wear", desc: "Stylish accessory for entrepreneurs and career professionals.", icon: "💼" }
    ],
    faqs: [
      { q: "What stones are used?", a: "Natural Pyrite and Citrine crystal beads." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it a guaranteed money magnet?", a: "No gemstone guarantees financial results; benefits are traditional spiritual symbolism." },
      { q: "Can business owners wear it?", a: "Yes, it is a very popular symbolic accessory." },
      { q: "How should it be cleaned?", a: "Use a soft, dry cloth." }
    ]
  },
  "vv_p32": {
    description: "Natural Pyrite Wealth Bracelet features Pyrite beads with a distinctive metallic appearance. Pyrite is traditionally associated with abundance, confidence, determination, and prosperity symbolism.",
    specs: [
      { label: "Stone", value: "Natural Pyrite (Fool's Gold)" },
      { label: "Type", value: "Gemstone Bracelet" },
      { label: "Color", value: "Metallic Brass / Golden Sheen" },
      { label: "Design", value: "Beaded Stretch Cord" },
      { label: "Usage", value: "Daily wear, professional wear" }
    ],
    benefits: [
      { title: "Prosperity Symbol", desc: "Traditionally associated with wealth, abundance, and success.", icon: "🪙" },
      { title: "Determination", desc: "Symbolizes strong willpower, focus, and groundness.", icon: "💪" },
      { title: "Metallic Shine", desc: "Distinctive metallic appearance that draws admiring attention.", icon: "✨" },
      { title: "Business Gift", desc: "Thoughtful gift for colleagues, business partners, and grads.", icon: "🎁" }
    ],
    faqs: [
      { q: "What is Pyrite?", a: "A naturally occurring mineral known for its metallic golden appearance." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Does Pyrite guarantee wealth?", a: "No, benefits are spiritual and symbolic." },
      { q: "Can its appearance vary?", a: "Natural minerals vary slightly in luster and texture." },
      { q: "How should I care for it?", a: "Keep it dry and avoid harsh soaps or moisture." }
    ]
  },
  "vv_p33": {
    description: "Rose Quartz Bracelet features soft pink crystal beads traditionally associated with love, harmony, compassion, and emotional positivity. Its subtle colour makes it suitable for everyday wear.",
    specs: [
      { label: "Stone", value: "Natural Rose Quartz" },
      { label: "Color", value: "Soft Pastel Pink" },
      { label: "Type", value: "Crystal Bracelet" },
      { label: "Design", value: "Beaded Stretch Bracelet" },
      { label: "Usage", value: "Daily wear, meditation, gifting" }
    ],
    benefits: [
      { title: "Love & Harmony", desc: "Traditionally associated with self-love, compassion, and harmony.", icon: "🌸" },
      { title: "Emotional Peace", desc: "Calms emotional restlessness and nurtures kindness.", icon: "💖" },
      { title: "Gentle Aesthetics", desc: "Soft pink color complements both Western and ethnic wear.", icon: "✨" },
      { title: "Popular Gift", desc: "One of the most gifted crystals for loved ones.", icon: "🎁" }
    ],
    faqs: [
      { q: "What is Rose Quartz associated with?", a: "Traditionally, love, harmony, and emotional positivity." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is every bead identical?", a: "Natural crystals show gentle variations in translucency." },
      { q: "Can I gift it?", a: "Yes." },
      { q: "How should I clean it?", a: "Gently wipe with a soft dry cloth." }
    ]
  },
  "vv_p39": {
    description: "Natural Tiger Eye Bracelet features distinctive golden-brown bands and chatoyancy. Tiger Eye is traditionally associated with courage, confidence, grounding, and protection symbolism.",
    specs: [
      { label: "Stone", value: "Natural Tiger Eye" },
      { label: "Color", value: "Golden Brown Chatoyant" },
      { label: "Type", value: "Gemstone Bracelet" },
      { label: "Design", value: "Beaded Stretch Cord" },
      { label: "Usage", value: "Daily wear, meditation" }
    ],
    benefits: [
      { title: "Courage & Willpower", desc: "Traditionally associated with inner strength and fearlessness.", icon: "🐅" },
      { title: "Grounding Energy", desc: "Provides grounding energy during challenging situations.", icon: "🪵" },
      { title: "Striking Pattern", desc: "Beautiful silky luster with chatoyant light reflections.", icon: "✨" },
      { title: "Unisex Styling", desc: "Versatile bracelet popular among both men and women.", icon: "👌" }
    ],
    faqs: [
      { q: "What is Tiger Eye?", a: "A gemstone known for its golden-brown chatoyant light bands." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Can stone patterns vary?", a: "Yes, every natural stone has a unique pattern." },
      { q: "Is it suitable for gifting?", a: "Yes." },
      { q: "How do I maintain it?", a: "Avoid harsh chemicals and excessive water." }
    ]
  },
  "vv_p29": {
    description: "Mesh Rashi Bracelet is designed for people born under the Aries zodiac sign. It combines traditional zodiac symbolism with a stylish gemstone bracelet design suitable for everyday wear.",
    specs: [
      { label: "Rashi / Zodiac", value: "Mesh (Aries)" },
      { label: "Rashi Lord", value: "Mangal (Mars)" },
      { label: "Material", value: "Curated Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, personalized gifting" }
    ],
    benefits: [
      { title: "Aries Symbolism", desc: "Tailored to align with Aries (Mesh Rashi) energetic traits.", icon: "♈" },
      { title: "Confidence & Drive", desc: "Encourages enthusiasm, leadership, and bold action.", icon: "🔥" },
      { title: "Personalized Fashion", desc: "Meaningful astrological accessory for daily wear.", icon: "✨" },
      { title: "Birthday Gift", desc: "Perfect birthday gift for Aries natives.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear Mesh Rashi Bracelet?", a: "People associated with the Aries/Mesh zodiac sign." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it adjustable?", a: "Stretch bracelet designs fit most wrist sizes comfortably." },
      { q: "Can I gift it?", a: "Yes." },
      { q: "Is it an astrological treatment?", a: "No, it is a traditional spiritual accessory." }
    ]
  },
  "vv_p43": {
    description: "Vrishabh Rashi Bracelet is inspired by the Taurus zodiac sign and combines traditional astrology symbolism with a stylish gemstone bracelet design.",
    specs: [
      { label: "Rashi / Zodiac", value: "Vrishabh (Taurus)" },
      { label: "Rashi Lord", value: "Shukra (Venus)" },
      { label: "Material", value: "Curated Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, astrology enthusiasts" }
    ],
    benefits: [
      { title: "Taurus Alignment", desc: "Reflects Taurus (Vrishabh Rashi) qualities of stability and elegance.", icon: "♉" },
      { title: "Peace & Groundedness", desc: "Supports emotional balance and practical determination.", icon: "🌿" },
      { title: "Sophisticated Look", desc: "Harmonious bead colors suited for all occasions.", icon: "✨" },
      { title: "Personalized Gift", desc: "Thoughtful gift for Taurus birthday celebrants.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who is it for?", a: "Taurus/Vrishabh zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it a gemstone bracelet?", a: "Yes." },
      { q: "Can it be gifted?", a: "Yes." },
      { q: "Will every stone look identical?", a: "Natural stones show organic color variations." }
    ]
  },
  "vv_p30": {
    description: "Mithun Rashi Bracelet is designed around Gemini zodiac symbolism. It combines traditional astrological inspiration with attractive gemstone beads for a meaningful everyday accessory.",
    specs: [
      { label: "Rashi / Zodiac", value: "Mithun (Gemini)" },
      { label: "Rashi Lord", value: "Budh (Mercury)" },
      { label: "Material", value: "Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, gifting" }
    ],
    benefits: [
      { title: "Gemini Symbolism", desc: "Resonates with Gemini traits of intellect, adaptability, and charm.", icon: "♊" },
      { title: "Communication", desc: "Traditionally associated with clear expression and quick learning.", icon: "🗣️" },
      { title: "Versatile Wear", desc: "Lightweight and stylish for home, office, and travel.", icon: "✨" },
      { title: "Special Gift", desc: "Ideal gift for Gemini friends and family.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Gemini/Mithun zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it suitable for gifting?", a: "Yes." },
      { q: "Are natural stones unique?", a: "Yes." },
      { q: "How should it be maintained?", a: "Keep away from harsh chemicals." }
    ]
  },
  "vv_p23": {
    description: "Karka Rashi Bracelet is inspired by the Cancer zodiac sign and features a traditional gemstone-based design. It is suitable for people who enjoy astrology-inspired jewellery and spiritual accessories.",
    specs: [
      { label: "Rashi / Zodiac", value: "Karka (Cancer)" },
      { label: "Rashi Lord", value: "Chandra (Moon)" },
      { label: "Material", value: "Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, gifting" }
    ],
    benefits: [
      { title: "Cancer Symbolism", desc: "Aligned with Cancer (Karka) traits of intuition and care.", icon: "♋" },
      { title: "Emotional Peace", desc: "Associated with calming emotional waves and fostering intuition.", icon: "🌙" },
      { title: "Subtle Elegance", desc: "Gentle gemstone tones suitable for all outfits.", icon: "✨" },
      { title: "Personal Gift", desc: "Heartfelt gift for Cancer sign individuals.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear Karka Bracelet?", a: "Cancer/Karka zodiac enthusiasts." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Is it suitable as a gift?", a: "Yes." },
      { q: "Are the stones natural?", a: "Yes, genuine gemstone beads." },
      { q: "Can colour vary?", a: "Natural gemstones show subtle variations." }
    ]
  },
  "vv_p37": {
    description: "Singh Rashi Bracelet is designed around Leo zodiac symbolism. Its gemstone design makes it a stylish choice for people interested in astrology, spiritual accessories, and personalised gifting.",
    specs: [
      { label: "Rashi / Zodiac", value: "Singh (Leo)" },
      { label: "Rashi Lord", value: "Surya (Sun)" },
      { label: "Material", value: "Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, personal style" }
    ],
    benefits: [
      { title: "Leo Leadership", desc: "Embodying Leo (Singh) energy of confidence and charisma.", icon: "♌" },
      { title: "Warm Energy", desc: "Associated with enthusiasm, vitality, and solar power.", icon: "☀️" },
      { title: "Bold Style", desc: "Striking design that makes a distinctive personal statement.", icon: "🦁" },
      { title: "Zodiac Gift", desc: "Great gift for Leos on birthdays and milestones.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Leo/Singh zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it suitable for gifting?", a: "Yes." },
      { q: "Can the beads vary?", a: "Natural gemstone beads show unique grain patterns." },
      { q: "How should it be cared for?", a: "Avoid harsh chemicals and perfumes." }
    ]
  },
  "vv_p22": {
    description: "Kanya Rashi Bracelet is inspired by the Virgo zodiac sign and combines traditional astrological symbolism with a modern gemstone bracelet design.",
    specs: [
      { label: "Rashi / Zodiac", value: "Kanya (Virgo)" },
      { label: "Rashi Lord", value: "Budh (Mercury)" },
      { label: "Material", value: "Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, gifting" }
    ],
    benefits: [
      { title: "Virgo Precision", desc: "Reflects Virgo (Kanya) characteristics of clarity and dedication.", icon: "♍" },
      { title: "Analytical Balance", desc: "Associated with mental focus, organization, and inner calm.", icon: "🧠" },
      { title: "Understated Style", desc: "Refined aesthetic suited for workplace and daily routine.", icon: "✨" },
      { title: "Custom Gift", desc: "Thoughtful birthday gift for Virgo friends.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Virgo/Kanya zodiac enthusiasts." },
      { q: "Can it be worn every day?", a: "Yes." },
      { q: "Is it suitable for gifting?", a: "Yes." },
      { q: "Do gemstones vary?", a: "Natural stones may show light variations." },
      { q: "How should it be stored?", a: "Keep in a clean dry pouch when not in use." }
    ]
  },
  "vv_p40": {
    description: "Tula Rashi Bracelet is inspired by the Libra zodiac sign and is designed as a stylish gemstone accessory for astrology enthusiasts.",
    specs: [
      { label: "Rashi / Zodiac", value: "Tula (Libra)" },
      { label: "Rashi Lord", value: "Shukra (Venus)" },
      { label: "Material", value: "Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, gifting" }
    ],
    benefits: [
      { title: "Libra Balance", desc: "Symbolizes Libra (Tula) harmony, justice, and aesthetic appreciation.", icon: "♎" },
      { title: "Peaceful Aura", desc: "Associated with cultivating peaceful relationships and beauty.", icon: "⚖️" },
      { title: "Chic Design", desc: "Elegant colors that complement diverse wardrobes.", icon: "✨" },
      { title: "Personalized Gift", desc: "Popular gift for Libra zodiac birthdays.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Libra/Tula zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can it be gifted?", a: "Yes." },
      { q: "Are all beads identical?", a: "Natural stones differ in subtle natural markings." },
      { q: "How should I care for it?", a: "Avoid chemicals and prolonged moisture." }
    ]
  },
  "vv_p17": {
    description: "Dhanu Rashi Bracelet is inspired by Sagittarius zodiac symbolism. The gemstone bracelet combines traditional astrology with a modern accessory suitable for daily wear.",
    specs: [
      { label: "Rashi / Zodiac", value: "Dhanu (Sagittarius)" },
      { label: "Rashi Lord", value: "Guru (Jupiter)" },
      { label: "Material", value: "Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, gifting" }
    ],
    benefits: [
      { title: "Sagittarius Optimism", desc: "Aligned with Sagittarius (Dhanu) spirit of adventure and truth.", icon: "♐" },
      { title: "Wisdom & Joy", desc: "Associated with optimistic mindset and spiritual growth.", icon: "🏹" },
      { title: "Versatile Wear", desc: "Stylish everyday accessory for active lifestyles.", icon: "✨" },
      { title: "Zodiac Present", desc: "Meaningful gift for Sagittarius natives.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Sagittarius/Dhanu zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can I gift it?", a: "Yes." },
      { q: "Can natural stones vary?", a: "Yes." },
      { q: "How should it be stored?", a: "Keep it dry and protected." }
    ]
  },
  "vv_p27": {
    description: "Makar Rashi Bracelet is inspired by Capricorn zodiac symbolism. It is designed with gemstone beads and offers a combination of traditional astrological inspiration and contemporary styling.",
    specs: [
      { label: "Rashi / Zodiac", value: "Makar (Capricorn)" },
      { label: "Rashi Lord", value: "Shani (Saturn)" },
      { label: "Material", value: "Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, professional style" }
    ],
    benefits: [
      { title: "Capricorn Discipline", desc: "Reflects Capricorn (Makar) traits of perseverance and ambition.", icon: "♑" },
      { title: "Grounding Strength", desc: "Associated with steady focus and practical wisdom.", icon: "🏔️" },
      { title: "Classic Aesthetic", desc: "Timeless design suited for professional and formal wear.", icon: "✨" },
      { title: "Thoughtful Gift", desc: "Ideal gift for Capricorn zodiac celebrants.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Capricorn/Makar zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it a good gift?", a: "Yes." },
      { q: "Can gemstone colour vary?", a: "Natural stones can vary." },
      { q: "How should I maintain it?", a: "Keep away from harsh chemicals." }
    ]
  },
  "vv_p26": {
    description: "Kumbh Rashi Bracelet is inspired by Aquarius zodiac symbolism. Its gemstone design makes it a meaningful accessory for astrology enthusiasts and those looking for personalised spiritual jewellery.",
    specs: [
      { label: "Rashi / Zodiac", value: "Kumbh (Aquarius)" },
      { label: "Rashi Lord", value: "Shani (Saturn)" },
      { label: "Material", value: "Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, gifting" }
    ],
    benefits: [
      { title: "Aquarius Vision", desc: "Captures Aquarius (Kumbh) ideals of innovation and humanitarian spirit.", icon: "♒" },
      { title: "Originality & Insight", desc: "Associated with creative thinking and open-mindedness.", icon: "💡" },
      { title: "Daily Comfort", desc: "Smooth, comfortable fit for work and leisure.", icon: "✨" },
      { title: "Personalized Choice", desc: "Great present for Aquarius birthdays.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Aquarius/Kumbh zodiac enthusiasts." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Is it suitable for gifting?", a: "Yes." },
      { q: "Are stones naturally varied?", a: "Natural gemstones can vary." },
      { q: "How should I care for it?", a: "Avoid chemicals and excessive water." }
    ]
  },
  "vv_p28": {
    description: "Meen Rashi Bracelet is inspired by Pisces zodiac symbolism and features a gemstone-based design. It is suitable for astrology enthusiasts looking for a meaningful and attractive everyday accessory.",
    specs: [
      { label: "Rashi / Zodiac", value: "Meen (Pisces)" },
      { label: "Rashi Lord", value: "Guru (Jupiter)" },
      { label: "Material", value: "Gemstone Beads" },
      { label: "Type", value: "Zodiac Rashi Bracelet" },
      { label: "Usage", value: "Daily wear, gifting" }
    ],
    benefits: [
      { title: "Pisces Intuition", desc: "Resonates with Pisces (Meen) traits of empathy and imagination.", icon: "♓" },
      { title: "Peaceful Resonance", desc: "Associated with emotional calmness and artistic inspiration.", icon: "🌊" },
      { title: "Lightweight Wear", desc: "Comfortable wrist accessory for everyday fashion.", icon: "✨" },
      { title: "Zodiac Present", desc: "Wonderful gift for Pisces birthdays.", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Pisces/Meen zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can it be gifted?", a: "Yes." },
      { q: "Can natural stones vary?", a: "Yes." },
      { q: "How should it be maintained?", a: "Keep it clean and dry." }
    ]
  },
  "vv_p24": {
    description: "Natural Karungali Ebony Wood Mala features 108 traditionally arranged beads made from Karungali/Ebony wood. It is commonly used for meditation, chanting, prayer, and spiritual practices.",
    specs: [
      { label: "Material", value: "100% Natural Karungali (Ebony Wood)" },
      { label: "Bead Count", value: "108 Sacred Beads + 1 Guru Bead" },
      { label: "Type", value: "Jaap & Prayer Mala" },
      { label: "Finish", value: "Natural Smooth Wood" },
      { label: "Usage", value: "Mantra Japa, meditation, sacred neck wear" }
    ],
    benefits: [
      { title: "Mantra Chanting", desc: "Traditional 108-bead format designed specifically for Jaap rituals.", icon: "📿" },
      { title: "Ebony Strength", desc: "Karungali wood is revered in South Indian traditions for grounding energy.", icon: "🪵" },
      { title: "Meditation Routine", desc: "Helps maintain count and focus during quiet prayer sessions.", icon: "🧘" },
      { title: "Natural Aesthetic", desc: "Rich dark wooden texture that grows shinier with natural skin contact.", icon: "✨" }
    ],
    faqs: [
      { q: "How many beads does it have?", a: "108 beads + 1 Guru bead." },
      { q: "What is Karungali?", a: "Karungali is the traditional Tamil name for dense Ebony wood." },
      { q: "Can it be used for Jaap?", a: "Yes, it is specially crafted for mantra chanting." },
      { q: "Can it be worn?", a: "Yes, around the neck or wrapped on the wrist." },
      { q: "How should it be maintained?", a: "Keep the wood dry and avoid soaking in water." }
    ]
  },
  "vv_p25": {
    description: "Karungali Rudraksha Silver Cap Mala combines traditional Karungali beads and Rudraksha elements with silver-cap detailing. It offers a distinctive spiritual appearance for prayer, meditation, and devotional use.",
    specs: [
      { label: "Materials", value: "Natural Karungali Wood & 5 Mukhi Rudraksha" },
      { label: "Metal Detail", value: "Pure Silver Capped Joints" },
      { label: "Type", value: "Spiritual Combination Mala" },
      { label: "Usage", value: "Prayer, meditation, sacred wear" },
      { label: "Design", value: "Traditional Silver Wired Craftsmanship" }
    ],
    benefits: [
      { title: "Dual Elements", desc: "Combines the sacred energies of Rudraksha and Karungali wood.", icon: "☸️" },
      { title: "Silver Crafting", desc: "Hand-capped with silver for durability and royal elegance.", icon: "🥈" },
      { title: "Devotional Wear", desc: "Distinctive traditional appearance for rituals and everyday wear.", icon: "🧘" },
      { title: "Sacred Gift", desc: "Exquisite spiritual gift for elders and devotees.", icon: "🎁" }
    ],
    faqs: [
      { q: "What materials are used?", a: "Karungali wood, natural Rudraksha, and silver-cap wiring." },
      { q: "Can it be used for Jaap?", a: "Yes." },
      { q: "Can it be worn?", a: "Yes, it is designed for daily sacred neck wear." },
      { q: "How should the silver cap be maintained?", a: "Keep it dry and wipe gently with a silver polish cloth." },
      { q: "Can natural beads vary?", a: "Yes." }
    ]
  },
  "vv_p31": {
    description: "This 108-bead mala features 5 Mukhi Nepali Rudraksha beads and is designed for traditional chanting, meditation, prayer, and spiritual practices.",
    specs: [
      { label: "Rudraksha Type", value: "5 Mukhi Nepali Rudraksha" },
      { label: "Origin", value: "Nepal" },
      { label: "Bead Count", value: "108 Beads + 1 Guru Bead" },
      { label: "Type", value: "Traditional Jaap Mala" },
      { label: "Usage", value: "Mantra chanting, meditation, prayer" }
    ],
    benefits: [
      { title: "Classic Jaap Mala", desc: "Ideal for Shiva mantra chanting and daily prayer routines.", icon: "📿" },
      { title: "Nepali Quality", desc: "Sourced from Nepal with natural deep grooves and high density.", icon: "🏔️" },
      { title: "Mental Calmness", desc: "Traditionally associated with calm thoughts and spiritual discipline.", icon: "🕊️" },
      { title: "108 Count", desc: "Traditional 108-bead arrangement with tassel.", icon: "✨" }
    ],
    faqs: [
      { q: "How many beads are included?", a: "108 beads + 1 Guru bead." },
      { q: "What Mukhi is used?", a: "5 Mukhi Nepali Rudraksha." },
      { q: "Is it suitable for Jaap?", a: "Yes, it is the classic choice for Jaap." },
      { q: "Can beginners use it?", a: "Yes." },
      { q: "How should it be stored?", a: "Keep it clean, dry, and stored in a sacred pouch." }
    ]
  },
  "vv_p35": {
    description: "Original Rudraksha Jaap Mala features 108 Rudraksha beads designed for mantra chanting, prayer, meditation, and devotional practices. Its traditional design makes it suitable for regular spiritual routines.",
    specs: [
      { label: "Material", value: "Natural Rudraksha Beads" },
      { label: "Bead Count", value: "108 Beads" },
      { label: "Type", value: "Sacred Jaap Mala" },
      { label: "Usage", value: "Daily Jaap, prayer, meditation" },
      { label: "Design", value: "Traditional Knotted Thread" }
    ],
    benefits: [
      { title: "Daily Chanting", desc: "Essential companion for daily mantra counts and japa practice.", icon: "📿" },
      { title: "Meditation Anchor", desc: "Provides tactile rhythm during breathwork and silent reflection.", icon: "🧘" },
      { title: "Devotional Tradition", desc: "Traditional format passed down through Vedic lineage.", icon: "🌺" },
      { title: "Spiritual Gift", desc: "Heartfelt gift for anyone starting their spiritual journey.", icon: "🎁" }
    ],
    faqs: [
      { q: "How many beads does the mala have?", a: "108." },
      { q: "Can it be used for Jaap?", a: "Yes." },
      { q: "Can I use it daily?", a: "Yes." },
      { q: "Is it suitable for meditation?", a: "Yes." },
      { q: "How should I care for it?", a: "Keep it dry and clean." }
    ]
  },
  "vv_p36": {
    description: "Silver Cap Karungali Mala features natural Karungali/Ebony wood beads complemented by silver-cap detailing. It combines traditional aesthetics with an elegant finish for spiritual and devotional use.",
    specs: [
      { label: "Material", value: "Natural Karungali (Ebony Wood)" },
      { label: "Metal Detail", value: "Pure Silver Cap Joints" },
      { label: "Type", value: "Silver Capped Wood Mala" },
      { label: "Usage", value: "Prayer, meditation, sacred neck wear" },
      { label: "Finish", value: "Polished Silver & Dark Wood" }
    ],
    benefits: [
      { title: "Royal Aesthetics", desc: "Silver caps enhance durability while providing a regal look.", icon: "👑" },
      { title: "Grounding Energy", desc: "Karungali wood is traditionally valued for grounding aura.", icon: "🪵" },
      { title: "Sacred Ceremonies", desc: "Suitable for temple visits, puja ceremonies, and special occasions.", icon: "🪔" },
      { title: "High Craftsmanship", desc: "Artisanal hand-wired silver capping on every bead.", icon: "✨" }
    ],
    faqs: [
      { q: "What is the mala made from?", a: "Karungali/Ebony wood with silver-cap detailing." },
      { q: "Can it be used for Jaap?", a: "Yes." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "How should the wood be protected?", a: "Avoid prolonged exposure to water." },
      { q: "Will every bead look identical?", a: "Natural wood can show subtle organic grain variations." }
    ]
  },
  "vv_p38": {
    description: "Natural Sphatik Mala is made with clear quartz crystal beads and is traditionally valued for meditation, prayer, spiritual practices, and its naturally transparent appearance.",
    specs: [
      { label: "Material", value: "100% Natural Sphatik (Clear Quartz Crystal)" },
      { label: "Appearance", value: "Transparent / Clear Crystal Beads" },
      { label: "Type", value: "Quartz Crystal Mala" },
      { label: "Usage", value: "Meditation, prayer, Jaap" },
      { label: "Design", value: "Traditional Diamond-Cut / Round Beads" }
    ],
    benefits: [
      { title: "Cooling Energy", desc: "Traditionally associated with cooling body heat and calming emotions.", icon: "❄️" },
      { title: "Clear Quartz Luster", desc: "Beautiful transparent crystal beads reflecting natural light.", icon: "💎" },
      { title: "Meditation Clarity", desc: "Enhances mental clarity during prayer and mantra recitation.", icon: "🧘" },
      { title: "Goddess Saraswati", desc: "Revered in rituals dedicated to Goddess Saraswati and Lord Shiva.", icon: "🌸" }
    ],
    faqs: [
      { q: "What is Sphatik?", a: "Sphatik is the traditional Indian name for clear quartz crystal." },
      { q: "Can it be used for Jaap?", a: "Yes, especially for Saraswati and Lakshmi japa." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "Can quartz have natural variations?", a: "Yes, genuine quartz has natural internal inclusions." },
      { q: "How should I clean it?", a: "Gently wipe with a soft cloth." }
    ]
  },
  "vv_p41": {
    description: "Tulsi Jaap Mala is traditionally made from Tulsi wood beads and is commonly used for chanting, prayer, meditation, and devotional practices. Its natural wooden appearance gives it a simple and traditional character.",
    specs: [
      { label: "Material", value: "Natural Holy Tulsi Wood" },
      { label: "Type", value: "Sacred Tulsi Jaap Mala" },
      { label: "Usage", value: "Prayer, Vishnu/Krishna Jaap, meditation" },
      { label: "Finish", value: "Natural Smooth Wood" },
      { label: "Design", value: "Traditional Knotted Thread" }
    ],
    benefits: [
      { title: "Devotional Sacredness", desc: "Revered as one of the most sacred woods in Vaishnava traditions.", icon: "🌿" },
      { title: "Mantra Chanting", desc: "Ideal for Hare Krishna and Vishnu mantra japa.", icon: "📿" },
      { title: "Lightweight & Soft", desc: "Lightweight wood that is soft to touch during long chanting sessions.", icon: "🕊️" },
      { title: "Purity & Peace", desc: "Traditionally associated with spiritual purity and peace.", icon: "✨" }
    ],
    faqs: [
      { q: "What is Tulsi Mala used for?", a: "Traditionally for prayer, chanting (especially Vishnu/Krishna), and devotional practices." },
      { q: "Can it be used for Jaap?", a: "Yes." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "Can the beads vary?", a: "Natural Tulsi beads vary in shape and wood texture." },
      { q: "How should it be stored?", a: "Keep it dry and protected from moisture." }
    ]
  },
  "vv_p42": {
    description: "Natural Tulsi Bead Mala contains 108 traditionally arranged Tulsi beads and is designed for mantra chanting, prayer, meditation, and devotional practices.",
    specs: [
      { label: "Material", value: "100% Natural Tulsi Wood" },
      { label: "Bead Count", value: "108 Beads" },
      { label: "Type", value: "Sacred 108 Tulsi Mala" },
      { label: "Usage", value: "Jaap, meditation, prayer" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "108 Count Format", desc: "Full 108-bead length for complete mantra rounds.", icon: "📿" },
      { title: "Vaishnava Tradition", desc: "Deeply connected with Lord Vishnu and Krishna devotion.", icon: "🪷" },
      { title: "Daily Prayer", desc: "Easy to handle for morning and evening prayer routines.", icon: "🌅" },
      { title: "Sacred Aroma", desc: "Carries the natural subtle wooden aroma of holy Tulsi.", icon: "✨" }
    ],
    faqs: [
      { q: "How many beads are there?", a: "108." },
      { q: "What material is used?", a: "Holy Tulsi wood beads." },
      { q: "Can it be used for mantra chanting?", a: "Yes." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "How should it be maintained?", a: "Keep it dry and avoid soaking in water." }
    ]
  },
  "vv_p12": {
    description: "7 Chakra Crystal Gemstone Tree is a decorative spiritual piece featuring colourful gemstone elements representing the seven chakras. It can be placed in homes, offices, meditation spaces, or gifted on special occasions.",
    specs: [
      { label: "Type", value: "Vastu Gemstone Tree" },
      { label: "Theme", value: "7 Chakra Balance" },
      { label: "Material", value: "Natural Gemstone Chips (Amethyst, Jasper, Lapis, etc.)" },
      { label: "Wire Base", value: "Golden / Copper Flexible Craft Wire" },
      { label: "Usage", value: "Home décor, office desk, meditation space, gifting" }
    ],
    benefits: [
      { title: "Vastu & Harmony", desc: "Traditionally placed to enhance positive energy flow in living spaces.", icon: "🏡" },
      { title: "Chakra Symbolism", desc: "Multi-colored gemstone branches representing the 7 chakras.", icon: "🌈" },
      { title: "Decorative Elegance", desc: "Eye-catching centerpiece for living rooms and office desks.", icon: "✨" },
      { title: "Auspicious Gift", desc: "Popular housewarming, Diwali, and corporate gift.", icon: "🎁" }
    ],
    faqs: [
      { q: "What does the tree represent?", a: "The seven chakras in traditional spiritual practices." },
      { q: "Where can it be placed?", a: "Home living room, office desk, meditation area, or study table." },
      { q: "Can it be gifted?", a: "Yes, it makes a wonderful festive or housewarming gift." },
      { q: "Are the stones natural?", a: "Yes, crafted with natural gemstone chips." },
      { q: "Is it a medical device?", a: "No, it is a decorative spiritual Vastu item." }
    ]
  },
  "vv_p34": {
    description: "Rose Quartz Gemstone Tree is a decorative piece featuring pink-toned Rose Quartz elements arranged in a tree-inspired design. Traditionally associated with love, harmony, and compassion, it makes an elegant addition to homes, offices, and meditation spaces.",
    specs: [
      { label: "Stone", value: "Natural Rose Quartz Crystal Chips" },
      { label: "Color", value: "Pastel Pink" },
      { label: "Type", value: "Decorative Crystal Tree" },
      { label: "Base / Wire", value: "Natural Wooden / Stone Base & Golden Wire" },
      { label: "Usage", value: "Home décor, bedroom, meditation space, gifting" }
    ],
    benefits: [
      { title: "Love & Harmony", desc: "Traditionally placed in bedrooms to foster peaceful and loving relationships.", icon: "🌸" },
      { title: "Gentle Aura", desc: "Soft pink tones create a serene and soothing visual presence.", icon: "💖" },
      { title: "Meditation Space", desc: "Ideal decor piece for yoga studios and quiet reflection corners.", icon: "🧘" },
      { title: "Festive Gift", desc: "Beautiful gift for weddings, anniversaries, and housewarmings.", icon: "🎁" }
    ],
    faqs: [
      { q: "What gemstone is used?", a: "Natural Rose Quartz crystal chips." },
      { q: "What does Rose Quartz traditionally symbolize?", a: "Love, harmony, compassion, and emotional peace." },
      { q: "Where can the tree be placed?", a: "Home, bedroom, office desk, study, or meditation space." },
      { q: "Can it be gifted?", a: "Yes." },
      { q: "Will every tree look identical?", a: "Handcrafted natural crystal trees show unique branch arrangements." }
    ]
  },
  "vv_p21": {
    description: "Gold Capped Rudraksha Bracelet features authentic Rudraksha beads encased in elegant gold-capped frames. It offers a majestic spiritual appearance suitable for daily wear, prayer, and special occasions.",
    specs: [
      { label: "Material", value: "Natural Rudraksha Beads" },
      { label: "Metal Detail", value: "Premium Gold Capped Frame" },
      { label: "Type", value: "Sacred Rudraksha Bracelet" },
      { label: "Usage", value: "Daily wear, prayer, gifting" },
      { label: "Certification", value: "Govt. Lab Certified" }
    ],
    benefits: [
      { title: "Regal Design", desc: "Gold capped detailing offers a luxurious royal appearance.", icon: "👑" },
      { title: "Spiritual Resonance", desc: "Combines divine Rudraksha energy with gold aesthetic.", icon: "✨" },
      { title: "Comfortable Fit", desc: "Durable wiring for daily wrist wear.", icon: "👌" },
      { title: "Divine Gift", desc: "Memorable gift for spiritual occasions.", icon: "🎁" }
    ],
    faqs: [
      { q: "Is the Rudraksha original?", a: "Yes, 100% natural and lab certified." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "How to clean gold caps?", a: "Wipe with a soft dry cloth." },
      { q: "Can it be gifted?", a: "Yes." }
    ]
  }
};

// Also map slugs as keys
global.window = {};
require('../frontend/public/js/data.js');
const products = global.window.VED_VIGYAN_DATA?.products || [];

products.forEach(p => {
  if (tabsData[p.id] && p.slug) {
    tabsData[p.slug] = tabsData[p.id];
  }
});

const fileContent = `// Auto-generated Product Tabbed Content Dataset (Description, Specification, Benefits, FAQs)
window.VED_VIGYAN_PRODUCT_TABS = ${JSON.stringify(tabsData, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'public', 'js', 'pdp-tabs-data.js'), fileContent, 'utf8');
console.log('Successfully generated pdp-tabs-data.js!');
