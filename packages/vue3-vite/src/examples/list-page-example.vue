<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Input from '@/components/ui/input.vue'
import { useApi } from '@/lib/services'

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
}

interface PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

const page = ref(1)
const pageSize = ref(10)
const keyword = ref('')

const mockFetchProducts = async (): Promise<PaginatedResult<Product>> => {
  await new Promise((resolve) => setTimeout(resolve, 350))

  const source: Product[] = [
    { id: '1', name: 'Product A', price: 99.99, category: 'Electronics', stock: 100 },
    { id: '2', name: 'Product B', price: 199.99, category: 'Apparel', stock: 50 },
    { id: '3', name: 'Product C', price: 49.99, category: 'Grocery', stock: 200 },
  ]

  const filtered = source.filter((item) =>
    item.name.toLowerCase().includes(keyword.value.toLowerCase()),
  )

  return {
    list: filtered,
    total: filtered.length,
    page: page.value,
    pageSize: pageSize.value,
  }
}

const { data, loading, error, refetch } = useApi(mockFetchProducts, { immediate: true })

watch([page, pageSize, keyword], () => {
  void refetch()
})

const totalPages = computed(() => {
  if (!data.value || data.value.total === 0) return 1
  return Math.ceil(data.value.total / pageSize.value)
})

function nextPage(): void {
  if (page.value < totalPages.value) {
    page.value += 1
  }
}

function prevPage(): void {
  if (page.value > 1) {
    page.value -= 1
  }
}
</script>

<template>
  <section class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Products</h1>
      <Button>Add product</Button>
    </div>

    <div class="flex gap-4">
      <Input v-model="keyword" placeholder="Search products..." class="max-w-sm" />
      <Button variant="outline" @click="refetch">Refresh</Button>
    </div>

    <div v-if="error" class="p-4 text-center text-red-500">
      Failed to load: {{ error.message }}
      <Button class="ml-2" @click="refetch">Retry</Button>
    </div>

    <div v-else-if="loading" class="text-center py-8 text-gray-500">Loading...</div>

    <div v-else-if="data && data.list.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="product in data.list" :key="product.id" class="p-4">
        <h3 class="font-semibold text-lg">{{ product.name }}</h3>
        <p class="text-gray-500 text-sm">{{ product.category }}</p>
        <div class="flex justify-between items-center mt-4">
          <span class="text-blue-600 font-bold">${{ product.price }}</span>
          <span class="text-gray-400 text-sm">Stock: {{ product.stock }}</span>
        </div>
        <div class="flex gap-2 mt-4">
          <Button size="sm" variant="outline">Edit</Button>
          <Button size="sm" variant="destructive">Delete</Button>
        </div>
      </Card>
    </div>

    <div v-else class="text-center py-8 text-gray-500">No data</div>

    <div v-if="data && data.total > pageSize" class="flex justify-center gap-2">
      <Button variant="outline" :disabled="page <= 1" @click="prevPage">Previous</Button>
      <span class="px-4 py-2">Page {{ page }} / {{ totalPages }}</span>
      <Button variant="outline" :disabled="page >= totalPages" @click="nextPage">Next</Button>
    </div>
  </section>
</template>
