import Link from "next/link";
import { type ReactNode } from "react";

import "@fontsource/montserrat/500.css";
import { Tooltip } from "@mui/material";

import { cn } from "~/lib/hooks";

type MeniButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  link?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  normalCase?: boolean;
  square?: boolean;
  tooltip?: string;
};

export default function MeniButton(props: MeniButtonProps) {
  return (
    <>
      {props.onClick && !props.link && (
        <Tooltip title={props.tooltip ? props.tooltip : ""} arrow>
          <button
            type="button"
            className={cn(
              `inline-block border-2 px-4 pb-[6px] pt-2 font-sans font-medium leading-normal transition duration-150 ease-in-out focus:outline-none focus:ring-0 
               border-${props.disabled ? "gray-400" : "white"} 
               text-${props.disabled ? "gray-400" : "white"} 
               hover:border-${props.disabled ? "gray-400" : "white"}`,
              {
                "hover:cursor-pointer": !props.disabled,
                "w-full": props.fullWidth,
                rounded: props.rounded,
                uppercase: !props.normalCase,
                "hover:bg-white hover:text-black": !props.disabled,
                "aspect-square": props.square,
              },
            )}
            data-te-ripple-init
            onClick={props.onClick}
            data-te-ripple-color="light"
            disabled={props.disabled}
          >
            {props.children}
          </button>
        </Tooltip>
      )}
      {!props.onClick && props.link && (
        <Tooltip title={props.tooltip ? props.tooltip : ""} arrow>
          <Link href={props.link}>
            <button
              type="button"
              className={cn(
                `border-1 duration-149 focus:ring1 inline-block px-3 pb-[6px] pt-2 font-sans text-lg leading-normal transition ease-in-out focus:outline-none
                border-${props.disabled ? "gray-400" : "white"} 
                text-${props.disabled ? "gray-400" : "white"} 
                hover:border-${props.disabled ? "gray-400" : "white"}`,
                {
                  "w-full": props.fullWidth,
                  rounded: props.rounded,
                  uppercase: !props.normalCase,
                  "hover:bg-white hover:text-black": !props.disabled,
                },
              )}
              data-te-ripple-init
              data-te-ripple-color="light"
            >
              {props.children}
            </button>
          </Link>
        </Tooltip>
      )}
    </>
  );
}
