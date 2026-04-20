import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import NotFound from '@/pages/NotFound.vue';
import ExamplesPage from '@/pages/ExamplesPage.vue';

/**
 * Hash-based routing keeps navigation fully relative for static hosting:
 * - URLs look like /#/path and do not need server-side rewrite rules.
 * - The server always receives "/" while the client handles route matching.
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
    {
      path: '/examples',
      name: 'examples',
      component: ExamplesPage,
    },
  ],
});

export default router;
