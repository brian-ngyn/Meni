import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import type { Menus } from "@prisma/client";

import { menucover1, menucover2, menucover3 } from "~/assets";

interface MenuCardProps {
  menu: Menus;
  index: number;
}

const MENU_COVERS = [menucover1, menucover2, menucover3];

function MenuCard({ menu, index }: MenuCardProps) {
  const router = useRouter();

  return (
    <Link
      href={`${router.asPath.split("?")[0]}/${menu.id}`}
      className={`${
        index && "border-t md:border-l md:border-t-0"
      } flex min-h-[300px] flex-1 items-center justify-center border-white/40 md:h-full md:min-w-[300px]`}
      style={{
        backgroundImage: `${`linear-gradient(0deg, rgba(53, 53, 53, 0.9),  rgba(53, 53, 53, 0.9)), url(${
          MENU_COVERS[index % 3]!.src
        })`}`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full max-w-[80%] cursor-pointer items-center justify-center truncate border border-white px-5 py-10 font-serif text-3xl transition-all hover:bg-white/10">
        {menu.name}{" "}
      </div>
    </Link>
  );
}

export default MenuCard;
