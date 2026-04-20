<script setup lang="ts">
import type { Component } from 'vue'
import { Cpu, MessageCircle, Sparkles } from 'lucide-vue-next'

/**
 * Step metadata mirrors the React template structure:
 * - number: visual sequence badge
 * - title: short action label
 * - description: kept for future extension and parity with source template data
 * - icon: Vue component from lucide-vue-next
 */
interface Step {
  number: string
  title: string
  description: string
  icon: Component
}

// Keep wording aligned with packages/react-vite/src/pages/Home.tsx.
const steps: Step[] = [
  {
    number: '1',
    title: 'Describe',
    description: 'Tell the assistant what you want in plain language',
    icon: MessageCircle,
  },
  {
    number: '2',
    title: 'Build',
    description: 'Let AI scaffold UI and logic for you',
    icon: Cpu,
  },
  {
    number: '3',
    title: 'Preview',
    description: 'See the result update as you iterate',
    icon: Sparkles,
  },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
    <div class="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-center">
      <div class="text-center mb-8">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3">Smart app builder</h1>
        <p class="text-base sm:text-lg text-black mb-6">
          Describe your idea once and ship polished web UI faster - with help from your coding assistant.
        </p>
      </div>

      <!-- Keep layout and spacing closely aligned with react-vite Home.tsx. -->
      <div class="mb-8">
        <h2 class="text-lg sm:text-xl font-bold text-black mb-4 text-center">Get started in three steps</h2>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
          <div v-for="(step, index) in steps" :key="index" class="flex items-center gap-3">
            <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              {{ step.number }}
            </div>
            <div class="flex items-center gap-2">
              <component :is="step.icon" class="w-5 h-5 text-blue-600" />
              <h3 class="font-semibold text-black text-sm">{{ step.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="py-3 sm:py-4 px-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <p class="text-xs sm:text-sm text-gray-600">Built for modern web development</p>
        <p class="text-xs sm:text-sm text-gray-600">This is a template page - replace it with your real experience.</p>
      </div>
    </div>
  </div>
</template>
