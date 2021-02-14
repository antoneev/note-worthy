import { useState, useEffect } from "react";
import Login from "./auth/login";
import Dashboard from "./dashboard/home";

export default function Home() {
  const [isLoggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLoggedIn(true);
    else setLoggedIn(false);
  }, []);

  if (isLoggedIn) {
    return <Dashboard />;
  } else {
    return <Login />;
  }
}
