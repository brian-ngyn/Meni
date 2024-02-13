import { type Account } from "@prisma/client";
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

export enum IPlanRole {
  BETA1 = "BETA1",
  FREE = "FREE",
}

// This should eventually be from a Mongo Table
const subscribedFeature = {
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

export const MEC_isPaid = (account: Account): boolean => {
  if (
    subscribedFeature[account.plan as IPlanRole].entitlements.includes(
      IEntitlements.SKIP_PAYMENT,
    )
  ) {
    return true;
  } else {
    return account.activePayment;
  }
};

export const MEC_checkPermissions = (
  account: Account,
  entitlement: IEntitlements,
): boolean => {
  if (MEC_isPaid(account)) {
    const allowed =
      subscribedFeature[account.plan as IPlanRole].entitlements.includes(
        entitlement,
      );
    return allowed;
  }
  return false;
};
