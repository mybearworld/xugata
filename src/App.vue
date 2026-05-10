<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { currentWord } from "./lib/currentWord.ts";
import {
  type Evaluation,
  type GameState,
  newGame,
  WORD_LENGTH,
} from "./lib/game.ts";
import GameGrid from "./components/GameGrid.vue";
import MobileKeyboard from "./components/MobileKeyboard.vue";
import StatsModal from "./components/StatsModal.vue";
import { ANIMATION_DURATION } from "./lib/animationDuration.ts";

const BATELU_LETTER = /^[a-pr-z]$/;

const word = currentWord();
const game = ref(newGame(word));
const guesses = ref<Evaluation[]>([]);
const gameState = ref<GameState>("ongoing");
const input = ref("");
const animationOngoing = ref(false);

const makeGuess = () => {
  const guess = game.value.guess(input.value);
  if (guess.error) {
    alert(guess.msg);
    return;
  }
  guesses.value.push(guess.evaluation);
  gameState.value = guess.gameState;
  input.value = "";
  animationOngoing.value = true;
  setTimeout(() => {
    animationOngoing.value = false;
  }, ANIMATION_DURATION);
};

const addLetter = (letter: string) => {
  if (animationOngoing.value) return;
  if (!BATELU_LETTER.test(letter)) return;
  if (input.value.length === WORD_LENGTH) return;
  input.value += letter;
};
const backspace = () => {
  input.value = input.value.slice(0, -1);
};

const keydownEventListener = (e: KeyboardEvent) => {
  if (gameState.value !== "ongoing") return;
  switch (e.key) {
    case "Backspace":
      e.preventDefault();
      backspace();
      return;
    case "Enter":
      makeGuess();
      break;
    default:
      addLetter(e.key);
  }
};
onMounted(() => {
  document.body.addEventListener("keydown", keydownEventListener);
});
onBeforeUnmount(() => {
  document.body.removeEventListener("keydown", keydownEventListener);
});
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center gap-5">
    <h1 class="text-2xl">xuga wordyl</h1>
    <GameGrid :evaluations="guesses" :input />
    <MobileKeyboard
      @type="addLetter"
      @backspace="backspace"
      @submit="makeGuess"
    />
    <StatsModal
      :word="word"
      :success="gameState === 'success'"
      :evaluations="guesses"
      v-if="gameState !== 'ongoing' && !animationOngoing"
    />
  </div>
</template>
