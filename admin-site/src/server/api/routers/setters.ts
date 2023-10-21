import { z } from "zod";

import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const settersRouter = createTRPCRouter({
  updateRestaurantInfo: privateProcedure
    .input(
      z.object({
        id: z.string(),
        clerkId: z.string(),
        name: z.string(),
        address: z.string(),
        phoneNumber: z.string(),
        description: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId !== input.clerkId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to update this restaurant info",
        });
      }
      const userSubmittingRequest = await clerkClient.users.getUser(ctx.userId);
      if (!userSubmittingRequest.publicMetadata.onboardingComplete) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to update this restaurant info",
        });
      }

      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });

      await ctx.db.restaurantInfo.update({
        where: {
          ownerId: owner?.id,
        },
        data: {
          name: input.name,
          address: input.address,
          phoneNumber: input.phoneNumber,
          description: input.description,
          image: input.image,
        },
      });

      return {
        success: true,
        message: "Restaurant Info updated",
      };
    }),
  updateAccount: privateProcedure
    .input(
      z.object({
        id: z.string(),
        clerkId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId !== input.clerkId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to update this account info",
        });
      }
      const userSubmittingRequest = await clerkClient.users.getUser(ctx.userId);
      if (!userSubmittingRequest.publicMetadata.onboardingComplete) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to update this account info",
        });
      }

      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });

      await ctx.db.account.update({
        where: {
          id: owner?.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });

      return {
        success: true,
        message: "Account Info updated",
      };
    }),
});
