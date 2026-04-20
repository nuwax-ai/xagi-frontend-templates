<script setup lang="ts">
import { computed } from 'vue'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'radix-vue'
import { cn } from '@/lib/utils'

interface DialogProps {
  open?: boolean
  title?: string
  description?: string
  class?: string
}

const props = withDefaults(defineProps<DialogProps>(), {
  open: false,
})

const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const contentClass = computed(() => cn('w-full max-w-lg rounded-lg bg-white p-6 shadow-lg', props.class))
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent :class="cn('fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 p-6', contentClass)">
        <div v-if="title || description" class="grid gap-1.5">
          <DialogTitle v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</DialogTitle>
          <DialogDescription v-if="description" class="text-sm text-gray-500">{{ description }}</DialogDescription>
        </div>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
