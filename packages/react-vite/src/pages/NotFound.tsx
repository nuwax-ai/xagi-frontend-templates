import { Link } from 'react-router-dom';

/**
 * 404 page — shown when no route matches.
 */
function NotFound() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4'>
            <div className='text-center max-w-md'>
                <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
                <p className='text-xl text-gray-600 mb-2'>Page not found</p>
                <p className='text-sm text-gray-500 mb-8'>
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    to='/'
                    className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
