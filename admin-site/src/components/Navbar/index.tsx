import Image from "next/image";
import Link from "next/link";

import { IconButton } from "@mui/material";

import { useMeniContext } from "~/context/meniContext";

import MeniButton from "~/components/items/MeniButton";

type NavbarProps = {
  page: string;
  hidden?: boolean;
};

export default function Navbar(props: NavbarProps) {
  const { logout } = useMeniContext();

  if (!props.hidden) {
    return (
      <div className="sticky top-0 z-40 flex h-20 w-screen items-center border-b-[1px] border-[#353535] bg-backdrop px-4 font-sans md:px-12 lg:px-24">
        <div className="w-full bg-backdrop">
          <div className="flex flex-row items-center justify-between">
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
                <div className="flex flex-row items-center gap-10">
                  <Link href="/login">
                    <div className="relative text-lg before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100">
                      Login
                    </div>
                  </Link>
                  <MeniButton link="/register" rounded normalCase={true}>
                    Join Now
                  </MeniButton>
                </div>
              ) : props.page === "dashboard" ? (
                <div className="flex flex-row items-center gap-10">
                  <Link href="/">
                    <div className="relative text-lg before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100">
                      Home
                    </div>
                  </Link>
                  <Link href="/">
                    <div
                      className="relative text-lg before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100"
                      onClick={logout}
                    >
                      Logout
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-10"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="sticky top-0 z-40 hidden h-16 min-w-full bg-backdrop md:block lg:block">
        <div className="min-h-full min-w-full border-b-[1px] border-[#353535]   bg-backdrop px-12 py-2 md:px-28">
          <div className="flex flex-row items-center justify-between">
            <Link href="/">
              <IconButton
                disableRipple
                style={{ backgroundColor: "transparent" }}
              >
                <Image
                  alt="logo"
                  src="/landingPage/logo.svg"
                  width="90"
                  height="90"
                />
              </IconButton>
            </Link>
            <div>
              {props.page === "landingPage" ? (
                <div className="flex flex-row items-center gap-10">
                  <Link href="/login">
                    <div className="relative text-lg before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100">
                      Login
                    </div>
                  </Link>
                  <MeniButton link="/register" rounded>
                    Join Now
                  </MeniButton>
                </div>
              ) : props.page === "dashboard" ? (
                <div className="flex flex-row items-center gap-10">
                  <Link href="/">
                    <div className="relative text-lg before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100">
                      Home
                    </div>
                  </Link>
                  <Link href="/">
                    <div
                      className="relative text-lg before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100"
                      onClick={logout}
                    >
                      Logout
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-10"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//TODO: Add conditional rendering for logged in users.
//If a user is logged in they should see a sign out button instead of the login and join now buttons.
