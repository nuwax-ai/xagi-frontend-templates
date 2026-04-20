<script setup lang="ts">
import { computed } from 'vue';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue';
import { cn } from '@/lib/utils';

export interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  modelValue: string;
  tabs: TabItem[];
  class?: string;
}

const props = defineProps<TabsProps>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const rootClass = computed(() => cn('w-full', props.class));
</script>

<template>
  <TabsRoot
    :model-value="modelValue"
    :class="rootClass"
    @update:model-value="emit('update:modelValue', String($event))"
  >
    <TabsList
      class="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500"
    >
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all"
        :class="
          modelValue === tab.value
            ? 'bg-white text-gray-900 shadow-sm'
            : 'hover:text-gray-900'
        "
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="mt-2 focus:outline-none"
      force-mount
    >
      <slot :active-tab="modelValue" />
    </TabsContent>
  </TabsRoot>
</template>
