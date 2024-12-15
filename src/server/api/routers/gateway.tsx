import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

import { env } from "~/env";
import {PagedModelEnrichedCourseModel} from "~/types/Course";
import {User} from "~/types/Course";
import {UserUpdateEmail} from "~/server/email/UserUpdateEmail";

const userUpdateSchema = z.object({
  id: z.number(),
  name: z.string(),
  expectedGraduationMonth: z.string().nullable(),
  expectedGraduationYear: z.number().nullable(),
  majors: z.array(z.string()),
});

const gatewayRouter = createTRPCRouter({
  updateUser: publicProcedure
    .input(userUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const jwt = await getJwt(input.id);

      const url = `${env.GATEWAY_URL}/users/${input.id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          id: input.id,
          name: input.name,
          expectedGraduationMonth: input.expectedGraduationMonth,
          expectedGraduationYear: input.expectedGraduationYear,
          majors: input.majors.map((majorId) => ({ majorId })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser:User = await response.json() as User;

      await ctx.resend.emails.send({
        from: 'Plan4CU <plan4cu@rutmiandakash.com>',
        to: updatedUser.email,
        subject: 'Your account was updated.',
        react: <UserUpdateEmail name={updatedUser.name} expectedGraduationMonth={updatedUser.expectedGraduationMonth} expectedGraduationYear={updatedUser.expectedGraduationYear}
          majors={updatedUser.majors.map((major) => major.majorName)}
        />
      });


      return updatedUser;
    }),
  getRelevantCourses: publicProcedure
    .input(
      z.object({
        page: z.number().default(0),
        size: z.number().default(20),
        sort: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId: number = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const jwt = await getJwt(userId);

      const url = new URL(`${env.GATEWAY_URL}/classes/relevant`);
      url.searchParams.append("page", input.page.toString());
      url.searchParams.append("size", input.size.toString());
      if (input.sort) {
        url.searchParams.append("sort", input.sort);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch relevant courses - status: " + response.status);
      }

      const data: PagedModelEnrichedCourseModel = await response.json();
      console.log(data)

      return data;
    }),
});

const getJwt = async (user_id: number) => {
  const url = `${env.GATEWAY_URL}/users/${user_id}/jwt`;
  const response = await fetch(url, {
    method: "POST",
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const responseJson: { token: string } = await response.json();

  return responseJson.token;
};

export { gatewayRouter };
