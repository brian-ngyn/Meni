import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import Image from "next/image";

import { useUser } from "@clerk/nextjs";

import { ScrollTo } from "~/lib/hooks";

import MeniButton from "~/components/meniComponents/MeniButton";
import NavBar from "~/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isLoaded } = useUser();
  const dotSpacers = () => {
    return (
      <div className="grid grid-cols-1">
        <Image
          className="justify-self-center"
          alt="Dot Spacers"
          src="/landingPage/dotspacers.svg"
          width="10"
          height="54"
        />
      </div>
    );
  };

  return (
    isLoaded && (
      <>
        <NavBar page="landingPage" />
        <div className="flex min-h-screen flex-col overflow-hidden p-[7%] text-center font-sans md:px-[6%] md:py-[15%] md:text-left lg:px-[10%] lg:py-[9%] lg:text-left">
          <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 lg:grid-cols-2 lg:gap-x-20">
            <div className="grid grid-cols-1">
              <div className="flex flex-col space-y-10">
                <div className="pt-10 font-serif text-7xl md:pt-20">
                  Digitalize your menu
                </div>
                <div className="text-2xl">
                  Enhance your dining experience while saving time and money on
                  creating and editing menus.
                </div>
                <div>
                  <MeniButton onClick={() => ScrollTo("how-it-works")}>
                    Learn How it works
                  </MeniButton>
                </div>
              </div>
            </div>
            <div>
              <div className="relative">
                <Image
                  className="m-auto"
                  alt="Back Drop"
                  src="/landingPage/backdrop.svg"
                  width="400"
                  height="400"
                />
                <motion.div
                  initial={{
                    x: -400,
                    position: "relative",
                    y: -550,
                    opacity: 0,
                  }}
                  animate={{ x: 0, position: "relative", y: -550, opacity: 1 }}
                  transition={{
                    x: { type: "spring", stiffness: 50, duration: 1.25 },
                  }}
                >
                  <Image
                    className="absolute right-5 top-28 md:right-0 md:top-28 lg:right-5 lg:top-28 xl:right-28 xl:top-28"
                    alt="Back Drop"
                    src="/landingPage/herosaladitem.svg"
                    width="506"
                    height="137"
                  />
                </motion.div>
                <motion.div
                  initial={{
                    x: 400,
                    position: "relative",
                    y: -550,
                    opacity: 0,
                  }}
                  animate={{ x: 0, position: "relative", y: -550, opacity: 1 }}
                  transition={{
                    x: { type: "spring", stiffness: 50, duration: 1.5 },
                  }}
                >
                  <Image
                    className="absolute -right-5 top-72 md:-right-3 md:top-72 lg:right-5 lg:top-72 xl:-right-20 xl:top-72"
                    alt="Back Drop"
                    src="/landingPage/heroburgeritem.svg"
                    width="506"
                    height="137"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center py-20">
            <Image
              className=""
              alt="Divider"
              src="/landingPage/divider.svg"
              width="600"
              height="50"
            />
          </div>

          <div className="flex flex-col space-y-20 font-thin">
            <div className="grid grid-cols-1">
              <div
                className="weight justify-self-center font-serif text-7xl font-semibold"
                id="how-it-works"
              >
                How it works
              </div>
            </div>

            <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-2 ">
              <div className="place-self-center">
                <Image
                  alt="Account Cards"
                  src="/landingPage/accountcards.svg"
                  width="450"
                  height="275"
                />
              </div>
              <div className="place-self-center p-6 text-2xl md:p-16 lg:p-24">
                Create an account and get started for free! Get a chance to
                explore our platform and build your menu before committing
              </div>
            </div>

            {dotSpacers()}

            <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-2">
              <div className="order-last place-self-center p-6 text-2xl md:order-first md:p-16 lg:order-first lg:p-24">
                Easily create your digital menu showcasing your delicious food
              </div>
              <div className="place-self-center">
                <Image
                  alt="Dashboard Preview"
                  src="/landingPage/dashboardpreview.png"
                  width="575"
                  height="648"
                />
              </div>
            </div>

            {dotSpacers()}

            <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-2 ">
              <div className="place-self-center">
                <Image
                  alt="QR Code Placeholder"
                  src="/landingPage/qrcodepreview.svg"
                  width="300"
                  height="300"
                />
              </div>
              <div className="place-self-center p-6 text-2xl md:p-16 lg:p-24">
                Download your QR code and place it on your tables for your
                guests to scan
              </div>
            </div>

            {dotSpacers()}

            <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-2">
              <div className="order-last place-self-center p-6 text-2xl md:order-first md:p-16 lg:order-first lg:p-24">
                Diners will scan your QR code when seated to view your sleek
                digital menu
              </div>
              <div className="place-self-center">
                <Image
                  alt="Menu Preview Card"
                  src="/landingPage/menupreview.png"
                  width="1100"
                  height="1150"
                />
              </div>
            </div>

            {dotSpacers()}

            <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-2 ">
              <div className="place-self-center">
                <Image
                  alt="Edit Preview Card"
                  src="/landingPage/editingpreview.svg"
                  width="425"
                  height="425"
                />
              </div>
              <div className="place-self-center p-6 text-2xl md:p-16 lg:p-24">
                Easily edit your menus and select which one to display with a
                click of a button
              </div>
            </div>

            {dotSpacers()}

            <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-2">
              <div className="order-last place-self-center p-6 text-2xl md:order-first md:p-16 lg:order-first lg:p-24">
                Showcase your menu on our explore page to attract new customers
                who are searching for new spots or nearby options{" "}
              </div>
              <div className="place-self-center">
                <Image
                  alt="Menu Preview Card"
                  src="/landingPage/explorepreview.png"
                  width="725"
                  height="725"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
