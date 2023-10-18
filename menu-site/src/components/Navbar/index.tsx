import Image from "next/image";
import Link from "next/link";

import { IconButton } from "@mui/material";

export default function Navbar() {
  return (
    <div className="bg-backdrop sticky top-0 z-40 h-24 min-w-full font-thin">
      <div className="bg-backdrop min-h-full min-w-full border-b-[1px] border-[#353535] px-4 py-2 md:px-12">
        <div className="flex w-full flex-row items-center justify-between">
          <IconButton>
            <Image alt="logo" src="/logo.svg" width="90" height="90" />
          </IconButton>
          <div>
            <div className="flex flex-row items-center gap-10">
              <Link href="https://admin.meniapp.ca">
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
