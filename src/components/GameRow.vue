<script setup lang="ts">
import type { Evaluation } from "../lib/game";
import { WORD_LENGTH } from "../lib/game";

const props = defineProps<{
  evaluation: Evaluation | undefined;
  input: string;
  renderInput: boolean;
}>();
</script>

<template>
  <div class="flex gap-1">
    <div
      class="flex h-12 w-12 items-center justify-center border text-2xl uppercase transition-colors delay-(--transition-delay) duration-200"
      :style="{
        '--transition-delay': 300 * (col - 1) + 'ms',
      }"
      :class="{
        'rounded border-stone-700 font-bold': !evaluation,
        'border-transparent': evaluation,
        'bg-yellow-700 font-bold': evaluation?.[col - 1]?.color === 'yellow',
        'bg-lime-800 font-bold': evaluation?.[col - 1]?.color === 'green',
        'bg-stone-700 font-bold': evaluation?.[col - 1]?.color === 'gray',
      }"
      v-for="col in WORD_LENGTH"
    >
      {{
        evaluation?.[col - 1]?.letter ||
        (props.renderInput ? props.input[col - 1] || "" : "")
      }}
    </div>
  </div>
</template>
