import React from "react";

import { cn } from "~/lib/hooks";

type IMenuDialogProps = {
  children?: any;
  open: boolean;
  onClose: () => void;
};

function MeniDialog(props: IMenuDialogProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black/50 transition duration-300",
        {
          "opacity-100": props.open,
          "pointer-events-none opacity-0": !props.open,
        },
      )}
      onClick={props.onClose}
    >
      <div
        className="z-40"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

export default MeniDialog;
