"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cookingImage from "@/../public/img/cooking-stock.jpg";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

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
          <h1 className="text-4xl font-extrabold mb-6">Let's get cooking!</h1>

          <form onSubmit={doLogin} className="space-y-4 text-gray-700">
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border py-1.5 px-3 rounded border-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
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
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-green-600 hover:text-green-500 font-semibold"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
