"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Header } from "~/app/_components/header";

export default function ViewSchedule({ id }: { id: string }) {
  const {
    data: schedule,
    isLoading: scheduleIsLoading,
    isError: scheduleIsError,
  } = api.schedule.getById.useQuery({
    id: parseInt(id),
  });

  const {
    data: sections,
    isLoading: sectionsIsLoading,
    isError: sectionsIsError,
  } = api.schedule.getSections.useQuery({ scheduleId: parseInt(id) });

  const isLoading = scheduleIsLoading || sectionsIsLoading;
  const isError = scheduleIsError || sectionsIsError;

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="mb-6 h-8 w-3/4 rounded bg-gray-200"></div>
      <div className="mb-4 h-6 w-1/4 rounded bg-gray-200"></div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="mb-4 rounded-lg border p-4">
          <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="mb-2 h-4 w-2/3 rounded bg-gray-200"></div>
          <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );

  if (isError) {
    return (
      <div className="text-red-500">
        Error loading schedule. Please try again.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <h1 className="mb-6 text-2xl font-bold">{schedule?.label}</h1>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Courses</h2>
            {sections?.map((section) => (
              <div
                key={section.sectionModel.section_id}
                className="mb-4 rounded-lg border p-4"
              >
                <h3 className="text-lg font-medium">
                  {section.courseModel.course_name} (
                  {section.courseModel.course_id})
                </h3>
                <p>Section: {section.sectionModel.section_num}</p>
                <p>
                  Professor: {section.professorModel.first_name}{" "}
                  {section.professorModel.last_name}
                </p>
                <p>
                  Time: {section.sectionModel.day}{" "}
                  {section.sectionModel.start_time.toTimeString().slice(0, 5)}-
                  {section.sectionModel.end_time.toTimeString().slice(0, 5)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
