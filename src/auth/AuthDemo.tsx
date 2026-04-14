import { useState } from "react";
import Login from "./Login";
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
        // @ts-ignore - Login component doesn't accept onNavigate prop
        <Login onNavigate={(p) => navigate(p === "register" ? "register" : "forgot-password")} />
      )}
      {page === "register" && (
        // @ts-ignore - Register component doesn't accept onNavigate prop
        <Register onNavigate={() => navigate("login")} />
      )}
      {page === "forgot-password" && (
        // @ts-ignore - ForgotPassword component doesn't accept onNavigate prop
        <ForgotPassword onNavigate={(p) => navigate(p === "login" ? "login" : "reset-password")} />
      )}
      {page === "reset-password" && (
        // @ts-ignore - ResetPassword component doesn't accept onNavigate prop
        <ResetPassword onNavigate={() => navigate("login")} />
      )}
    </>
  );
}