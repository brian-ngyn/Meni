import { type User } from "@clerk/nextjs/dist/types/server";
import { IPlanRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export enum IEntitlements {
  RESTAURANT_COUNT_1 = "RESTAURANT_COUNT_1",
  RESTAURANT_COUNT_2 = "RESTAURANT_COUNT_2",
  RESTAURANT_COUNT_3 = "RESTAURANT_COUNT_3",
  FEATURED = "FEATURED",
  ALLOW_PUBLISHING = "ALLOW_PUBLISHING", // can see on explore site and scan qr code
  MENU_COUNT_1 = "MENU_COUNT_1",
  MENU_COUNT_2 = "MENU_COUNT_2",
  MENU_COUNT_3 = "MENU_COUNT_3",
  SKIP_PAYMENT = "SKIP_PAYMENT",
}
export type IPlanFeatures = {
  inMarket: boolean;
  grandfathered: boolean;
  releaseDate: Date;
  activeUntil: Date;
  entitlements: IEntitlements[];
};

export type ISubscribedFeatures = {
  [key in IPlanRole]: IPlanFeatures;
};

// This should eventually be from a Mongo Table
export const subscribedFeature: ISubscribedFeatures = {
  [IPlanRole.BETA1]: {
    inMarket: true,
    grandfathered: false,
    releaseDate: new Date("2024-01-01"),
    activeUntil: new Date("2999-01-01"),
    entitlements: [
      IEntitlements.RESTAURANT_COUNT_3,
      IEntitlements.MENU_COUNT_3,
      IEntitlements.FEATURED,
      IEntitlements.ALLOW_PUBLISHING,
      IEntitlements.SKIP_PAYMENT,
    ],
  },
  [IPlanRole.FREE]: {
    inMarket: true,
    grandfathered: false,
    releaseDate: new Date("2024-01-01"),
    activeUntil: new Date("2999-01-01"),
    entitlements: [
      IEntitlements.RESTAURANT_COUNT_1,
      IEntitlements.MENU_COUNT_1,
    ],
  },
};

export const MEC_isPaid = (clerkUser: User): void => {
  if (
    subscribedFeature[
      clerkUser.publicMetadata.plan as IPlanRole
    ].entitlements.includes(IEntitlements.SKIP_PAYMENT)
  ) {
    return;
  } else {
    if (!clerkUser.publicMetadata.activePayment) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User does not have an active payment",
      });
    }
  }
};

export const MEC_checkPermissions = (
  clerkUser: User,
  entitlement: IEntitlements,
): void => {
  MEC_isPaid(clerkUser);
  const allowed =
    subscribedFeature[
      clerkUser.publicMetadata.plan as IPlanRole
    ].entitlements.includes(entitlement);
  if (!allowed) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "User is not authorized to use this feature for the current plan",
    });
  }
};

export const MEC_checkCount = (
  clerkUser: User,
  typeToCheck: "RESTAURANT" | "MENU",
  count: number, // this count represents the CURRENT restaurant or menu count before adding
): void => {
  MEC_isPaid(clerkUser);
  for (const entitlement of subscribedFeature[
    clerkUser.publicMetadata.plan as IPlanRole
  ].entitlements) {
    if (entitlement.startsWith(`${typeToCheck}_COUNT_`)) {
      const countAllowed = entitlement.split(`${typeToCheck}_COUNT_`)[1];
      if (countAllowed && count < parseInt(countAllowed)) {
        return;
      }
    }
  }
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "User is not authorized to use this feature for the current plan",
  });
};
