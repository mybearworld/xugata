<script setup lang="ts">
import Modal from "./Modal.vue";
import GameRow from "./GameRow.vue";

const open = defineModel<boolean>("open");
const close = () => {
  open.value = false;
};
</script>

<template>
  <Modal v-model:open="open">
    <div class="flex flex-col gap-2">
      <header class="flex items-center gap-2">
        <h2 class="grow text-2xl font-bold">How to play</h2>
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
      <p>
        You get six tries to guess a random five letter word - in
        <a
          href="https://batelu.sushii64.com"
          target="_blank"
          class="text-blue-300 hover:underline"
          >Batelu</a
        >. Each time you'll guess, each letter will receive a certain color.
        They will help you figure out the word.
      </p>
      <GameRow
        :evaluation="[
          { letter: 'p', color: 'green' },
          { letter: 'o', color: 'gray' },
          { letter: 'g', color: 'gray' },
          { letter: 'h', color: 'gray' },
          { letter: 'u', color: 'gray' },
        ]"
        :input="undefined"
      />
      <p>
        This tells you that the letters 'o', 'g', 'h', and 'u' don't appear in
        the word at all. The letter 'p' does appear, and it is the first letter
        of the word.
      </p>
      <GameRow
        :evaluation="[
          { letter: 'b', color: 'gray' },
          { letter: 'a', color: 'gray' },
          { letter: 'x', color: 'yellow' },
          { letter: 'e', color: 'gray' },
          { letter: 'n', color: 'gray' },
        ]"
        :input="undefined"
      />
      <p>
        This tells you that the letters 'b', 'a', 'e', and 'n' don't appear in
        the word at all. The letter 'x' does appear, but it is not the third
        letter in the word.
      </p>
    </div>
  </Modal>
</template>
