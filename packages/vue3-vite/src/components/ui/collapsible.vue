<script setup lang="ts">
interface CollapsibleProps {
  open?: boolean
  title?: string
}

withDefaults(defineProps<CollapsibleProps>(), {
  open: false,
  title: 'Toggle section',
})

const emit = defineEmits<{ 'update:open': [value: boolean] }>()
</script>

<template>
  <div class="rounded-md border border-gray-200 p-3">
    <button type="button" class="text-sm font-medium" @click="emit('update:open', !open)">
      {{ title }}
    </button>
    <div v-if="open" class="mt-3">
      <slot />
    </div>
  </div>
</template>
