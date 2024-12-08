import { redirect } from "next/navigation";
import { Schedule } from "~/types/Course";
import { Header } from "~/app/_components/header";
import { auth } from "~/server/auth";
import SchedulesList from "~/app/schedules/SchedulesList"; // Adjust the import path as needed

export default async function SchedulesListPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }
  return (
    <>
      <Header
        userName={session.user.name}
        pageName={"Schedules"}
        returnTo={[{ title: "Dashboard", href: "/dashboard" }]}
      />
      <SchedulesList />
    </>
  );
}
