import data from "./src/lib/data.json" with { type: "json" };
import { writeFile } from "node:fs/promises";

const getCurrentWords = () => {
  const wordsSet = new Set<string>();
  Object.entries(data.words).forEach(([_date, words]) => {
    words.forEach((word) => {
      wordsSet.add(word);
    });
  });
  return wordsSet;
};

const getNewWords = async () => {
  const currentWords = getCurrentWords();
  const fetchedWords = await (
    await fetch("https://batelu.sushii64.com/data/words.json")
  ).json();
  if (!Array.isArray(fetchedWords))
    throw new Error("fetched words not an array");

  const newWords = new Set<string>();
  fetchedWords.forEach((word: unknown) => {
    if (
      !word ||
      typeof word !== "object" ||
      !("word" in word) ||
      typeof word.word !== "string"
    ) {
      throw new Error("no word property");
    }
    const displayWord = word.word.replace(/\d+$/, "");
    if (displayWord.length !== 5) return;
    if (currentWords.has(displayWord)) return;
    newWords.add(displayWord);
  });
  return newWords;
};

const tomorrowString = () => {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0);
  tomorrow.setUTCMinutes(0);
  tomorrow.setUTCSeconds(0);
  tomorrow.setUTCMilliseconds(0);
  return tomorrow.toISOString();
};

const updateFile = async () => {
  const newWords = await getNewWords();
  if (newWords.size === 0) {
    console.log("No new words. Quitting.");
    return 1;
  }
  const tomorrow = tomorrowString();
  const newData = { ...data };
  newData.words[tomorrow as keyof typeof newData.words] = [
    ...(data.words[tomorrow as keyof typeof data.words] ?? []),
    ...newWords.values(),
  ];
  await writeFile("./src/lib/data.json", JSON.stringify(newData));
  console.log(`Added ${newWords.size} new word(s).`);
  return 0;
};

process.exit(await updateFile());
