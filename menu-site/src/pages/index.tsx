import { debounce } from "lodash";
import Head from "next/head";
import Image from "next/image";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const [coordinates, setCoordinates] = useState({
    latitude: -1,
    longitude: -1,
  });
  const [search, setSearch] = useState({
    searchString: "",
    flag: false,
  });

  const { data: featuredRestaurants, isLoading } =
    api.home.getFeaturedRestaurants.useQuery();
  const { data: localRestaurants, refetch: refetchLocalRestaurants } =
    api.home.getLocalRestaurants.useQuery(coordinates, { enabled: false });
  const { data: searchedRestaurants, refetch: refetchSearchedRestaurants } =
    api.home.search.useQuery(search.searchString, {
      enabled: false,
    });

  useEffect(() => {
    if (coordinates.latitude !== -1 && coordinates.longitude !== -1) {
      void refetchLocalRestaurants();
    }
  }, [coordinates, refetchLocalRestaurants]);

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

  useEffect(() => {
    if (search.searchString.length === 0) {
      setSearch({
        flag: false,
        searchString: "",
      });
    }
    if (search.flag && search.searchString.length !== 0) {
      void refetchSearchedRestaurants();
    }
  }, [search.flag, refetchSearchedRestaurants, search.searchString.length]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      debounceSearch.cancel();
    };
  });

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({
      flag: true,
      searchString: e.target.value,
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const debounceSearch = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return debounce(onSearchChange, 1000);
  }, []);

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
                <h1 className="relative mb-5 font-serif text-5xl md:text-6xl">
                  Explore
                </h1>
                <form className="mb-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative flex flex-row items-center bg-grey ring-white/50 duration-300 ease-in hover:ring-1">
                    <span className="absolute my-2 border-r-2 px-3">
                      <SearchIcon />
                    </span>
                    <input
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      onChange={debounceSearch}
                      type="search"
                      className="w-full border-transparent bg-grey px-3 pl-16 text-xs focus:border-transparent focus:ring-0 md:text-lg"
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
            {searchedRestaurants &&
            searchedRestaurants.length !== 0 &&
            search.searchString.length !== 0 &&
            search.flag ? (
              <div className="mb-10">
                <h2 className="mb-5 font-serif text-3xl md:text-4xl">
                  Search results for: {search.searchString}
                </h2>
                <div className={GRID_CONTAINER} ref={ref}>
                  {searchedRestaurants.map((data, index) => {
                    return (
                      <RestaurantCard
                        restaurantInfo={{
                          ...data,
                        }}
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
                    <div className="flex flex-wrap justify-center gap-10 pb-10 md:justify-start">
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
