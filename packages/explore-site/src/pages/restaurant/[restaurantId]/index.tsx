import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import type { Menus } from "@prisma/client";

import { api } from "~/utils/api";

import MenuCard from "~/components/MenuCard/MenuCard";
import { LoadingPage } from "~/components/loadingPage";

export default function RestaurantPage() {
  const router = useRouter();
  const { restaurantId } = router.query;
  const { data, isLoading } = api.restaurant.getRestaurantMenus.useQuery(
    restaurantId as string,
    {
      enabled: true,
      initialData: {
        restaurantName: "",
        menus: [],
      },
    },
  );

  const NavBar = () => {
    return (
      <>
        <Head>
          <title>{`${data.restaurantName} | Meni`}</title>
        </Head>
        <div className="align-center flex w-full flex-row gap-4 p-8 font-sans">
          <ArrowBackIosIcon
            className="left-6 top-6 cursor-pointer"
            onClick={() => void router.push("/")}
          />
          <div className="font-serif text-xl">Restaurant Name</div>
        </div>
      </>
    );
  };

  if (isLoading) return <LoadingPage />;
  if (!data.menus) {
    return (
      <div className="flex h-screen w-full flex-col">
        {NavBar()}
        <div className="flex w-full flex-1 items-center justify-center font-sans">
          No active menus found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col">
      {NavBar()}
      <div className="flex w-full flex-1 flex-col overflow-auto md:flex-row">
        {data.menus?.map((menu) => <MenuCard key={menu.id} menu={menu} />)}
      </div>
    </div>
  );
}
