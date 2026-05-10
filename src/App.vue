<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { currentWord } from "./lib/currentWord.ts";
import { newGame, WORD_LENGTH } from "./lib/game.ts";
import GameGrid from "./components/GameGrid.vue";
import MobileKeyboard from "./components/MobileKeyboard.vue";
import StatsModal from "./components/StatsModal.vue";
import HowToPlayModal from "./components/HowToPlayModal.vue";
import { ANIMATION_DURATION } from "./lib/animationDuration.ts";
import {
  getGameProgress,
  getSeenHowToPlay,
  setSeenHowToPlay,
} from "./lib/storage.ts";

const BATELU_LETTER = /^[a-pr-z]$/;

const word = currentWord();
const game = reactive(newGame(word, getGameProgress()));
const input = ref("");
const animationOngoing = ref(false);
const howToPlayOpen = ref(!getSeenHowToPlay());
const statsOpen = ref(true);
const canShowStats = computed(
  () => game.state !== "ongoing" && !animationOngoing.value,
);
watch(howToPlayOpen, () => {
  if (!howToPlayOpen.value) setSeenHowToPlay();
});

const openHowToPlay = () => {
  howToPlayOpen.value = true;
};
const openStats = () => {
  statsOpen.value = true;
};

const makeGuess = () => {
  const guess = game.guess(input.value);
  if (guess.error) {
    alert(guess.msg);
    return;
  }
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
  if (game.state !== "ongoing") return;
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
    <header class="text-center">
      <h1 class="text-2xl">Xugata</h1>
      <div>
        <button
          class="cursor-pointer text-blue-300 hover:underline"
          @click="openHowToPlay"
        >
          How to play
        </button>
        <template v-if="canShowStats">
          ·
          <button
            class="cursor-pointer text-blue-300 hover:underline"
            @click="openStats"
          >
            Statistics
          </button>
        </template>
      </div>
    </header>
    <GameGrid :evaluations="game.evaluations" :input />
    <MobileKeyboard
      @type="addLetter"
      @backspace="backspace"
      @submit="makeGuess"
    />
    <HowToPlayModal v-model:open="howToPlayOpen" />
    <StatsModal :game="game" v-model:open="statsOpen" v-if="canShowStats" />
  </div>
</template>
