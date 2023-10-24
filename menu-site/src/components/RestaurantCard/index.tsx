import Image from "next/image";
import { useRouter } from "next/router";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import RouteIcon from "@mui/icons-material/Route";
import { type RestaurantInfo } from "@prisma/client";

import MeniGlobals from "~/MeniGlobals";

interface RestaurantCardProps {
  restaurantInfo: RestaurantInfo;
  distance?: number;
}

export default function RestaurantCard({
  restaurantInfo,
  distance,
}: RestaurantCardProps) {
  const router = useRouter();

  return (
    <div
      className="flex aspect-square h-[375px] w-[320px] flex-col items-center rounded bg-grey hover:cursor-pointer md:h-[325px] md:w-[275px]"
      onClick={() =>
        void router.push(`/restaurant/${restaurantInfo.id}`, "", {
          scroll: true,
        })
      }
    >
      <div className="relative mb-3 h-[200px] w-full object-cover">
        <Image
          alt="resto"
          src={MeniGlobals().cdnRoot + restaurantInfo.image}
          fill={true}
          className="rounded-t object-cover"
        />
      </div>
      <div className="mb-6 flex w-full flex-col justify-evenly gap-1 px-4">
        <h2 className="text-lg font-semibold">{restaurantInfo.name}</h2>
        <div className="flex h-[104px] flex-col gap-1">
          <div className="flex h-1/3 w-full flex-row items-center justify-start">
            <LocationOnIcon sx={{ marginLeft: -0.5 }} />
            <p className="w-full truncate break-words font-normal md:w-auto lg:text-sm">
              {restaurantInfo.address}
            </p>
          </div>
          {distance && (
            <div className="flex h-1/3 w-full flex-row items-center justify-start">
              <RouteIcon sx={{ marginLeft: -0.5 }} />
              <p className="w-full break-words font-normal md:w-auto lg:text-sm">
                {typeof distance === "number" ? distance.toFixed(2) : ""}{" "}
                kilometres
              </p>
            </div>
          )}
          <div className="mt-1 line-clamp-3 h-16 w-full text-sm font-thin">
            {restaurantInfo.description}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="h-[375px] w-[320px] md:h-[325px] md:w-[275px]">
      <div className="relative flex aspect-square h-[375px] w-[320px] flex-col items-center rounded bg-grey hover:cursor-pointer md:h-[325px] md:w-[275px]">
        <div className="relative w-full animate-pulse p-4">
          <div className="mb-4 flex h-[150px] w-full items-center justify-center rounded bg-neutral-700">
            <svg
              className="h-10 w-10"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="#5A5A5A"
              viewBox="0 0 16 20"
            >
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            </svg>
          </div>
          <div className="w-full space-y-3">
            <div className="h-4 w-full rounded-lg bg-neutral-700"></div>
            <div className="h-4 w-full rounded-lg bg-neutral-700"></div>
            <div className="h-4 w-full rounded-lg bg-neutral-700"></div>
            <div className="h-12 w-full rounded-lg bg-neutral-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
