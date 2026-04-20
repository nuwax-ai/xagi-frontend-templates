<script setup lang="ts">
export interface MenubarItem {
  label: string
  value: string
}

interface MenubarProps {
  items: MenubarItem[]
}

defineProps<MenubarProps>()
const emit = defineEmits<{ select: [value: string] }>()
</script>

<template>
  <div class="inline-flex h-10 items-center gap-1 rounded-md border border-gray-200 bg-white p-1">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="rounded-sm px-3 py-1.5 text-sm hover:bg-gray-100"
      @click="emit('select', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
