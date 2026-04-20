<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface SwitchProps {
  modelValue?: boolean;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const rootClass = computed(() =>
  cn(
    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
    props.modelValue ? 'bg-blue-600' : 'bg-gray-300',
    props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    props.class
  )
);

function toggle(): void {
  if (!props.disabled) emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <button type="button" :disabled="disabled" :class="rootClass" @click="toggle">
    <span
      class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
      :class="modelValue ? 'translate-x-5' : 'translate-x-1'"
    />
  </button>
</template>
