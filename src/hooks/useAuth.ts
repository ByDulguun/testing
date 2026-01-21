"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const { setAuth, user } = useAuthContext();
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown, defaultMsg: string) => {
    const apiError = err as { response?: { data?: { error?: string } } };
    setError(apiError.response?.data?.error || defaultMsg);
  };

  /* REGISTER */
  const registerUser = async (data: Record<string, any>) => {
    try {
      setAuthLoading(true);
      setError(null);
      await api.post("/auth/register", data);
      return true;
    } catch (err) {
      handleError(err, "Registration failed");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  /* LOGIN */
  const loginUser = async (data: Record<string, any>) => {
    try {
      setAuthLoading(true);
      setError(null);

      const res = await api.post("/auth/login", data);
      setAuth(res.data.user, res.data.idToken);

      return true;
    } catch (err) {
      handleError(err, "Login failed");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  /* SEND RESET CODE */
  const sendResetCode = async (email: string) => {
    try {
      setAuthLoading(true);
      setError(null);
      await api.post("/auth/reset", { email });
      return true;
    } catch (err) {
      handleError(err, "Failed to send reset code");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  /* RESET PASSWORD */
  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    try {
      setAuthLoading(true);
      setError(null);
      await api.post("/auth/reset-password", { email, code, newPassword });
      return true;
    } catch (err) {
      handleError(err, "Failed to reset password");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  /* ---------------------------------------------------------
     CHANGE PASSWORD (NEW)
  --------------------------------------------------------- */
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setAuthLoading(true);
      setError(null);

      await api.post("/auth/change-password", {
        email: user?.email,
        oldPassword,
        newPassword,
      });

      return true;
    } catch (err) {
      handleError(err, "Failed to change password");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    registerUser,
    loginUser,
    sendResetCode,
    resetPassword,
    changePassword, // <-- NEW
    authLoading,
    error,
  };
}
