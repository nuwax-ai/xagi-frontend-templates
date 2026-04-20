<script setup lang="ts">
import { computed } from 'vue';
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'radix-vue';
import { cn } from '@/lib/utils';

interface TooltipProps {
  text: string;
  class?: string;
  delayDuration?: number;
}

const props = defineProps<TooltipProps>();
const className = computed(() =>
  cn(
    'z-50 overflow-hidden rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-md',
    props.class
  )
);
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration ?? 150">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent :class="className" side="top" :side-offset="6">
          {{ text }}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
