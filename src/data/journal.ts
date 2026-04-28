export interface JournalEntry {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: string;
  content: string[];
  relatedProducts?: string[];
}

export const journalEntries: JournalEntry[] = [
  {
    id: "1",
    title: "Why Hands",
    slug: "why-hands",
    excerpt:
      "We chose to begin here because hands are how you meet the world. They hold, they gesture, they rest. A hand chain follows all of it.",
    date: "2026-03-15",
    image: "/images/lifestyle.jpg",
    content: [
      "Think about what your hands do in a single day. They hold coffee cups and door handles and other people. They gesture when you talk. They rest in your lap when you listen. They are always present, always in motion, always telling something about you.",
      "A hand chain follows that. It traces the natural lines, the gesture of the wrist, the stillness of the fingers at rest. It does not interrupt. It accompanies.",
      "We did not start with hand chains because they are trending. We started here because the most personal jewellery should live on the most personal part of the body. Your hands are how you connect. This felt like the only honest place to begin.",
    ],
    relatedProducts: ["1"],
  },
  {
    id: "2",
    title: "The Case for One",
    slug: "the-case-for-one",
    excerpt:
      "You do not need a full collection to feel complete. You need one piece that feels right. The rest will follow when it is time.",
    date: "2026-03-01",
    image: "/images/intimate.jpg",
    content: [
      "There is pressure everywhere to have more. More options, more pieces, more everything. We are not interested in that.",
      "We launched with a single hand chain because we believe one intentional piece changes how you carry yourself more than ten impulse purchases ever could. One piece you chose carefully. One piece that sits on your skin and becomes part of your day.",
      "When you wear the same piece every morning, it stops being jewellery and starts being identity. That is what we are building toward. Not a catalogue. A collection that grows when you are ready, not when we tell you to be.",
    ],
    relatedProducts: ["1"],
  },
  {
    id: "3",
    title: "Quiet Confidence",
    slug: "quiet-confidence",
    excerpt:
      "The most powerful jewellery is the kind that does not ask for attention. It simply belongs on the body, as if it was always there.",
    date: "2026-02-15",
    image: "/images/detail.jpg",
    content: [
      "Confidence is not volume. It is certainty. The same is true of how we wear jewellery. A piece that sits close to the skin, that moves with the body, that catches light without demanding it, that is confidence made tangible.",
      "Every chain, every link, every clasp is considered. Not to impress anyone. To feel right. When jewellery feels right on the body, it changes posture, gesture, presence. You stand a little differently. Your hand moves a little more deliberately.",
      "You do not need to explain it. You do not need anyone to notice. You know it is there, and that is enough.",
    ],
    relatedProducts: ["1"],
  },
];

export function getJournalEntry(slug: string): JournalEntry | undefined {
  return journalEntries.find((e) => e.slug === slug);
}
