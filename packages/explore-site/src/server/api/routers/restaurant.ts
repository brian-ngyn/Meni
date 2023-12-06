import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type IPlanRole, MEC_isPublishable } from "~/server/utils/helpers";

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
    const owner = await ctx.db.account.findUnique({
      where: {
        id: restaurant?.ownerId,
      },
    });
    if (owner && MEC_isPublishable(owner.plan as IPlanRole)) {
      if (restaurant && restaurant.activeMenuId) {
        return ctx.db.menus.findFirst({
          where: {
            id: restaurant?.activeMenuId,
          },
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Restaurant does not have an active menu",
        });
      }
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Restaurant does not have a valid plan",
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
      const owner = await ctx.db.account.findUnique({
        where: {
          id: restaurant?.ownerId,
        },
      });
      if (owner && MEC_isPublishable(owner.plan as IPlanRole)) {
        if (restaurant) {
          return restaurant;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Restaurant does not currently have an active menu",
          });
        }
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Restaurant does not have a valid plan",
        });
      }
    }),
});
