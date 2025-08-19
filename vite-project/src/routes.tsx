import type { RouteObject } from 'react-router';
import { AuthProvider } from "./contexts/AuthProvider";

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
        element: <AuthProvider><Home /></AuthProvider>,
      },
      {
        path: '/library',
        element: <AuthProvider><Library /></AuthProvider>
      },
      {
        path: '/shop',
        element: <AuthProvider><Shop /></AuthProvider>
      },
      {
        path: '/profile/:pathId',
        element: <AuthProvider><Profile /></AuthProvider>
      },
      {
        path: '/all',
        element: <AuthProvider><All /></AuthProvider>
      },
      {
        path: '/users',
        element: <AuthProvider><Users /></AuthProvider>
      },
      {
        path: '/signup',
        element: <AuthProvider><Signup /></AuthProvider>
      },
      {
        path: '/login',
        element: <AuthProvider><Login /></AuthProvider>
      },
    ]
  }
];

export default routes;