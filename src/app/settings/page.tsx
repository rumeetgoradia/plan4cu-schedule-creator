import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import SettingsForm from "~/app/settings/SettingsForm";
import Link from "next/link";
import { Header } from "~/app/_components/header";

export default async function Settings() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { majors: { include: { major: true } } },
  });

  if (!user || !user.name) {
    throw new Error("User not found");
  }

  const allMajors = await db.major.findMany({
    orderBy: { major_name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        pageName={"User Settings"}
        returnTo={[{ title: "Dashboard", href: "/dashboard" }]}
        userName={user.name}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
          <SettingsForm user={user} allMajors={allMajors} />
        </div>
      </main>
    </div>
  );
}
