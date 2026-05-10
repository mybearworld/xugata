<script setup lang="ts">
const open = defineModel<boolean>("open");
const close = () => {
  open.value = false;
};
</script>

<template>
  <div
    class="absolute top-0 left-0 z-10 h-screen w-screen bg-black/50"
    v-if="open"
  ></div>
  <div
    class="absolute top-0 left-0 z-20 flex h-screen w-screen items-center justify-center"
    @click="close"
    v-if="open"
  >
    <div
      class="animate-fly-in mx-4 w-[min(var(--container-2xl),100vw)] rounded-lg bg-stone-800 px-8 py-4"
      @click.stop
    >
      <slot />
    </div>
  </div>
</template>
