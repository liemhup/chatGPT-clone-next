"use client";
import { signIn } from "next-auth/react";

export default function SignInButton({
  provider,
  color,
}: {
  provider: string;
  color: string;
}) {
  return (
    <button
      className={`rounded-xl bg-${color} px-8 py-2`}
      onClick={() => signIn(provider)}
    >
      {`Sign in with ${provider}`}
    </button>
  );
}
