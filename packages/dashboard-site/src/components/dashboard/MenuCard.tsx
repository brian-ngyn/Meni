import Image from "next/image";
import React from "react";

import { cn } from "~/lib/hooks";
import { type IMenuBrief } from "~/lib/types";

import { MenuCardMode } from "~/components/dashboard/MenuList";

type IMenuCard = {
  menu: IMenuBrief;
  isActive: boolean;
  openSettings: (menu: { id: string; name: string }) => void;
  setActive: (menu: string) => void;
  opened: boolean;
  openDialog: (dialog: string) => void;
  mode: MenuCardMode;
  openForEdit: () => void;
};

const TEMPLATE_IMAGE =
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80";

function MenuCard(props: IMenuCard) {
  const renderSettings = () => {
    return (
      <>
        <div
          className="flex flex-row-reverse font-sans"
          onClick={() => props.openSettings({ id: "", name: "" })}
        >
          <Image
            src="/shared/Cancel.svg"
            alt="three dots"
            width="16"
            height="16"
            className="hover:cursor-pointer"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between py-4 font-sans">
          <div
            className="flex flex-1 items-center border-b border-accent pl-2 hover:cursor-pointer hover:bg-accent"
            onClick={() => props.openForEdit()}
          >
            Edit
          </div>
          <div
            className="flex flex-1 items-center border-b border-accent pl-2 hover:cursor-pointer hover:bg-accent"
            onClick={() => props.openDialog("rename")}
          >
            Rename
          </div>

          <div
            className="flex flex-1 items-center border-b border-accent pl-2 hover:cursor-pointer hover:bg-accent"
            onClick={(e) => {
              props.setActive(props.menu.id);
              props.openSettings({ id: "", name: "" });
            }}
          >
            {props.isActive ? "Disable" : "Enable"}
          </div>
          <div
            className="flex flex-1 items-center border-b border-accent pl-2 hover:cursor-pointer hover:bg-accent"
            onClick={() => props.openDialog("delete")}
          >
            Delete
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div
        className={cn(
          "relative flex aspect-[236/256] h-64 flex-col justify-between rounded-xl bg-card bg-cover bg-center p-6 transition-transform duration-150 hover:scale-[1.02]",
          {
            "border-2": props.isActive,
          },
        )}
        style={{
          backgroundImage: `${
            props.opened
              ? ""
              : `linear-gradient(0deg, rgba(53, 53, 53, 0.9),  rgba(53, 53, 53, 0.9)), url(${TEMPLATE_IMAGE})`
          }`,
        }}
      >
        {props.isActive && (
          <div className="absolute -right-3 -top-3">
            <Image
              src="/dashboardPage/ActiveCheck.svg"
              alt="Active Menu Check"
              width="32"
              height="32"
            ></Image>
          </div>
        )}
        {props.mode === MenuCardMode.MENU && (
          <>
            {props.opened ? (
              renderSettings()
            ) : (
              <>
                <div className="flex flex-row-reverse">
                  <div
                    className="p-2 hover:cursor-pointer"
                    onClick={() =>
                      props.openSettings({
                        id: props.menu.id,
                        name: props.menu.name,
                      })
                    }
                  >
                    <Image
                      src="/shared/ThreeDots.svg"
                      alt="three dots"
                      width="32"
                      height="32"
                    />
                  </div>
                </div>
                <h2 className="font-sans text-xl">{props.menu.name}</h2>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default MenuCard;
