"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import logo from "@/../public/img/logo.png";
import cookingImage from "@/../public/img/cooking-stock.jpg";

export default function LoginPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function doSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Something went wrong");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2">
      {/* left */}
      <div className="hidden sm:flex items-center justify-center relative">
        <Image
          src={cookingImage}
          alt="Cooking Illustration"
          className="object-cover w-full h-full"
          fill
        />
      </div>
      {/* right */}
      <div className="flex items-center justify-center p-6">
        <div className="w-sm max-w-md">
          <h1 className="text-4xl font-extrabold mb-6">Welcome!</h1>
          <form onSubmit={doSignup} className="space-y-4 text-gray-700">
            <div className="flex flex-row w-full gap-x-3">
              <div className="flex-1">
                <label htmlFor="firstName" className="block font-medium mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border py-1.5 px-3 rounded border-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="lastName" className="block font-medium mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border py-1.5 px-3 rounded border-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border py-1.5 px-3 rounded border-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border py-1.5 px-3 rounded border-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border py-1.5 px-3 rounded border-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="h-6">
              {error && (
                <p className="text-red-600 mb-4 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded cursor-pointer"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-600 hover:text-green-500 font-semibold"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
