import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Sign up — Aorexon" };

export default function SignUpPage() {
  return (
    <div className="flex justify-center px-4 py-16">
      <SignUp />
    </div>
  );
}
