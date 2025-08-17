import type { RouteObject } from 'react-router';

import Home from './routes/Home';
import Error from './routes/Error';
import Shop from './routes/Shop';
import Library from './routes/Library';
import All from './routes/All';
import Profile from './routes/Profile';
import Users from './routes/Users';
import Signup from './routes/Signup';
import Login from './routes/Login';

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
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/all',
        element: <All />
      },
      {
        path: '/users',
        element: <Users />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/login',
        element: <Login />
      },
    ]
  }
];

export default routes;