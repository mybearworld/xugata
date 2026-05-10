<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { currentWord } from "./lib/currentWord.ts";
import { type Evaluation, newGame, WORD_LENGTH } from "./lib/game.ts";
import GameGrid from "./components/GameGrid.vue";

const BATELU_LETTER = /^[a-pr-z]$/;

const game = ref(newGame(currentWord()));
const guesses = ref<Evaluation[]>([]);
const input = ref("");

const makeGuess = () => {
  const guess = game.value.guess(input.value);
  if (guess.error) {
    alert(guess.msg);
    return;
  }
  guesses.value.push(guess.evaluation);
  input.value = "";
};

const keydownEventListener = (e: KeyboardEvent) => {
  switch (e.key) {
    case "Backspace":
      e.preventDefault();
      input.value = input.value.slice(0, -1);
      return;
    case "Enter":
      makeGuess();
      break;
    default:
      if (!BATELU_LETTER.test(e.key)) return;
      if (input.value.length === WORD_LENGTH) return;
      input.value += e.key;
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
  <GameGrid :evaluations="guesses" :input />
</template>
