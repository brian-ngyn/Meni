import Image from "next/image";
import { useRouter } from "next/router";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import RouteIcon from "@mui/icons-material/Route";
import { type RestaurantInfo } from "@prisma/client";

import MeniGlobals from "~/MeniGlobals";

interface RestaurantCardProps {
  restaurantInfo: RestaurantInfo;
  image: string;
  distance: number;
}

export default function RestaurantCard({
  restaurantInfo,
  image,
  distance,
}: RestaurantCardProps) {
  const router = useRouter();

  function handleClick() {
    console.log("clicked");
    // router.push(`/restaurant/${restaurantInfo.id}`);
  }

  return (
    <div
      className="bg-grey flex aspect-square h-[375px] w-[320px] flex-col items-center hover:cursor-pointer md:h-[325px] md:w-[275px]"
      onClick={handleClick}
    >
      <div className="relative mb-3 h-[200px] w-full object-cover">
        <Image
          alt="resto"
          src={MeniGlobals().cdnRoot + image}
          fill={true}
          className="object-cover"
        />
      </div>
      <div className="mb-6 flex w-full flex-col justify-evenly gap-1 px-4">
        <h2 className="text-lg font-semibold">{restaurantInfo.name}</h2>
        <div className="flex h-[104px] flex-col gap-1">
          <div className="flex h-1/3 w-full flex-row items-start justify-start">
            <LocationOnIcon sx={{ marginLeft: -0.5 }} />
            <p className="w-full truncate break-words font-normal md:w-auto lg:text-sm">
              {restaurantInfo.address}
            </p>
          </div>
          <div className="flex h-1/3 w-full flex-row items-start justify-start">
            {distance && (
              <>
                <RouteIcon sx={{ marginLeft: -0.5 }} />
                <p className="w-full break-words font-normal md:w-auto lg:text-sm">
                  {typeof distance === "number" ? distance.toFixed(2) : ""}{" "}
                  kilometres
                </p>
              </>
            )}
          </div>
          <div className="mt-1 line-clamp-2 h-16 w-full text-sm font-thin">
            {restaurantInfo.description}
          </div>
        </div>
      </div>
    </div>
  );
}
