import { getDistance } from "geolib";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const homeRouter = createTRPCRouter({
  getFeaturedRestaurants: publicProcedure.query(({ ctx }) => {
    return ctx.db.restaurantInfo.findMany({
      where: {
        // featuredPayment: true, // need to change this to use entitlements !
        activeMenuId: {
          not: null,
        },
      },
    });
  }),
  getLocalRestaurants: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // return the list of restaurants that have the same geoLocation as the user's location
      const allRestaurants = await ctx.db.restaurantInfo.findMany({
        where: {
          activeMenuId: {
            not: null,
          },
        },
      });
      const restaurantsWithinRadius = allRestaurants
        .map((restaurant) => {
          const restaurantLatitude = restaurant.geoLocation.latitude;
          const restaurantLongitude = restaurant.geoLocation.longitude;

          // Calculate the distance between the input coordinates and the restaurant's coordinates
          const distance = getDistance(
            { latitude: input.latitude, longitude: input.longitude },
            { latitude: restaurantLatitude, longitude: restaurantLongitude },
          );

          // Check if the restaurant is within the specified radius
          const isWithinRadius = distance <= 40000;

          return {
            ...restaurant,
            distance,
            isWithinRadius,
          };
        })
        .filter((restaurant) => restaurant.isWithinRadius);
      return restaurantsWithinRadius;
    }),
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.restaurantInfo.findMany({
      where: {
        name: {
          contains: input,
          mode: "insensitive",
        },
      },
    });
  }),
});
