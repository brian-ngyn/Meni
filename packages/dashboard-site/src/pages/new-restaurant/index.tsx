import { motion } from "framer-motion";
import Head from "next/head";
import router from "next/router";
import { type ChangeEvent, useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

import { LoadingPage } from "~/components/loadingPage";
import MeniNotification from "~/components/meniComponents/MeniNotification";
import RestaurantInfo from "~/components/registrationForms/RestaurantInfo";

export default function Page() {
  const { isLoaded, user, isSignedIn } = useUser();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({
    restaurantName: "",
    address: "",
    restaurantPhoneNumber: "",
    description: "",
  });

  const { mutate, isLoading } = api.onboarding.newRestaurant.useMutation({
    onSuccess: (a) => {
      if (a.success) {
        setFormSubmitted(true);
        void user?.reload();
        void router.push("/dashboard");
      } else {
        setFormSubmitted(false);
        void user?.reload();
        MeniNotification(
          "Error",
          "Failed to create new restaurant. Please try again later or contact support.",
          "error",
        );
      }
    },
    onError: (e) => {
      setFormSubmitted(false);
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

  const handleSubmit = () => {
    if (
      form.restaurantName === "" ||
      form.address === "" ||
      form.restaurantPhoneNumber === "" ||
      form.description === ""
    ) {
      return;
    }
    setFormSubmitted(true);
    if (user) mutate({ ...form, clerkId: user.id });
  };

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && !user?.publicMetadata.onboardingComplete) {
      void router.push("/register");
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || isLoading || formSubmitted) return <LoadingPage />;

  return (
    isLoaded &&
    !isLoading &&
    !formSubmitted &&
    isSignedIn && (
      <>
        {" "}
        <div className="min-h-screen w-full bg-backdrop">
          <Head>
            <title>New Restaurant | Meni</title>
          </Head>
          <div className="mx-8 flex min-h-screen flex-col md:mx-20 lg:mx-28">
            <div className="pt-20 font-serif text-6xl lg:pt-24">
              <h1>New Restaurant</h1>
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
      </>
    )
  );
}
