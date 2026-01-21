"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface EmailForm {
  email: string;
}

interface ResetForm {
  code: string;
  password: string;
  confirmPassword: string;
}

export default function ForgotPasswordPage({
  setShown,
}: {
  setShown: (state: [boolean, string, string | null]) => void;
}) {
  const emailForm = useForm<EmailForm>();
  const resetForm = useForm<ResetForm>();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");

  const { sendResetCode, resetPassword, authLoading, error } = useAuth();


   // 1 send reset code

  const onSendCode = async (data: EmailForm) => {
    const success = await sendResetCode(data.email);

    if (success) {
      setEmail(data.email);
      setStep("reset");
      emailForm.reset();
    }
  };


   // 2 reset password

  const onResetPassword = async (data: ResetForm) => {
    if (data.password !== data.confirmPassword) {
      resetForm.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }

    const success = await resetPassword(email, data.code, data.password);

    if (success) {
      resetForm.reset();
      setShown([true, "login", null]);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow relative">

        {/* Close button */}
        <button
          onClick={() => setShown([false, "", null])}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h1>

        {/* STEP 1: Email */}
        {step === "email" && (
          <>
            <form
              onSubmit={emailForm.handleSubmit(onSendCode)}
              className="space-y-4"
            >
              <input
                {...emailForm.register("email", {
                  required: "Email is required",
                })}
                type="email"
                placeholder="Enter your email"
                className="border p-3 text-base rounded w-full focus:ring focus:ring-black/20 outline-none"
                disabled={authLoading}
              />
              {emailForm.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {emailForm.formState.errors.email.message}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="bg-black text-white py-3 rounded w-full hover:bg-black/90 transition cursor-pointer disabled:bg-gray-400"
              >
                {authLoading ? "Sending..." : "Send Code"}
              </button>
            </form>

            {error && (
              <p className="mt-3 text-center text-base text-red-600">{error}</p>
            )}
          </>
        )}

        {/* STEP 2: Code & New Password */}
        {step === "reset" && (
          <>
            <p className="text-center text-gray-600 mb-4">
              A reset code was sent to:
              <br />
              <span className="font-semibold">{email}</span>
            </p>

            <form
              onSubmit={resetForm.handleSubmit(onResetPassword)}
              className="space-y-4"
            >
              <input
                {...resetForm.register("code", {
                  required: "Reset code is required",
                })}
                placeholder="Reset code"
                className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
                disabled={authLoading}
              />
              {resetForm.formState.errors.code && (
                <p className="text-red-500 text-sm">
                  {resetForm.formState.errors.code.message}
                </p>
              )}

              <input
                {...resetForm.register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters",
                  },
                })}
                type="password"
                placeholder="New password"
                className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
                disabled={authLoading}
              />
              {resetForm.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {resetForm.formState.errors.password.message}
                </p>
              )}

              <input
                {...resetForm.register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                type="password"
                placeholder="Confirm new password"
                className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
                disabled={authLoading}
              />
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="bg-black text-white py-3 rounded w-full hover:bg-black/90 transition cursor-pointer disabled:bg-gray-400"
              >
                {authLoading ? "Changing..." : "Change Password"}
              </button>
            </form>

            {error && (
              <p className="mt-3 text-center text-base text-red-600">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
