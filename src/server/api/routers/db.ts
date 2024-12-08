import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const dbRouter = createTRPCRouter({
  majorsForUser: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const userMajors = await ctx.db.user_Major.findMany({
        where: { user_id: input },
        include: { major: true },
      });
      return userMajors.map((um) => um.major);
    }),
  majors: publicProcedure.query(async ({ ctx }) => {
    const majors = await ctx.db.major.findMany({
      orderBy: { major_name: "asc" },
    });
    return majors;
  }),
});

export { dbRouter };
