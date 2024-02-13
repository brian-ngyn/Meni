import { z } from "zod";

import { clerkClient } from "@clerk/nextjs";
import { geocode } from "@esri/arcgis-rest-geocoding";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { IPlanRole } from "@prisma/client";

import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  onboardedProcedure,
  onboardingProcedure,
} from "~/server/api/trpc";
import { MEC_checkCount } from "~/server/utils/helpers";

export const onboardingRouter = createTRPCRouter({
  signUp: onboardingProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        restaurantName: z.string(),
        address: z.string(),
        restaurantPhoneNumber: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ArcGIS_auth = ApiKeyManager.fromKey(env.ARCGIS_KEY);
      const geoLocation = await geocode({
        address: input.address,
        authentication: ArcGIS_auth,
      });

      const newAccount = await ctx.db.account.create({
        data: {
          email:
            ctx.userSubmittingRequest?.emailAddresses[0]?.emailAddress || "",
          firstName: input.firstName,
          lastName: input.lastName,
          clerkId: ctx.userSubmittingRequest.id,
          activePayment: false,
          plan: "FREE",
        },
      });

      const newRestaurant = await ctx.db.restaurantInfo.create({
        data: {
          ownerId: newAccount.id,
          name: input.restaurantName,
          address: input.address,
          phoneNumber: input.restaurantPhoneNumber,
          description: input.description,
          image: "fa2fa419-2459-4784-975b-3c62a9697a49-ncfuw.png",
          geoLocation: {
            latitude: geoLocation.candidates[0]?.location.y || 0,
            longitude: geoLocation.candidates[0]?.location.x || 0,
          },
        },
      });

      // ****************************************************
      // ********SET BETA PLAN REMOVE IN THE FUTURE *********
      // ****************************************************
      await ctx.db.account.update({
        where: {
          clerkId: ctx.userSubmittingRequest.id,
        },
        data: {
          activePayment: false, // remove in future, set this via stripe
          lastPaidAt: null, // remove in future, set this via stripe
          plan: IPlanRole.FREE, // set it to BETA1 for now, FREE in the future
        },
      });
      // ****************************************************
      // ********SET BETA PLAN REMOVE IN THE FUTURE *********
      // ****************************************************

      // update the user's public metadata to indicate onboarding is complete
      if (newAccount && newRestaurant) {
        await clerkClient.users.updateUser(ctx.userSubmittingRequest.id, {
          publicMetadata: {
            onboardingComplete: true,
            activePayment: false, // remove in future, set this via stripe
            lastPaidAt: null, // remove in future, set this via stripe
            plan: IPlanRole.FREE, // set it to BETA1 for now, FREE in the future
          },
        });
      }
      // ****************************************************
      // ********SET BETA PLAN REMOVE IN THE FUTURE *********
      // ****************************************************

      return {
        success: true,
        message: "Onboarding complete",
      };
    }),

  newRestaurant: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        restaurantName: z.string(),
        address: z.string(),
        restaurantPhoneNumber: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.account.findFirst({
        where: {
          clerkId: ctx.userId,
        },
      });
      const restaurantCount = await ctx.db.restaurantInfo.count({
        where: {
          ownerId: account?.id as string,
        },
      });
      MEC_checkCount(ctx.userSubmittingRequest, "RESTAURANT", restaurantCount);

      const ArcGIS_auth = ApiKeyManager.fromKey(env.ARCGIS_KEY);
      const geoLocation = await geocode({
        address: input.address,
        authentication: ArcGIS_auth,
      });
      const newRestaurant = await ctx.db.restaurantInfo.create({
        data: {
          ownerId: account?.id as string, // guaranteed since we check onboarding
          name: input.restaurantName,
          address: input.address,
          phoneNumber: input.restaurantPhoneNumber,
          description: input.description,
          image: "fa2fa419-2459-4784-975b-3c62a9697a49-ncfuw.png",
          geoLocation: {
            latitude: geoLocation.candidates[0]?.location.y || 0,
            longitude: geoLocation.candidates[0]?.location.x || 0,
          },
        },
      });

      return {
        success: newRestaurant ? true : false,
        message: "New restaurant added",
      };
    }),
});
