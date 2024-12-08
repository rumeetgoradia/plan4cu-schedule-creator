import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { Header } from "~/app/_components/header";
import ViewSchedule from "~/app/schedules/[id]/ViewSchedule";

export default async function ViewSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <Header
        userName={session.user.name}
        pageName={"Schedule"}
        returnTo={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Schedules", href: "/schedules" },
        ]}
      />
      <ViewSchedule id={params.id} />
    </>
  );
}
