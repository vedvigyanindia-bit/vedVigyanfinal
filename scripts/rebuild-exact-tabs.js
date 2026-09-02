const fs = require('fs');
const path = require('path');

const tabsData = {
  "vv_p01": {
    description: "10 Mukhi Rudraksha, also known as Dasha Mukhi, is traditionally associated with Lord Vishnu and is valued for spiritual protection, stability, and inner balance. Its natural texture and distinct mukhi lines make it a meaningful choice for spiritual practices and everyday wear.",
    specs: [
      { label: "Type", value: "10 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Lord Vishnu" },
      { label: "Origin", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, spiritual practices, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Spiritual Protection", desc: "Traditionally believed to provide spiritual protection", icon: "🛡️" },
      { title: "Inner Balance", desc: "Supports a sense of inner balance and stability", icon: "🧘" },
      { title: "Meditation & Prayer", desc: "Commonly used during meditation and prayer", icon: "✨" },
      { title: "Positive Energy", desc: "Considered helpful for maintaining positive spiritual energy", icon: "⚡" },
      { title: "Spiritual Routine", desc: "Suitable for regular spiritual practices", icon: "🌟" }
    ],
    faqs: [
      { q: "Is 10 Mukhi Rudraksha suitable for daily wear?", a: "Yes, it can be worn regularly as part of spiritual practice." },
      { q: "Who can wear it?", a: "It is traditionally worn by people seeking spiritual protection and balance." },
      { q: "Can it be used for meditation?", a: "Yes." },
      { q: "How should it be cared for?", a: "Keep it clean and away from harsh chemicals." },
      { q: "Is it natural?", a: "Choose a naturally sourced Rudraksha and verify authenticity before purchase." }
    ]
  },
  "vv_p02": {
    description: "11 Mukhi Rudraksha, or Ekadasha Mukhi, is traditionally associated with Lord Hanuman and is valued for courage, confidence, and spiritual strength. It is commonly used for meditation, prayer, and personal spiritual practices.",
    specs: [
      { label: "Type", value: "11 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Lord Hanuman" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Courage & Confidence", desc: "Traditionally associated with courage and confidence", icon: "🦁" },
      { title: "Spiritual Discipline", desc: "Supports spiritual discipline", icon: "🧘" },
      { title: "Meditation Support", desc: "Commonly used during meditation", icon: "✨" },
      { title: "Mental Strength", desc: "Believed to encourage mental strength", icon: "⚡" },
      { title: "Devotional Practices", desc: "Suitable for spiritual and devotional practices", icon: "🙏" }
    ],
    faqs: [
      { q: "What is 11 Mukhi Rudraksha associated with?", a: "Traditionally, it is associated with Lord Hanuman." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Can it be used for meditation?", a: "Yes." },
      { q: "How do I maintain it?", a: "Keep it dry and clean." },
      { q: "Can beginners wear it?", a: "It is commonly worn by both beginners and experienced practitioners." }
    ]
  },
  "vv_p03": {
    description: "12 Mukhi Rudraksha, known as Dwadasha Mukhi, is traditionally associated with Surya, the Sun God. It is valued in spiritual traditions for qualities such as confidence, vitality, leadership, and positive energy.",
    specs: [
      { label: "Type", value: "12 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Surya" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Spiritual practice, meditation, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Confidence", desc: "Traditionally associated with confidence", icon: "☀️" },
      { title: "Positive Mindset", desc: "Supports a positive spiritual mindset", icon: "🧠" },
      { title: "Meditation Use", desc: "Commonly used for meditation", icon: "🧘" },
      { title: "Vitality & Strength", desc: "Associated with vitality and inner strength", icon: "⚡" },
      { title: "Devotional Use", desc: "Suitable for devotional practices", icon: "✨" }
    ],
    faqs: [
      { q: "What does 12 Mukhi represent?", a: "It is traditionally associated with Surya." },
      { q: "Can it be worn every day?", a: "Yes." },
      { q: "Is it suitable for meditation?", a: "Yes." },
      { q: "How should it be stored?", a: "Store it in a clean, dry place." },
      { q: "How can I protect its natural surface?", a: "Avoid perfumes, chemicals, and prolonged moisture." }
    ]
  },
  "vv_p04": {
    description: "2 Mukhi Rudraksha, or Dwi Mukhi, is traditionally associated with unity, harmony, and emotional balance. It is often chosen for spiritual practices focused on relationships, inner peace, and balance.",
    specs: [
      { label: "Type", value: "2 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Ardhanarishvara" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Harmony", desc: "Traditionally associated with harmony", icon: "🤝" },
      { title: "Emotional Balance", desc: "Supports a sense of emotional balance", icon: "💖" },
      { title: "Meditation Aid", desc: "Commonly used in meditation", icon: "🧘" },
      { title: "Unity & Togetherness", desc: "Associated with unity and togetherness", icon: "☯️" },
      { title: "Spiritual Practices", desc: "Suitable for spiritual practices", icon: "✨" }
    ],
    faqs: [
      { q: "What is 2 Mukhi Rudraksha traditionally associated with?", a: "Unity and harmony." },
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
      { label: "Traditional Association", value: "Agni" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Transformation", desc: "Traditionally associated with transformation", icon: "🔥" },
      { title: "Focused Mindset", desc: "Supports a positive and focused mindset", icon: "🧠" },
      { title: "Spiritual Meditation", desc: "Used in meditation and spiritual practices", icon: "🧘" },
      { title: "Inner Strength", desc: "Associated with confidence and inner strength", icon: "💪" },
      { title: "Spiritual Discipline", desc: "Encourages spiritual discipline", icon: "✨" }
    ],
    faqs: [
      { q: "What does 3 Mukhi represent?", a: "It is traditionally associated with Agni." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can it be used during meditation?", a: "Yes." },
      { q: "How should I clean it?", a: "Gently wipe it with a soft cloth." },
      { q: "Should I expose it to chemicals?", a: "Avoid harsh chemicals." }
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
      { title: "Knowledge", desc: "Traditionally associated with knowledge", icon: "📚" },
      { title: "Concentration", desc: "Supports concentration and focus", icon: "🎓" },
      { title: "Meditation Aid", desc: "Commonly used during meditation", icon: "🧘" },
      { title: "Creativity & Learning", desc: "Associated with creativity and learning", icon: "💡" },
      { title: "For Students & Pros", desc: "Suitable for students and professionals", icon: "✍️" }
    ],
    faqs: [
      { q: "Who is 4 Mukhi Rudraksha associated with?", a: "Lord Brahma." },
      { q: "Is it suitable for students?", a: "Traditionally, it is commonly chosen by students." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can it be used during study or meditation?", a: "Yes." },
      { q: "How should it be maintained?", a: "Keep it clean and dry." }
    ]
  },
  "vv_p07": {
    description: "Gauri Shankar Rudraksha is a naturally joined Rudraksha formation traditionally associated with Lord Shiva and Goddess Parvati. It symbolizes unity, harmony, and spiritual connection and is highly valued for devotional practices.",
    specs: [
      { label: "Type", value: "Gauri Shankar Rudraksha" },
      { label: "Formation", value: "Naturally joined Rudraksha" },
      { label: "Traditional Association", value: "Shiva-Parvati" },
      { label: "Usage", value: "Meditation, prayer, spiritual practices" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Harmony", desc: "Traditionally associated with harmony", icon: "🌺" },
      { title: "Spiritual Unity", desc: "Symbolizes unity and spiritual connection", icon: "☯️" },
      { title: "Meditation Focus", desc: "Commonly used in meditation", icon: "🧘" },
      { title: "Devotional Practices", desc: "Considered meaningful for devotional practices", icon: "🙏" },
      { title: "For Collectors", desc: "Suitable for spiritual collectors", icon: "💎" }
    ],
    faqs: [
      { q: "What makes Gauri Shankar special?", a: "Its two naturally joined Rudraksha beads." },
      { q: "Is it suitable for meditation?", a: "Yes." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "How should it be stored?", a: "In a clean, dry place." },
      { q: "Should the bead be polished?", a: "Avoid excessive polishing that alters its natural appearance." }
    ]
  },
  "vv_p08": {
    description: "5 Mukhi Nepali Rudraksha is one of the most commonly used Rudraksha varieties. Traditionally associated with Lord Shiva, it is valued for meditation, spiritual discipline, calmness, and everyday devotional practices.",
    specs: [
      { label: "Type", value: "5 Mukhi" },
      { label: "Origin", value: "Nepal" },
      { label: "Traditional Association", value: "Lord Shiva" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Daily wear, meditation, prayer" }
    ],
    benefits: [
      { title: "Calmness", desc: "Traditionally associated with calmness", icon: "🕊️" },
      { title: "Meditation & Prayer", desc: "Suitable for meditation and prayer", icon: "🧘" },
      { title: "Spiritual Discipline", desc: "Commonly used for spiritual discipline", icon: "✨" },
      { title: "Daily Wear", desc: "Easy to incorporate into daily routines", icon: "🌟" },
      { title: "Popular Choice", desc: "Popular choice for regular Rudraksha wear", icon: "📿" }
    ],
    faqs: [
      { q: "What is Nepali Rudraksha?", a: "Rudraksha traditionally sourced from Nepal." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is 5 Mukhi popular?", a: "It is one of the most commonly used varieties." },
      { q: "Can beginners wear it?", a: "Yes." },
      { q: "How should it be maintained?", a: "Keep it clean and dry." }
    ]
  },
  "vv_p09": {
    description: "Panchmukhi Rudraksha has five natural mukhi lines and is traditionally associated with Lord Shiva. It is widely used for meditation, prayer, chanting, and everyday spiritual practices.",
    specs: [
      { label: "Type", value: "5 Mukhi Rudraksha" },
      { label: "Traditional Association", value: "Lord Shiva" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, chanting, daily wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Calmness & Balance", desc: "Traditionally associated with calmness and balance", icon: "🧘" },
      { title: "Meditation Support", desc: "Supports meditation practices", icon: "🕊️" },
      { title: "Chanting Companion", desc: "Commonly used for chanting", icon: "📿" },
      { title: "Everyday Routine", desc: "Suitable for everyday spiritual routines", icon: "✨" },
      { title: "For Beginners & Regulars", desc: "Popular among beginners and regular practitioners", icon: "🌟" }
    ],
    faqs: [
      { q: "What is Panchmukhi Rudraksha?", a: "A Rudraksha with five natural mukhi lines." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can it be used for chanting?", a: "Yes." },
      { q: "Is it suitable for beginners?", a: "Yes." },
      { q: "How should it be cleaned?", a: "Use a soft cloth and avoid harsh chemicals." }
    ]
  },
  "vv_p10": {
    description: "6 Mukhi Rudraksha, or Shad Mukhi, is traditionally associated with Lord Kartikeya. It is valued in spiritual traditions for focus, discipline, confidence, and inner balance.",
    specs: [
      { label: "Type", value: "6 Mukhi" },
      { label: "Traditional Association", value: "Lord Kartikeya" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Focus", desc: "Traditionally associated with focus", icon: "🎯" },
      { title: "Spiritual Discipline", desc: "Supports spiritual discipline", icon: "🧘" },
      { title: "Confidence & Determination", desc: "Associated with confidence and determination", icon: "🦁" },
      { title: "Meditation Aid", desc: "Commonly used during meditation", icon: "✨" },
      { title: "Daily Spiritual Wear", desc: "Suitable for everyday spiritual practices", icon: "🌟" }
    ],
    faqs: [
      { q: "Who is 6 Mukhi associated with?", a: "Lord Kartikeya." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can students use it?", a: "It is traditionally associated with focus and discipline." },
      { q: "Can it be used during meditation?", a: "Yes." },
      { q: "How should it be stored?", a: "Keep it away from moisture and chemicals." }
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
      { title: "Prosperity", desc: "Traditionally associated with prosperity", icon: "💰" },
      { title: "Abundance & Stability", desc: "Symbolizes abundance and stability", icon: "⚖️" },
      { title: "Spiritual Practices", desc: "Commonly used in spiritual practices", icon: "✨" },
      { title: "Meditation & Prayer", desc: "Suitable for meditation and prayer", icon: "🧘" },
      { title: "Traditional Choice", desc: "Popular among those following traditional Rudraksha practices", icon: "🌟" }
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
      { label: "Type", value: "8 Mukhi" },
      { label: "Traditional Association", value: "Lord Ganesha" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Meditation, prayer, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Ganesha Blessings", desc: "Traditionally associated with Lord Ganesha", icon: "🐘" },
      { title: "New Beginnings", desc: "Symbolizes new beginnings", icon: "🌅" },
      { title: "Wisdom & Clarity", desc: "Associated with wisdom and clarity", icon: "💡" },
      { title: "Spiritual Use", desc: "Commonly used for spiritual practices", icon: "✨" },
      { title: "Meditation & Prayer", desc: "Suitable for meditation and prayer", icon: "🧘" }
    ],
    faqs: [
      { q: "What is 8 Mukhi associated with?", a: "Lord Ganesha." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it suitable for new beginnings?", a: "It is traditionally associated with new beginnings." },
      { q: "Can it be used for meditation?", a: "Yes." },
      { q: "How should it be cared for?", a: "Keep it away from chemicals and excessive moisture." }
    ]
  },
  "vv_p15": {
    description: "9 Mukhi Rudraksha is traditionally associated with Goddess Durga and is valued for courage, strength, determination, and spiritual confidence.",
    specs: [
      { label: "Type", value: "9 Mukhi" },
      { label: "Traditional Association", value: "Goddess Durga" },
      { label: "Material", value: "Natural Rudraksha" },
      { label: "Usage", value: "Prayer, meditation, personal wear" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Courage", desc: "Traditionally associated with courage", icon: "⚔️" },
      { title: "Inner Strength", desc: "Symbolizes inner strength", icon: "💪" },
      { title: "Spiritual Discipline", desc: "Supports spiritual discipline", icon: "🧘" },
      { title: "Meditation Support", desc: "Commonly used during meditation", icon: "✨" },
      { title: "Determination", desc: "Associated with determination and confidence", icon: "🦁" }
    ],
    faqs: [
      { q: "Who is 9 Mukhi associated with?", a: "Goddess Durga." },
      { q: "Can it be worn every day?", a: "Yes." },
      { q: "Is it suitable for meditation?", a: "Yes." },
      { q: "What does it symbolize?", a: "Traditionally, courage and strength." },
      { q: "How should it be maintained?", a: "Keep it clean and dry." }
    ]
  },
  "vv_p19": {
    description: "Ganesh Rudraksha is a naturally formed Rudraksha featuring a trunk-like protrusion that resembles Lord Ganesha. It is traditionally valued as a symbol of wisdom, auspicious beginnings, and spiritual growth.",
    specs: [
      { label: "Type", value: "Ganesh Rudraksha" },
      { label: "Formation", value: "Natural Ganesha-like protrusion" },
      { label: "Traditional Association", value: "Lord Ganesha" },
      { label: "Usage", value: "Prayer, meditation, collection" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Auspicious Beginnings", desc: "Symbolizes auspicious beginnings", icon: "🐘" },
      { title: "Wisdom", desc: "Traditionally associated with wisdom", icon: "💡" },
      { title: "Devotional Practices", desc: "Commonly used in devotional practices", icon: "🙏" },
      { title: "Meditation & Collection", desc: "Suitable for meditation and spiritual collections", icon: "🧘" },
      { title: "New Ventures", desc: "Considered meaningful for new ventures", icon: "🌅" }
    ],
    faqs: [
      { q: "What is Ganesh Rudraksha?", a: "A Rudraksha with a naturally occurring trunk-like formation." },
      { q: "Is the shape natural?", a: "Authentic specimens have natural formations." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "Can it be used for prayer?", a: "Yes." },
      { q: "How should it be preserved?", a: "Keep it dry and protected from chemicals." }
    ]
  },
  "vv_p11": {
    description: "The 7 Chakra Crystal Bracelet features a combination of colourful gemstone beads traditionally associated with the seven chakras. It is designed as a spiritual accessory for meditation, mindfulness, and everyday wear.",
    specs: [
      { label: "Type", value: "Crystal/Gemstone Bracelet" },
      { label: "Chakra Coverage", value: "7 Chakra" },
      { label: "Bead Type", value: "Natural/Crystal gemstone beads" },
      { label: "Usage", value: "Meditation, mindfulness, daily wear" },
      { label: "Design", value: "Stretch bracelet" }
    ],
    benefits: [
      { title: "Chakra Balancing", desc: "Traditionally associated with chakra balancing", icon: "🌈" },
      { title: "Mindfulness Routine", desc: "Supports meditation and mindfulness routines", icon: "🧘" },
      { title: "Everyday Accessory", desc: "Attractive everyday spiritual accessory", icon: "✨" },
      { title: "7 Chakra Representation", desc: "Seven-colour design represents the seven chakras", icon: "💎" },
      { title: "Gifting Choice", desc: "Suitable for gifting", icon: "🎁" }
    ],
    faqs: [
      { q: "What are the seven chakras?", a: "Traditional energy centres used in several Indian spiritual practices." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Is it adjustable?", a: "Stretch designs generally accommodate different wrist sizes." },
      { q: "Can it be used during meditation?", a: "Yes." },
      { q: "Is it a medical product?", a: "No." }
    ]
  },
  "vv_p16": {
    description: "Natural Amethyst Bracelet features beautiful purple-toned crystal beads and is traditionally associated with calmness, meditation, and spiritual awareness. Its elegant appearance also makes it suitable for everyday styling.",
    specs: [
      { label: "Stone", value: "Amethyst" },
      { label: "Type", value: "Crystal Bracelet" },
      { label: "Colour", value: "Purple" },
      { label: "Usage", value: "Meditation, mindfulness, daily wear" },
      { label: "Design", value: "Beaded stretch bracelet" }
    ],
    benefits: [
      { title: "Calmness", desc: "Traditionally associated with calmness", icon: "💜" },
      { title: "Meditation Practice", desc: "Suitable for meditation practices", icon: "🧘" },
      { title: "Elegant Accessory", desc: "Elegant everyday accessory", icon: "✨" },
      { title: "Crystal Enthusiasts", desc: "Popular among crystal enthusiasts", icon: "💎" },
      { title: "Spiritual Gift", desc: "Makes a thoughtful spiritual gift", icon: "🎁" }
    ],
    faqs: [
      { q: "Is the bracelet made with Amethyst?", a: "Yes, it is designed with Amethyst beads." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Can Amethyst colour vary?", a: "Natural stones can show variations." },
      { q: "Can it be used for meditation?", a: "Yes." },
      { q: "How should I clean it?", a: "Wipe gently with a soft cloth." }
    ]
  },
  "vv_p18": {
    description: "The Evil Eye Protection Pendant is inspired by the traditional evil-eye symbol, widely used across cultures as a protective talisman. Its stylish design allows it to be worn as both a spiritual accessory and everyday jewellery.",
    specs: [
      { label: "Type", value: "Pendant" },
      { label: "Design", value: "Evil Eye" },
      { label: "Usage", value: "Daily wear, gifting" },
      { label: "Style", value: "Spiritual/Fashion accessory" },
      { label: "Finish", value: "As per selected variant" }
    ],
    benefits: [
      { title: "Protective Symbol", desc: "Traditionally regarded as a protective symbol", icon: "👁️" },
      { title: "Stylish Accessory", desc: "Stylish everyday accessory", icon: "✨" },
      { title: "Easy Pairing", desc: "Easy to pair with different outfits", icon: "👌" },
      { title: "Suitable for Gifting", desc: "Suitable for gifting", icon: "🎁" },
      { title: "Positivity & Protection", desc: "Represents positivity and protection", icon: "🛡️" }
    ],
    faqs: [
      { q: "What does the Evil Eye symbolize?", a: "Traditionally, protection against negative influence." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Is it suitable as a gift?", a: "Yes." },
      { q: "Can men and women wear it?", a: "Yes." },
      { q: "How should it be stored?", a: "Keep it in a dry jewellery box when not in use." }
    ]
  },
  "vv_p20": {
    description: "The Money Magnet Bracelet combines Pyrite and Citrine-inspired gemstone elements in a stylish design traditionally associated with abundance, confidence, and prosperity symbolism.",
    specs: [
      { label: "Stones", value: "Pyrite & Citrine" },
      { label: "Type", value: "Gemstone Bracelet" },
      { label: "Usage", value: "Daily wear, meditation" },
      { label: "Design", value: "Beaded bracelet" },
      { label: "Finish", value: "Natural stone appearance" }
    ],
    benefits: [
      { title: "Abundance", desc: "Traditionally associated with abundance", icon: "💰" },
      { title: "Prosperity & Confidence", desc: "Symbolizes prosperity and confidence", icon: "🦁" },
      { title: "Stylish Accessory", desc: "Stylish everyday accessory", icon: "✨" },
      { title: "Professional Gifting", desc: "Suitable for business and professional gifting", icon: "💼" },
      { title: "Crystal Enthusiasts", desc: "Popular among crystal enthusiasts", icon: "💎" }
    ],
    faqs: [
      { q: "What stones are used?", a: "Pyrite and Citrine." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it a guaranteed money magnet?", a: "No gemstone can guarantee financial results." },
      { q: "Can business owners wear it?", a: "Yes, as a symbolic accessory." },
      { q: "How should it be cleaned?", a: "Use a soft, dry cloth." }
    ]
  },
  "vv_p32": {
    description: "Natural Pyrite Wealth Bracelet features Pyrite beads with a distinctive metallic appearance. Pyrite is traditionally associated with abundance, confidence, determination, and prosperity symbolism.",
    specs: [
      { label: "Stone", value: "Natural Pyrite" },
      { label: "Type", value: "Gemstone Bracelet" },
      { label: "Colour", value: "Metallic golden" },
      { label: "Usage", value: "Daily wear, meditation" },
      { label: "Design", value: "Beaded bracelet" }
    ],
    benefits: [
      { title: "Prosperity", desc: "Traditionally associated with prosperity", icon: "🪙" },
      { title: "Confidence & Determination", desc: "Symbolizes confidence and determination", icon: "💪" },
      { title: "Metallic Look", desc: "Attractive metallic appearance", icon: "✨" },
      { title: "Professional Wear", desc: "Suitable for professional wear", icon: "💼" },
      { title: "Popular Gifting", desc: "Popular choice for gifting", icon: "🎁" }
    ],
    faqs: [
      { q: "What is Pyrite?", a: "A naturally occurring mineral known for its metallic golden appearance." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Does Pyrite guarantee wealth?", a: "No." },
      { q: "Can its appearance vary?", a: "Natural stones may vary in colour and texture." },
      { q: "How should I care for it?", a: "Keep it dry and avoid harsh chemicals." }
    ]
  },
  "vv_p33": {
    description: "Rose Quartz Bracelet features soft pink crystal beads traditionally associated with love, harmony, compassion, and emotional positivity. Its subtle colour makes it suitable for everyday wear.",
    specs: [
      { label: "Stone", value: "Rose Quartz" },
      { label: "Colour", value: "Pink" },
      { label: "Type", value: "Crystal Bracelet" },
      { label: "Usage", value: "Daily wear, meditation, gifting" },
      { label: "Design", value: "Beaded bracelet" }
    ],
    benefits: [
      { title: "Love & Harmony", desc: "Traditionally associated with love and harmony", icon: "🌸" },
      { title: "Mindfulness", desc: "Suitable for meditation and mindfulness", icon: "🧘" },
      { title: "Elegant Everyday", desc: "Elegant everyday accessory", icon: "✨" },
      { title: "Popular Gift", desc: "Popular gifting choice", icon: "🎁" },
      { title: "Natural Pink Look", desc: "Beautiful natural pink appearance", icon: "💖" }
    ],
    faqs: [
      { q: "What is Rose Quartz associated with?", a: "Traditionally, love, harmony, and compassion." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is every bead identical?", a: "Natural crystals can vary." },
      { q: "Can I gift it?", a: "Yes." },
      { q: "How should I clean it?", a: "Gently wipe with a soft cloth." }
    ]
  },
  "vv_p39": {
    description: "Natural Tiger Eye Bracelet features distinctive golden-brown bands and chatoyancy. Tiger Eye is traditionally associated with courage, confidence, grounding, and protection symbolism.",
    specs: [
      { label: "Stone", value: "Tiger Eye" },
      { label: "Colour", value: "Golden Brown" },
      { label: "Type", value: "Gemstone Bracelet" },
      { label: "Usage", value: "Daily wear, meditation" },
      { label: "Design", value: "Beaded bracelet" }
    ],
    benefits: [
      { title: "Courage", desc: "Traditionally associated with courage", icon: "🐅" },
      { title: "Confidence & Grounding", desc: "Symbolizes confidence and grounding", icon: "🪵" },
      { title: "Natural Pattern", desc: "Distinctive natural stone appearance", icon: "✨" },
      { title: "Daily Wear", desc: "Suitable for daily wear", icon: "👌" },
      { title: "Spiritual Gift", desc: "Popular spiritual gifting option", icon: "🎁" }
    ],
    faqs: [
      { q: "What is Tiger Eye?", a: "A gemstone known for its golden-brown chatoyant appearance." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Can stone patterns vary?", a: "Yes, natural stones have unique patterns." },
      { q: "Is it suitable for gifting?", a: "Yes." },
      { q: "How do I maintain it?", a: "Avoid harsh chemicals and excessive moisture." }
    ]
  },
  "vv_p29": {
    description: "Mesh Rashi Bracelet is designed for people born under the Aries zodiac sign. It combines traditional zodiac symbolism with a stylish gemstone bracelet design suitable for everyday wear.",
    specs: [
      { label: "Rashi", value: "Mesh / Aries" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Design", value: "Zodiac-inspired" },
      { label: "Usage", value: "Daily wear, gifting" },
      { label: "Material", value: "Gemstone beads" }
    ],
    benefits: [
      { title: "Aries Zodiac", desc: "Represents the Aries zodiac sign", icon: "♈" },
      { title: "Astrology Lovers", desc: "Suitable for astrology enthusiasts", icon: "✨" },
      { title: "Stylish Accessory", desc: "Stylish spiritual accessory", icon: "👌" },
      { title: "Easy Daily Wear", desc: "Easy to wear daily", icon: "🌟" },
      { title: "Gifting Option", desc: "Good gifting option", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear Mesh Rashi Bracelet?", a: "People associated with the Aries/Mesh zodiac sign." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it adjustable?", a: "Stretch bracelet designs generally fit multiple wrist sizes." },
      { q: "Can I gift it?", a: "Yes." },
      { q: "Is it an astrological treatment?", a: "No, it is a traditional/spiritual accessory." }
    ]
  },
  "vv_p43": {
    description: "Vrishabh Rashi Bracelet is inspired by the Taurus zodiac sign and combines traditional astrology symbolism with a stylish gemstone bracelet design.",
    specs: [
      { label: "Rashi", value: "Vrishabh / Taurus" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Taurus Symbolism", desc: "Represents Taurus zodiac symbolism", icon: "♉" },
      { title: "Astrology Lovers", desc: "Suitable for astrology enthusiasts", icon: "✨" },
      { title: "Everyday Accessory", desc: "Stylish everyday accessory", icon: "👌" },
      { title: "Suitable for Gifting", desc: "Suitable for gifting", icon: "🎁" },
      { title: "Spiritual Routine", desc: "Can complement spiritual routines", icon: "🌿" }
    ],
    faqs: [
      { q: "Who is it for?", a: "Taurus/Vrishabh zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it a gemstone bracelet?", a: "Yes." },
      { q: "Can it be gifted?", a: "Yes." },
      { q: "Will every stone look identical?", a: "Natural stones can vary." }
    ]
  },
  "vv_p30": {
    description: "Mithun Rashi Bracelet is designed around Gemini zodiac symbolism. It combines traditional astrological inspiration with attractive gemstone beads for a meaningful everyday accessory.",
    specs: [
      { label: "Rashi", value: "Mithun / Gemini" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Gemini Symbolism", desc: "Represents Gemini zodiac symbolism", icon: "♊" },
      { title: "Astrology Followers", desc: "Suitable for astrology followers", icon: "✨" },
      { title: "Stylish & Versatile", desc: "Stylish and versatile", icon: "👌" },
      { title: "Good for Gifting", desc: "Good option for gifting", icon: "🎁" },
      { title: "Everyday Comfort", desc: "Comfortable for everyday use", icon: "🌟" }
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
      { label: "Rashi", value: "Karka / Cancer" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear, gifting" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Cancer Symbolism", desc: "Represents Cancer zodiac symbolism", icon: "♋" },
      { title: "Astrology Lovers", desc: "Suitable for astrology enthusiasts", icon: "✨" },
      { title: "Spiritual Accessory", desc: "Stylish spiritual accessory", icon: "👌" },
      { title: "Daily Wear", desc: "Suitable for daily wear", icon: "🌟" },
      { title: "Personalised Gift", desc: "Thoughtful personalised gift option", icon: "🎁" }
    ],
    faqs: [
      { q: "Who can wear Karka Bracelet?", a: "Cancer/Karka zodiac enthusiasts." },
      { q: "Can I wear it daily?", a: "Yes." },
      { q: "Is it suitable as a gift?", a: "Yes." },
      { q: "Are the stones natural?", a: "Depends on the selected product specification." },
      { q: "Can colour vary?", a: "Natural gemstones may vary." }
    ]
  },
  "vv_p37": {
    description: "Singh Rashi Bracelet is designed around Leo zodiac symbolism. Its gemstone design makes it a stylish choice for people interested in astrology, spiritual accessories, and personalised gifting.",
    specs: [
      { label: "Rashi", value: "Singh / Leo" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Leo Symbolism", desc: "Represents Leo zodiac symbolism", icon: "♌" },
      { title: "Astrology Lovers", desc: "Suitable for astrology enthusiasts", icon: "✨" },
      { title: "Everyday Style", desc: "Stylish everyday accessory", icon: "🦁" },
      { title: "Personalised Gift", desc: "Good personalised gift", icon: "🎁" },
      { title: "Spiritual Reminder", desc: "Can be used as a spiritual reminder", icon: "🌟" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Leo/Singh zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Is it suitable for gifting?", a: "Yes." },
      { q: "Can the beads vary?", a: "Natural gemstone beads can vary." },
      { q: "How should it be cared for?", a: "Avoid harsh chemicals." }
    ]
  },
  "vv_p22": {
    description: "Kanya Rashi Bracelet is inspired by the Virgo zodiac sign and combines traditional astrological symbolism with a modern gemstone bracelet design.",
    specs: [
      { label: "Rashi", value: "Kanya / Virgo" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Virgo Symbolism", desc: "Represents Virgo zodiac symbolism", icon: "♍" },
      { title: "Astrology Lovers", desc: "Suitable for astrology enthusiasts", icon: "✨" },
      { title: "Elegant Style", desc: "Elegant everyday accessory", icon: "👌" },
      { title: "Suitable for Gifting", desc: "Suitable for gifting", icon: "🎁" },
      { title: "Easy Pairing", desc: "Easy to pair with other accessories", icon: "🌟" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Virgo/Kanya zodiac enthusiasts." },
      { q: "Can it be worn every day?", a: "Yes." },
      { q: "Is it suitable for gifting?", a: "Yes." },
      { q: "Do gemstones vary?", a: "Natural stones may show variations." },
      { q: "How should it be stored?", a: "In a dry place." }
    ]
  },
  "vv_p40": {
    description: "Tula Rashi Bracelet is inspired by the Libra zodiac sign and is designed as a stylish gemstone accessory for astrology enthusiasts.",
    specs: [
      { label: "Rashi", value: "Tula / Libra" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear, gifting" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Libra Symbolism", desc: "Represents Libra zodiac symbolism", icon: "♎" },
      { title: "Stylish & Versatile", desc: "Stylish and versatile", icon: "✨" },
      { title: "Astrology Lovers", desc: "Suitable for astrology enthusiasts", icon: "⚖️" },
      { title: "Personalised Gift", desc: "Good personalised gift", icon: "🎁" },
      { title: "Regular Wear", desc: "Comfortable for regular wear", icon: "🌟" }
    ],
    faqs: [
      { q: "Who can wear it?", a: "Libra/Tula zodiac enthusiasts." },
      { q: "Can it be worn daily?", a: "Yes." },
      { q: "Can it be gifted?", a: "Yes." },
      { q: "Are all beads identical?", a: "Natural stones can differ." },
      { q: "How should I care for it?", a: "Avoid chemicals and prolonged moisture." }
    ]
  },
  "vv_p17": {
    description: "Dhanu Rashi Bracelet is inspired by Sagittarius zodiac symbolism. The gemstone bracelet combines traditional astrology with a modern accessory suitable for daily wear.",
    specs: [
      { label: "Rashi", value: "Dhanu / Sagittarius" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear, gifting" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Sagittarius Symbolism", desc: "Represents Sagittarius zodiac symbolism", icon: "♐" },
      { title: "Astrology Lovers", desc: "Suitable for astrology lovers", icon: "🏹" },
      { title: "Everyday Accessory", desc: "Stylish everyday accessory", icon: "✨" },
      { title: "Personalised Gift", desc: "Personalised gifting option", icon: "🎁" },
      { title: "Easy Combining", desc: "Easy to combine with other jewellery", icon: "🌟" }
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
      { label: "Rashi", value: "Makar / Capricorn" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Capricorn Symbolism", desc: "Represents Capricorn zodiac symbolism", icon: "♑" },
      { title: "Astrology Lovers", desc: "Suitable for astrology enthusiasts", icon: "✨" },
      { title: "Elegant Everyday", desc: "Elegant everyday accessory", icon: "👌" },
      { title: "Gifting Choice", desc: "Good gifting choice", icon: "🎁" },
      { title: "Spiritual Routines", desc: "Suitable for spiritual routines", icon: "🌟" }
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
      { label: "Rashi", value: "Kumbh / Aquarius" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear, gifting" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Aquarius Symbolism", desc: "Represents Aquarius zodiac symbolism", icon: "♒" },
      { title: "Astrology Lovers", desc: "Suitable for astrology enthusiasts", icon: "✨" },
      { title: "Daily Accessory", desc: "Stylish daily accessory", icon: "💡" },
      { title: "Personalised Gift", desc: "Personalised gifting option", icon: "🎁" },
      { title: "Regular Wear", desc: "Comfortable for regular wear", icon: "🌟" }
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
      { label: "Rashi", value: "Meen / Pisces" },
      { label: "Type", value: "Rashi Bracelet" },
      { label: "Material", value: "Gemstone beads" },
      { label: "Usage", value: "Daily wear, gifting" },
      { label: "Design", value: "Zodiac-inspired" }
    ],
    benefits: [
      { title: "Pisces Symbolism", desc: "Represents Pisces zodiac symbolism", icon: "♓" },
      { title: "Astrology Lovers", desc: "Suitable for astrology enthusiasts", icon: "🌊" },
      { title: "Lightweight Accessory", desc: "Stylish and lightweight accessory", icon: "✨" },
      { title: "Personalised Gift", desc: "Good personalised gift", icon: "🎁" },
      { title: "Everyday Wear", desc: "Suitable for everyday wear", icon: "🌟" }
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
      { label: "Material", value: "Karungali/Ebony Wood" },
      { label: "Beads", value: "108" },
      { label: "Type", value: "Mala" },
      { label: "Usage", value: "Jaap, meditation, prayer" },
      { label: "Finish", value: "Natural wood" }
    ],
    benefits: [
      { title: "Mantra Chanting", desc: "Suitable for mantra chanting", icon: "📿" },
      { title: "Meditation Support", desc: "Supports meditation routines", icon: "🧘" },
      { title: "Traditional Appearance", desc: "Natural traditional appearance", icon: "🪵" },
      { title: "Devotional Use", desc: "Useful for devotional practices", icon: "🙏" },
      { title: "108 Bead Format", desc: "108-bead design is traditionally significant", icon: "✨" }
    ],
    faqs: [
      { q: "How many beads does it have?", a: "108 beads." },
      { q: "What is Karungali?", a: "A traditional name used for ebony wood." },
      { q: "Can it be used for Jaap?", a: "Yes." },
      { q: "Can it be worn?", a: "Depending on personal preference." },
      { q: "How should it be maintained?", a: "Keep the wood dry and avoid soaking." }
    ]
  },
  "vv_p25": {
    description: "Karungali Rudraksha Silver Cap Mala combines traditional Karungali beads and Rudraksha elements with silver-cap detailing. It offers a distinctive spiritual appearance for prayer, meditation, and devotional use.",
    specs: [
      { label: "Materials", value: "Karungali Wood & Rudraksha" },
      { label: "Detail", value: "Silver Cap" },
      { label: "Type", value: "Spiritual Mala" },
      { label: "Usage", value: "Prayer, meditation, Jaap" },
      { label: "Design", value: "Traditional" }
    ],
    benefits: [
      { title: "Dual Elements", desc: "Combines two traditional spiritual elements", icon: "☸️" },
      { title: "Meditation & Prayer", desc: "Suitable for meditation and prayer", icon: "🧘" },
      { title: "Distinctive Look", desc: "Distinctive traditional appearance", icon: "🥈" },
      { title: "Spiritual Gift", desc: "Makes a meaningful spiritual gift", icon: "🎁" },
      { title: "Devotional Routines", desc: "Suitable for devotional routines", icon: "✨" }
    ],
    faqs: [
      { q: "What materials are used?", a: "Karungali, Rudraksha and silver-cap detailing." },
      { q: "Can it be used for Jaap?", a: "Yes." },
      { q: "Can it be worn?", a: "Yes, depending on preference." },
      { q: "How should the silver cap be maintained?", a: "Keep it dry and wipe gently." },
      { q: "Can natural beads vary?", a: "Yes." }
    ]
  },
  "vv_p31": {
    description: "This 108-bead mala features 5 Mukhi Nepali Rudraksha beads and is designed for traditional chanting, meditation, prayer, and spiritual practices.",
    specs: [
      { label: "Rudraksha", value: "5 Mukhi" },
      { label: "Origin", value: "Nepal" },
      { label: "Beads", value: "108" },
      { label: "Type", value: "Jaap Mala" },
      { label: "Usage", value: "Mantra chanting, meditation, prayer" }
    ],
    benefits: [
      { title: "Traditional Jaap", desc: "Ideal for traditional Jaap", icon: "📿" },
      { title: "Meditation Use", desc: "Suitable for meditation", icon: "🧘" },
      { title: "108 Arrangement", desc: "Convenient 108-bead arrangement", icon: "✨" },
      { title: "Lord Shiva Association", desc: "Traditionally associated with Lord Shiva", icon: "🕉️" },
      { title: "Regular Practice", desc: "Suitable for regular spiritual practice", icon: "🌟" }
    ],
    faqs: [
      { q: "How many beads are included?", a: "108." },
      { q: "What Mukhi is used?", a: "5 Mukhi." },
      { q: "Is it suitable for Jaap?", a: "Yes." },
      { q: "Can beginners use it?", a: "Yes." },
      { q: "How should it be stored?", a: "Keep it clean and dry." }
    ]
  },
  "vv_p35": {
    description: "Original Rudraksha Jaap Mala features 108 Rudraksha beads designed for mantra chanting, prayer, meditation, and devotional practices. Its traditional design makes it suitable for regular spiritual routines.",
    specs: [
      { label: "Type", value: "Rudraksha Jaap Mala" },
      { label: "Beads", value: "108" },
      { label: "Usage", value: "Jaap, prayer, meditation" },
      { label: "Material", value: "Rudraksha" },
      { label: "Design", value: "Traditional" }
    ],
    benefits: [
      { title: "Mantra Chanting", desc: "Suitable for mantra chanting", icon: "📿" },
      { title: "Meditation Routines", desc: "Supports meditation routines", icon: "🧘" },
      { title: "108 Bead Format", desc: "Traditional 108-bead format", icon: "✨" },
      { title: "Daily Prayer", desc: "Convenient for daily prayer", icon: "🌅" },
      { title: "Gifting Choice", desc: "Suitable for gifting", icon: "🎁" }
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
    description: "Silver Cap Original Karungali Mala features natural Karungali/Ebony wood beads complemented by silver-cap detailing. It combines traditional aesthetics with an elegant finish for spiritual and devotional use.",
    specs: [
      { label: "Material", value: "Karungali/Ebony Wood" },
      { label: "Detail", value: "Silver Cap" },
      { label: "Type", value: "Mala" },
      { label: "Usage", value: "Prayer, meditation, Jaap" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Spiritual Appearance", desc: "Traditional spiritual appearance", icon: "🪵" },
      { title: "Prayer & Meditation", desc: "Suitable for prayer and meditation", icon: "🧘" },
      { title: "Silver Detailing", desc: "Elegant silver detailing", icon: "🥈" },
      { title: "Gifting Option", desc: "Good option for gifting", icon: "🎁" },
      { title: "Devotional Routines", desc: "Suitable for devotional routines", icon: "✨" }
    ],
    faqs: [
      { q: "What is the mala made from?", a: "Karungali/Ebony wood with silver-cap detailing." },
      { q: "Can it be used for Jaap?", a: "Yes." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "How should the wood be protected?", a: "Avoid prolonged exposure to water." },
      { q: "Will every bead look identical?", a: "Natural wood can vary." }
    ]
  },
  "vv_p38": {
    description: "Natural Sphatik Mala is made with clear quartz crystal beads and is traditionally valued for meditation, prayer, spiritual practices, and its naturally transparent appearance.",
    specs: [
      { label: "Material", value: "Natural Sphatik / Quartz" },
      { label: "Type", value: "Crystal Mala" },
      { label: "Usage", value: "Meditation, prayer, Jaap" },
      { label: "Appearance", value: "Clear/transparent" },
      { label: "Design", value: "Traditional Mala" }
    ],
    benefits: [
      { title: "Meditation Aid", desc: "Suitable for meditation", icon: "❄️" },
      { title: "Prayer & Practice", desc: "Commonly used for prayer and spiritual practices", icon: "🧘" },
      { title: "Crystal Appearance", desc: "Naturally elegant crystal appearance", icon: "💎" },
      { title: "Jaap Suitable", desc: "Suitable for Jaap", icon: "📿" },
      { title: "Meaningful Gift", desc: "Meaningful gifting option", icon: "🎁" }
    ],
    faqs: [
      { q: "What is Sphatik?", a: "Sphatik is a traditional Indian name for clear quartz crystal." },
      { q: "Can it be used for Jaap?", a: "Yes." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "Can quartz have natural variations?", a: "Yes." },
      { q: "How should I clean it?", a: "Gently wipe with a soft cloth." }
    ]
  },
  "vv_p41": {
    description: "Tulsi Jaap Mala is traditionally made from Tulsi wood beads and is commonly used for chanting, prayer, meditation, and devotional practices. Its natural wooden appearance gives it a simple and traditional character.",
    specs: [
      { label: "Material", value: "Tulsi Wood" },
      { label: "Type", value: "Jaap Mala" },
      { label: "Usage", value: "Prayer, Jaap, meditation" },
      { label: "Finish", value: "Natural" },
      { label: "Design", value: "Traditional" }
    ],
    benefits: [
      { title: "Devotional Chanting", desc: "Commonly used for devotional chanting", icon: "🌿" },
      { title: "Meditation Support", desc: "Suitable for meditation", icon: "🧘" },
      { title: "Traditional Accessory", desc: "Traditional spiritual accessory", icon: "✨" },
      { title: "Lightweight", desc: "Lightweight and easy to handle", icon: "🕊️" },
      { title: "Regular Prayer", desc: "Suitable for regular prayer routines", icon: "🌅" }
    ],
    faqs: [
      { q: "What is Tulsi Mala used for?", a: "Traditionally for prayer, chanting, and devotional practices." },
      { q: "Can it be used for Jaap?", a: "Yes." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "Can the beads vary?", a: "Natural Tulsi beads can vary." },
      { q: "How should it be stored?", a: "Keep it dry and protected." }
    ]
  },
  "vv_p42": {
    description: "Natural Tulsi Bead Mala contains 108 traditionally arranged Tulsi beads and is designed for mantra chanting, prayer, meditation, and devotional practices.",
    specs: [
      { label: "Material", value: "Natural Tulsi" },
      { label: "Beads", value: "108" },
      { label: "Type", value: "Mala" },
      { label: "Usage", value: "Jaap, meditation, prayer" },
      { label: "Finish", value: "Natural" }
    ],
    benefits: [
      { title: "Traditional Jaap", desc: "Suitable for traditional Jaap", icon: "📿" },
      { title: "108 Arrangement", desc: "108-bead arrangement", icon: "🌿" },
      { title: "Easy to Use", desc: "Lightweight and easy to use", icon: "🕊️" },
      { title: "Devotional Routines", desc: "Ideal for devotional routines", icon: "✨" },
      { title: "Natural Appearance", desc: "Natural traditional appearance", icon: "🌅" }
    ],
    faqs: [
      { q: "How many beads are there?", a: "108." },
      { q: "What material is used?", a: "Tulsi beads." },
      { q: "Can it be used for mantra chanting?", a: "Yes." },
      { q: "Can it be worn?", a: "Yes." },
      { q: "How should it be maintained?", a: "Keep it dry and avoid soaking." }
    ]
  },
  "vv_p12": {
    description: "7 Chakra Crystal Gemstone Tree is a decorative spiritual piece featuring colourful gemstone elements representing the seven chakras. It can be placed in homes, offices, meditation spaces, or gifted on special occasions.",
    specs: [
      { label: "Type", value: "Gemstone Tree" },
      { label: "Theme", value: "7 Chakras" },
      { label: "Material", value: "Crystal/Gemstone elements" },
      { label: "Usage", value: "Home décor, meditation space, gifting" },
      { label: "Design", value: "Decorative tree" }
    ],
    benefits: [
      { title: "Chakra System", desc: "Represents the seven chakra system", icon: "🌈" },
      { title: "Spiritual Touch", desc: "Adds a spiritual touch to interiors", icon: "🏡" },
      { title: "Meditation Space", desc: "Suitable for meditation spaces", icon: "🧘" },
      { title: "Decorative Piece", desc: "Attractive decorative piece", icon: "✨" },
      { title: "Gifting Option", desc: "Excellent gifting option", icon: "🎁" }
    ],
    faqs: [
      { q: "What does the tree represent?", a: "The seven chakras in traditional spiritual practices." },
      { q: "Where can it be placed?", a: "Home, office, meditation area, or study space." },
      { q: "Can it be gifted?", a: "Yes." },
      { q: "Are the stones natural?", a: "Depends on the specific product specification." },
      { q: "Is it a medical device?", a: "No." }
    ]
  },
  "vv_p34": {
    description: "Rose Quartz Gemstone Tree is a decorative piece featuring pink-toned Rose Quartz elements arranged in a tree-inspired design. Traditionally associated with love, harmony, and compassion, it makes an elegant addition to homes, offices, and meditation spaces.",
    specs: [
      { label: "Stone", value: "Rose Quartz" },
      { label: "Type", value: "Gemstone Tree" },
      { label: "Colour", value: "Pink" },
      { label: "Usage", value: "Home décor, gifting, meditation space" },
      { label: "Design", value: "Decorative tree" }
    ],
    benefits: [
      { title: "Love & Harmony", desc: "Traditionally associated with love and harmony", icon: "🌸" },
      { title: "Decorative Touch", desc: "Adds an elegant decorative touch", icon: "🏡" },
      { title: "Meditation Space", desc: "Suitable for meditation spaces", icon: "🧘" },
      { title: "Thoughtful Gift", desc: "Makes a thoughtful gift", icon: "🎁" },
      { title: "Natural Gemstone Look", desc: "Beautiful natural pink gemstone appearance", icon: "💖" }
    ],
    faqs: [
      { q: "What gemstone is used?", a: "Rose Quartz." },
      { q: "What does Rose Quartz traditionally symbolize?", a: "Love, harmony, and compassion." },
      { q: "Where can the tree be placed?", a: "Home, office, study, or meditation space." },
      { q: "Can it be gifted?", a: "Yes." },
      { q: "Will every tree look identical?", a: "Natural gemstone colour and texture can vary." }
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

// Map by product ID and product Slug from data.js
global.window = {};
require('../frontend/public/js/data.js');
const products = global.window.VED_VIGYAN_DATA?.products || [];

products.forEach(p => {
  if (tabsData[p.id]) {
    if (p.slug) tabsData[p.slug] = tabsData[p.id];
  } else {
    console.warn(`Missing tab data for product ID: ${p.id} (${p.name})`);
  }
});

// Explicit subfolder and legacy path aliases
const extraAliases = {
  "5-mukhi": tabsData["vv_p08"],
  "7-mukhi": tabsData["vv_p13"],
  "amethyst-bracelet": tabsData["vv_p16"],
  "tiger-eye-bracelet": tabsData["vv_p39"],
  "tulsi-mala": tabsData["vv_p41"],
  "5-mukhi-mala-108": tabsData["vv_p31"],
  "rudraksha-bracelet": tabsData["vv_p21"],
  "gangajal": tabsData["vv_p01"],
  "mithun-gemini-braclet": tabsData["vv_p30"],
  "vrishabh-taurus-braclet": tabsData["vv_p43"],
  "mesh-aries-braclet": tabsData["vv_p29"],
  "karka-cancer-braclet": tabsData["vv_p23"],
  "singh-leo-braclet": tabsData["vv_p37"],
  "kanya-virgo-braclet": tabsData["vv_p22"],
  "tula-libra-braclet": tabsData["vv_p40"],
  "dhanu-sagittarius-braclet": tabsData["vv_p17"],
  "makar-capricorn-braclet": tabsData["vv_p27"],
  "kumbh-aquarius-braclet": tabsData["vv_p26"],
  "meen-pisces-braclet": tabsData["vv_p28"]
};

Object.assign(tabsData, extraAliases);

const fileContent = `// Auto-generated Product Tabbed Content Dataset (Exact user content for all 42 products)
window.VED_VIGYAN_PRODUCT_TABS = ${JSON.stringify(tabsData, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'public', 'js', 'pdp-tabs-data.js'), fileContent, 'utf8');
console.log(`Successfully generated pdp-tabs-data.js with exact data for all ${Object.keys(tabsData).length} product keys!`);
