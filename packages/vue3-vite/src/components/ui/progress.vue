<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value?: number;
  max?: number;
  class?: string;
}

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  max: 100,
});

const clamped = computed(() => Math.max(0, Math.min(props.value, props.max)));
const width = computed(() => `${(clamped.value / props.max) * 100}%`);
</script>

<template>
  <div
    :class="
      cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-gray-200',
        props.class
      )
    "
  >
    <div class="h-full bg-blue-600 transition-all" :style="{ width }" />
  </div>
</template>
