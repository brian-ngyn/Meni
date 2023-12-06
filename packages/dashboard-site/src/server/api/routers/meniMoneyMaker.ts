import { z } from "zod";

import { createTRPCRouter, onboardedProcedure } from "~/server/api/trpc";
import { MEC_checkCount } from "~/server/utils/helpers";

export const meniMoneyMakerRouter = createTRPCRouter({
  pickPlan: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        plan: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      if (
        owner?.isBetaTester ||
        (owner?.stripeCustomerId && owner?.stripePaymentId) // we need to validate this stripe info first. skip for now becuase beta.
      ) {
        await ctx.db.account.update({
          where: {
            clerkId: input.clerkId,
          },
          data: {
            currentPlan: input.plan,
            isPaid: input.plan === "tier0" ? false : true,
          },
        });
        if (input.plan === "tier3") {
          await ctx.db.restaurantInfo.update({
            where: {
              ownerId: owner.id,
            },
            data: {
              featuredPayment: true,
            },
          });
        } else if (input.plan === "tier0") {
          await ctx.db.restaurantInfo.update({
            where: {
              ownerId: owner.id,
            },
            data: {
              featuredPayment: false,
              activeMenuId: null,
            },
          });
        } else {
          await ctx.db.restaurantInfo.update({
            where: {
              ownerId: owner.id,
            },
            data: {
              featuredPayment: false,
            },
          });
        }
      } else {
        return {
          success: false,
          message: "You need to add a payment method first",
        };
      }

      return {
        success: true,
        message: "Plan updated",
      };
    }),
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
