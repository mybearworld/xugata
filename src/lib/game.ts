import type { Word } from "./currentWord";
import data from "./data.json";
import { addGuessAmount, setGameProgress } from "./storage";

export type Game = {
  state: GameState;
  evaluations: Evaluation[];
  guesses: string[];
  letterState: LetterState;
  word: Word;
  guess: (guess: string) => { error: true; msg: string } | { error: false };
};
export type Evaluation = ColoredLetter[];
export type ColoredLetter = {
  letter: string;
  color: LetterColor;
};
export type LetterColor = "gray" | "green" | "yellow";
export type GameState = "ongoing" | "success" | "fail";
export type LetterState = Map<string, LetterColor>;

const higherColor = (a: LetterColor | undefined, b: LetterColor) => {
  if (!a) return b;
  if (a === "green" || b === "green") return "green";
  if (a === "yellow" || b === "yellow") return "yellow";
  return "gray";
};

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export const stringifyGame = (game: Game) => {
  const lines: string[] = [
    `Xugata #${game.word.number} — ${game.state === "fail" ? "X" : game.evaluations.length}/${MAX_GUESSES}`,
  ];
  game.evaluations.forEach((evaluation) => {
    lines.push(
      evaluation
        .map((letter) => {
          if (letter.color === "green") return "🟩";
          if (letter.color === "yellow") return "🟨";
          if (letter.color === "gray") return "⬛";
        })
        .join(""),
    );
  });
  lines.push("https://mybearworld.github.io/xugata");
  return lines.join("\n");
};

export const newGame = (word: Word, guesses: string[] | null) => {
  const game: Game = {
    state: "ongoing",
    evaluations: [],
    guesses: [],
    letterState: new Map(),
    word,
    guess(guess) {
      if (this.state !== "ongoing") {
        return { error: true, msg: "The game's already over!" };
      }
      if (guess.length < WORD_LENGTH) {
        return { error: true, msg: "That word is too short!" };
      }
      if (guess.length > WORD_LENGTH) {
        return { error: true, msg: "That word is too long!" };
      }
      if (
        !Object.values(data.words).some((words) =>
          words.some((word) => word === guess),
        )
      ) {
        return { error: true, msg: "That word is not in the dictionary!" };
      }
      const colors = new Map<number, LetterColor>();
      const wordArray = [...word.word];
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
      evaluation.forEach((evaluation) => {
        this.letterState.set(
          evaluation.letter,
          higherColor(
            this.letterState.get(evaluation.letter),
            evaluation.color,
          ),
        );
      });
      this.evaluations.push(evaluation);
      this.state =
        guess === word.word ? "success"
        : this.evaluations.length === MAX_GUESSES ? "fail"
        : "ongoing";
      if (this.state === "success") {
        addGuessAmount(this.evaluations.length);
      }
      this.guesses.push(guess);
      setGameProgress(this.guesses);
      return { error: false };
    },
  };
  guesses?.forEach((guess) => {
    game.guess(guess);
  });
  return game;
};
