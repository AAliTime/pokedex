"use client";

import { useState } from "react";
import { authService } from "../services/authService";

export default function Login({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isSignUp) {
        data = await authService.register({ username, password });
      } else {
        data = await authService.login({ username, password });
      }

      const loggedInUsername = data.username || username;
      localStorage.setItem("pokedex_user", loggedInUsername);

      onLoginSuccess(loggedInUsername);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Authentication failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors text-xl font-bold"
        >
          ✕
        </button>

        <div className="flex border-b border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError("");
            }}
            className={`flex-1 py-3 font-semibold text-sm transition-all border-b-2 ${
              !isSignUp
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError("");
            }}
            className={`flex-1 py-3 font-semibold text-sm transition-all border-b-2 ${
              isSignUp
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="TrainerRed"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="filter-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="filter-input w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="load-more-btn w-full mt-2 justify-center"
          >
            {loading
              ? "Authenticating..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}