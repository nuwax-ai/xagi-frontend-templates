<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

interface RadioGroupProps {
  modelValue?: string
  options: RadioOption[]
  name: string
  class?: string
}

const props = defineProps<RadioGroupProps>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const className = computed(() => cn('grid gap-2', props.class))
</script>

<template>
  <div :class="className">
    <label
      v-for="option in options"
      :key="option.value"
      class="flex items-center gap-2 text-sm"
      :class="option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
    >
      <input
        type="radio"
        :name="name"
        :value="option.value"
        :checked="modelValue === option.value"
        :disabled="option.disabled"
        class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
        @change="emit('update:modelValue', option.value)"
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>
