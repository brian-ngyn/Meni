import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { IEntitlements, MEC_checkPermissions } from "~/server/utils/helpers";

export const restaurantRouter = createTRPCRouter({
  getMenu: publicProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        menuId: z.string(),
      }),
    )
    .query(async (opts) => {
      const ctx = opts.ctx;
      const { restaurantId, menuId } = opts.input;
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          id: restaurantId,
        },
      });
      if (!restaurant?.activeMenuIds?.includes(menuId)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Menu not currently active",
        });
      }
      const owner = await ctx.db.account.findUnique({
        where: {
          id: restaurant?.ownerId,
        },
      });
      if (
        owner &&
        MEC_checkPermissions(owner, IEntitlements.ALLOW_PUBLISHING)
      ) {
        if (restaurant?.activeMenuIds) {
          return ctx.db.menus.findFirst({
            where: {
              id: menuId,
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
  getRestaurantMenus: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          id: input,
          activeMenuIds: {
            isEmpty: false,
          },
        },
      });
      const owner = await ctx.db.account.findUnique({
        where: {
          id: restaurant?.ownerId,
        },
      });
      if (
        owner &&
        MEC_checkPermissions(owner, IEntitlements.ALLOW_PUBLISHING)
      ) {
        if (restaurant?.activeMenuIds) {
          return ctx.db.menus.findFirst({
            where: {
              id: { in: restaurant?.activeMenuIds },
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
          activeMenuIds: {
            isEmpty: false,
          },
        },
      });
      const owner = await ctx.db.account.findUnique({
        where: {
          id: restaurant?.ownerId,
        },
      });
      if (
        owner &&
        MEC_checkPermissions(owner, IEntitlements.ALLOW_PUBLISHING)
      ) {
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
