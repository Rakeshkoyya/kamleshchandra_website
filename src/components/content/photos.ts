/*
 * Photo metadata for the CC-licensed stand-in images (see public/images/CREDITS.md).
 * Credits must stay visible wherever these photos appear. Replace with KC's own
 * photography before launch — then drop the credit lines.
 */

export interface PhotoMeta {
  width: number;
  height: number;
  alt: string;
  credit?: string;
}

const PHOTOS: Record<string, PhotoMeta> = {
  "/images/kamlesh-portrait.jpg": {
    width: 286,
    height: 452,
    alt: "Black-and-white portrait of Kamlesh Chandra, smiling, in glasses and a dark sweater",
  },
  "/images/teacher-training.jpg": {
    width: 1024,
    height: 768,
    alt: "Teachers working in small groups around tables during a training session",
    credit: "Photo: TESS-India, CC BY-SA 2.0",
  },
  "/images/schoolgirls.jpg": {
    width: 1024,
    height: 711,
    alt: "Three schoolgirls in uniform walking home together, smiling, one wheeling a bicycle",
    credit: "Photo: Nithi clicks, CC BY 2.0",
  },
  "/images/bikaner-pattern.jpg": {
    width: 1024,
    height: 683,
    alt: "Painted floral ornament on a wall of Junagarh Fort, Bikaner",
    credit: "Photo: dalbera, CC BY 2.0",
  },
  "/images/open-book.jpg": {
    width: 1024,
    height: 768,
    alt: "An open book",
    credit: "Photo: Honou, CC BY 2.0",
  },
  "/images/parent-child.jpg": {
    width: 1023,
    height: 685,
    alt: "Parents and children learning together",
    credit: "Photo: DFID – UK Department for International Development, CC BY 2.0",
  },
  "/images/sunrise.jpg": {
    width: 1024,
    height: 683,
    alt: "Morning light at sunrise",
    credit: "Photo: mripp, CC BY 2.0",
  },
  "/images/storytelling-circle.jpg": {
    width: 1024,
    height: 682,
    alt: "Children gathered in a circle at a storytelling workshop",
    credit: "Photo: Pratham Books, CC BY 2.0",
  },
};

const FALLBACK: PhotoMeta = { width: 1024, height: 683, alt: "" };

export function photoMeta(src: string): PhotoMeta {
  return PHOTOS[src] ?? FALLBACK;
}
