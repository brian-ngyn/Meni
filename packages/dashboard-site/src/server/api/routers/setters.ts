import { z } from "zod";

import { geocode } from "@esri/arcgis-rest-geocoding";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { type Menus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { env } from "~/env.mjs";
import { createTRPCRouter, onboardedProcedure } from "~/server/api/trpc";
import {
  IEntitlements,
  MEC_checkCount,
  MEC_checkPermissions,
} from "~/server/utils/helpers";

export const settersRouter = createTRPCRouter({
  updateRestaurantInfo: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        restaurantId: z.string(),
        name: z.string(),
        address: z.string(),
        phoneNumber: z.string(),
        description: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });

      const currentRestaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          ownerId: owner?.id,
          id: input.restaurantId,
        },
      });
      if (currentRestaurant && currentRestaurant?.address !== input.address) {
        const ArcGIS_auth = ApiKeyManager.fromKey(env.ARCGIS_KEY);
        const geoLocation = await geocode({
          address: input.address,
          authentication: ArcGIS_auth,
        });
        await ctx.db.restaurantInfo.update({
          where: {
            ownerId: owner?.id,
            id: input.restaurantId,
          },
          data: {
            name: input.name,
            address: input.address,
            phoneNumber: input.phoneNumber,
            description: input.description,
            image: input.image,
            geoLocation: {
              latitude: geoLocation.candidates[0]?.location.y || 0,
              longitude: geoLocation.candidates[0]?.location.x || 0,
            },
          },
        });
      } else if (currentRestaurant) {
        await ctx.db.restaurantInfo.update({
          where: {
            ownerId: owner?.id,
            id: input.restaurantId,
          },
          data: {
            name: input.name,
            address: input.address,
            phoneNumber: input.phoneNumber,
            description: input.description,
            image: input.image,
          },
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to update this restaurant info",
        });
      }

      return {
        success: true,
        message: "Restaurant Info updated",
      };
    }),
  updateAccount: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

  createMenu: onboardedProcedure
    .input(
      // this needs to be fixed to use the prisma type.. idk how to do that yet.
      z.object({
        clerkId: z.string(),
        restaurantId: z.string(),
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
                      price: z.string(),
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
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          ownerId: owner?.id,
          id: input.restaurantId,
        },
      });

      const menuLength = await ctx.db.menus.count({
        where: {
          restaurantId: restaurant?.id,
        },
      });
      MEC_checkCount(ctx.userSubmittingRequest, "MENU", menuLength);

      if (restaurant?.id !== input.newMenu.restaurantId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to update this restaurant info",
        });
      }

      const parsedPrices: Menus = {
        ...input.newMenu,
        mainCategories: input.newMenu.mainCategories.map((item) => {
          const subCategories = item.subCategories.map((subItem) => {
            const menuItems = subItem.items.map((menuItem) => {
              const inputPrice = menuItem.price.trim();
              let parsedPrice: string;
              if (inputPrice === "" || /[a-zA-Z]/.test(inputPrice)) {
                parsedPrice = "0.00";
              } else {
                const num = parseFloat(inputPrice);
                if (isNaN(num)) {
                  parsedPrice = "0.00";
                } else {
                  parsedPrice = num.toFixed(2);
                }
              }
              return {
                ...menuItem,
                price: parsedPrice,
              };
            });
            return {
              ...subItem,
              items: menuItems,
            };
          });
          return {
            ...item,
            subCategories: subCategories,
          };
        }),
      };

      await ctx.db.menus.create({
        data: {
          ...parsedPrices,
        },
      });

      return {
        success: "true",
        message: "Menu created successfully",
        menuId: input.newMenu.id,
      };
    }),

  updateMenu: onboardedProcedure
    .input(
      // this needs to be fixed to use the prisma type.. idk how to do that yet.
      z.object({
        clerkId: z.string(),
        restaurantId: z.string(),
        updatedMenu: z.object({
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
                      price: z.string(),
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
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          ownerId: owner?.id,
          id: input.restaurantId,
        },
      });

      if (!restaurant || restaurant?.id !== input.updatedMenu.restaurantId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to update this restaurant's menu",
        });
      }

      const parsedPrices: Menus = {
        ...input.updatedMenu,
        mainCategories: input.updatedMenu.mainCategories.map((item) => {
          const subCategories = item.subCategories.map((subItem) => {
            const menuItems = subItem.items.map((menuItem) => {
              const inputPrice = menuItem.price.trim();
              let parsedPrice: string;
              if (inputPrice === "" || /[a-zA-Z]/.test(inputPrice)) {
                parsedPrice = "0.00";
              } else {
                const num = parseFloat(inputPrice);
                if (isNaN(num)) {
                  parsedPrice = "0.00";
                } else {
                  parsedPrice = num.toFixed(2);
                }
              }
              return {
                ...menuItem,
                price: parsedPrice,
              };
            });
            return {
              ...subItem,
              items: menuItems,
            };
          });
          return {
            ...item,
            subCategories: subCategories,
          };
        }),
      };

      const menuWithoutId = { ...parsedPrices, id: undefined };
      await ctx.db.menus.update({
        where: {
          id: input.updatedMenu.id,
          restaurantId: restaurant.id,
        },
        data: {
          ...menuWithoutId,
        },
      });

      return {
        success: "true",
        message: "Menu updated successfully",
      };
    }),

  setActiveMenu: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        menuId: z.string(),
        restaurantId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      MEC_checkPermissions(
        ctx.userSubmittingRequest,
        IEntitlements.ALLOW_PUBLISHING,
      );
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          ownerId: owner?.id,
          id: input.restaurantId,
        },
      });
      const menu = await ctx.db.menus.findUnique({
        where: {
          id: input.menuId,
          restaurantId: restaurant?.id,
        },
      });
      if (!menu) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "User is not authorized to update this account's active menu",
        });
      }
      await ctx.db.restaurantInfo.update({
        where: {
          id: restaurant?.id,
        },
        data: {
          activeMenuId: input.menuId,
        },
      });

      return {
        success: "true",
        message: "Active menu set successfully",
      };
    }),

  renameMenu: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        restaurantId: z.string(),
        menuId: z.string(),
        newName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          ownerId: owner?.id,
          id: input.restaurantId,
        },
      });
      if (restaurant) {
        const menu = await ctx.db.menus.findUnique({
          where: {
            id: input.menuId,
            restaurantId: restaurant.id,
          },
        });
        if (menu?.restaurantId !== restaurant?.id) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User is not authorized to rename this menu",
          });
        }

        await ctx.db.menus.update({
          where: {
            id: input.menuId,
          },
          data: {
            name: input.newName,
          },
        });

        return {
          success: "true",
          message: "Menu has been renamed successfully",
        };
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to delete this menu",
        });
      }
    }),

  deleteMenu: onboardedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        restaurantId: z.string(),
        menuId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.db.account.findUnique({
        where: {
          clerkId: input.clerkId,
        },
      });
      const restaurant = await ctx.db.restaurantInfo.findUnique({
        where: {
          ownerId: owner?.id,
          id: input.restaurantId,
        },
      });
      if (restaurant) {
        const menu = await ctx.db.menus.findUnique({
          where: {
            id: input.menuId,
          },
        });
        if (menu?.restaurantId !== restaurant?.id) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User is not authorized to delete this menu",
          });
        }

        await ctx.db.menus.delete({
          where: {
            id: input.menuId,
          },
        });

        const menuLength = await ctx.db.menus.count({
          where: {
            restaurantId: restaurant?.id,
          },
        });

        if (menuLength === 0 || restaurant?.activeMenuId === input.menuId) {
          await ctx.db.restaurantInfo.update({
            where: {
              ownerId: owner?.id,
            },
            data: {
              activeMenuId: null,
            },
          });
        }

        return {
          success: "true",
          message: "Menu has been deleted successfully",
        };
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User is not authorized to delete this menu",
        });
      }
    }),
});
