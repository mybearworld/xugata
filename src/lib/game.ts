import data from "./data.json";
import { addGuessAmount } from "./storage";

export type Evaluation = ColoredLetter[];
export type ColoredLetter = {
  letter: string;
  color: LetterColor;
};
export type LetterColor = "gray" | "green" | "yellow";
export type GameState = "ongoing" | "success" | "fail";

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export const newGame = (word: string) => {
  let gameState: GameState = "ongoing";
  const evaluations: Evaluation[] = [];
  return {
    guess: (
      guess: string,
    ):
      | { error: true; msg: string }
      | { error: false; evaluation: Evaluation; gameState: GameState } => {
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
        const wordIndex = wordCandidates.indexOf(guessLetter);
        if (wordIndex === -1) return;
        wordCandidates.splice(wordIndex, 1);
        colors.set(i, "yellow");
      });
      const evaluation = guessArray.map(
        (guessLetter, i): ColoredLetter => ({
          letter: guessLetter,
          color: colors.get(i) || "gray",
        }),
      );
      evaluations.push(evaluation);
      gameState =
        guess === word ? "success"
        : evaluations.length + 1 === MAX_GUESSES ? "fail"
        : "ongoing";
      if (gameState === "success") {
        addGuessAmount(evaluations.length);
      }
      return { error: false, evaluation, gameState };
    },
  };
};
