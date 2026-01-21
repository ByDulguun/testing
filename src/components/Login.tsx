"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { t } from "i18next";

interface LoginPageProps {
  setShown: (state: [boolean, string, string | null]) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginModal({ setShown }: LoginPageProps) {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { loginUser, authLoading, error } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    const success = await loginUser({
      email: data.email,
      password: data.password,
    });
    if (!success) return;

    setShown([false, "", null]);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow relative">
        <button
          aria-label="Close login modal"
          onClick={() => setShown([false, "", null])}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold mb-6 text-center">
          {t("menu.login")}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...formRegister("email", { required: "Email is required" })}
              placeholder="Email"
              type="email"
              className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...formRegister("password", {
                required: "Password is required",
              })}
              placeholder="Password"
              type="password"
              className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="bg-black cursor-pointer disabled:bg-gray-400 text-white py-3 rounded w-full hover:bg-black/90 transition"
          >
            {authLoading ? "Loading..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-center text-base text-red-600">{error}</p>
        )}

        <div className="flex justify-between mt-5">
          <button
            disabled={authLoading}
            onClick={() => setShown([true, "forgot", null])}
            className="underline cursor-pointer text-base text-gray-600 hover:text-black transition disabled:text-gray-400"
          >
            Forgot password?
          </button>

          <button
            disabled={authLoading}
            onClick={() => setShown([true, "register", null])}
            className="underline cursor-pointer text-base text-gray-600 hover:text-black transition disabled:text-gray-400"
          >
            Register?
          </button>
        </div>
      </div>
    </div>
  );
}
