/**
 * Form reference — React Hook Form + Zod + shadcn-style Form primitives.
 * Agents can copy patterns, not this file wholesale, into production code.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// ============================================
// 1. Zod schema
// ============================================

const userFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
    email: z.string().email('Enter a valid email address'),
    role: z.enum(['admin', 'user'], { required_error: 'Select a role' }),
    agreeTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// ============================================
// 2. Form component
// ============================================

interface UserFormProps {
    defaultValues?: Partial<UserFormValues>;
    onSubmit: (data: UserFormValues) => void | Promise<void>;
    loading?: boolean;
}

export function UserFormExample({ defaultValues, onSubmit, loading }: UserFormProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: '',
            email: '',
            role: undefined,
            agreeTerms: false,
            ...defaultValues,
        },
    });

    const handleSubmit = async (data: UserFormValues) => {
        try {
            await onSubmit(data);
            form.reset();
        } catch (error) {
            console.error('Form submit failed:', error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Text input */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormDescription>We will never share your email.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Select */}
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Checkbox */}
                <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>I agree to the terms and privacy policy</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting…' : 'Submit'}
                </Button>
            </form>
        </Form>
    );
}

export default UserFormExample;
