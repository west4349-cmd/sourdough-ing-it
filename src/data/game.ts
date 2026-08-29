export type ChapterId = 'starter' | 'loaf' | 'home' | 'town' | 'company';

export type Supply = {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  teaching: string;
};

export const chapters = [
  { id: 'starter' as ChapterId, icon: '🌱', title: 'Raise Your Starter', summary: 'Earn supplies, make a starter, feed it, and prove it is mature.' },
  { id: 'loaf' as ChapterId, icon: '🥖', title: 'Bake Your First Loaf', summary: 'Learn the real sourdough bread process from active starter to cooled loaf.' },
  { id: 'home' as ChapterId, icon: '🏠', title: 'Start a Home Bakery', summary: 'Take small orders, learn costs, and reinvest carefully.' },
  { id: 'town' as ChapterId, icon: '🏪', title: 'Open Bunnywood Bakery', summary: 'Move into town and run a growing bakery.' },
  { id: 'company' as ChapterId, icon: '🏢', title: 'Build the Bakery Company', summary: 'Scale production and grow beyond Bunnywood.' },
];

export const starterSupplies: Supply[] = [
  { id: 'flour', name: 'Brown Rice Flour', emoji: '🌾', cost: 6, teaching: 'We begin with brown rice flour because it is a dependable flour for getting the starter going.' },
  { id: 'water', name: 'Filtered Water', emoji: '💧', cost: 5, teaching: 'Use filtered drinking water for the starter. Filtering helps remove chlorine and other tastes or treatments that can interfere with fermentation.' },
  { id: 'jar', name: 'Clear Glass Jar', emoji: '🫙', cost: 7, teaching: 'A clear jar lets us watch bubbles and see how high the starter rises.' },
  { id: 'scale', name: 'Digital Gram Scale', emoji: '⚖️', cost: 10, teaching: 'Sourdough is easier to repeat when ingredients are measured by grams.' },
  { id: 'bowl', name: 'Mixing Bowl', emoji: '🥣', cost: 5, teaching: 'A mixing bowl gives us room to measure and combine ingredients cleanly.' },
  { id: 'whisk', name: 'Danish Dough Whisk', emoji: '🌀', cost: 8, teaching: 'The whisk moves through thick starter without clogging like a balloon whisk.' },
  { id: 'spatula', name: 'Silicone Jar Spatula', emoji: '🥄', cost: 6, teaching: 'The flexible spatula scrapes sticky starter from the jar walls.' },
  { id: 'timer', name: 'Timer', emoji: '⏲️', cost: 5, teaching: 'Fermentation needs time. A timer helps us wait instead of guessing.' },
  { id: 'thermometer', name: 'Digital Thermometer', emoji: '🌡️', cost: 9, teaching: 'Temperature changes fermentation speed, so we learn to check it instead of guessing.' },
];
