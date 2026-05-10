<script setup lang="ts">
import { MAX_GUESSES, stringifyGame, type Game } from "../lib/game";
import { getGuesses } from "../lib/storage";
import { getResetTime } from "../lib/currentWord";
import { ref } from "vue";
import Modal from "./Modal.vue";

const props = defineProps<{
  game: Game;
}>();

const open = defineModel<boolean>("open");
const close = () => {
  open.value = false;
};

const guesses = getGuesses();
const totalGuesses = Object.values(guesses).reduce((a, b) => a + b, 0);
const resetTimeString = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
}).format(getResetTime());

const hasCopied = ref(false);
const copyStats = () => {
  navigator.clipboard.writeText(stringifyGame(props.game));
  hasCopied.value = true;
  setTimeout(() => {
    hasCopied.value = false;
  }, 1000);
};
</script>

<template>
  <Modal v-model:open="open">
    <header class="flex items-center gap-2">
      <h2 class="grow text-2xl font-bold">Stats</h2>
      <!-- Tabler icons; MIT -->
      <button
        class="cursor-pointer"
        aria-label="Copy stats"
        @click="copyStats"
        :disabled="hasCopied"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-if="hasCopied"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l5 5l10 -10" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-else
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"
          />
          <path
            d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
          />
        </svg>
      </button>
      <button aria-label="Close" class="cursor-pointer" @click="close">
        <!-- Tabler icons; MIT -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </header>
    <div class="mb-4">
      <div class="flex items-center gap-2" v-for="guessAmount in MAX_GUESSES">
        <div class="w-2">{{ guessAmount }}</div>
        <div
          class="relative h-5 grow rounded-lg bg-stone-700"
          :title="`${guesses[guessAmount] ?? 0} out of ${totalGuesses} game${totalGuesses === 1 ? '' : 's'}`"
        >
          <div
            class="absolute h-5 w-[--width] rounded-lg"
            :class="{
              'bg-lime-700': props.game.evaluations.length === guessAmount,
              'bg-stone-500': props.game.evaluations.length !== guessAmount,
            }"
            :style="{
              width: ((guesses[guessAmount] ?? 0) / totalGuesses) * 100 + '%',
            }"
          ></div>
        </div>
      </div>
    </div>
    <p>
      <span v-if="props.game.state === 'success'">
        Well done! You took {{ props.game.evaluations.length }} guess{{
          props.game.evaluations.length === 1 ? "" : "es"
        }}
        to guess
      </span>
      <span v-else>Better luck next time! The word was{{ " " }}</span>
      <a
        :href="`https://batelu.sushii64.com/words?word=${props.game.word.word}`"
        class="text-blue-300 uppercase hover:underline"
        target="_blank"
        >{{ props.game.word.word }}</a
      >.
    </p>
    <p>
      Want to guess another word tomorrow? The word resets at
      {{ resetTimeString }} your time.
    </p>
  </Modal>
</template>
