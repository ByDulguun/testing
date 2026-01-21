"use client";

import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";

interface RegisterPageProps {
  // Controls whether the modal is open, which modal shows, and optional email.
  setShown: (state: [boolean, string, string | null]) => void;
}

interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export default function RegisterPage({ setShown }: RegisterPageProps) {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { registerUser, authLoading, error } = useAuth();

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
    });

    // Stop if registration failed — let the error message display
    if (!success) return;

    // If successful → Open verification modal and pass email
    setShown([true, "verify", data.email]);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
      role="dialog"         // Accessibility role
      aria-modal="true"     // Ensures screen readers interpret as modal
    >
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow relative">
        {/* Close button */}
        <button
          onClick={() => setShown([false, "", null])}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h1>

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* FIRST NAME FIELD */}
          <div>
            <input
              {...formRegister("firstname", {
                required: "First name is required",
              })}
              placeholder="First Name"
              className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
              disabled={authLoading}  // Prevent interaction while loading
            />
            {/* Validation error display */}
            {errors.firstname && (
              <p className="text-red-500 text-sm">
                {errors.firstname.message}
              </p>
            )}
          </div>

          {/* LAST NAME FIELD */}
          <div>
            <input
              {...formRegister("lastname", {
                required: "Last name is required",
              })}
              placeholder="Last Name"
              className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
              disabled={authLoading}
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm">
                {errors.lastname.message}
              </p>
            )}
          </div>

          {/* EMAIL FIELD */}
          <div>
            <input
              {...formRegister("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,           // Basic email pattern
                  message: "Invalid email format",
                },
              })}
              placeholder="Email"
              type="email"
              className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
              disabled={authLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <input
              {...formRegister("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Password"
              type="password"
              className="border text-base p-3 rounded w-full focus:ring focus:ring-black/20 outline-none"
              disabled={authLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={authLoading}  // Prevent double submits
            className="bg-black cursor-pointer disabled:bg-gray-400 text-white py-3 rounded w-full hover:bg-black/90 transition"
          >
            {authLoading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* --------------------------------------------------------------------
           Backend or auth hook error message
           Displayed only when an error exists
           -------------------------------------------------------------------- */}
        {error && (
          <p className="mt-3 text-center text-base text-red-600">{error}</p>
        )}

        {/* --------------------------------------------------------------------
           SWITCH TO LOGIN
           Disabled while loading for clean UX
           -------------------------------------------------------------------- */}
        <button
          onClick={() => setShown([true, "login", null])}
          disabled={authLoading}
          className="mt-5 underline cursor-pointer text-base flex justify-center w-full text-gray-600 hover:text-black transition disabled:text-gray-400"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
