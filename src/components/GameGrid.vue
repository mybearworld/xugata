<script setup lang="ts">
import type { Evaluation } from "../lib/game";
import GameRow from "./GameRow.vue";
import { MAX_GUESSES } from "../lib/game";

const props = defineProps<{
  evaluations: Evaluation[];
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <GameRow
      :row="props.evaluations[row - 1]?.letters"
      v-for="row in MAX_GUESSES"
    />
  </div>
</template>
