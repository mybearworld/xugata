import { z } from "zod/v4";
import { isISOToday, NOW } from "./currentWord";

const STORAGE_KEY = "xugata:storage";
const STORAGE_SCHEMA = z.object({
  stats: z.object({
    guesses: z.record(z.number(), z.number()),
  }),
  gameProgress: z
    .object({
      date: z.iso.datetime().transform((d) => new Date(d)),
      guesses: z.string().array(),
    })
    .nullable(),
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
    gameProgress: null,
  } satisfies z.infer<typeof STORAGE_SCHEMA>;
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

export const getGameProgress = () => {
  if (storage.gameProgress && isISOToday(storage.gameProgress.date)) {
    return storage.gameProgress.guesses;
  }
  return null;
};

export const setGameProgress = (guesses: string[]) => {
  storage.gameProgress = {
    date: NOW,
    guesses,
  };
  writeToStorage();
};
