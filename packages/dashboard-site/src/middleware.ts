// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

import { authMiddleware } from "@clerk/nextjs";

import { db } from "~/server/db";

// Set the paths that do not result to redirection
const reservedPaths = ["/", "/login", "/register"];

const isReserved = (path: string) => {
  return reservedPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)"))),
  );
};

const isApi = (path: string) => {
  return path.startsWith("/api");
};

export default authMiddleware({
  afterAuth(auth, req, evt) {
    // if (!isReserved(req.nextUrl.pathname) && !isApi(req.nextUrl.pathname)) {
    //   const ip = req.ip ?? "127.0.0.1";

    //   const { success, pending, limit, reset, remaining } =
    //     await ratelimit.limit(ip);

    //   evt.waitUntil(pending);

    //   if (!success) {
    //     return addRatelimitHeaders(
    //       new NextResponse(null, {
    //         status: 429,
    //         statusText: "You have hit the rate limit.",
    //       }),
    //       limit,
    //       reset,
    //       remaining,
    //     );
    //   }

    //   return addRatelimitHeaders(
    //     NextResponse.redirect(shurtle.url),
    //     limit,
    //     reset,
    //     remaining,
    //   );
    // } else if (
    //   !isApi(req.nextUrl.pathname) &&
    //   isReserved(req.nextUrl.pathname) &&
    //   req.nextUrl.pathname !== "/" &&
    //   !auth.userId
    // ) {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    //   return redirectToSignIn({ returnBackUrl: req.url });
    // }

    return NextResponse.next();
  },
  publicRoutes: ["/", "/login", "/register"],
});

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   prefix: "public",
//   limiter: Ratelimit.slidingWindow(3, "1 m"),
//   analytics: true,
// });

const addRatelimitHeaders = (
  res: NextResponse,
  limit: number,
  reset: number,
  remaining: number,
) => {
  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());
  res.headers.set("X-RateLimit-Reset", reset.toString());

  return res;
};

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
