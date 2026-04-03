import { Router } from 'express';

import { authRoutes } from '../modules/auth/auth.route';
import { userRoutes } from '../modules/user/user.route';
import { dashboardRoutes } from '../modules/dashboard/dashboard.route';
import { queueRoutes } from '../modules/queue/queue.route';
import { formRoutes } from '../modules/form/form.route';
import { csvRoutes } from '../modules/csv/csv.route';
import { searchRoutes } from '../modules/search/search.route';

export const router: Router = Router();

interface IModuleRoute {
  path: string;
  route: Router;
}

const moduleRoutes: IModuleRoute[] = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/dashboard',
    route: dashboardRoutes,
  },
  {
    path: '/queue',
    route: queueRoutes,
  },
  {
    path: '/forms',
    route: formRoutes,
  },
  {
    path: '/csv',
    route: csvRoutes,
  },
  {
    path: '/search',
    route: searchRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
