<script setup lang="ts">
import Toggle from './toggle.vue'

export interface ToggleOption {
  label: string
  value: string
}

interface ToggleGroupProps {
  modelValue?: string[]
  options: ToggleOption[]
  multiple?: boolean
}

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  modelValue: () => [],
  multiple: true,
})

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

function onToggle(value: string, active: boolean): void {
  if (props.multiple) {
    const next = active
      ? [...props.modelValue, value]
      : props.modelValue.filter((item) => item !== value)
    emit('update:modelValue', next)
    return
  }

  emit('update:modelValue', active ? [value] : [])
}
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <Toggle
      v-for="option in options"
      :key="option.value"
      :model-value="modelValue.includes(option.value)"
      @update:model-value="onToggle(option.value, $event)"
    >
      {{ option.label }}
    </Toggle>
  </div>
</template>
