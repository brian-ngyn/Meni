import { z } from "zod";

import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const gettersRouter = createTRPCRouter({
  getAccountInfo: privateProcedure
    .input(
      z.object({
        clerkId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
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

      return await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
    }),

  getRestaurantInfo: privateProcedure
    .input(
      z.object({
        clerkId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
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
      if (owner && owner.id) {
        return await ctx.db.restaurantInfo.findFirst({
          where: {
            ownerId: owner.id,
          },
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Restaurant with this owner does not exist",
        });
      }
    }),

  getMenusBrief: privateProcedure
    .input(
      z.object({
        clerkId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.userId !== input.clerkId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to view menus for this account",
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
      const restaurant = await ctx.db.restaurantInfo.findFirst({
        where: {
          ownerId: owner?.id,
        },
      });
      if (restaurant && restaurant.id) {
        return await ctx.db.menus.findMany({
          where: {
            restaurantId: restaurant.id,
          },
          select: {
            id: true,
            name: true,
          },
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Restaurant with this owner does not exist",
        });
      }
    }),

  getMenu: privateProcedure
    .input(
      z.object({
        clerkId: z.string(),
        menuId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.userId !== input.clerkId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to get the menu for this account",
        });
      }
      const userSubmittingRequest = await clerkClient.users.getUser(ctx.userId);
      if (!userSubmittingRequest.publicMetadata.onboardingComplete) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to get the menu for this account",
        });
      }

      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const restaurant = await ctx.db.restaurantInfo.findFirst({
        where: {
          ownerId: owner?.id,
        },
      });
      const menu = await ctx.db.menus.findFirst({
        where: {
          id: input.menuId,
        },
      });
      if (menu && menu.restaurantId !== restaurant?.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Menu does not belong to this restaurant",
        });
      }

      return menu;
    }),
});