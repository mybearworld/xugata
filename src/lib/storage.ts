import { z } from "zod/v4";

const STORAGE_KEY = "wordyl:storage";
const STORAGE_SCHEMA = z.object({
  stats: z.object({
    guesses: z.record(z.number(), z.number()),
  }),
});

const getFromStorage = () => {
  const fromStorage = localStorage.getItem(STORAGE_KEY);
  try {
    if (fromStorage) {
      return STORAGE_SCHEMA.parse(JSON.parse(fromStorage));
    }
  } catch {}
  return {
    stats: {
      guesses: {},
    },
  };
};
const storage = getFromStorage();
const writeToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
};
writeToStorage();

export const addGuessAmount = (guesses: number) => {
  storage.stats.guesses[guesses] ??= 0;
  storage.stats.guesses[guesses]++;
  writeToStorage();
};

export const getGuesses = () => storage.stats.guesses;
