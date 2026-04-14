export interface PresetBlock {
  id: number;
  text: string;
  count: number;
  imageSrc: string | undefined;
}

export const presetBlocks: PresetBlock[] = [
  { id: 1, text: "Drinking water isn't just about quenching about", count: 1, imageSrc: undefined },
  { id: 2, text: "Staying hydrated throughout the day keeps your energy levels stable and your mind sharp.", count: 10, imageSrc: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&q=80" },
  { id: 3, text: "The ocean covers more than 70% of Earth's surface.", count: 4, imageSrc: undefined },
  { id: 4, text: "Deep beneath the waves lies an entire world of creatures, currents, and geological formations we have", count: 2333, imageSrc: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200&q=80" },
  { id: 5, text: "Climate change impacts water availability across the globe.", count: 99, imageSrc: "/bg.png" },
];

export const presetBlocks2: PresetBlock[] = [
  { id: 6, text: "Mountains cover about 27% of Earth's land surface.", count: 5, imageSrc: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80" },
  { id: 7, text: "The Amazon rainforest produces 20% of the world's oxygen.", count: 88, imageSrc: undefined },
  { id: 8, text: "Every year, approximately 500,000 earthquakes occur worldwide.", count: 500, imageSrc: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
  { id: 9, text: "Light travels at 299,792 kilometres per second.", count: 12, imageSrc: undefined },
  { id: 10, text: "There are more trees on Earth than stars in the Milky Way.", count: 42, imageSrc: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&q=80" },
];
