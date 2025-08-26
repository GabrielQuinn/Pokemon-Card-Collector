import { useCallback, useMemo, useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthObject } from "./AuthContext";
import type { User } from "../types/types";
import { useNavigate, useLocation } from "react-router";

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const login = useCallback((user: User) => setUser(user), []);
  const logout = useCallback(() => setUser(null), []);

  const contextValue = useMemo<AuthObject>(
    () => ({ user, login, logout }),
    [user, login, logout]
  );

  useEffect(() => { // Check if user exists
    if (user == null) {
      if (location.pathname == "/signup") {
        navigate("/signup");
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <AuthContext value={contextValue}>
      {children}
    </AuthContext>
  );
}