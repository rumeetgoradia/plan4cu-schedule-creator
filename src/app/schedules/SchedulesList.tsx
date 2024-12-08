"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Schedule } from "~/types/Course";
import { Header } from "~/app/_components/header"; // Adjust the import path as needed

export default function SchedulesList() {
  const router = useRouter();

  const {
    data: schedules,
    isLoading,
    isError,
  } = api.schedule.getAll.useQuery();
  const utils = api.useUtils();

  const deleteScheduleMutation = api.schedule.delete.useMutation({
    onSuccess: async () => {
      await utils.schedule.invalidate();
    },
  });

  const handleDelete = (scheduleId: number) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      deleteScheduleMutation.mutate({ id: scheduleId });
    }
  };

  const ScheduleSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
        >
          <div className="space-y-2">
            <div className="h-5 w-48 rounded bg-gray-200"></div>
            <div className="h-4 w-32 rounded bg-gray-200"></div>
          </div>
          <div className="space-x-2">
            <div className="inline-block h-8 w-16 rounded bg-gray-200"></div>
            <div className="inline-block h-8 w-16 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      {isLoading ? (
        <ScheduleSkeleton />
      ) : isError ? (
        <div className="text-red-500">
          Error loading schedules. Please try again.
        </div>
      ) : schedules.length === 0 ? (
        <p>You haven't created any schedules yet.</p>
      ) : (
        <ul className="space-y-4">
          {schedules.map((schedule) => (
            <li
              key={schedule.schedule_id}
              className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold">{schedule.label}</h2>
                <p className="text-sm text-gray-500">
                  Created: {new Date(schedule.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  href={`/schedules/${schedule.schedule_id}`}
                  className="rounded bg-columbia-blue px-4 py-2 text-white hover:bg-columbia-blue/90"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(schedule.schedule_id)}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <Link
          href="/schedules/create"
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Create New Schedule
        </Link>
      </div>
    </div>
  );
}
