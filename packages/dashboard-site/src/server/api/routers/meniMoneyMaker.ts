import { z } from "zod";

import { createTRPCRouter, onboardedProcedure } from "~/server/api/trpc";
import { MEC_checkCount } from "~/server/utils/helpers";

export const meniMoneyMakerRouter = createTRPCRouter({
  createMenuCheck: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        restaurantId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          ownerId: owner?.id,
          id: input.restaurantId,
        },
      });

      const menuLength = await ctx.db.menus.count({
        where: {
          restaurantId: restaurant?.id,
        },
      });
      MEC_checkCount(ctx.userSubmittingRequest, "MENU", menuLength);
      return {
        success: true,
      };
    }),

  createRestaurantCheck: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const restaurantLength = await ctx.db.restaurantInfo.count({
        where: {
          ownerId: owner?.id,
        },
      });
      MEC_checkCount(ctx.userSubmittingRequest, "RESTAURANT", restaurantLength);
      return {
        success: true,
      };
    }),
});
