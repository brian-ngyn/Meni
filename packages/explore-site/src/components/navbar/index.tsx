import Image from "next/image";
import Link from "next/link";

import { IconButton } from "@mui/material";

export function Navbar() {
  return (
    <header className="h-20 bg-backdrop font-sans">
      <div className="max-w-screen mx-auto flex h-full items-center justify-evenly border-b-[1px] border-[#353535] px-4 md:px-12 lg:px-24">
        <div className="flex h-16 w-full items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <IconButton>
              <Image alt="logo" src="/logo.svg" width="70" height="70" />
            </IconButton>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-row items-center gap-10">
              <Link href="https://dashboard.meniapp.ca">
                <div className="relative font-sans text-lg font-thin before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100">
                  <h2>For Restaurants</h2>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
