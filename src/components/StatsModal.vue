<script setup lang="ts">
import {
  MAX_GUESSES,
  stringifyEvaluations,
  type Evaluation,
} from "../lib/game";
import { getGuesses } from "../lib/storage";
import { getResetTime } from "../lib/currentWord";
import { ref } from "vue";

const props = defineProps<{
  word: string;
  success: boolean;
  evaluations: Evaluation[];
}>();

const guesses = getGuesses();
const totalGuesses = Object.values(guesses).reduce((a, b) => a + b, 0);
const resetTimeString = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
}).format(getResetTime());

const hasCopied = ref(false);
const copyStats = () => {
  navigator.clipboard.writeText(stringifyEvaluations(props.evaluations));
  hasCopied.value = true;
  setTimeout(() => {
    hasCopied.value = false;
  }, 1000);
};
</script>

<template>
  <div class="absolute top-0 left-0 z-10 h-screen w-screen bg-black/50"></div>
  <div
    class="absolute top-0 left-0 z-20 flex h-screen w-screen items-center justify-center"
  >
    <div
      class="animate-fly-in mx-4 w-[min(var(--container-2xl),100vw)] rounded-lg bg-stone-800 px-8 py-4"
    >
      <header class="flex items-center">
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
      </header>
      <div class="mb-4">
        <div class="flex items-center gap-2" v-for="guessAmount in MAX_GUESSES">
          <div class="w-2">{{ guessAmount }}</div>
          <div
            class="relative h-5 grow rounded-lg bg-stone-700"
            :title="`${guesses[guessAmount]} out of ${totalGuesses} games`"
          >
            <div
              class="absolute h-5 w-[--width] rounded-lg bg-lime-700"
              :style="{
                width: (guesses[guessAmount] / totalGuesses) * 100 + '%',
              }"
            ></div>
          </div>
        </div>
      </div>
      <p>
        <span v-if="props.success">
          Well done! You took {{ props.evaluations.length }} guess{{
            props.evaluations.length === 1 ? "" : "es"
          }}
          to guess
        </span>
        <span v-else> Better luck next time! The word was</span>
        <a
          :href="`https://batelu.sushii64.com/words?word=${props.word}`"
          class="text-blue-300 uppercase hover:underline"
          target="_blank"
          >{{ props.word }}</a
        >.
      </p>
      <p>
        Want to guess another word tomorrow? The word resets at
        {{ resetTimeString }} your time.
      </p>
    </div>
  </div>
</template>
