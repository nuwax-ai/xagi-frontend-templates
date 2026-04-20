<script setup lang="ts">
import { computed } from 'vue';
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue';
import { Check, ChevronDown } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  modelValue?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: '',
  placeholder: 'Select an option',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const className = computed(() =>
  cn(
    'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class
  )
);
</script>

<template>
  <SelectRoot
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', String($event))"
  >
    <SelectTrigger :class="className" :disabled="disabled">
      <SelectValue :placeholder="placeholder" />
      <SelectIcon>
        <ChevronDown class="h-4 w-4 opacity-60" />
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md"
      >
        <SelectViewport class="p-1">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <span
              class="absolute left-2 inline-flex h-3.5 w-3.5 items-center justify-center"
            >
              <SelectItemIndicator>
                <Check class="h-4 w-4" />
              </SelectItemIndicator>
            </span>
            <SelectItemText>{{ option.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
