import React, { useState } from "react";
import Header from "../../components/auth/header";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import Loader from "react-loader-spinner";
import axios from "axios";

export default function login() {
  const router = useRouter();
  const { addToast } = useToasts();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post(
        "https://treehacks-server-oj3ri.ondigitalocean.app/quickstart/auth/login/",
        {
          username: email,
          password: password,
        }
      );

      addToast(`Welcome ${response.data.name}! Login successfull`, {
        appearance: "success",
        autoDismiss: true,
      });

      setLoading(false);

      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      router.push("/dashboard/home");
    } catch (err) {
      addToast("Server Error!", {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="flex h-screen pattern bg-gray-100">
      <div className="w-full max-w-sm m-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <Header />

          <form onSubmit={login}>
            <div className="w-full mt-4">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                type="email"
                placeholder="Email Address"
                ariaLabel="Email Address"
              />
            </div>

            <div className="w-full mt-4">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                type="password"
                placeholder="Password"
                ariaLabel="Password"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
              >
                Forget Password?
              </a>

              {loading ? (
                <Loader
                  className="w-full flex justify-center"
                  type="Oval"
                  color="#00BFFF"
                  height={40}
                  width={40}
                  timeout={3000}
                />
              ) : (
                <button
                  className="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
                  type="submit"
                >
                  Login
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center py-4 text-center bg-gray-100 dark:bg-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-200">
            Don't have an account?{" "}
          </span>

          <button
            onClick={() => {
              router.push("/auth/register");
            }}
            className="mx-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
