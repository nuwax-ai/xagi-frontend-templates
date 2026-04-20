<script setup lang="ts">
import { computed } from 'vue'

interface AspectRatioProps {
  ratio?: number
}

const props = withDefaults(defineProps<AspectRatioProps>(), {
  ratio: 16 / 9,
})

const paddingBottom = computed(() => `${100 / props.ratio}%`)
</script>

<template>
  <div class="relative w-full">
    <div :style="{ paddingBottom }" />
    <div class="absolute inset-0">
      <slot />
    </div>
  </div>
</template>
