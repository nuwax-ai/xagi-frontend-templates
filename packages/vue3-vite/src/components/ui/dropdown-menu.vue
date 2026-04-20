<script setup lang="ts">
import { computed } from 'vue';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownMenuProps {
  open?: boolean;
  items: DropdownItem[];
  class?: string;
}

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  open: false,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  select: [value: string];
}>();

const className = computed(() =>
  cn(
    'absolute z-50 mt-2 min-w-[10rem] rounded-md border border-gray-200 bg-white p-1 shadow-md',
    props.class
  )
);
</script>

<template>
  <DropdownMenuRoot :open="open" @update:open="emit('update:open', $event)">
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent :class="className" :side-offset="6">
        <DropdownMenuItem
          v-for="item in items"
          :key="item.value"
          class="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none data-[highlighted]:bg-gray-100"
          :class="item.disabled ? 'opacity-50 cursor-not-allowed' : ''"
          :disabled="item.disabled"
          @select="emit('select', item.value)"
        >
          {{ item.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
