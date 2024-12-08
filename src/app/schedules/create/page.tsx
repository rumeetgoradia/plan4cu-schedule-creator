import { redirect } from "next/navigation";
import CreateScheduleForm from "./CreateScheduleForm";
import {auth} from "~/server/auth";
import {Header} from "~/app/_components/header";

export default async function CreateSchedulePage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header userName={session.user.name} pageName={'Create Schedule'}

            returnTo={[
                {title: 'Dashboard', href: '/dashboard'},
                {title: 'Schedules', href: '/schedules'}
            ]}/>
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <CreateScheduleForm userId={session.user.id} />
                </div>
            </main>
        </div>
    );
}