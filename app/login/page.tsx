import type { Metadata } from "next";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in · EduSlide",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep turning documents into polished slides."
    >
      <LoginForm />
    </AuthLayout>
  );
}
