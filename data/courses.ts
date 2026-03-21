export type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: "text" | "audio" | "quiz";
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  completed: boolean;
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  rating: number;
  students: number;
  color: string;
  emoji: string;
  instructor: string;
  description: string;
  tags: string[];
  lessonList: Lesson[];
};

export const COURSES: Course[] = [
  {
    id: "1",
    title: "UI Design Fundamentals",
    subtitle: "Master the core principles",
    category: "UI Design",
    level: "Beginner",
    duration: "4h 30min",
    lessons: 18,
    rating: 4.9,
    students: 3240,
    color: "#7C5CBF",
    emoji: "🎨",
    instructor: "Sarah Chen",
    description:
      "Learn the foundational principles of UI design including layout, spacing, visual hierarchy, and component design. Build real-world interfaces from scratch.",
    tags: ["Layout", "Components", "Figma", "Typography"],
    lessonList: [
      {
        id: "1-1",
        title: "What is UI Design?",
        duration: "8 min",
        type: "text",
        completed: true,
        content:
          "UI Design (User Interface Design) is the process of creating interfaces in software or computerized devices with a focus on looks and style.\n\n**Key Principles:**\n\n**1. Clarity**\nEvery element should serve a purpose. Remove anything that doesn't help the user accomplish their goal.\n\n**2. Consistency**\nUse the same patterns, colors, and typography throughout your design. Consistency builds trust and reduces the cognitive load on users.\n\n**3. Visual Hierarchy**\nGuide the user's eye through your design using size, color, contrast, and spacing. The most important elements should stand out.\n\n**4. Feedback**\nAlways let users know the result of their actions. Buttons should change state on press. Forms should validate in real time.",
      },
      {
        id: "1-2",
        title: "The 8pt Grid System",
        duration: "12 min",
        type: "text",
        completed: true,
        content:
          "The 8pt grid system is the foundation of modern UI design. All spacing, sizes, and positioning should be multiples of 8.\n\n**Why 8pt?**\n\nMost screen sizes are divisible by 8, which means your designs will scale perfectly across all devices — from phones to large monitors.\n\n**How to apply it:**\n\n• Margins: 16px, 24px, 32px\n• Padding: 8px, 16px, 24px\n• Component heights: 40px, 48px, 56px, 64px\n• Icon sizes: 16px, 24px, 32px, 48px\n\n**Soft vs Hard grid**\n\nA soft grid gives you flexibility — elements don't have to snap exactly to grid lines, but their spacing values should still be multiples of 8.",
      },
      {
        id: "1-3",
        title: "Color in UI Design",
        duration: "15 min",
        type: "text",
        completed: false,
        content:
          "Color is one of the most powerful tools in a UI designer's arsenal. Used correctly, it guides attention, communicates meaning, and creates emotion.\n\n**The 60-30-10 Rule**\n\n• 60% — Dominant/background color (usually neutral)\n• 30% — Secondary color (surfaces, cards)\n• 10% — Accent color (buttons, highlights, CTAs)\n\n**Semantic colors:**\n\n• Green → Success, positive actions\n• Red → Error, danger, delete\n• Yellow/Orange → Warning, caution\n• Blue → Information, links\n\n**Contrast ratios (WCAG):**\n\nFor accessibility, text must have a minimum contrast ratio of 4.5:1 against its background. Large text (18px+) needs 3:1.",
      },
      {
        id: "1-4",
        title: "Typography Basics",
        duration: "10 min",
        type: "text",
        completed: false,
        content:
          "Typography is the art of arranging type to make written language legible, readable, and appealing.\n\n**Type Scale**\n\nUse a modular scale for your type sizes. A common scale uses a ratio of 1.25:\n• 12, 14, 16, 20, 24, 32, 40, 48px\n\n**Font pairing rules:**\n\n1. Contrast styles — pair a serif with a sans-serif\n2. Contrast weights — pair bold with regular\n3. Limit to 2 typefaces per project\n\n**Line height:**\n\n• Body text: 1.5x the font size\n• Headings: 1.1–1.3x the font size\n• UI labels: 1.0–1.2x",
      },
      {
        id: "1-5",
        title: "Design Principles — Audio Guide",
        duration: "6 min",
        type: "audio",
        completed: false,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        content:
          "A narrated walkthrough of the core UI design principles covered in this module. Listen and absorb the key concepts at your own pace.\n\n**In this audio lesson:**\n\n• Clarity and purpose in design\n• Building consistent visual systems\n• Using hierarchy to guide attention\n• Giving users meaningful feedback",
      },
    ],
  },
  {
    id: "2",
    title: "Typography Mastery",
    subtitle: "Type that speaks volumes",
    category: "Typography",
    level: "Intermediate",
    duration: "3h 15min",
    lessons: 14,
    rating: 4.8,
    students: 2180,
    color: "#FF6B35",
    emoji: "✍️",
    instructor: "Marcus Webb",
    description:
      "Deep dive into the world of typography. Learn to choose, pair, and use typefaces like a professional designer.",
    tags: ["Typefaces", "Kerning", "Hierarchy", "Print"],
    lessonList: [
      {
        id: "2-1",
        title: "Anatomy of Type",
        duration: "10 min",
        type: "text",
        completed: false,
        content:
          "Understanding the anatomy of letterforms is fundamental to working with type professionally.\n\n**Key terms:**\n\n**Baseline** — The invisible line that letters sit on\n**Cap height** — Height of capital letters from baseline\n**X-height** — Height of lowercase letters (specifically 'x')\n**Ascender** — Part of letter that extends above x-height (b, d, f, h, k, l, t)\n**Descender** — Part of letter below baseline (g, j, p, q, y)\n**Serif** — Small decorative strokes at ends of letterforms\n**Counter** — Enclosed or partially enclosed space within a letter",
      },
      {
        id: "2-2",
        title: "Choosing the Right Typeface",
        duration: "12 min",
        type: "text",
        completed: false,
        content:
          "Typeface selection is one of the most important decisions in design. The wrong font can undermine even the best layout.\n\n**Categories:**\n\n**Serif** — Traditional, trustworthy, editorial (Times New Roman, Georgia, Playfair)\n**Sans-serif** — Modern, clean, digital-first (Inter, Helvetica, Roboto)\n**Monospace** — Technical, code, terminal feel (JetBrains Mono, Courier)\n**Display** — Decorative, high-impact, headlines only\n\n**Questions to ask:**\n\n1. What is the medium? (Screen vs print)\n2. What emotion should it convey?\n3. What sizes will it be used at?\n4. Does it support all required characters/languages?",
      },
      {
        id: "2-3",
        title: "Font Pairing Masterclass",
        duration: "8 min",
        type: "audio",
        completed: false,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        content:
          "An audio deep-dive into the art of pairing fonts. Learn the rules — then learn when to break them.\n\n**What you'll hear:**\n\n• Why contrast is the golden rule of pairing\n• How to balance personality and readability\n• Real examples from top design studios\n• Common pairing mistakes and how to fix them",
      },
    ],
  },
  {
    id: "3",
    title: "Color Theory & Application",
    subtitle: "The science and art of color",
    category: "Color",
    level: "Beginner",
    duration: "2h 45min",
    lessons: 12,
    rating: 4.7,
    students: 4120,
    color: "#FF4D8D",
    emoji: "🌈",
    instructor: "Aisha Johnson",
    description:
      "Understand color on a deep level — from the physics of light to creating stunning color palettes for real projects.",
    tags: ["Palettes", "Psychology", "Accessibility", "Branding"],
    lessonList: [
      {
        id: "3-1",
        title: "The Color Wheel",
        duration: "8 min",
        type: "text",
        completed: false,
        content:
          "The color wheel is a circular diagram of colors organized by their chromatic relationship.\n\n**Primary colors:** Red, Yellow, Blue\n**Secondary colors:** Orange, Green, Violet\n**Tertiary colors:** Combinations of primary + secondary\n\n**Color relationships:**\n\n**Complementary** — Colors opposite each other (high contrast, vibrant)\n**Analogous** — Colors next to each other (harmonious, calming)\n**Triadic** — Three equally spaced colors (balanced, vibrant)\n**Split-complementary** — One color + two adjacent to its complement",
      },
    ],
  },
  {
    id: "4",
    title: "Figma Essentials",
    subtitle: "From zero to professional",
    category: "Tools",
    level: "Beginner",
    duration: "5h 0min",
    lessons: 22,
    rating: 4.9,
    students: 6780,
    color: "#00D4AA",
    emoji: "⚡",
    instructor: "David Park",
    description:
      "Master Figma from the ground up. Learn frames, components, auto layout, prototyping, and collaboration features used by top design teams.",
    tags: ["Figma", "Prototyping", "Components", "Auto Layout"],
    lessonList: [
      {
        id: "4-1",
        title: "Figma Interface Tour",
        duration: "10 min",
        type: "text",
        completed: false,
        content:
          "Figma is a browser-based design tool that has become the industry standard for UI/UX design.\n\n**Main areas:**\n\n**Toolbar** — Top bar with selection, frame, shape, pen, text tools\n**Layers panel** — Left panel showing page structure\n**Canvas** — Central area where you design\n**Properties panel** — Right panel showing selected element properties\n**Assets panel** — Left panel tab for components and styles\n\n**Essential shortcuts:**\n\n• F — Frame tool\n• R — Rectangle\n• T — Text\n• V — Selection (move)\n• Cmd+D — Duplicate\n• Cmd+G — Group\n• Cmd+Shift+G — Ungroup",
      },
    ],
  },
  {
    id: "5",
    title: "Design Thinking",
    subtitle: "Human-centered problem solving",
    category: "Process",
    level: "Intermediate",
    duration: "3h 30min",
    lessons: 16,
    rating: 4.8,
    students: 2890,
    color: "#C8FF00",
    emoji: "💡",
    instructor: "Elena Russo",
    description:
      "Learn the 5-stage Design Thinking process used by top companies like IDEO, Apple, and Google to solve complex problems.",
    tags: ["Research", "Ideation", "Prototyping", "Testing"],
    lessonList: [
      {
        id: "5-1",
        title: "What is Design Thinking?",
        duration: "8 min",
        type: "text",
        completed: false,
        content:
          "Design Thinking is a non-linear, iterative process that teams use to understand users, challenge assumptions, redefine problems, and create innovative solutions.\n\n**The 5 Stages:**\n\n**1. Empathize** — Research your users' needs\n**2. Define** — State your users' needs and problems\n**3. Ideate** — Challenge assumptions, create ideas\n**4. Prototype** — Start to create solutions\n**5. Test** — Try your solutions out\n\nDesign Thinking is not a sequential process — you can return to earlier stages based on what you learn in later ones.",
      },
    ],
  },
  {
    id: "6",
    title: "Branding & Identity",
    subtitle: "Build brands that last",
    category: "Branding",
    level: "Advanced",
    duration: "4h 0min",
    lessons: 20,
    rating: 4.9,
    students: 1560,
    color: "#7C5CBF",
    emoji: "🔮",
    instructor: "James Okafor",
    description:
      "Create powerful brand identities from strategy to execution. Covers logo design, brand guidelines, visual systems, and brand voice.",
    tags: ["Logo", "Brand Voice", "Guidelines", "Visual Identity"],
    lessonList: [
      {
        id: "6-1",
        title: "What Makes a Strong Brand?",
        duration: "10 min",
        type: "text",
        completed: false,
        content:
          "A brand is much more than a logo. It's the total sum of how people perceive a company — visually, emotionally, and experientially.\n\n**Brand components:**\n\n**Brand strategy** — Purpose, vision, values, positioning\n**Brand identity** — Logo, colors, typography, imagery\n**Brand voice** — Tone, language, personality in communication\n**Brand experience** — Every touchpoint a customer has\n\n**What makes brands memorable:**\n\n1. Consistency across all touchpoints\n2. Emotional resonance\n3. Clear differentiation from competitors\n4. Authentic values alignment",
      },
    ],
  },
];

export const SCHEDULE = [
  { id: "s1", title: "UI Design Fundamentals", time: "09:00 - 10:00", day: "Today", color: "#7C5CBF" },
  { id: "s2", title: "Typography Mastery", time: "11:00 - 12:00", day: "Today", color: "#FF6B35" },
  { id: "s3", title: "Color Theory", time: "14:00 - 15:00", day: "Today", color: "#FF4D8D" },
  { id: "s4", title: "Figma Essentials", time: "16:00 - 17:00", day: "Today", color: "#00D4AA" },
];

export const CLASSMATES = [
  { id: "m1", name: "Alex", initial: "A", color: "#7C5CBF" },
  { id: "m2", name: "Bea", initial: "B", color: "#FF6B35" },
  { id: "m3", name: "Carlos", initial: "C", color: "#FF4D8D" },
  { id: "m4", name: "Diana", initial: "D", color: "#00D4AA" },
  { id: "m5", name: "Evan", initial: "E", color: "#C8FF00" },
];
