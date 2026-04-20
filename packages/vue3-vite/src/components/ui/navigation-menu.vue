<script setup lang="ts">
export interface NavigationItem {
  label: string
  href: string
}

interface NavigationMenuProps {
  items: NavigationItem[]
}

defineProps<NavigationMenuProps>()
</script>

<template>
  <nav class="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2">
    <a
      v-for="item in items"
      :key="item.href"
      :href="item.href"
      class="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {{ item.label }}
    </a>
  </nav>
</template>
