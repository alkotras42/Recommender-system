import {z} from 'zod';

import {createTRPCRouter, publicProcedure} from '~/server/api/trpc';

export const categoryRouter = createTRPCRouter({
  createCategory: publicProcedure
    .input(z.object({name: z.string(), description: z.string().optional()}))
    .mutation(async ({ctx, input}) => {
      const category = await ctx.prisma.category.create({
        data: input,
      });
      return category;
    }),
  getAllCategories: publicProcedure.query(({ctx}) => {
    return ctx.prisma.category.findMany({
      orderBy: {createdAt: 'asc'},
    });
  }),
  findCategoryByName: publicProcedure.input(z.object({name: z.string()})).query(async ({ctx, input}) => {
    const category = await ctx.prisma.category.findFirst({
      where: {
        name: input.name,
      },
    });
    return category;
  }),
});
