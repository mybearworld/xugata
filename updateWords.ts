import { data } from "./src/lib/data.ts";
import { writeFile } from "node:fs/promises";

const getCurrentWords = () => {
  const wordsSet = new Set<string>();
  Object.entries(data.words).forEach(([_date, words]) => {
    words.removed.forEach((word) => {
      wordsSet.delete(word);
    });
    words.added.forEach((word) => {
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

  const addedWords = new Set<string>();
  const seenWords = new Set<string>();
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
    seenWords.add(displayWord);
    if (currentWords.has(displayWord)) return;
    addedWords.add(displayWord);
  });
  const removedWords = new Set<string>();
  currentWords.forEach((word) => {
    if (!seenWords.has(word)) {
      removedWords.add(word);
    }
  });
  return { added: addedWords, removed: removedWords };
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
  if (newWords.added.size === 0 && newWords.removed.size === 0) {
    console.log("No changes. Quitting.");
    return 1;
  }
  const tomorrow = tomorrowString();
  const newData = { ...data };
  const currentTomorrow = data.words[tomorrow as keyof typeof data.words];
  newData.words[tomorrow as keyof typeof newData.words] = {
    added: [...(currentTomorrow?.added ?? []), ...newWords.added.values()],
    removed: [
      ...(currentTomorrow?.removed ?? []),
      ...newWords.removed.values(),
    ],
  };
  await writeFile("./src/lib/data.json", JSON.stringify(newData));
  console.log(
    `Added ${newWords.added.size} and removed ${newWords.removed.size} word(s)`,
  );
  return 0;
};

process.exit(await updateFile());
