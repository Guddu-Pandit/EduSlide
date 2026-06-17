import type { Metadata } from "next";
import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account · EduSlide",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Turn documents into polished slides — free, no credit card required."
    >
      <SignupForm />
    </AuthLayout>
  );
}
