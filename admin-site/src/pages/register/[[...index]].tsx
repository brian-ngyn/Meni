import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { type ChangeEvent, useEffect, useState } from "react";

import { SignUp, useUser } from "@clerk/nextjs";

import quotes from "~/constants/quotes";

import { LoadingPage } from "~/components/LoadingPage";
import PersonalInfo from "~/components/RegistrationForms/PersonalInfo";
import RestaurantInfo from "~/components/RegistrationForms/RestaurantInfo";

export default function Page() {
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
      form.restaurantName === "" ||
      form.address === "" ||
      form.restaurantPhoneNumber === "" ||
      form.description === ""
    ) {
      return;
    }
    const body = {
      firstName: form.firstName,
      lastName: form.lastName,
      restaurantName: form.restaurantName,
      address: form.address,
      restaurantPhoneNumber: form.restaurantPhoneNumber,
      description: form.description,
    };
    console.log(body);
    // try {
    //   beginLoad();
    //   const res = await fetch(MeniGlobals().apiRoot + "/register", {
    //     method: `POST`,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(body),
    //   });
    //   if (res.status === 401) {
    //     MeniNotification("Error!", "", "error");
    //     logout();
    //     endLoad();
    //     router.push("/");
    //   } else if (res.status === 400) {
    //     endLoad();
    //     const data = await res.json();
    //     MeniNotification("Error!", data.message, "error");
    //     setPage(0);
    //   } else if (res.status === 200) {
    //     const data = await res.json();
    //     setLocalStorage(data).then((setStorageRes) => {
    //       if (setStorageRes === "Saved") {
    //         MeniNotification("Account Created!", "", "success");
    //         router.push("/dashboard");
    //         endLoad();
    //       } else {
    //         MeniNotification("Error!", "", "error");
    //         logout();
    //         endLoad();
    //         router.push("/");
    //       }
    //     });
    //   }
    // } catch (err) {
    //   endLoad();
    // }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.publicMetadata.isOnboarded) {
      void router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, user?.publicMetadata.isOnboarded]);

  if (!isLoaded) return <LoadingPage />;

  return isLoaded && !user && !isSignedIn ? (
    <>
      <Head>
        <title>Registration | Meni</title>
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
                <SignUp
                  path="/register"
                  signInUrl="/login"
                  redirectUrl="/register"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
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
            imageChange={() => {}}
            initial={true}
          />
        </motion.div>
        <div className="item-stretch bottom-0 flex justify-end font-sans text-2xl font-light">
          <button
            className="h-11 w-40 border-2 border-white bg-white text-backdrop"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
