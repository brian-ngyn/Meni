import { z } from "zod";

import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const settersRouter = createTRPCRouter({
  updateRestaurantInfo: privateProcedure
    .input(
      z.object({
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

  createMenu: privateProcedure
    .input(
      // this needs to be fixed to use the prisma type.. idk how to do that yet.
      z.object({
        clerkId: z.string(),
        newMenu: z.object({
          id: z.string(),
          name: z.string(),
          restaurantId: z.string(),
          tags: z.array(z.string()),
          mainCategories: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              subCategories: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  items: z.array(
                    z.object({
                      id: z.string(),
                      name: z.string(),
                      price: z.number(),
                      description: z.string(),
                      image: z.string(),
                      tags: z.array(z.string()),
                    }),
                  ),
                }),
              ),
            }),
          ),
        }),
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
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          ownerId: owner?.id,
        },
      });

      if (restaurant?.id !== input.newMenu.restaurantId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to update this restaurant",
        });
      }

      await ctx.db.menus.create({
        data: {
          ...input.newMenu,
        },
      });

      return {
        success: "true",
        message: "Menu created successfully",
      };
    }),
});
