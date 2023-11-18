import { z } from "zod";

import { clerkClient } from "@clerk/nextjs";
import { geocode } from "@esri/arcgis-rest-geocoding";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { TRPCError } from "@trpc/server";

import { env } from "~/env.mjs";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const onboardingRouter = createTRPCRouter({
  signUp: privateProcedure
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
      const userSubmittingRequest = await clerkClient.users.getUser(ctx.userId);
      if (userSubmittingRequest.publicMetadata.onboardingComplete) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User has already completed onboarding1",
        });
      } else {
        const ArcGIS_auth = ApiKeyManager.fromKey(env.ARCGIS_KEY);
        const geoLocation = await geocode({
          address: input.address,
          authentication: ArcGIS_auth,
        });

        const newAccount = await ctx.db.account.create({
          data: {
            email: userSubmittingRequest?.emailAddresses[0]?.emailAddress || "",
            firstName: input.firstName,
            lastName: input.lastName,
            clerkId: userSubmittingRequest.id,
            currentPlan: "tier0",
          },
        });

        await ctx.db.restaurantInfo.create({
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

        // SET TIER 3
        // REMOVE IN FUTURE
        await ctx.db.account.update({
          where: {
            clerkId: userSubmittingRequest.id,
          },
          data: {
            currentPlan: "tier3",
            isPaid: true,
          },
        });
        await ctx.db.restaurantInfo.update({
          where: {
            ownerId: newAccount.id,
          },
          data: {
            featuredPayment: true,
          },
        });
        // SET TIER 3
        // REMOVE IN FUTURE

        // update the user's public metadata to indicate onboarding is complete
        await clerkClient.users.updateUser(userSubmittingRequest.id, {
          publicMetadata: {
            onboardingComplete: true,
          },
        });

        return {
          success: true,
          message: "Onboarding complete",
        };
      }
    }),
});
