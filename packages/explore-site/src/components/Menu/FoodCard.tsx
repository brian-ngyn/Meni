import Image from "next/image";
import { type MutableRefObject } from "react";
import { useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import { type MenuItem } from "@prisma/client";

import { MeniGlobals } from "~/lib/hooks";

import { MenuTextField } from "~/components/menu/MenuTextField";

export type IFoodCardProps = MenuItem & {
  isTable: boolean;
  setCurrentImage?: (image: string) => void;
  barREF?: MutableRefObject<undefined>;
  currentImage?: string;
};

export function FoodCard(props: IFoodCardProps) {
  const {
    id,
    name,
    description,
    price,
    image,
    tags,
    isTable,
    setCurrentImage,
    currentImage,
  } = props;
  const myRef = useRef(null);

  useEffect(() => {
    if (isTable && setCurrentImage) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // target element intersects with the viewport
          if (entry?.isIntersecting) {
            setCurrentImage(image);
          }
        },
        {
          root: null,
          rootMargin: "-45% 0px -30% 0px",
          threshold: 0.51, // 51% of the target element must be visible to trigger the callback
        },
      );

      if (myRef.current) {
        observer.observe(myRef.current);
      }

      // disconnect the observer when the component unmounts
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div
      ref={myRef}
      className={`group relative flex flex-col rounded sm:flex-row ${
        currentImage === image && isTable ? "bg-[#656565]" : "bg-card"
      } ${
        !isTable ? "aspect-square" : null
      }  w-full=== sm:aspect-[3/1] md:aspect-[20/5] lg:aspect-[25/10] xl:aspect-[25/10]`}
    >
      <div className="bg-accent absolute left-2 top-2 z-10 hidden rounded-full p-1 hover:cursor-pointer group-hover:block"></div>
      {!props.isTable && (
        <div className="relative aspect-square flex-none sm:w-48 lg:w-48">
          {image !== "" ? (
            <Image
              src={MeniGlobals().cdnRoot + image}
              className="rounded-l object-cover"
              fill={true}
              alt="Food Item Image"
              priority
            />
          ) : null}
        </div>
      )}
      <div className="flex w-full flex-col justify-between overflow-hidden break-words px-4 py-2 sm:h-full">
        <div className="flex w-full flex-1 grow flex-col gap-1 overflow-hidden">
          <div className="flex-none">
            <MenuTextField id={id} field="name" textClass="text-lg">
              {name}
            </MenuTextField>
          </div>
          <div className="w-full flex-initial grow overflow-y-auto scrollbar-hide">
            <MenuTextField
              id={id}
              field="description"
              textClass="text-sm font-thin"
            >
              {description}
            </MenuTextField>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <ScrollContainer
            className="mt-1 box-content flex h-fit flex-none shrink-0 grow flex-nowrap items-center justify-between overflow-x-auto overflow-y-hidden py-1"
            vertical={false}
          >
            <MenuTextField
              id={id}
              field="tags"
              textClass="text-lg float-right"
              tags={tags}
            />
          </ScrollContainer>
          <div className="flex w-16 flex-row items-center justify-center">
            <div>$</div>
            <MenuTextField id={id} field="price" textClass="text-lg">
              {price}
            </MenuTextField>
          </div>
        </div>
      </div>
    </div>
  );
}
