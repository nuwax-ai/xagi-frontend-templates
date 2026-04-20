<script setup lang="ts">
import { ref } from 'vue';

export interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItemData[];
}

defineProps<AccordionProps>();
const openId = ref<string | null>(null);

function toggle(id: string): void {
  openId.value = openId.value === id ? null : id;
}
</script>

<template>
  <div class="w-full rounded-md border border-gray-200">
    <div
      v-for="item in items"
      :key="item.id"
      class="border-b border-gray-200 last:border-b-0"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between p-4 text-left text-sm font-medium"
        @click="toggle(item.id)"
      >
        {{ item.title }}
        <span>{{ openId === item.id ? '-' : '+' }}</span>
      </button>
      <div v-if="openId === item.id" class="px-4 pb-4 text-sm text-gray-600">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>
