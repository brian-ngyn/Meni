import Image from "next/image";
import Link from "next/link";
import router from "next/router";

import { useClerk, useUser } from "@clerk/nextjs";
import { IconButton } from "@mui/material";

import MeniButton from "~/components/items/MeniButton";

type NavbarProps = {
  page: string;
  hidden?: boolean;
};

export default function Navbar(props: NavbarProps) {
  const { signOut } = useClerk();
  const { user, isSignedIn, isLoaded } = useUser();

  return (
    isLoaded && (
      <div
        className={`sticky ${
          props.hidden ? "hidden" : ""
        } top-0 z-40 flex h-20 w-screen items-center border-b-[1px] border-[#353535] bg-backdrop px-4 font-thin md:block md:px-12 lg:px-24`}
      >
        <div className="h-full w-full bg-backdrop">
          <div className="flex h-full flex-row items-center justify-between">
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
            <div>
              {props.page === "landingPage" ? (
                <>
                  {user && isSignedIn ? (
                    <div className="flex flex-row items-center gap-10">
                      <MeniButton link="/dashboard" rounded>
                        Dashboard
                      </MeniButton>
                    </div>
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
                  <Link href="/">
                    <div className="relative font-sans text-lg before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100">
                      Home
                    </div>
                  </Link>
                  <Link href="/">
                    <MeniButton
                      onClick={() =>
                        void signOut(
                          () => void router.push("/"), // need both for some reason...
                        )
                      }
                      rounded
                    >
                      Logout
                    </MeniButton>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-10"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

//TODO: Add conditional rendering for logged in users.
//If a user is logged in they should see a sign out button instead of the login and join now buttons.
