import Head from "next/head";
import Image from "next/image";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { type RestaurantInfo } from "@prisma/client";

import { api } from "~/utils/api";

import { LoadingPage } from "~/components/LoadingPage";
import Navbar from "~/components/Navbar";
import RestaurantCard from "~/components/RestaurantCard";

const HEADER = "text-3xl md:text-5xl mb-5 font-serif";
const GRID_CONTAINER =
  "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-screen";

export default function Home() {
  const [coordinates, setCoordinates] = useState({
    latitude: -1,
    longitude: -1,
  });
  const { data: featuredRestaurants, isLoading } =
    api.home.getFeaturedRestaurants.useQuery();
  const { data: localRestaurants, refetch } =
    api.home.getLocalRestaurants.useQuery(coordinates, { enabled: false });

  useEffect(() => {
    if (coordinates.latitude !== -1 && coordinates.longitude !== -1) {
      console.log("hi");
      void refetch();
    }
  }, [coordinates]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      });
    }
  }, []);

  const [search, setSearch] = useState({
    key: "",
    restaurants: [],
    flag: false,
  });

  // const [localRestaurants, setLocalRestaurants] = useState([]);
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  // const { events } = useDraggable(ref);

  function onSubmit(e: FormEvent): void {
    e.preventDefault();
    console.log(search.key);
    // fetch(
    //   MeniGlobals().apiRoot +
    //     `/search?` +
    //     new URLSearchParams({
    //       key: JSON.stringify(search.key),
    //     }),
    //   { method: "GET" },
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     const uniqueRestaurants = new Set();
    //     const filteredRestaurants = data.filter((item: any) => {
    //       if (uniqueRestaurants.has(item.id)) {
    //         return false;
    //       } else {
    //         uniqueRestaurants.add(item.id);
    //         return true;
    //       }
    //     });
    //     setSearch((prev) => {
    //       return {
    //         ...prev,
    //         restaurants: filteredRestaurants,
    //         flag: true,
    //       };
    //     });
    //   });
  }

  function onChange(str: string): void {
    setSearch((prev) => {
      return {
        ...prev,
        key: str,
      };
    });
  }

  // Clears the current start if the search field is deleted
  useEffect(() => {
    if (search.flag) {
      setSearch({
        key: "",
        restaurants: [],
        flag: false,
      });
    }
  }, [search.key]);

  // useEffect(() => {
  //   const container = ref.current;

  //   function handleScrollRight() {
  //     const isEndReached =
  //       container.scrollWidth - container.scrollLeft === container.clientWidth;
  //     const arrow = container.querySelector<HTMLElement>(".scroll-arrow");
  //     if (arrow && arrow.style) {
  //       arrow.style.display = isEndReached ? "none" : "block";
  //     }
  //   }

  //   container.addEventListener("scroll", handleScrollRight);
  //   handleScrollRight();

  //   return () => container.removeEventListener("scroll", handleScrollRight);
  // }, []);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <Navbar />
          <Head>
            <title>Explore | Meni</title>
          </Head>
          <div className="mt-6 flex min-h-screen flex-col px-[7%] font-sans">
            <div className="flex flex-row justify-between space-x-14">
              <div className="mb-5 grow border-b-[1px] pb-5 md:border-none">
                <h1 className="relative mb-5 font-serif text-5xl md:text-7xl">
                  Explore
                </h1>
                <form className="mb-5" onSubmit={(e) => onSubmit(e)}>
                  <div className="flex flex-row bg-grey ring-white/50 duration-300 ease-in hover:ring-1">
                    <span className="my-2 border-r-2 px-3">
                      <SearchIcon />
                    </span>
                    <input
                      onChange={(e) => onChange(e.target.value)}
                      type="search"
                      className="w-full bg-grey px-3 text-xs outline-none md:text-lg"
                      placeholder="Search for a restaurant, food, or cuisine"
                    />
                  </div>
                </form>
                <p className="font-thin md:border-b-[1px] md:pb-6 md:text-xl">
                  {
                    "Search for your favourite restaurant or enter what you're craving to find a new one."
                  }
                </p>
              </div>
              <Image
                className="invisible absolute w-0 md:visible md:relative lg:w-auto"
                width="800"
                height="200"
                src="/Explore/rhombus.svg"
                alt="rhombus"
              />
            </div>
            {search.restaurants.length !== 0 && search.key.length !== 0 ? (
              <div className="mb-10">
                <h2 className={HEADER}>Search results for: `{search.key}`</h2>
                <div className={GRID_CONTAINER} ref={ref}>
                  {search.restaurants.map((data, index) => {
                    return (
                      <RestaurantCard
                        restaurantInfo={{
                          ...(data as RestaurantInfo),
                        }}
                        distance={0}
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h2 className={HEADER}>Featured</h2>
                  <div
                    className="flex h-[375px] flex-row gap-x-10 overflow-x-scroll scrollbar-hide md:h-[350px]"
                    ref={ref}
                  >
                    {featuredRestaurants?.map((data, index: number) => {
                      return (
                        <div
                          key={index}
                          className="h-[375px] w-[320px] md:h-[325px] md:w-[275px]"
                        >
                          <RestaurantCard
                            restaurantInfo={{
                              ...data,
                            }}
                            key={index}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className={HEADER}>Restaurants Near You</h2>
                  <div className="flex">
                    <div className="flex flex-wrap justify-start gap-10 pb-10">
                      {localRestaurants?.map((data, index) => {
                        return (
                          <div
                            key={index}
                            className="h-[375px] w-[320px] md:h-[325px] md:w-[275px]"
                          >
                            <RestaurantCard
                              restaurantInfo={{
                                ...data,
                              }}
                              distance={data.distance / 1000}
                              key={index}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
