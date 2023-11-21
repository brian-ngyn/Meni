import Link from "next/link";
import { type ReactNode } from "react";

import "@fontsource/montserrat/500.css";
import { Tooltip } from "@mui/material";

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
            className={`${
              props.fullWidth ? "w-full" : ""
            } inline-block font-sans ${
              props.rounded ? "rounded" : ""
            } border-2 border-${
              props.disabled ? "gray-400" : "white"
            } px-4 pb-[6px] pt-2 ${
              props.normalCase ? null : "uppercase"
            } leading-normal text-${
              props.disabled ? "gray-400" : "white"
            } transition duration-150 ease-in-out hover:border-${
              props.disabled ? "gray-400" : "white"
            } ${
              !props.disabled ? "hover:bg-white hover:text-black" : ""
            } font-medium focus:outline-none focus:ring-0 ${
              props.square ? "aspect-square" : ""
            }`}
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
              className={`${
                props.fullWidth ? "w-full" : ""
              } inline-block font-sans ${
                props.rounded ? "rounded" : ""
              } border-1 border-${
                props.disabled ? "gray-400" : "white"
              } px-3 pb-[6px] pt-2 ${
                props.normalCase ? null : "uppercase"
              } leading-normal text-${
                props.disabled ? "gray-400" : "white"
              } duration-149 transition ease-in-out hover:border-${
                props.disabled ? "gray-400" : "white"
              } ${
                !props.disabled ? "hover:bg-white hover:text-black" : ""
              } focus:ring1 text-lg focus:outline-none`}
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
