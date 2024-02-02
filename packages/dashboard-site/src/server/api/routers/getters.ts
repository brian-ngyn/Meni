import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  onboardedProcedure,
  privateProcedure,
} from "~/server/api/trpc";

interface Suggestions {
  suggestions: [
    {
      text: string;
    },
  ];
}

export const gettersRouter = createTRPCRouter({
  getContextData: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accountInfo = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      if (accountInfo && accountInfo.id) {
        const allRestaurantInfo = await ctx.db.restaurantInfo.findMany({
          where: {
            ownerId: accountInfo.id,
          },
        });
        return {
          accountInfo,
          allRestaurantInfo,
        };
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Restaurant with this owner does not exist",
        });
      }
    }),

  getRestaurantInfo: onboardedProcedure
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
      if (owner && owner.id) {
        return await ctx.db.restaurantInfo.findFirst({
          where: {
            id: input.restaurantId,
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

  getMenusBrief: onboardedProcedure
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
      const restaurant = await ctx.db.restaurantInfo.findFirst({
        where: {
          ownerId: owner?.id,
          id: input.restaurantId,
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

  getMenu: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        menuId: z.string(),
        restaurantId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const restaurant = await ctx.db.restaurantInfo.findFirst({
        where: {
          ownerId: owner?.id,
          id: input.restaurantId,
        },
      });
      const menu = await ctx.db.menus.findFirst({
        where: {
          id: input.menuId,
          restaurantId: restaurant?.id,
        },
      });
      if (menu?.restaurantId !== restaurant?.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Menu does not belong to this restaurant",
        });
      }

      return menu;
    }),

  getAddressSuggestions: privateProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cleanInput = input.address.replace(/[^a-zA-Z0-9 ]/g, "");
      const response = await fetch(
        `https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${cleanInput}&f=json&token=${env.ARCGIS_KEY}`,
        {
          method: "GET",
        },
      );

      const suggestions = response.json().then((data: Suggestions) => {
        return data.suggestions.map((suggestion, i) => ({
          address: suggestion.text,
          id: i,
        }));
      });
      return suggestions;
    }),
});
