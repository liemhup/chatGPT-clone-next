// "use client";
import { getServerSession } from "next-auth";
import { authOptions } from "./server/auth";
import SignInButton from "./component/SignInButton";
import { redirect } from "next/navigation";
export default async function Home() {
  const session = await getServerSession(authOptions);
  // const router = useRouter();
  if (session?.user) {
    redirect("chat");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="px-12 text-center border py-8 bg-white rounded-3xl pb-16">
        <h3 className="py-4 text-2xl font-bold">Sign in </h3>
        <div className="py-2 flex flex-col gap-4">
          <SignInButton provider="discord" color="purple-500"></SignInButton>
          <SignInButton provider="google" color="red-700"></SignInButton>
        </div>
      </div>
    </main>
  );
}
