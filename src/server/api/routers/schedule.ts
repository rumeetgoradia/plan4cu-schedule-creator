import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

import { env } from "~/env";
import { PagedModelEnrichedCourseModel } from "~/types/Course";

export const scheduleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        label: z.string(),
        sectionIds: z.array(z.number()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const newSchedule = await ctx.db.schedule.create({
        data: {
          user_id: input.userId,
          label: input.label,
          schedule_sections: {
            create: input.sectionIds.map((sectionId) => ({
              section_id: sectionId,
            })),
          },
        },
        include: {
          schedule_sections: true,
        },
      });
      return newSchedule;
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const schedule = await ctx.db.schedule.findUnique({
        where: { schedule_id: input.id },
      });
      if (!schedule) throw new Error("Schedule not found");
      return schedule;
    }),

  getSections: protectedProcedure
    .input(z.object({ scheduleId: z.number() }))
    .query(async ({ input, ctx }) => {
      const sections = await ctx.db.schedule_Section.findMany({
        where: { schedule_id: input.scheduleId },
        include: {
          section: {
            include: {
              course: true,
              professor: true,
            },
          },
        },
      });
      // You might need to transform this data to match your EnrichedSectionModel
      return sections.map((s) => ({
        sectionModel: s.section,
        courseModel: s.section.course,
        professorModel: s.section.professor,
      }));
    }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const schedules = await ctx.db.schedule.findMany({
            where: { user_id: ctx.session.user.id },
            orderBy: { created_at: 'desc' },
        });
        return schedules;
    }),

    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.schedule.delete({
                where: { schedule_id: input.id },
            });
            return { success: true };
        }),
});
