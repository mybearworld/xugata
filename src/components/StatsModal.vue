<script setup lang="ts">
import { MAX_GUESSES, stringifyGame, type Game } from "../lib/game";
import { getGuesses } from "../lib/storage";
import { getResetTime } from "../lib/currentWord";
import { onBeforeUnmount, onMounted, ref } from "vue";
import Modal from "./Modal.vue";

const props = defineProps<{
  game: Game;
}>();

const MILLISECOND = 1;
const SECOND = MILLISECOND * 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const open = defineModel<boolean>("open");
const close = () => {
  open.value = false;
};

const guesses = getGuesses();
const totalGuesses = Object.values(guesses).reduce((a, b) => a + b, 0);
const resetTime = getResetTime();
const resetTimeString = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
}).format(resetTime);
const resetTimeInterval = ref<number>();
const resetTimeCountdown = ref<string>();
onMounted(() => {
  resetTimeInterval.value = setInterval(() => {
    const now = Date.now();
    const reset = resetTime.getTime();
    if (now >= reset) {
      resetTimeCountdown.value = undefined;
      return;
    }
    resetTimeCountdown.value = undefined;
    const dist = reset - now;
    const hours = Math.floor(dist / HOUR);
    const minutes = Math.floor((dist - hours * HOUR) / MINUTE);
    const seconds = Math.floor(
      (dist - hours * HOUR - minutes * MINUTE) / SECOND,
    );
    resetTimeCountdown.value =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
  }, 100);
});
onBeforeUnmount(() => {
  clearInterval(resetTimeInterval.value);
});

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
          <path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          <path d="M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          <path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          <path d="M8.7 10.7l6.6 -3.4" />
          <path d="M8.7 13.3l6.6 3.4" />
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
    <template v-if="resetTimeCountdown">
      <p>Want to guess another word tomorrow? The word resets in:</p>
      <p class="text-center">
        <span class="text-3xl">{{ resetTimeCountdown }}</span> <br />
        <span class="text-sm">({{ resetTimeString }} your time)</span>
      </p>
    </template>
    <template v-else>
      <p>Want to guess another word? Reload to play today's word.</p>
    </template>
  </Modal>
</template>
