import { createHashRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

/**
 * 路由配置
 * 使用 HashRouter（hash 模式）
 * 路由路径格式：/#/ 等
 *
 * Hash 模式的优点：
 * - 不需要服务器配置，可以在任何路径下部署
 * - URL 中的 hash 部分不会发送到服务器
 * - 适合静态部署和 CDN 部署
 *
 * 添加新路由：
 * {
 *   path: '/your-path',
 *   element: <YourComponent />,
 * }
 */
export const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
