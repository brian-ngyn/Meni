import Image from "next/image";
import Link from "next/link";

import { useUser } from "@clerk/nextjs";
import { IconButton } from "@mui/material";

import MeniButton from "~/components/meniComponents/MeniButton";
import HamburgerMenu from "~/components/navbar/HamburgerMenu";

type NavbarProps = {
  page: string;
};

export default function Navbar(props: NavbarProps) {
  const { user, isSignedIn, isLoaded } = useUser();

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
                    src="/logo-transparent.svg"
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
                      <HamburgerMenu />
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
