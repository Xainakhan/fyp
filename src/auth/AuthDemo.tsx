import { useState } from "react";
import Login from "./login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

type Page = "login" | "register" | "forgot-password" | "reset-password";

export default function AuthDemo() {
  const [page, setPage] = useState<Page>("login");

  const navigate = (to: Page) => setPage(to);

  return (
    <>
      {page === "login" && (
        <Login onNavigate={(p) => navigate(p === "register" ? "register" : "forgot-password")} />
      )}
      {page === "register" && (
        <Register onNavigate={() => navigate("login")} />
      )}
      {page === "forgot-password" && (
        <ForgotPassword onNavigate={(p) => navigate(p === "login" ? "login" : "reset-password")} />
      )}
      {page === "reset-password" && (
        <ResetPassword onNavigate={() => navigate("login")} />
      )}
    </>
  );
}