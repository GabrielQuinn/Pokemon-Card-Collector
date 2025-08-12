import type { RouteObject } from 'react-router';

import Home from './routes/Home';
import Error from './routes/Error';
import Shop from './routes/Shop';
import Library from './routes/Library';

const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/library',
        element: <Library />
      },
      {
        path: '/shop',
        element: <Shop />
      }
    ]
  }
];

export default routes;