<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  class?: string;
}

defineProps<AvatarProps>();
const imageError = ref(false);
</script>

<template>
  <div
    :class="
      cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        $props.class
      )
    "
  >
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt ?? 'avatar'"
      class="aspect-square h-full w-full"
      @error="imageError = true"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600"
    >
      {{ fallback ?? 'U' }}
    </div>
  </div>
</template>
