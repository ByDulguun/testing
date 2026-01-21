"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { api } from "@/lib/api";

interface User {
  uid: string;
  email: string;
  displayName: string | null;
  emailVerified?: boolean;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  setAuth: (u: User, t: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuth = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    Cookies.set("idToken", t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("idToken");
  };

  useEffect(() => {
    const restore = async () => {
      try {
        const saved = Cookies.get("idToken");
        if (!saved) return setLoading(false);

        setToken(saved);
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${saved}` },
        });

        setUser(res.data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext)!;
