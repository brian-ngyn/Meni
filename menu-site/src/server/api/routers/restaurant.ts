import { ObjectId } from "bson";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const restaurantRouter = createTRPCRouter({
  getMenu: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.menus.findFirst({
      where: {
        restaurantId: input,
      },
    });
  }),
  getRestaurant: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      console.log(input);
      return ctx.db.restaurantInfo.findUnique({
        where: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          id: input,
        },
      });
    }),
});
