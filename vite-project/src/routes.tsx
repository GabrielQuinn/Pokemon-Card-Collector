import type { RouteObject } from 'react-router';

import Home from './routes/Home';
import Gallery from './routes/Gallery';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/gallery',
    element: <Gallery />,
  },
];

export default routes;