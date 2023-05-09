import {isSet} from 'util/types';
import {z} from 'zod';

import {createTRPCRouter, publicProcedure} from '~/server/api/trpc';

export const productRouter = createTRPCRouter({
  createProcust: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.number().min(0),
        rating: z.number().min(0).max(5),
        ratingCount: z.number().min(0),
        categoryId: z.string(),
        description: z.string().optional(),
        ImageURL: z.string().optional(),
        quantity: z.number().min(0),
      })
    )
    .mutation(async ({ctx, input}) => {
      const product = await ctx.prisma.product.create({data: input});
      return product;
    }),
  getAllProducts: publicProcedure.query(({ctx}) => {
    return ctx.prisma.product.findMany();
  }),
  getProductsByCategoryId: publicProcedure
    .input(z.object({categoryId: z.string(), compatibility: z.object({socket: z.string().optional()})}))
    .query(async ({ctx, input}) => {
      let products;

      if (input.compatibility.socket) {
        products = await ctx.prisma.product.findMany({
          where: {
            OR: [
              {
                socket: input.compatibility.socket,
              },
              {
                socket: {isSet: false},
              },
            ],
            AND: [
              {
                categoryId: input.categoryId,
              },
            ],
          },
        });
      } else {
        products = await ctx.prisma.product.findMany({
          where: {
            categoryId: input.categoryId,
          },
        });
      }

      return products;
    }),
});
