<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface ScrollAreaProps {
  class?: string;
  maxHeight?: string;
}

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  maxHeight: '16rem',
});

const className = computed(() =>
  cn('overflow-auto rounded-md border border-gray-200', props.class)
);
</script>

<template>
  <div :class="className" :style="{ maxHeight }">
    <slot />
  </div>
</template>
