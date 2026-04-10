import { createHashRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

/**
 * Hash-based routing (createHashRouter).
 * URLs look like `/#/…` and need no server rewrite rules.
 *
 * Why hash mode:
 * - Works on any static host without extra server config
 * - The fragment is not sent to the server
 * - Handy for static sites and CDNs
 *
 * Add a route:
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
