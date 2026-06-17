import type { Metadata } from "next";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in · EduSlide",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep turning documents into polished slides."
    >
      <LoginForm error={error} message={message} />
    </AuthLayout>
  );
}
