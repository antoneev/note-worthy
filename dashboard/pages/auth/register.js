import React from "react";
import Header from "../../components/auth/header";
import { useRouter } from "next/router";

export default function register() {
  const router = useRouter();

  return (
    <div className="flex h-screen">
      <div className="w-full max-w-sm m-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <Header />

          <form>
            <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                type="text"
                placeholder="Full Name"
                aria-label="Full Name"
              />
            </div>

            <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                type="email"
                placeholder="Email Address"
                aria-label="Email Address"
              />
            </div>

            <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                type="password"
                placeholder="Password"
                aria-label="Password"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              {/* <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
              >
                Forget Password?
              </a> */}

              <div></div>

              <button
                className="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
                type="button"
              >
                Register
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center py-4 text-center bg-gray-100 dark:bg-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-200">
            Already have an account?{" "}
          </span>

          <button
            onClick={() => {
              router.push("/auth/login");
            }}
            className="mx-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
