<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  modelValue?: boolean;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const className = computed(() =>
  cn(
    'h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    props.class
  )
);
</script>

<template>
  <input
    type="checkbox"
    :checked="modelValue"
    :disabled="disabled"
    :class="className"
    @change="
      emit('update:modelValue', ($event.target as HTMLInputElement).checked)
    "
  />
</template>
