import { getDistance } from "geolib";
import { z } from "zod";

import { type RestaurantInfo } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const homeRouter = createTRPCRouter({
  getFeaturedRestaurants: publicProcedure.query(({ ctx }) => {
    return ctx.db.restaurantInfo.findMany({
      where: {
        featuredPayment: true,
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
      const allRestaurants = await ctx.db.restaurantInfo.findMany();
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
          const isWithinRadius = distance <= 20000;

          return {
            ...restaurant,
            distance,
            isWithinRadius,
          };
        })
        .filter((restaurant) => restaurant.isWithinRadius);
      return restaurantsWithinRadius;
    }),
});
