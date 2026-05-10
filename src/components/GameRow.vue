<script setup lang="ts">
import type { ColoredLetter } from "../lib/game";
import { WORD_LENGTH } from "../lib/game";

const props = defineProps<{
  row: ColoredLetter[] | undefined;
  input: string;
  renderInput: boolean;
}>();
</script>

<template>
  <div class="flex gap-1">
    <div
      class="flex h-8 w-8 items-center justify-center uppercase"
      :class="{
        'rounded border border-stone-700 bg-stone-200': !row,
        'bg-amber-400': row?.[col - 1]?.color === 'yellow',
        'bg-lime-400': row?.[col - 1]?.color === 'green',
        'bg-stone-400': row?.[col - 1]?.color === 'gray',
      }"
      v-for="col in WORD_LENGTH"
    >
      {{
        row?.[col - 1]?.letter ||
        (props.renderInput ? props.input[col - 1] || "" : "")
      }}
    </div>
  </div>
</template>
