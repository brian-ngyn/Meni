import { z } from "zod";

import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const meniMoneyMakerRouter = createTRPCRouter({
  pickPlan: privateProcedure
    .input(
      z.object({
        clerkId: z.string(),
        plan: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId !== input.clerkId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to view this account",
        });
      }
      const userSubmittingRequest = await clerkClient.users.getUser(ctx.userId);
      if (!userSubmittingRequest.publicMetadata.onboardingComplete) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User has not completed onboarding",
        });
      }

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
});
