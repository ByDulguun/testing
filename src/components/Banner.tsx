"use client";
import React from "react";

export const Banner: React.FC = () => {
  const [visible, setVisible] = React.useState(true);

  // Instead of removing the banner from the DOM, just hide it without collapsing space 
  // if (!visible) return null;
  <div className={visible ? "opacity-100" : "opacity-0 pointer-events-none"} style={{transition: "opacity: 0.3s"}}></div>

  return (
    <div className="w-full bg-linear-to-r from-red-600 via-red-500 to-red-700 text-white shadow-lg shadow-red-900/20">
      <div className="mx-auto max-w-7xl px-4 py-20 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left side title + description */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/20 backdrop-blur-md p-2 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2C12 2 6 7 6 12a6 6 0 0012 0c0-5-6-10-6-10z"
              />
            </svg>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/70 font-semibold">
              Contact Us
            </p>
            <p className="text-base sm:text-base font-medium leading-tight">
              We’re here to help — reach out anytime.
            </p>
          </div>
        </div>

        {/* Contact info section */}
        <div className="flex flex-col sm:flex-row gap-4 text-base text-white/90">
          {/* Phone */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 8l2.5-2.5a2 2 0 012.7-.1l2 1.7a2 2 0 01.5 2.5l-1 2a12 12 0 006 6l2-1a2 2 0 012.5.5l1.7 2a2 2 0 01-.1 2.7L16 22A3 3 0 0112 22c-5.5 0-10-4.5-10-10a3 3 0 010-4z"
              />
            </svg>
            <span>+976 9900-0000</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4h16v16H4V4zm16 0l-8 7L4 4"
              />
            </svg>
            <span>support@company.com</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2a7 7 0 017 7c0 4.4-5 10-7 13-2-3-7-8.6-7-13a7 7 0 017-7z"
              />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>Ulaanbaatar, Mongolia</span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="p-2 rounded-full hover:bg-white/20 transition self-start sm:self-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};
