import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const onboardingRouter = createTRPCRouter({
  signUp: privateProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
