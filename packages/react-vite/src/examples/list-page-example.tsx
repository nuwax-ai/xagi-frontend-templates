/**
* 列表页面示例
* Code Agent 可参考此文件生成类似的数据列表页面
*/

import { useState } from 'react';
import { useApi } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// ============================================
// 1. 定义通用类型（根据后端实际响应格式调整）
// ============================================

/** 分页结果 */
interface PaginatedResult<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

/** 分页查询参数 */
interface ListParams {
    page: number;
    pageSize: number;
    keyword?: string;
}

// ============================================
// 2. 定义数据类型
// ============================================

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
}

// 模拟 API 调用（实际使用时替换为真实 API）
const mockFetchProducts = async (params: ListParams): Promise<PaginatedResult<Product>> => {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        list: [
            { id: '1', name: '产品A', price: 99.99, category: '电子', stock: 100 },
            { id: '2', name: '产品B', price: 199.99, category: '服装', stock: 50 },
            { id: '3', name: '产品C', price: 49.99, category: '食品', stock: 200 },
        ],
        total: 3,
        page: params.page,
        pageSize: params.pageSize,
    };
};

// ============================================
// 2. 列表页面组件
// ============================================

export function ProductListExample() {
    const [params, setParams] = useState<ListParams>({
        page: 1,
        pageSize: 10,
        keyword: '',
    });

    const { data, loading, error, refetch } = useApi(
        () => mockFetchProducts(params),
        [params.page, params.pageSize, params.keyword]
    );

    // 搜索处理
    const handleSearch = (keyword: string) => {
        setParams(prev => ({ ...prev, keyword, page: 1 }));
    };

    // 分页处理
    const handlePageChange = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };

    // 删除处理
    const handleDelete = async (id: string) => {
        if (confirm('确定删除？')) {
            // await productApi.delete(id);
            console.log('删除:', id);
            refetch();
        }
    };

    // 错误状态
    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                加载失败: {error.message}
                <Button onClick={refetch} className="ml-2">重试</Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* 页面标题 */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">产品列表</h1>
                <Button>新增产品</Button>
            </div>

            {/* 搜索栏 */}
            <div className="flex gap-4">
                <Input
                    placeholder="搜索产品..."
                    value={params.keyword}
                    onChange={e => handleSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Button variant="outline" onClick={refetch}>刷新</Button>
            </div>

            {/* 加载状态 */}
            {loading && (
                <div className="text-center py-8 text-gray-500">加载中...</div>
            )}

            {/* 数据列表 */}
            {!loading && data && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {data.list.map(product => (
                        <Card key={product.id} className="p-4">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-gray-500 text-sm">{product.category}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-blue-600 font-bold">¥{product.price}</span>
                                <span className="text-gray-400 text-sm">库存: {product.stock}</span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Button size="sm" variant="outline">编辑</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                                    删除
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* 空状态 */}
            {!loading && data?.list.length === 0 && (
                <div className="text-center py-8 text-gray-500">暂无数据</div>
            )}

            {/* 分页 */}
            {data && data.total > params.pageSize && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={params.page <= 1}
                        onClick={() => handlePageChange(params.page - 1)}
                    >
                        上一页
                    </Button>
                    <span className="px-4 py-2">
                        第 {params.page} 页 / 共 {Math.ceil(data.total / params.pageSize)} 页
                    </span>
                    <Button
                        variant="outline"
                        disabled={params.page >= Math.ceil(data.total / params.pageSize)}
                        onClick={() => handlePageChange(params.page + 1)}
                    >
                        下一页
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ProductListExample;
