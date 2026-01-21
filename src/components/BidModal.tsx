"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function BidModal({
  carId,
  onClose,
  onSuccess,
}: {
  carId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const placeBid = async () => {
    try {
      setLoading(true);
      setError("");

      const token = Cookies.get("idToken");

      console.log("Sending token:", token);
      console.log("Sending amount:", amount);
      console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}/bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: Number(amount) }),
        },
      );

      const data = await res.json();
      console.log("API response:", data);

      if (!res.ok) {
        setError(data.message || "Bid failed.");
        return;
      }

      onSuccess();
      onClose();
    } catch {}

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Place a Bid</h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter bid amount"
          className="w-full border px-3 py-2 rounded-md mb-3"
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          onClick={placeBid}
          disabled={loading}
          className="w-full bg-[#E10600] text-white py-2 rounded-md font-semibold"
        >
          {loading ? "Submitting..." : "Submit Bid"}
        </button>

        <button
          onClick={onClose}
          className="w-full text-gray-600 underline mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
