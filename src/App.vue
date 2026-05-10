<script setup lang="ts">
import { ref } from "vue";
import { currentWord } from "./lib/currentWord.ts";
import { type Evaluation, newGame } from "./lib/game.ts";
import GameGrid from "./components/GameGrid.vue";

const game = ref(newGame(currentWord()));
const guesses = ref<Evaluation[]>([]);
const input = ref("");

const submit = (e: SubmitEvent) => {
  e.preventDefault();
  const guess = game.value.guess(input.value);
  if (guess.error) {
    alert(guess.msg);
    return;
  }
  guesses.value.push(guess.evaluation);
};
</script>

<template>
  <form @submit="submit">
    <input class="border" type="text" v-model="input" />
    <button>Submit</button>
  </form>
  <GameGrid :evaluations="guesses" />
</template>
