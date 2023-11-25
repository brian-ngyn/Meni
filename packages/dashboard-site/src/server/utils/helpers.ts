export enum IEntitlements {
  RESTAURANT_COUNT_1 = "RESTAURANT_COUNT_1",
  RESTAURANT_COUNT_2 = "RESTAURANT_COUNT_2",
  RESTAURANT_COUNT_3 = "RESTAURANT_COUNT_3",
  RESTAURANT_COUNT_4 = "RESTAURANT_COUNT_4",
  FEATURED = "FEATURED",
  ALLOW_PUBLISHING = "ALLOW_PUBLISHING",
  MENU_COUNT_1 = "MENU_COUNT_1",
  MENU_COUNT_2 = "MENU_COUNT_2",
  MENU_COUNT_3 = "MENU_COUNT_3",
  MENU_COUNT_4 = "MENU_COUNT_4",
  MENU_COUNT_5 = "MENU_COUNT_5",
}

export enum IPlanRole {
  BETA1 = "BETA1",
}

// This should eventually be from a Mongo Table
const subscribedFeature = {
  [IPlanRole.BETA1]: [
    IEntitlements.RESTAURANT_COUNT_1,
    IEntitlements.RESTAURANT_COUNT_2,
    IEntitlements.RESTAURANT_COUNT_3,
    IEntitlements.RESTAURANT_COUNT_4,
    IEntitlements.FEATURED,
    IEntitlements.ALLOW_PUBLISHING,
  ],
};

export const checkPermissions = (
  role: IPlanRole,
  entitlement: IEntitlements,
): boolean => {
  return subscribedFeature[role].includes(entitlement);
};
