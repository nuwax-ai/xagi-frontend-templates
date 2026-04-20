import UserFormExample from '@/examples/form-example';
import ProductListExample from '@/examples/list-page-example';

function ExamplesPage() {
  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6'>
        <header className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>
            React UI Examples
          </h1>
          <p className='mt-2 text-sm text-gray-600'>
            Smoke playground for the generated React UI library, API helpers,
            and Zod-based form flow.
          </p>
        </header>

        <section className='mb-10 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold text-gray-900'>
            Form Example (Zod + React Hook Form)
          </h2>
          <UserFormExample onSubmit={async () => Promise.resolve()} />
        </section>

        <section className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold text-gray-900'>
            List Page Example
          </h2>
          <ProductListExample />
        </section>
      </div>
    </main>
  );
}

export default ExamplesPage;
