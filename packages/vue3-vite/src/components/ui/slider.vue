<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface SliderProps {
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  class?: string;
}

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
});

const emit = defineEmits<{ 'update:modelValue': [value: number] }>();
const className = computed(() => cn('w-full', props.class));
</script>

<template>
  <input
    type="range"
    :class="className"
    :value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    @input="
      emit(
        'update:modelValue',
        Number(($event.target as HTMLInputElement).value)
      )
    "
  />
</template>
