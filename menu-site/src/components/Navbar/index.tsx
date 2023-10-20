import Image from "next/image";
import Link from "next/link";

import { IconButton } from "@mui/material";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-40 flex h-20 w-screen items-center border-b-[1px] border-[#353535] bg-backdrop px-4 font-thin md:px-12 lg:px-24">
      <div className="w-full bg-backdrop">
        <div className="flex w-full flex-row items-center justify-between">
          <IconButton>
            <Image alt="logo" src="/logo.svg" width="70" height="70" />
          </IconButton>
          <div>
            <div className="flex flex-row items-center gap-10">
              <Link href="https://dashboard.meniapp.ca">
                <div className="font-thinrelative font-sans text-lg font-thin before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:origin-right before:scale-x-0 before:bg-[#545454] before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100">
                  <h2>For Restaurants</h2>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
