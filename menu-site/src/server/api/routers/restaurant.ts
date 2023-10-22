import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const restaurantRouter = createTRPCRouter({
  getMenu: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const restaurant = await ctx.db.restaurantInfo.findUnique({
      where: {
        id: input,
      },
    });
    if (restaurant && restaurant.activeMenuId) {
      return ctx.db.menus.findFirst({
        where: {
          id: restaurant?.activeMenuId,
        },
      });
    }
  }),
  getRestaurant: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.restaurantInfo.findUnique({
        where: {
          id: input,
        },
      });
    }),
});
