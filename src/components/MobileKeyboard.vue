<script setup lang="ts">
import type { LetterState } from "../lib/game";

const props = defineProps<{
  letterState: LetterState;
}>();
const emit = defineEmits<{
  type: [letter: string];
  backspace: [];
  submit: [];
}>();

const colorFor = (letter: string) => {
  const state = props.letterState.get(letter);
  if (state === "gray" || letter === "q") return "bg-stone-700";
  if (state === "green") return "bg-lime-800";
  if (state === "yellow") return "bg-yellow-700";
  return "bg-stone-600";
};
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <div class="flex gap-1">
      <button
        class="flex h-12 w-8 cursor-pointer items-center justify-center text-xl uppercase"
        :class="colorFor(letter)"
        @click="() => emit('type', letter)"
        v-for="letter in 'qwertyuiop'"
      >
        {{ letter }}
      </button>
    </div>
    <div class="flex gap-1">
      <button
        class="flex h-12 w-8 cursor-pointer items-center justify-center text-xl uppercase"
        :class="colorFor(letter)"
        @click="() => emit('type', letter)"
        v-for="letter in 'asdfghjkl'"
      >
        {{ letter }}
      </button>
    </div>
    <div class="flex gap-1">
      <button
        class="flex h-12 w-8 cursor-pointer items-center justify-center bg-stone-600 text-xl uppercase"
        @click="emit('backspace')"
        aria-label="Backspace"
      >
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
          <path
            d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5l11 0"
          />
          <path d="M12 10l4 4m0 -4l-4 4" />
        </svg>
      </button>
      <button
        class="flex h-12 w-8 cursor-pointer items-center justify-center text-xl uppercase"
        :class="colorFor(letter)"
        @click="() => emit('type', letter)"
        v-for="letter in 'zxcvbnm'"
      >
        {{ letter }}
      </button>
      <button
        class="flex h-12 w-8 cursor-pointer items-center justify-center bg-stone-600 text-xl uppercase"
        @click="() => emit('submit')"
        aria-label="Submit"
      >
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
          <path d="M18 6v6a3 3 0 0 1 -3 3h-10l4 -4m0 8l-4 -4" />
        </svg>
      </button>
    </div>
  </div>
</template>
