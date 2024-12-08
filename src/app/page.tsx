import Link from "next/link";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="bg-columbia-white flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="bg-columbia-blue p-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-white">Plan4CU</h1>
            <p className="text-columbia-white/90 text-xl">
              Create your perfect Columbia University schedule.
            </p>
          </div>

          <div className="p-8">
            {session ? (
              <div className="space-y-6">
                <p className="text-columbia-gray text-center text-2xl">
                  Welcome back, {session.user?.name}!
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="bg-columbia-blue hover:bg-columbia-blue/90 rounded-md px-6 py-3 text-white transition duration-300"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="bg-columbia-gray hover:bg-columbia-gray/90 rounded-md px-6 py-3 text-white transition duration-300"
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-columbia-gray text-center text-2xl">
                  Plan your academic journey at Columbia University now!
                </p>
                <div className="flex justify-center">
                  <Link
                    href="/api/auth/signin"
                    className="bg-columbia-blue hover:bg-columbia-blue/90 rounded-md px-8 py-3 text-white transition duration-300"
                  >
                    Sign In to Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-columbia-gray mt-8 text-center">
          <p>&copy; 2024 Plan4CU. All rights reserved.</p>
        </footer>
      </main>
    </HydrateClient>
  );
}
