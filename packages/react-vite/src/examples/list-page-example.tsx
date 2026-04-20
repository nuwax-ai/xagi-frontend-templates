/**
 * List page reference — patterns for data tables, search, and pagination.
 * Copy ideas, not this file verbatim, into production code.
 */

import { useState } from 'react';
import { useApi } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// ============================================
// 1. Shared types (adjust to your API contract)
// ============================================

/** Paginated list payload */
interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Query params for list endpoints */
interface ListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

// ============================================
// 2. Domain model
// ============================================

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

// Mock fetch — swap for real `api.get` + `extractApiData`
const mockFetchProducts = async (
  params: ListParams
): Promise<PaginatedResult<Product>> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    list: [
      {
        id: '1',
        name: 'Product A',
        price: 99.99,
        category: 'Electronics',
        stock: 100,
      },
      {
        id: '2',
        name: 'Product B',
        price: 199.99,
        category: 'Apparel',
        stock: 50,
      },
      {
        id: '3',
        name: 'Product C',
        price: 49.99,
        category: 'Grocery',
        stock: 200,
      },
    ],
    total: 3,
    page: params.page,
    pageSize: params.pageSize,
  };
};

// ============================================
// 3. Example page component
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

  const handleSearch = (keyword: string) => {
    setParams(prev => ({ ...prev, keyword, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
      // await productApi.delete(id);
      console.log('deleted:', id);
      refetch();
    }
  };

  if (error) {
    return (
      <div className='p-4 text-center text-red-500'>
        Failed to load: {error.message}
        <Button onClick={refetch} className='ml-2'>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Products</h1>
        <Button>Add product</Button>
      </div>

      <div className='flex gap-4'>
        <Input
          placeholder='Search products…'
          value={params.keyword}
          onChange={e => handleSearch(e.target.value)}
          className='max-w-sm'
        />
        <Button variant='outline' onClick={refetch}>
          Refresh
        </Button>
      </div>

      {loading && (
        <div className='text-center py-8 text-gray-500'>Loading…</div>
      )}

      {!loading && data && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {data.list.map(product => (
            <Card key={product.id} className='p-4'>
              <h3 className='font-semibold text-lg'>{product.name}</h3>
              <p className='text-gray-500 text-sm'>{product.category}</p>
              <div className='flex justify-between items-center mt-4'>
                <span className='text-blue-600 font-bold'>
                  ¥{product.price}
                </span>
                <span className='text-gray-400 text-sm'>
                  Stock: {product.stock}
                </span>
              </div>
              <div className='flex gap-2 mt-4'>
                <Button size='sm' variant='outline'>
                  Edit
                </Button>
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && data?.list.length === 0 && (
        <div className='text-center py-8 text-gray-500'>No data</div>
      )}

      {data && data.total > params.pageSize && (
        <div className='flex justify-center gap-2'>
          <Button
            variant='outline'
            disabled={params.page <= 1}
            onClick={() => handlePageChange(params.page - 1)}
          >
            Previous
          </Button>
          <span className='px-4 py-2'>
            Page {params.page} / {Math.ceil(data.total / params.pageSize)}
          </span>
          <Button
            variant='outline'
            disabled={params.page >= Math.ceil(data.total / params.pageSize)}
            onClick={() => handlePageChange(params.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductListExample;
