import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { Header } from "~/app/_components/header";
import { db } from "~/server/db";

export default async function Dashboard() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // Fetch the 3 most recently updated schedules
  const recentSchedules = await db.schedule.findMany({
    where: { user_id: session.user.id },
    orderBy: { updated_at: 'desc' },
    take: 3,
  });

  // Get the total count of user's schedules
  const totalSchedules = await db.schedule.count({
    where: { user_id: session.user.id },
  });

  return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <Header pageName='Dashboard' userName={session.user.name} />
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Schedules Overview */}
            <div className="col-span-2 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Your Recent Schedules</h2>
              <div className="space-y-4">
                {recentSchedules.map((schedule) => (
                    <Link
                        key={schedule.schedule_id}
                        href={`/schedules/${schedule.schedule_id}`}
                        className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition duration-300"
                    >
                      <h3 className="font-medium">{schedule.label}</h3>
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(schedule.updated_at).toLocaleDateString()}
                      </p>
                    </Link>
                ))}
                {recentSchedules.length === 0 && (
                    <p className="text-gray-500">You haven't created any schedules yet.</p>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link
                    href="/schedules"
                    className="text-columbia-blue hover:underline"
                >
                  View all {totalSchedules} schedule{totalSchedules !== 1 ? 's' : ''}
                </Link>
                <Link
                    href="/schedules/create"
                    className="rounded-md bg-columbia-blue px-4 py-2 text-white transition duration-300 hover:bg-columbia-blue/90"
                >
                  Create New Schedule
                </Link>
              </div>
            </div>
            {/* User Settings */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">User Settings</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Update your majors and expected graduation date.
                </p>
                <Link
                    href="/settings"
                    className="block w-full rounded-md bg-columbia-blue px-4 py-2 text-center text-white transition duration-300 hover:bg-columbia-blue/90"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}