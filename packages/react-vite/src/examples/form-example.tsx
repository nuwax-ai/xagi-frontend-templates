/**
 * 表单组件示例
 * Code Agent 可参考此文件生成类似的表单组件
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
// 1. 定义 Zod 验证模式
// ============================================

const userFormSchema = z.object({
    name: z.string().min(2, '姓名至少2个字符').max(50, '姓名最多50个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    role: z.enum(['admin', 'user'], { required_error: '请选择角色' }),
    agreeTerms: z.boolean().refine(val => val === true, '请同意服务条款'),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// ============================================
// 2. 表单组件
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
            console.error('表单提交失败:', error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* 文本输入 */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>姓名</FormLabel>
                            <FormControl>
                                <Input placeholder="请输入姓名" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 邮箱输入 */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>邮箱</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="请输入邮箱" {...field} />
                            </FormControl>
                            <FormDescription>我们不会公开您的邮箱地址</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 下拉选择 */}
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>角色</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择角色" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="user">普通用户</SelectItem>
                                    <SelectItem value="admin">管理员</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 复选框 */}
                <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>我同意服务条款和隐私政策</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? '提交中...' : '提交'}
                </Button>
            </form>
        </Form>
    );
}

export default UserFormExample;
