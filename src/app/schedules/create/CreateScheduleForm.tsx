"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "~/trpc/react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { EnrichedCourseModel, EnrichedSectionModel } from "~/types/Course";

interface CreateScheduleFormProps {
  userId: number;
}

export default function CreateScheduleForm({
  userId,
}: CreateScheduleFormProps) {
  const [label, setLabel] = useState("");
  const [selectedSections, setSelectedSections] = useState<
    Record<
      string,
      { course: EnrichedCourseModel; section: EnrichedSectionModel }
    >
  >({});
  const router = useRouter();

  const createScheduleMutation = api.schedule.create.useMutation({
    onSuccess: ({schedule_id}) => {
      toast.success("Schedule created successfully!");
      router.push(`/schedules/${schedule_id}`);
    },
    onError: (error) => {
      toast.error(`Failed to create schedule: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sectionIds = Object.values(selectedSections).map(
      ({ section }) => section.sectionModel.sectionId,
    );
    createScheduleMutation.mutate({ userId, label, sectionIds });
  };

  const removeSection = (courseId: string) => {
    setSelectedSections((prev) => {
      const { [courseId]: removed, ...rest } = prev;
      return rest;
    });
  };
  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label
            htmlFor="label"
            className="mb-2 block text-xl font-semibold text-gray-700"
          >
            Schedule Title
          </label>
          <input
            type="text"
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-columbia-blue focus:ring focus:ring-columbia-blue focus:ring-opacity-50"
            placeholder="e.g. Spring 2025 schedule"
            required
          />
        </div>
        <div className="border-t border-gray-200 pt-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Selected Sections ({Object.keys(selectedSections).length})
          </h2>
          <ul className="min-h-[100px] rounded-md bg-gray-50 p-4">
            {Object.entries(selectedSections).map(
              ([courseId, { course, section }]) => (
                <li
                  key={courseId}
                  className="mb-2 flex items-center justify-between rounded bg-white p-2 text-sm shadow"
                >
                  <span>
                    <strong>
                      {course.courseModel.courseName} ({courseId})
                    </strong>{" "}
                    - Section {section.sectionModel.sectionNum}
                    <br />
                    <span className="text-gray-600">
                      Professor: {section.professorModel.firstName}{" "}
                      {section.professorModel.lastName}
                    </span>
                    <div className="text-gray-600">
                      Time: {section.sectionModel.day}{" "}
                      {section.sectionModel.startTime}-
                      {section.sectionModel.endTime}
                    </div>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSection(courseId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </li>
              ),
            )}
            {Object.entries(selectedSections).length === 0 && (
              <p className="italic text-gray-500">
                Select some course sections from the list below to get started!
              </p>
            )}
          </ul>
        </div>
        <PaginatedCourseList
          selectedSections={selectedSections}
          setSelectedSections={setSelectedSections}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-columbia-blue px-6 py-3 text-white transition duration-300 hover:bg-columbia-blue/90 focus:outline-none focus:ring focus:ring-columbia-blue focus:ring-opacity-50"
            disabled={createScheduleMutation.isPending}
          >
            {createScheduleMutation.isPending
              ? "Creating..."
              : "Create Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}

interface PaginatedCourseListProps {
  selectedSections: Record<
    string,
    { course: EnrichedCourseModel; section: EnrichedSectionModel }
  >;
  setSelectedSections: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        { course: EnrichedCourseModel; section: EnrichedSectionModel }
      >
    >
  >;
}

function PaginatedCourseList({
  selectedSections,
  setSelectedSections,
}: PaginatedCourseListProps) {
  const [page, setPage] = useState(0);
  const [expandedCourses, setExpandedCourses] = useState<
    Record<string, boolean>
  >({});

  const {
    data: coursesData,
    isLoading,
    error,
  } = api.gateway.getRelevantCourses.useQuery({ page, size: 10 });

  const handleSectionSelect = (
    courseId: string,
    course: EnrichedCourseModel,
    section: EnrichedSectionModel,
  ) => {
    setSelectedSections((prev) => ({
      ...prev,
      [courseId]: {
        course,
        section,
      },
    }));
  };

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error loading courses: {error.message}
      </div>
    );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-lg bg-white shadow-md"
        >
          <div className="h-16 bg-gray-200"></div>
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Course Selection</h2>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        coursesData?._embedded.enrichedCourseModelList.map((course) => (
          <div
            key={course.courseModel.courseId}
            className="overflow-hidden rounded-lg bg-white shadow-md"
          >
            <div
              className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => toggleCourseExpansion(course.courseModel.courseId)}
            >
              <h3 className="text-lg font-medium text-gray-800">
                {course.courseModel.courseName} ({course.courseModel.courseId})
              </h3>
              <span>
                {expandedCourses[course.courseModel.courseId] ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </span>
            </div>
            {expandedCourses[course.courseModel.courseId] && (
              <div className="space-y-2 bg-gray-50 p-4">
                {course.sections.map((section) => (
                  <div
                    key={section.sectionModel.sectionId}
                    className="flex items-start rounded-md bg-white p-3 shadow-sm"
                  >
                    <input
                      type="radio"
                      id={`section-${section.sectionModel.sectionId}`}
                      name={`course-${course.courseModel.courseId}`}
                      checked={
                        selectedSections[course.courseModel.courseId]?.section
                          .sectionModel.sectionId ===
                        section.sectionModel.sectionId
                      }
                      onChange={() =>
                        handleSectionSelect(
                          course.courseModel.courseId,
                          course,
                          section,
                        )
                      }
                      className="mr-3 mt-1"
                    />
                    <label
                      htmlFor={`section-${section.sectionModel.sectionId}`}
                      className="flex-grow"
                    >
                      <div className="font-medium">
                        Professor: {section.professorModel.firstName}{" "}
                        {section.professorModel.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        Time: {section.sectionModel.day}{" "}
                        {section.sectionModel.startTime}-
                        {section.sectionModel.endTime}
                      </div>
                      <div className="text-sm text-gray-600">
                        Section: {section.sectionModel.sectionNum}
                      </div>
                      <div className="text-sm text-gray-600">
                        Capacity: {section.sectionModel.capacity}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(0, prev - 1))}
          disabled={page === 0 || isLoading}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition duration-300 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">Page {page + 1}</span>
        <button
          type="button"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={
            !coursesData ||
            coursesData._embedded.enrichedCourseModelList.length < 10 ||
            isLoading
          }
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition duration-300 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
