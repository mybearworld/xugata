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
      class="flex h-8 w-8 items-center justify-center uppercase"
      :class="{
        'rounded border border-stone-700 bg-stone-200': !evaluation,
        'bg-amber-400': evaluation?.[col - 1]?.color === 'yellow',
        'bg-lime-400': evaluation?.[col - 1]?.color === 'green',
        'bg-stone-400': evaluation?.[col - 1]?.color === 'gray',
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
