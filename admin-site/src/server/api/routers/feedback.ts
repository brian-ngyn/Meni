import { z } from "zod";

import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
  sendFeedback: privateProcedure
    .input(z.object({ clerkId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId !== input.clerkId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to send feedback",
        });
      }
      const userSubmittingRequest = await clerkClient.users.getUser(ctx.userId);
      if (!userSubmittingRequest.publicMetadata.onboardingComplete) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to send feedback",
        });
      }

      const currentAccount = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const currentRestaurant = await ctx.db.restaurantInfo.findFirst({
        where: {
          ownerId: currentAccount?.id,
        },
      });

      const response = await fetch(
        "https://discord.com/api/webhooks/1176025109966897162/ZWDIHR4h9C6-raVmg_1LIKsQWkMIntfEguxRpdyyddTo2nisS1BiNLJ9t0ymp_L4vxmG",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                title: "New User Feedback",
                color: 5814783,
                description: `**Clerk ID:** ${userSubmittingRequest.id}\n**Account ID:** ${currentAccount?.id}\n**Restaurant ID:** ${currentRestaurant?.id}\n\n**Message:** ${input.content}`,
              },
            ],
          }),
        },
      );
      return {
        success: response.ok,
      };
    }),
});
