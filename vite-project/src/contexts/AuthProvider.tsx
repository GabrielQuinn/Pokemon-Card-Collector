import { useCallback, useMemo, useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthObject } from './AuthContext';
import type { User } from '../types/types';
//import Login from '../routes/Login';
import { useNavigate } from 'react-router';

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = useCallback((user: User) => setUser(user), []);
  const logout = useCallback(() => setUser(null), []);

  const contextValue = useMemo<AuthObject>(
    () => ({ user, login, logout }),
    [user, login, logout]
  );

  useEffect(() => {
    if (user == null) navigate("/Login");
  }, [user, navigate]);

  return (
    <AuthContext value={contextValue}>
      {children}
    </AuthContext>
  );
}