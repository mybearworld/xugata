<script setup lang="ts">
import type { Evaluation } from "../lib/game";
import GameRow from "./GameRow.vue";
import { MAX_GUESSES } from "../lib/game";

const props = defineProps<{
  evaluations: Evaluation[];
  input: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <GameRow
      :row="props.evaluations[row - 1]?.letters"
      :input="props.input"
      :renderInput="props.evaluations.length === row - 1"
      v-for="row in MAX_GUESSES"
    />
  </div>
</template>
