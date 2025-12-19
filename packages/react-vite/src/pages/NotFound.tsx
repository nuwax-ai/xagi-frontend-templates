import { Link } from 'react-router-dom';

/**
 * 404 页面组件
 * 当访问不存在的路由时显示
 */
function NotFound() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4'>
            <div className='text-center max-w-md'>
                <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
                <p className='text-xl text-gray-600 mb-2'>页面未找到</p>
                <p className='text-sm text-gray-500 mb-8'>
                    抱歉，您访问的页面不存在或已被移动
                </p>
                <Link
                    to='/'
                    className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                    返回首页
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
