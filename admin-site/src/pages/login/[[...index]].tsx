import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";

import { SignIn, useUser } from "@clerk/nextjs";

import quotes from "~/constants/quotes";

import { LoadingPage } from "~/components/LoadingPage";

export default function Page() {
  const { isLoaded, user, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.publicMetadata.isOnboarded) {
      void router.push("/dashboard");
    } else if (isLoaded && isSignedIn && !user?.publicMetadata.isOnboarded) {
      void router.push("/register");
    }
  }, [isLoaded, isSignedIn, user]);

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  if (!isLoaded) return <LoadingPage />;

  return (
    isLoaded &&
    !isSignedIn && (
      <>
        <Head>
          <title>Login | Meni</title>
        </Head>
        <div className="font-sans">
          <div className="pt-14" />
          <div className="min-w-screen flex justify-center">
            <div className="flex min-w-full justify-center space-x-16 py-[20%] pr-[15%] md:py-[7%] md:pl-[15%] md:pr-[17%] lg:py-[7%]">
              <div className="hidden w-1/2 md:block lg:block">
                <motion.div
                  initial={{ x: -200, position: "relative", y: 0, opacity: 0 }}
                  animate={{ x: 0, position: "relative", y: 0, opacity: 1 }}
                  transition={{
                    x: { type: "spring", stiffness: 35, duration: 1.25 },
                  }}
                  className="flex min-h-full flex-col justify-center space-y-12"
                >
                  <div className="font-serif text-6xl">Welcome Back</div>
                  <div className="flex flex-col text-lg">
                    <div>{quote?.quote}</div>
                    <div>--- {quote?.author}</div>
                  </div>
                </motion.div>
              </div>

              <div className="hidden h-full w-px bg-white md:block lg:block" />

              <div className="w-full md:w-1/2 lg:w-1/2">
                <div className="flex flex-col items-center">
                  <div className="col-span-2 row-span-2 pb-10">
                    <Link href="/">
                      <Image
                        onClick={() => {}}
                        alt="logo"
                        src="/landingPage/logo.svg"
                        width="175"
                        height="175"
                      />
                    </Link>
                  </div>
                  <SignIn
                    path="/login"
                    signUpUrl="/register"
                    redirectUrl="/register"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
