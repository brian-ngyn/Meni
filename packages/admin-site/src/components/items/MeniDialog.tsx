import React from "react";

type IMenuDialogProps = {
  children?: any;
  open: boolean;
  onClose: () => void;
};

function MeniDialog(props: IMenuDialogProps) {
  return (
    <div
      className={`fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black/50 transition duration-300 ${
        props.open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
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
