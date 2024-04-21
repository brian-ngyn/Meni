import { useRouter } from "next/router";
import React from "react";

import type { Menus } from "@prisma/client";

interface MenuCardProps {
  menu: Menus;
}

function MenuCard({ menu }: MenuCardProps) {
  const router = useRouter();
  const handleMenuClick = () =>
    void router.push(`${router.asPath}/${menu.id}`, "");

  return (
    <div
      onClick={handleMenuClick}
      className="flex min-h-[300px] flex-1 items-center justify-center border border-black bg-red-400 md:h-full md:min-w-[300px]"
    >
      <div className="flex w-full max-w-[80%] cursor-pointer items-center justify-center bg-card p-4">
        <div className="flex w-full items-center justify-center truncate border border-white px-5 py-10 font-serif text-xl">
          {menu.name}{" "}
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
