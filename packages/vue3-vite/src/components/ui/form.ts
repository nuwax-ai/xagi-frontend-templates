import { computed, defineComponent, h, inject, provide } from 'vue';
import { cn } from '@/lib/utils';

interface FormFieldContextValue {
  name: string;
  error?: string;
}

const FORM_FIELD_CONTEXT_KEY = Symbol('form-field-context');

export const Form = defineComponent({
  name: 'Form',
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

export const FormField = defineComponent({
  name: 'FormField',
  props: {
    name: { type: String, required: true },
    error: { type: String, default: '' },
  },
  setup(props, { slots }) {
    provide<FormFieldContextValue>(FORM_FIELD_CONTEXT_KEY, {
      name: props.name,
      error: props.error || undefined,
    });
    return () => h('div', slots.default?.());
  },
});

export const FormItem = defineComponent({
  name: 'FormItem',
  props: { class: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h('div', { class: cn('space-y-2', props.class) }, slots.default?.());
  },
});

export const FormLabel = defineComponent({
  name: 'FormLabel',
  props: {
    for: { type: String, default: '' },
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    const field = inject<FormFieldContextValue | null>(
      FORM_FIELD_CONTEXT_KEY,
      null
    );
    const className = computed(() =>
      cn(
        'text-sm font-medium leading-none',
        field?.error && 'text-red-500',
        props.class
      )
    );
    return () =>
      h('label', { for: props.for, class: className.value }, slots.default?.());
  },
});

export const FormControl = defineComponent({
  name: 'FormControl',
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

export const FormDescription = defineComponent({
  name: 'FormDescription',
  props: { class: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h(
        'p',
        { class: cn('text-sm text-gray-500', props.class) },
        slots.default?.()
      );
  },
});

export const FormMessage = defineComponent({
  name: 'FormMessage',
  props: {
    class: { type: String, default: '' },
    message: { type: String, default: '' },
  },
  setup(props, { slots }) {
    const field = inject<FormFieldContextValue | null>(
      FORM_FIELD_CONTEXT_KEY,
      null
    );
    const body = computed(() => props.message || field?.error || '');
    return () =>
      body.value
        ? h(
            'p',
            { class: cn('text-sm font-medium text-red-500', props.class) },
            body.value || slots.default?.()
          )
        : null;
  },
});

export function useFormField(): FormFieldContextValue | null {
  return inject<FormFieldContextValue | null>(FORM_FIELD_CONTEXT_KEY, null);
}
