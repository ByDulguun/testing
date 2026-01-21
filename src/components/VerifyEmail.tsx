"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

interface VerifyEmailPageProps {
  setShown: (state: [boolean, string, string | null]) => void;
  email: string | null;
}

export default function VerifyEmailPage({
  setShown,
  email,
}: VerifyEmailPageProps) {
  interface FormData {
    code: string;
  }

  const { register, handleSubmit } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/verify-code", {
        email,
        code: data.code,
      });

      alert("Email verified!");
      setShown([true, "login", null]);
    } catch {}

    setLoading(false);
  };

  const resend = async () => {
    try {
      await api.post("/auth/resend-code", { email });
      alert("New code sent!");
    } catch {}
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow relative">
        {/* Close button */}
        <button
          onClick={() => setShown([false, "", null])}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold mb-2 text-center">
          Verify Email
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Code was sent to:
          <br />
          <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("code")}
            placeholder="Enter 6-digit code"
            className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
          />

          <button
            type="submit"
            className="bg-black cursor-pointer text-white py-3 rounded w-full hover:bg-black/90 transition"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-center text-base text-red-600">{error}</p>
        )}

        <button
          onClick={resend}
          className="mt-5 underline cursor-pointer text-base flex justify-center w-full text-gray-600 hover:text-black transition"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
