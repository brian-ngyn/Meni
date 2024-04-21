import Head from "next/head";
import { useRouter } from "next/router";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Menu } from "@mui/material";

import { api } from "~/utils/api";

import MenuCard from "~/components/MenuCard/MenuCard";
import { LoadingPage } from "~/components/loadingPage";

export default function RestaurantPage() {
  const router = useRouter();
  const { restaurantId } = router.query;
  const { data: menus, isLoading } = api.restaurant.getRestaurantMenus.useQuery(
    restaurantId as string,
    {
      enabled: true,
    },
  );

  const NavBar = () => {
    return (
      <div className="align-center flex w-full flex-row gap-4 p-8 font-sans">
        <ArrowBackIosIcon
          className="left-6 top-6 cursor-pointer"
          onClick={() => void router.push("/")}
        />
        <div>Restaurant Name</div>
      </div>
    );
  };

  if (isLoading) return <LoadingPage />;
  if (!menus) {
    return (
      <div className="flex h-screen w-full flex-col">
        <Head>
          <title>{restaurantId} | Meni</title>
        </Head>
        {NavBar()}
        <div className="flex w-full flex-1 items-center justify-center font-sans">
          No active menus found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <Head>
        <title>{restaurantId} | Meni</title>
      </Head>
      {NavBar()}
      <div className="flex w-full flex-1 flex-col overflow-auto md:flex-row">
        {menus?.map((menu) => <MenuCard key={menu.id} menu={menu} />)}
      </div>
    </div>
  );
}
