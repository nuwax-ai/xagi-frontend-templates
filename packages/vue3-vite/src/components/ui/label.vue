<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface LabelProps {
  for?: string
  class?: string
}

const props = defineProps<LabelProps>()

const className = computed(() => cn('text-sm font-medium leading-none', props.class))
</script>

<template>
  <label :for="for" :class="className">
    <slot />
  </label>
</template>
