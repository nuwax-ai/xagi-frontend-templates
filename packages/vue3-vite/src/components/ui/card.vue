<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface CardProps {
  class?: string
}

const props = defineProps<CardProps>()
const className = computed(() => cn('rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm', props.class))
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>
