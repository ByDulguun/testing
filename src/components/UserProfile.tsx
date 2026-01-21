"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

export default function UserProfilePage({ setShown }: any) {
  const { user, logout } = useAuthContext();
  const { changePassword, authLoading, error } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = async () => {
    setSuccess("");

    if (newPassword !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const ok = await changePassword(oldPassword, newPassword);

    if (ok) {
      setSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow relative">
        {/* Close button */}
        <button
          onClick={() => setShown([false, ""])}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold mb-6 text-center">My Profile</h1>

        {/* User info */}
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold">{user?.displayName}</p>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <h2 className="font-semibold mb-3 text-lg">Change Password</h2>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border text-base p-3 rounded w-full"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border text-base p-3 rounded w-full"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="border text-base p-3 rounded w-full"
          />

          <button
            onClick={handleChange}
            className="bg-black text-white py-3 rounded w-full cursor-pointer hover:bg-black/90"
          >
            {authLoading ? "Updating..." : "Change Password"}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-center text-base text-red-600">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-center text-base text-green-600">{success}</p>
        )}

        <button
          onClick={() => {
            logout();
            setShown([false, ""]);
          }}
          className="mt-6 w-full underline text-gray-600 hover:text-black text-base cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
