import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { type ChangeEvent, useEffect, useState } from "react";

import { SignUp, useUser } from "@clerk/nextjs";

import quotes from "~/constants/quotes";
import { api } from "~/utils/api";

import { LoadingPage } from "~/components/LoadingPage";
import PersonalInfo from "~/components/RegistrationForms/PersonalInfo";
import RestaurantInfo from "~/components/RegistrationForms/RestaurantInfo";
import MeniNotification from "~/components/items/MeniNotification";

export default function Page() {
  const [signupComplete, setSignupComplete] = useState(false);
  const { mutate, isLoading } = api.onboarding.signUp.useMutation({
    onSuccess: (a) => {
      if (a.success) {
        setSignupComplete(true);
        void user?.reload();
        void router.push("/dashboard");
      } else {
        setSignupComplete(false);
        void user?.reload();
        MeniNotification(
          "Error",
          "Failed to onboard you. Please try again later or contact support.",
          "error",
        );
      }
    },
    onError: (e) => {
      setSignupComplete(false);
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        MeniNotification("Error", errorMessage[0], "error");
      } else {
        MeniNotification(
          "Error",
          "Failed to onboard you. Please try again later or contact support.",
          "error",
        );
      }
    },
  });

  const { isLoaded, user, isSignedIn } = useUser();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    restaurantName: "",
    address: "",
    restaurantPhoneNumber: "",
    description: "",
  });

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      form.firstName === "" ||
      form.lastName === "" ||
      form.restaurantName === "" ||
      form.address === "" ||
      form.restaurantPhoneNumber === "" ||
      form.description === ""
    ) {
      return;
    }
    setSignupComplete(true);
    mutate(form);
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.publicMetadata.onboardingComplete) {
      void router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || isLoading || signupComplete) return <LoadingPage />;

  return isLoaded && !user && !isSignedIn ? (
    <>
      <Head>
        <title>Registration | Meni</title>
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
            <SignUp
              path="/register"
              signInUrl="/login"
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
  ) : !isLoading &&
    isSignedIn &&
    !user?.publicMetadata.onboardingComplete &&
    !signupComplete ? (
    <div className="min-h-screen w-full bg-backdrop">
      <Head>
        <title>Registration | Meni</title>
      </Head>
      <div className="mx-8 flex min-h-screen flex-col md:mx-20 lg:mx-28">
        <div className="pt-20 font-serif text-6xl lg:pt-24">
          <h1>Onboarding</h1>
        </div>
        <div className="mb-9 mt-6 h-1.5 w-full bg-card">
          <div className="mr-auto h-1.5 w-1/2 bg-white transition-all duration-500"></div>
        </div>
        <motion.div
          initial={{ x: -100, position: "relative", y: 0, opacity: 0 }}
          animate={{ x: 0, position: "relative", y: 0, opacity: 1 }}
          transition={{
            x: { type: "spring", stiffness: 35, duration: 0.25 },
          }}
          className="mb-16"
        >
          <PersonalInfo
            firstName={form.firstName}
            lastName={form.lastName}
            onChange={handleChange}
          />
          <RestaurantInfo
            restaurantName={form.restaurantName}
            address={form.address}
            restaurantPhoneNumber={form.restaurantPhoneNumber}
            description={form.description}
            onChange={handleChange}
            restaurantImage=""
            initial={true}
          />
        </motion.div>
        <div className="item-stretch bottom-0 mb-16 flex justify-end font-sans text-2xl font-light md:mb-0">
          <button
            className="h-11 w-40 border-2 border-white bg-white text-backdrop"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
