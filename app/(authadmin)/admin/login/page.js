"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {signIn, signOut, useSession} from "next-auth/react";
import Link from "next/link";

const page = () => {
  const {data, status} = useSession();
  const [error, setError] = useState(null);
  const router = useRouter();
  console.log(data, status);

  const adminLoginSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    }
    if (res?.ok) {
      return router.push("/dashboard");
    }
  };

  useEffect(() => {
    status === "authenticated" &&
      data.user.role === "admin" &&
      router.push("/dashboard");
  }, [status]);

  if (status === "loading") {
    return <>loading...</>;
  }
  return (
    <div>
      {(status === "unauthenticated" ||
        data?.user?.role !== "admin" ||
        data === null) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto mt-4">
            <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
            <form onSubmit={adminLoginSubmit}>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="border border-gray-300 rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border border-gray-300 rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
              />
              <button className="w-full bg-red-600 text-white font-semibold rounded p-2 hover:bg-red-700 transition duration-300">
                Sign in
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
