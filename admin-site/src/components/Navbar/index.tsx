import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import { useClerk, useUser } from "@clerk/nextjs";
import AddBoxIcon from "@mui/icons-material/AddBox";
import KeyboardArrowDownTwoToneIcon from "@mui/icons-material/KeyboardArrowDownTwoTone";
import LogoutIcon from "@mui/icons-material/Logout";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { IconButton } from "@mui/material";

import { useMeniContext } from "~/context/meniContext";

import MeniButton from "~/components/items/MeniButton";

type NavbarProps = {
  page: string;
};

export default function Navbar(props: NavbarProps) {
  const { signOut } = useClerk();
  const genericHamburgerLine = `h-1 w-6 my-0.5 rounded-full bg-white transition ease transform duration-400`;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const {
    allRestaurantInfo,
    currentRestaurantSelectedIndex,
    setCurrentRestaurantSelectedIndex,
  } = useMeniContext();

  const hamburgerButton = useRef<HTMLButtonElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const closeHamburgerMenu = useCallback(
    (e: Event) => {
      if (dropdownOpen) {
        const hamburgerMenu = document.getElementById("hamburgerMenu");
        if (
          hamburgerButton.current &&
          !hamburgerButton.current.contains(e.target as Node) &&
          !hamburgerMenu?.contains(e.target as Node)
        ) {
          setDropdownOpen(false);
        }
      }
    },
    [dropdownOpen],
  );

  useEffect(() => {
    document.addEventListener("mousedown", closeHamburgerMenu);
    return () => {
      document.removeEventListener("mousedown", closeHamburgerMenu);
    };
  }, [closeHamburgerMenu]);

  return (
    isLoaded && (
      <header className="h-20 bg-backdrop font-sans">
        <div className="max-w-screen mx-auto flex h-full items-center justify-evenly border-b-[1px] border-[#353535] px-4 md:px-12 lg:px-24">
          <div className="flex h-16 w-full items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <Link href="/">
                <IconButton
                  disableRipple
                  style={{ backgroundColor: "transparent" }}
                >
                  <Image
                    alt="logo"
                    src="/landingPage/logo.svg"
                    width="70"
                    height="70"
                  />
                </IconButton>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {props.page === "landingPage" ? (
                <>
                  {user && isSignedIn ? (
                    <MeniButton link="/dashboard" rounded>
                      {user.publicMetadata.onboardingComplete
                        ? "Dashboard"
                        : "Finish Onboarding"}
                    </MeniButton>
                  ) : (
                    <div className="flex flex-row items-center gap-6 md:gap-10">
                      <Link href="/login">
                        <div className="relative font-sans text-lg before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100">
                          Login
                        </div>
                      </Link>
                      <Link href="/register">
                        <div className="relative font-sans text-lg before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100">
                          Join Now
                        </div>
                      </Link>
                    </div>
                  )}
                </>
              ) : props.page === "dashboard" ? (
                <div className="flex flex-row items-center gap-10">
                  <div className="flex">
                    <div className="relative">
                      <button
                        ref={hamburgerButton}
                        className="group flex h-10 w-10 flex-col items-center justify-center rounded"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                      >
                        <div
                          className={`${genericHamburgerLine} ${
                            dropdownOpen ? "translate-y-2 rotate-45" : ""
                          }`}
                        />
                        <div
                          className={`${genericHamburgerLine} ${
                            dropdownOpen ? "opacity-0" : ""
                          }`}
                        />
                        <div
                          className={`${genericHamburgerLine} ${
                            dropdownOpen ? "-translate-y-2 -rotate-45" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            id="hamburgerMenu"
                            key="hamburgerMenu"
                            className="absolute right-0 mt-2 w-[calc(100vw-125px)] rounded-md bg-card py-4 text-white md:w-[300px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.33 }}
                          >
                            <ul className="mx-4 flex flex-col gap-y-2 divide-y divide-[rgb(80,80,80)]">
                              <li className="relative flex cursor-pointer gap-x-4">
                                <div className="mr-4 w-full">
                                  {allRestaurantInfo?.length === 1 ? (
                                    <div className="flex flex-row items-center justify-between text-lg">
                                      {allRestaurantInfo[0]?.name}
                                      <StorefrontIcon />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-x-2">
                                      <StorefrontIcon />
                                      <select
                                        onChange={(e) =>
                                          setCurrentRestaurantSelectedIndex(
                                            Number(e.target.value),
                                          )
                                        }
                                        value={currentRestaurantSelectedIndex}
                                        className="w-full cursor-pointer appearance-none border-none bg-transparent text-lg text-white outline-none"
                                      >
                                        {allRestaurantInfo &&
                                          allRestaurantInfo.map(
                                            (restaurant, index: number) => {
                                              return (
                                                <option
                                                  key={index}
                                                  value={index}
                                                >
                                                  {restaurant.name}
                                                </option>
                                              );
                                            },
                                          )}
                                      </select>
                                      <KeyboardArrowDownTwoToneIcon className="-mr-3" />
                                    </div>
                                  )}
                                </div>
                              </li>
                              <li className="flex cursor-pointer items-center gap-x-2 pt-2">
                                <AddBoxIcon />
                                <div
                                  className="flex w-full text-lg"
                                  onClick={() =>
                                    void router.push("/new-restaurant")
                                  }
                                >
                                  Create New Restaurant
                                </div>
                              </li>
                              <li className="flex cursor-pointer items-center gap-x-2 pt-2">
                                <LogoutIcon className="ml-0.5" />
                                <div
                                  className="-ml-0.5 flex w-full text-lg"
                                  onClick={() =>
                                    void signOut(() => void router.push("/"))
                                  }
                                >
                                  Logout
                                </div>
                              </li>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </header>
    )
  );
}
