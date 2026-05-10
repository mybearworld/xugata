import data from "./data.json";

const SEED = 1778404414407;
const NOW = new Date();

const isISOToday = (date: Date) =>
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

export const currentWord = () => {
  const prng = splitmix32(SEED);
  const date = new Date(data.start);
  const allWords: string[] = [];
  const words: string[] = [];
  while (true) {
    const newWords = data.words[date.toISOString() as keyof typeof data.words];
    if (newWords) {
      allWords.push(...newWords);
      words.push(...newWords);
    }
    if (words.length === 0) {
      words.push(...allWords);
    }
    const i = Math.floor(prng() * words.length);
    if (isISOToday(date)) {
      return words[i];
    }
    words.splice(i, 1);
    date.setUTCDate(date.getUTCDate() + 1);
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
