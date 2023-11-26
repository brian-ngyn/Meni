import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const restaurantRouter = createTRPCRouter({
  getMenu: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const restaurant = await ctx.db.restaurantInfo.findUnique({
      where: {
        id: input,
        activeMenuId: {
          not: null,
        },
      },
    });
    if (restaurant && restaurant.activeMenuId) {
      return ctx.db.menus.findFirst({
        where: {
          id: restaurant?.activeMenuId,
        },
      });
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Restaurant does not currently have an active menu",
      });
    }
  }),
  getRestaurant: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          id: input,
          activeMenuId: {
            not: null,
          },
        },
      });
      if (restaurant) {
        return restaurant;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Restaurant does not currently have an active menu",
        });
      }
    }),
});
