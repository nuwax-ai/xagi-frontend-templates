<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Select from '@/components/ui/select.vue'
import Checkbox from '@/components/ui/checkbox.vue'
import Label from '@/components/ui/label.vue'

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['admin', 'user'], { required_error: 'Select a role' }),
  agreeTerms: z.boolean().refine((value) => value === true, 'You must accept the terms'),
})

type UserFormValues = z.infer<typeof userFormSchema>

const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
]

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm<UserFormValues>({
  validationSchema: toTypedSchema(userFormSchema),
  initialValues: {
    name: '',
    email: '',
    role: undefined,
    agreeTerms: false,
  },
})

const [name] = defineField('name')
const [email] = defineField('email')
const [role] = defineField('role')
const [agreeTerms] = defineField('agreeTerms')

const submitLabel = computed(() => (isSubmitting.value ? 'Submitting...' : 'Submit'))

const onSubmit = handleSubmit(async (values) => {
  console.log('Form values:', values)
  resetForm()
})
</script>

<template>
  <form class="space-y-6 p-6 rounded-lg border border-gray-200 bg-white" @submit.prevent="onSubmit">
    <div class="space-y-2">
      <Label for="name">Name</Label>
      <Input id="name" v-model="name" placeholder="Your name" />
      <p v-if="errors.name" class="text-sm font-medium text-red-500">{{ errors.name }}</p>
    </div>

    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input id="email" v-model="email" type="email" placeholder="you@example.com" />
      <p class="text-sm text-gray-500">We will never share your email.</p>
      <p v-if="errors.email" class="text-sm font-medium text-red-500">{{ errors.email }}</p>
    </div>

    <div class="space-y-2">
      <Label for="role">Role</Label>
      <Select id="role" v-model="role" :options="roleOptions" placeholder="Choose a role" />
      <p v-if="errors.role" class="text-sm font-medium text-red-500">{{ errors.role }}</p>
    </div>

    <div class="flex flex-row items-start space-x-3 space-y-0">
      <Checkbox id="agreeTerms" v-model="agreeTerms" class="mt-1" />
      <div class="space-y-1 leading-none">
        <Label for="agreeTerms">I agree to the terms and privacy policy</Label>
        <p v-if="errors.agreeTerms" class="text-sm font-medium text-red-500">{{ errors.agreeTerms }}</p>
      </div>
    </div>

    <Button type="submit" :disabled="isSubmitting">{{ submitLabel }}</Button>
  </form>
</template>
