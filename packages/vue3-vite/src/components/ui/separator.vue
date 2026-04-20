<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  class?: string;
}

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
});

const className = computed(() =>
  cn(
    props.orientation === 'horizontal'
      ? 'h-px w-full bg-gray-200'
      : 'h-full w-px bg-gray-200',
    props.class
  )
);
</script>

<template>
  <div :class="className" role="separator" :aria-orientation="orientation" />
</template>
