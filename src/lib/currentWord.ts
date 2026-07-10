import { data } from "./data.ts";

export type Word = {
  word: string;
  number: number;
};

const SEED = 1778431252292;
export const NOW = new Date();

export const isISOToday = (date: Date) =>
  date.getUTCDate() === NOW.getUTCDate() &&
  date.getUTCMonth() === NOW.getUTCMonth() &&
  date.getUTCDate() === NOW.getUTCDate();

export const getResetTime = () => {
  const tomorrow = new Date(NOW);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0);
  tomorrow.setUTCMinutes(0);
  tomorrow.setUTCMinutes(0);
  tomorrow.setUTCMilliseconds(0);
  return tomorrow;
};

export const currentWord = (): Word => {
  const prng = splitmix32(SEED);
  const date = new Date(data.start);
  let allWords: string[] = [];
  let words: string[] = [];
  let number = 1;
  while (true) {
    const newWords = data.words[date.toISOString() as keyof typeof data.words];
    if (newWords) {
      allWords.push(...newWords.added);
      words.push(...newWords.added);
      if (newWords.removed) {
        allWords = allWords.filter((word) => !newWords.removed.includes(word));
        words = words.filter((word) => !newWords.removed.includes(word));
      }
    }
    if (words.length === 0) {
      words.push(...allWords);
    }
    const i = Math.floor(prng() * words.length);
    if (isISOToday(date)) {
      return { word: words[i], number };
    }
    words.splice(i, 1);
    date.setUTCDate(date.getUTCDate() + 1);
    number++;
  }
};

// Seedable PRNG, see https://stackoverflow.com/a/47593316
const splitmix32 = (a: number) => {
  return () => {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
};
