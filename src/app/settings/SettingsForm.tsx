"use client";
import { useState } from "react";
import type { Major, User } from "@prisma/client";
import { api } from "~/trpc/react";
import toast, { Toaster } from "react-hot-toast";

type SettingsFormProps = {
  user: User & { majors: { major: Major }[] };
  allMajors: Major[];
};

export default function SettingsForm({ user, allMajors }: SettingsFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [graduationMonth, setGraduationMonth] = useState(
    user.expected_graduation_month ?? "",
  );
  const [graduationYear, setGraduationYear] = useState(
    user.expected_graduation_year?.toString() ?? "",
  );
  const [selectedMajors, setSelectedMajors] = useState<string[]>(
    user.majors.map((um) => um.major.major_id),
  );

  const utils = api.useUtils();

  const updateUserMutation = api.gateway.updateUser.useMutation({
    onSuccess: () => {
      utils.gateway.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await toast.promise(
      updateUserMutation.mutateAsync({
        id: user.id,
        name,
        expectedGraduationMonth: graduationMonth,
        expectedGraduationYear: graduationYear
          ? parseInt(graduationYear)
          : null,
        majors: selectedMajors,
      }),
      {
        loading: "Updating your profile...",
        success: (data) => {
          console.log("User updated successfully", data);
          return "Profile updated successfully!";
        },
        error: (err) => {
          console.error("Error updating user:", err);
          return "Failed to update profile. Please try again.";
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-columbia-blue focus:ring-columbia-blue"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={user.email ?? ""}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
        />
      </div>
      <div>
        <label
          htmlFor="majors"
          className="block text-sm font-medium text-gray-700"
        >
          Majors
        </label>
        <select
          id="majors"
          multiple
          value={selectedMajors}
          onChange={(e) =>
            setSelectedMajors(
              Array.from(e.target.selectedOptions, (option) => option.value),
            )
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-columbia-blue focus:ring-columbia-blue"
        >
          {allMajors.map((major) => (
            <option key={major.major_id} value={major.major_id}>
              {major.major_name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="graduationMonth"
            className="block text-sm font-medium text-gray-700"
          >
            Expected Graduation Month
          </label>
          <select
            id="graduationMonth"
            value={graduationMonth}
            onChange={(e) => setGraduationMonth(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-columbia-blue focus:ring-columbia-blue"
          >
            <option value="">Select Month</option>
            <option value="May">May</option>
            <option value="December">December</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="graduationYear"
            className="block text-sm font-medium text-gray-700"
          >
            Expected Graduation Year
          </label>
          <input
            type="number"
            id="graduationYear"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-columbia-blue focus:ring-columbia-blue"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-columbia-blue px-4 py-2 text-white transition duration-300 hover:bg-columbia-blue/90 focus:outline-none focus:ring-2 focus:ring-columbia-blue focus:ring-offset-2"
          disabled={updateUserMutation.isPending}
        >
          {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
