import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { useEffect } from "react";

import { SignIn, useUser } from "@clerk/nextjs";

import { quotes } from "~/lib/constants";

import { LoadingPage } from "~/components/loadingPage";

export default function Page() {
  const { isLoaded, user, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.publicMetadata.onboardingComplete) {
      void router.push("/dashboard");
    } else if (
      isLoaded &&
      isSignedIn &&
      !user?.publicMetadata.onboardingComplete
    ) {
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
        <div className="flex h-screen w-screen items-center justify-center font-sans">
          <div className="hidden grow lg:block">
            <motion.div
              initial={{ x: -200, position: "relative", y: 0, opacity: 0 }}
              animate={{ x: 0, position: "relative", y: 0, opacity: 1 }}
              transition={{
                x: { type: "spring", stiffness: 35, duration: 1.25 },
              }}
              className="ml-28 flex h-full flex-col justify-center space-y-12"
            >
              <div className="font-serif text-6xl">Welcome Back</div>
              <div className="flex w-[80%] flex-col text-lg">
                <div>{quote?.quote}</div>
                <div>--- {quote?.author}</div>
              </div>
            </motion.div>
          </div>
          <div className="hidden h-[66%] w-px bg-white lg:block" />
          <div className="h-full w-full flex-none lg:w-[40%] lg:px-24">
            <div className="mt-32 flex h-full flex-col items-center space-y-8 lg:mt-52">
              <Link href="/">
                <Image
                  onClick={() => {}}
                  alt="logo"
                  src="/landingPage/logo.svg"
                  width="150"
                  height="150"
                />
              </Link>
              <SignIn
                path="/login"
                signUpUrl="/register"
                redirectUrl="/register"
                appearance={{
                  variables: {
                    colorPrimary: "#4D4D4F",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </>
    )
  );
}
