import { AnimatePresence, motion } from "framer-motion";
import router from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import { useClerk } from "@clerk/nextjs";
import AddBoxIcon from "@mui/icons-material/AddBox";
import KeyboardArrowDownTwoToneIcon from "@mui/icons-material/KeyboardArrowDownTwoTone";
import LogoutIcon from "@mui/icons-material/Logout";
import StorefrontIcon from "@mui/icons-material/Storefront";

import { useMeniContext } from "~/context/meniContext";
import { cn } from "~/lib/hooks";
import { api } from "~/utils/api";

import MeniNotification from "~/components/meniComponents/MeniNotification";

const HambugerMenu = () => {
  const genericHamburgerLine = `h-1 w-6 my-0.5 rounded-full bg-white transition ease transform duration-400`;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {
    allRestaurantInfo,
    setCurrentRestaurantSelectedIndex,
    currentRestaurantSelectedIndex,
  } = useMeniContext();
  const { user, signOut } = useClerk();

  const { refetch: fetchCanCreateRestaurant } =
    api.meniMoneyMaker.createRestaurantCheck.useQuery(
      {
        clerkId: user?.id as string,
      },
      { enabled: false, retry: false },
    );

  const hamburgerButton = useRef<HTMLButtonElement>(null);
  // @typescript-eslint/no-unsafe-assignment
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

  const handleCreateRestaurant = async () => {
    const response = await fetchCanCreateRestaurant();
    if (response?.data?.success) {
      void router.push("/new-restaurant");
    } else {
      MeniNotification(
        "Error!",
        `You have reached the maximum number of restaurants for your plan.`,
        "error",
      );
    }
  };

  return (
    <AnimatePresence>
      <button
        ref={hamburgerButton}
        className="group flex h-10 w-10 flex-col items-center justify-center rounded"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <div
          className={cn(`${genericHamburgerLine}`, {
            "translate-y-2 rotate-45": dropdownOpen,
          })}
        />
        <div
          className={cn(`${genericHamburgerLine}`, {
            "opacity-0": dropdownOpen,
          })}
        />
        <div
          className={cn(`${genericHamburgerLine}`, {
            "-translate-y-2 -rotate-45": dropdownOpen,
          })}
        />
      </button>
      {dropdownOpen && (
        <motion.div
          id="hamburgerMenu"
          key="hamburgerMenu"
          className="absolute right-0 mt-2 w-[calc(100vw-75px)] rounded-md bg-card py-4 text-white md:w-[300px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.33 }}
        >
          <ul className="mx-4 flex flex-col gap-y-2 divide-y divide-[rgb(80,80,80)]">
            <li className="relative flex cursor-pointer gap-x-4">
              <div className="mr-4 w-full">
                {allRestaurantInfo?.length === 1 ? (
                  <div className="flex flex-row items-center gap-x-2 text-lg">
                    <StorefrontIcon />
                    {allRestaurantInfo[0]?.name}
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
                        allRestaurantInfo.map((restaurant, index: number) => {
                          return (
                            <option key={index} value={index}>
                              {restaurant.name}
                            </option>
                          );
                        })}
                    </select>
                    <KeyboardArrowDownTwoToneIcon className="-mr-3" />
                  </div>
                )}
              </div>
            </li>
            <li className={"flex cursor-pointer items-center gap-x-2 pt-2"}>
              <AddBoxIcon />
              <div
                className="flex w-full text-lg"
                onClick={() => void handleCreateRestaurant()}
              >
                Create New Restaurant
              </div>
            </li>
            <li className="flex cursor-pointer items-center gap-x-2 pt-2">
              <LogoutIcon className="ml-0.5" />
              <div
                className="-ml-0.5 flex w-full text-lg"
                onClick={() => void signOut(() => void router.push("/"))}
              >
                Logout
              </div>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HambugerMenu;
