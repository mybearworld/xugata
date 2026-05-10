import data from "./data.json";

export type Evaluation = {
  letters: ColoredLetter[];
  gameState: GameState;
};
export type ColoredLetter = {
  letter: string;
  color: LetterColor;
};
export type LetterColor = "gray" | "green" | "yellow";
export type GameState = "ongoing" | "success" | "fail";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export const newGame = (word: string) => {
  let gameState: GameState = "ongoing";
  const evaluations: Evaluation[] = [];
  return {
    guess: (
      guess: string,
    ):
      | { error: true; msg: string }
      | { error: false; evaluation: Evaluation } => {
      if (gameState !== "ongoing") {
        return { error: true, msg: "Game is over" };
      }
      if (guess.length < WORD_LENGTH) {
        return { error: true, msg: "Word too short" };
      }
      if (guess.length > WORD_LENGTH) {
        return { error: true, msg: "Word too long" };
      }
      if (
        !Object.values(data.words).some((words) =>
          words.some((word) => word === guess),
        )
      ) {
        return { error: true, msg: "Word not in dictionary" };
      }
      const colors = new Map<number, LetterColor>();
      const wordArray = [...word];
      const guessArray = [...guess];
      wordArray.forEach((wordLetter, i) => {
        if (wordLetter === guessArray[i]) {
          colors.set(i, "green");
        }
      });
      const wordCandidates = wordArray.filter(
        (_word, i) => colors.get(i) !== "green",
      );
      guessArray.forEach((guessLetter, i) => {
        if (colors.has(i)) return;
        console.log(guessLetter, wordCandidates);
        const wordIndex = wordCandidates.indexOf(guessLetter);
        if (wordIndex === -1) return;
        wordCandidates.splice(wordIndex, 1);
        colors.set(i, "yellow");
      });
      const letters = guessArray.map(
        (guessLetter, i): ColoredLetter => ({
          letter: guessLetter,
          color: colors.get(i) || "gray",
        }),
      );
      gameState =
        guess === word ? "success"
        : evaluations.length + 1 === MAX_GUESSES ? "fail"
        : "ongoing";
      const evaluation: Evaluation = { letters, gameState };
      evaluations.push(evaluation);
      return { error: false, evaluation };
    },
  };
};
