<script setup lang="ts">
import { computed } from 'vue';
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'radix-vue';
import { cn } from '@/lib/utils';

interface PopoverProps {
  open?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<PopoverProps>(), {
  open: false,
});

const emit = defineEmits<{ 'update:open': [value: boolean] }>();
const contentClass = computed(() =>
  cn(
    'absolute z-50 mt-2 w-72 rounded-md border border-gray-200 bg-white p-4 shadow-md',
    props.class
  )
);
</script>

<template>
  <PopoverRoot :open="open" @update:open="emit('update:open', $event)">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent :class="contentClass" :side-offset="6">
        <slot />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
