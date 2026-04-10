import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';

/**
 * Root app component — provides the router context.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
