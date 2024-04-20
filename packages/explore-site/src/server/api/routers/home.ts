import { getDistance } from "geolib";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { IEntitlements, MEC_checkPermissions } from "~/server/utils/helpers";

export const homeRouter = createTRPCRouter({
  getFeaturedRestaurants: publicProcedure.query(async ({ ctx }) => {
    const activeRestaurants = await ctx.db.restaurantInfo.findMany({
      where: {
        activeMenuIds: {
          isEmpty: false,
        },
      },
    });
    const owners = await ctx.db.account.findMany({
      where: {
        id: {
          in: activeRestaurants.map((restaurant) => restaurant.ownerId),
        },
      },
    });
    const validOwners = owners.filter(
      (owner) =>
        MEC_checkPermissions(owner, IEntitlements.FEATURED) &&
        MEC_checkPermissions(owner, IEntitlements.ALLOW_PUBLISHING),
    );
    return activeRestaurants.filter((restaurant) =>
      validOwners.find((owner) => owner.id === restaurant.ownerId),
    );
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
          activeMenuIds: {
            isEmpty: false,
          },
        },
      });
      const owners = await ctx.db.account.findMany({
        where: {
          id: {
            in: allRestaurants.map((restaurant) => restaurant.ownerId),
          },
        },
      });
      const validOwners = owners.filter((owner) =>
        MEC_checkPermissions(owner, IEntitlements.ALLOW_PUBLISHING),
      );
      const validRestaurants = allRestaurants.filter((restaurant) =>
        validOwners.find((owner) => owner.id === restaurant.ownerId),
      );
      const restaurantsWithinRadius = validRestaurants
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
    const foundRestaurants = await ctx.db.restaurantInfo.findMany({
      where: {
        name: {
          contains: input,
          mode: "insensitive",
        },
      },
    });
    const owners = await ctx.db.account.findMany({
      where: {
        id: {
          in: foundRestaurants.map((restaurant) => restaurant.ownerId),
        },
      },
    });
    const validOwners = owners.filter((owner) =>
      MEC_checkPermissions(owner, IEntitlements.ALLOW_PUBLISHING),
    );
    return foundRestaurants.filter((restaurant) =>
      validOwners.find((owner) => owner.id === restaurant.ownerId),
    );
  }),
});
