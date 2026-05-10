<script setup lang="ts">
import { MAX_GUESSES } from "../lib/game";
import { getGuesses } from "../lib/storage";
import { getResetTime } from "../lib/currentWord";

const props = defineProps<{
  word: string;
  success: boolean;
  todaysGuesses: number;
}>();

const guesses = getGuesses();
const totalGuesses = Object.values(guesses).reduce((a, b) => a + b, 0);
const resetTimeString = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
}).format(getResetTime());
</script>

<template>
  <div class="absolute top-0 left-0 z-10 h-screen w-screen bg-black/50"></div>
  <div
    class="absolute top-0 left-0 z-20 flex h-screen w-screen items-center justify-center"
  >
    <div
      class="animate-fly-in mx-4 w-[min(var(--container-2xl),100vw)] rounded-lg bg-stone-800 px-8 py-4"
    >
      <h2 class="text-2xl font-bold">Stats</h2>
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
          Well done! You took {{ todaysGuesses }} guess{{
            todaysGuesses === 1 ? "" : "es"
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
