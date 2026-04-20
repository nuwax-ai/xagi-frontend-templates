<script setup lang="ts">
import FormExample from '@/examples/form-example.vue'
import ListPageExample from '@/examples/list-page-example.vue'
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Vue UI Examples</h1>
        <p class="mt-2 text-sm text-gray-600">
          Smoke playground for the generated Vue UI library, API helpers, and Zod-based form flow.
        </p>
      </header>

      <section class="mb-10 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-semibold text-gray-900">Form Example (Zod + vee-validate)</h2>
        <FormExample />
      </section>

      <section class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-semibold text-gray-900">List Page Example</h2>
        <ListPageExample />
      </section>
    </div>
  </main>
</template>
