<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface ToggleProps {
  modelValue?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<ToggleProps>(), {
  modelValue: false,
});

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const className = computed(() =>
  cn(
    'inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
    props.modelValue
      ? 'bg-gray-200 text-gray-900'
      : 'bg-transparent hover:bg-gray-100',
    props.class
  )
);
</script>

<template>
  <button
    type="button"
    :class="className"
    @click="emit('update:modelValue', !modelValue)"
  >
    <slot />
  </button>
</template>
