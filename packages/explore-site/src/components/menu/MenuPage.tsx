import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link } from "react-scroll";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { MeniGlobals, cn } from "~/lib/hooks";
import { api } from "~/utils/api";

import { LoadingPage } from "~/components/loadingPage";
import MeniNotification from "~/components/meniComponents/MeniNotification";
import { FoodCard } from "~/components/menu/FoodCard";
import { MenuTextField } from "~/components/menu/MenuTextField";

interface MenuPageProps {
  restaurantId: string;
  menuId: string;
  tableMode: boolean;
}

export function MenuPage(props: MenuPageProps) {
  const router = useRouter();
  const barREF = useRef();
  const { restaurantId, menuId, tableMode } = props;

  const {
    data: menu,
    isLoading: isLoadingMenu,
    refetch: refetchMenus,
  } = api.restaurant.getMenu.useQuery(
    { restaurantId, menuId },
    { enabled: true },
  );
  const {
    data: restaurant,
    isLoading: isLoadingRestaurant,
    isError: isErrorRestaurant,
    error: errorRestaurant,
  } = api.restaurant.getRestaurant.useQuery(restaurantId, {
    enabled: !!props.restaurantId,
    retry: 1,
  });

  useEffect(() => {
    if (isErrorRestaurant) {
      MeniNotification("Error", `${errorRestaurant.message}`, "error", 7.5);
    }
  }, [errorRestaurant?.message, isErrorRestaurant]);

  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (menu) {
      setCurrentImage(
        menu?.mainCategories[0]?.subCategories[0]?.items[0]?.image || "",
      );
    }
  }, [menu]);

  useEffect(() => {
    if (!isLoadingMenu && !isLoadingRestaurant) {
      window.scroll(0, 0);
    }
  }, [isLoadingMenu, isLoadingRestaurant]);

  const renderHeader = () => {
    return (
      <div className="px-4 pt-10 sm:px-10">
        <Head>
          <title>{restaurant?.name} | Meni</title>
        </Head>
        <div className="mt-2 flex w-full flex-col gap-4 px-0 pb-4 font-sans xl:px-32 xl:pt-8">
          <div>
            <ArrowBackIosIcon
              className="absolute left-6 top-6 cursor-pointer"
              onClick={() => void router.push("/")}
            />
          </div>
          <div className="flex w-full flex-col gap-y-4 border-b pb-4">
            <h1 className="font-serif text-6xl text-white">
              {restaurant?.name}
            </h1>
            <p className="break-normal font-thin">{restaurant?.description} </p>
            <div className="flex gap-2">
              <Image
                width={20}
                height={20}
                alt="location icon"
                src="/menupage/location.svg"
              ></Image>
              <p className="font-thin">{restaurant?.address}</p>
            </div>
            <div className="flex gap-2">
              <Image
                width={20}
                height={20}
                alt="location icon"
                src="/menupage/phone.svg"
              ></Image>
              <a href={`tel:${restaurant?.phoneNumber}`} className="font-thin">
                {restaurant?.phoneNumber}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryBar = () => (
    <div className="flex justify-center">
      <ScrollContainer
        className={cn(
          "sticky top-0 z-50 flex w-full gap-16 overflow-x-auto bg-backdrop px-4 py-3 align-middle text-xl font-thin sm:px-10",
          {
            "border-b md:border-b-0": props.tableMode,
          },
        )}
      >
        {menu?.mainCategories.map((category, index) => (
          <Link
            offset={tableMode ? -350 : -50}
            activeClass="font-bold before:scale-x-100"
            className={cn(
              "before:duration-300r relative m-auto cursor-pointer whitespace-nowrap before:absolute before:bottom-0 before:left-0 before:block before:h-[2px] before:w-full before:origin-top-left before:scale-x-0 before:bg-white before:transition before:ease-in-out before:content-['']",
              {
                "ml-auto": index === 0,
              },
            )}
            key={category.id}
            smooth
            spy
            to={category.id}
          >
            {category.name}
          </Link>
        ))}
      </ScrollContainer>
    </div>
  );

  if (isLoadingMenu || isLoadingRestaurant) return <LoadingPage />;

  return menu && menu?.mainCategories ? (
    <>
      {tableMode && (
        <div className="sticky top-0 z-50 h-1/4 w-full rounded-b-xl bg-backdrop font-sans">
          <>
            <div className="m-auto grid w-4/5 gap-4 border-b pb-2 pt-4 font-sans">
              <h1 className="m-auto font-serif text-2xl text-white">
                {restaurant?.name}
              </h1>
            </div>
            {renderCategoryBar()}
          </>
          <div className="relative">
            <div className="absolute left-0 top-0 z-40 h-full w-full bg-gradient-to-t from-backdrop via-transparent to-transparent"></div>
            <div className="h-56 w-full">
              {currentImage !== "" && (
                <Image
                  src={MeniGlobals().cdnRoot + currentImage}
                  alt={"Current Food Image"}
                  width="1000"
                  height="1000"
                  className="z-30 h-full w-full"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div
        className={cn(
          "h-full w-full items-center justify-center font-sans text-white",
          {
            "px-10 pt-2": tableMode,
          },
        )}
      >
        <>
          {!tableMode && renderHeader()}
          <div className="sticky top-0 z-50 h-1/4 w-full rounded-b-xl bg-backdrop px-0 font-sans xl:px-32">
            {!tableMode && renderCategoryBar()}
          </div>
        </>

        <div className="m-auto mb-36 grid h-fit w-full gap-4 px-4 sm:px-10 xl:px-40">
          <div className="relative grid gap-4">
            <div className="relative overflow-hidden">
              <div className="my-8 flex flex-col gap-y-16">
                {menu?.mainCategories.map((category, index1) => {
                  return (
                    <section
                      id={category.id}
                      key={index1}
                      className="w-full border-white"
                    >
                      <MenuTextField
                        id={category.id}
                        textClass="font-serif text-5xl"
                      >
                        {category.name}
                      </MenuTextField>
                      {category.description && (
                        <MenuTextField
                          id={category.id}
                          textClass="text-md font-thin whitespace-pre-line break-normal"
                        >
                          {category.description}
                        </MenuTextField>
                      )}
                      <div className="flex flex-col gap-16">
                        {category.subCategories.map((subCategory, index2) => {
                          return (
                            <div className="grid gap-5" key={index2}>
                              <MenuTextField
                                id={subCategory.id}
                                textClass="text-2xl font-medium font-sans py-4"
                              >
                                {subCategory.name}
                              </MenuTextField>
                              {subCategory.description && (
                                <MenuTextField
                                  id={subCategory.id}
                                  textClass="-mt-9 text-md font-thin whitespace-pre-line break-normal"
                                >
                                  {subCategory.description}
                                </MenuTextField>
                              )}
                              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {subCategory.items.map((item, index3) => {
                                  return (
                                    <FoodCard
                                      key={index3}
                                      id={item.id}
                                      name={item.name}
                                      description={item.description}
                                      price={item.price}
                                      image={
                                        item.image === ""
                                          ? "97505de7-0cf3-4849-ba07-2d4e9630580e-f1lhsm.jpg"
                                          : item.image
                                      }
                                      tags={item.tags}
                                      isTable={tableMode}
                                      setCurrentImage={setCurrentImage}
                                      barREF={barREF}
                                      currentImage={currentImage}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <MenuTextField
          id={menu.id}
          textClass="text-xl font-thin whitespace-pre-line break-normal text-center w-full"
          field={"menuFooter"}
        >
          {menu.footer ? menu.footer : ""}
        </MenuTextField>
      </div>
    </>
  ) : (
    <></>
  );
}
