import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link } from "react-scroll";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import MeniGlobals from "~/MeniGlobals";
import { api } from "~/utils/api";

import { LoadingPage } from "~/components/LoadingPage";
import { FoodCard } from "~/components/Menu/FoodCard";
import EditableText from "~/components/Menu/MenuText";

interface EditContainerProps {
  restaurantId: string;
  tableMode: boolean;
}

export default function EditContainer(props: EditContainerProps) {
  const router = useRouter();
  const barREF = useRef();
  const { restaurantId, tableMode } = props;

  const {
    data: menu,
    isLoading: isLoadingMenu,
    refetch: refetchMenus,
  } = api.restaurant.getMenu.useQuery(restaurantId, { enabled: false });
  const {
    data: restaurant,
    isLoading: isLoadingRestaurant,
    refetch: refetchRestaurant,
  } = api.restaurant.getRestaurant.useQuery(restaurantId, { enabled: false });

  useEffect(() => {
    if (props.restaurantId) {
      void refetchMenus();
      void refetchRestaurant();
    }
  }, [props.restaurantId, refetchMenus, refetchRestaurant]);

  useEffect(() => {
    console.log(menu);
    console.log(restaurant);
  }, [menu, restaurant]);

  const horizontalScrollRef = useRef<HTMLElement>(null);

  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (!isLoadingMenu && !isLoadingRestaurant) {
      window.scroll(0, 0);
    }
  }, [isLoadingMenu, isLoadingRestaurant]);

  const renderHeader = () => {
    return (
      <>
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
      </>
    );
  };

  const renderCategoryBar = () => (
    <div className="flex justify-center">
      <ScrollContainer
        className={`sticky top-0 z-50 flex w-10/12 gap-16 overflow-x-auto bg-backdrop py-4 align-middle text-xl font-thin`}
      >
        {menu?.mainCategories.map((category, index) => (
          <Link
            offset={tableMode ? -350 : -50}
            activeClass="font-bold 
          before:scale-x-100 "
            className={`before:duration-300r relative m-auto cursor-pointer whitespace-nowrap before:absolute before:bottom-0 before:left-0 before:block 
          before:h-[2px] before:w-full before:origin-top-left
          before:scale-x-0 before:bg-white
          before:transition before:ease-in-out before:content-[''] ${
            index === 0 ? "ml-auto" : ""
          }`}
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

  return isLoadingMenu || isLoadingRestaurant ? (
    <LoadingPage />
  ) : menu && menu?.mainCategories ? (
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
            <div className="absolute left-0 top-0 z-40 h-full w-full bg-gradient-to-t from-backdrop via-transparent to-transparent "></div>
            <div className="h-56 w-full">
              <Image
                src={MeniGlobals().cdnRoot + currentImage}
                alt={"Current Food Image"}
                width="1000"
                height="1000"
                className="z-30 h-full w-full "
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      )}
      <div
        className={`h-full w-full items-center justify-center font-sans text-white ${
          !tableMode ? "p-10" : "px-10 pt-2"
        } `}
      >
        <>
          {!tableMode && renderHeader()}
          <div className="sticky top-0 z-50 h-1/4 w-full rounded-b-xl bg-backdrop font-sans ">
            {!tableMode && renderCategoryBar()}
          </div>
        </>

        <div className="m-auto mb-36 grid h-fit max-w-[1460px] gap-4 xl:w-4/5">
          <div className=" relative grid gap-4 ">
            <div className="relative overflow-hidden " id="">
              <div className="my-8 flex flex-col">
                {menu?.mainCategories.map((category, index1) => {
                  return (
                    <section
                      id={category.id}
                      key={index1}
                      className="w-full border-white "
                    >
                      <EditableText
                        id={category.id}
                        textClass="font-serif text-5xl"
                      >
                        {category.name}
                      </EditableText>
                      <div className="flex flex-col gap-16">
                        {/* <EditableText id={category.id} textClass="text-2xl">
                  {category.name}
                </EditableText> */}
                        {category.subCategories.map((subCategory, index2) => {
                          return (
                            <div className="grid gap-8" key={index2}>
                              <EditableText
                                id={subCategory.id}
                                textClass="text-2xl font-medium font-sans py-4"
                              >
                                {subCategory.name}
                              </EditableText>
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
                                        item.image
                                          ? "97505de7-0cf3-4849-ba07-2d4e9630580e-f1lhsm.jpg"
                                          : ""
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
                        <div className="relative flex h-16 w-full flex-col items-center justify-center hover:cursor-pointer sm:flex-row lg:aspect-[30/10] ">
                          {/* <span>
                    <AddIcon className="text-3xl text-gray-600" />
                  </span>{" "} */}
                        </div>
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Lots of fun here!! :) --> :/ --> :( */}
        {/* <DragDropContext onDragEnd={console.log()}>
          <Droppable droppableId="droppable" direction="horizontal">

              <Draggable key={1} draggableId={1} index={1}>
                Test

              </Draggable>
 
          </Droppable>
        </DragDropContext> */}
      </div>
    </>
  ) : (
    <></>
  );
}
