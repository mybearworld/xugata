<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

const message = defineModel<string>("message");
const counter = defineModel<number>("counter");
const realMessage = ref<string>();
const timeout = ref<number>();

watch(counter, async () => {
  if (timeout.value) clearTimeout(timeout.value);
  timeout.value = setInterval(() => {
    message.value = "";
    counter.value = 0;
  }, 1500);
  realMessage.value = "";
  await nextTick();
  realMessage.value = message.value;
});
</script>

<template>
  <div
    class="animate-fly-in absolute top-5 right-0 left-0 mx-auto w-fit rounded-3xl bg-red-300 px-4 text-stone-950"
    v-if="realMessage"
  >
    {{ realMessage }}
  </div>
</template>
