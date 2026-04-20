<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface InputProps {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  modelValue: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const className = computed(() =>
  cn(
    'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class
  )
);
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="className"
    @input="
      emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>
