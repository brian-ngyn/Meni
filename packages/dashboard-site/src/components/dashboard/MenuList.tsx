import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useDraggable } from "react-use-draggable-scroll";

import { useUser } from "@clerk/nextjs";
import { type UseQueryResult } from "@tanstack/react-query";

import { useMeniContext } from "~/context/meniContext";
import { type IMenuBrief } from "~/lib/types";
import { IEntitlements } from "~/server/utils/helpers";
import { api } from "~/utils/api";

import MenuCard from "~/components/dashboard/MenuCard";
import MeniButton from "~/components/meniComponents/MeniButton";
import MeniDialog from "~/components/meniComponents/MeniDialog";
import MeniNotification from "~/components/meniComponents/MeniNotification";
import MeniTextInput from "~/components/meniComponents/MeniTextInput";

export enum MenuCardMode {
  MENU = "menu",
  PLANS = "plans",
}
type IMenuListProps = {
  menus: IMenuBrief[];
  mode: MenuCardMode;
  restaurantId: string;
  getRestaurantMenus: () => Promise<UseQueryResult>;
  activeMenus: string[];
  currentPlan: string;
};

type SelectedMenu = { id: string; name: string };

function MenuList(props: IMenuListProps) {
  const { userEntitlements, refetchContextData, currentRestaurantSelected } =
    useMeniContext();
  const router = useRouter();
  const { user } = useUser();
  // We will use React useRef hook to reference the wrapping div:
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref, {
    applyRubberBandEffect: true,
  }); // Now we pass the reference to the useDraggable hook:

  const [openedMenu, setOpenedMenu] = useState<SelectedMenu>({
    id: "",
    name: "",
  }); // which menu has the settings open
  const [dialogOpened, setDialogOpened] = useState<boolean>(true); // is the dialog (delete/rename) open?
  const [dialog, setDialog] = useState<string>(""); // which dialog is open (delete or rename)?
  const [newName, setNewName] = useState<string>(""); // state for new menu name when renaming

  const handleOpenMenuSettings = (menu: SelectedMenu) => {
    setOpenedMenu(menu);
  };

  const { mutate: setActiveMenu } = api.setters.setActiveMenu.useMutation({
    onSuccess: (a) => {
      if (a.success) {
        MeniNotification(
          "Success",
          "Active menus successfully updated.",
          "success",
        );
        void refetchContextData();
        setOpenedMenu({ id: "", name: "" });
      } else {
        MeniNotification(
          "Error",
          "Failed to set your active menu. Please try again later or contact support.",
          "error",
        );
      }
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        MeniNotification("Error", errorMessage[0], "error");
      } else {
        MeniNotification("Error", e.message, "error");
      }
    },
  });

  const { mutate: renameMenu } = api.setters.renameMenu.useMutation({
    onSuccess: (a) => {
      if (a.success) {
        MeniNotification(
          "Success",
          "Menu has been renamed successfully.",
          "success",
        );
        void props.getRestaurantMenus();
        void refetchContextData();
        setDialogOpened(false);
        setOpenedMenu({ id: "", name: "" });
      } else {
        MeniNotification(
          "Error",
          "Failed to set your active menu. Please try again later or contact support.",
          "error",
        );
      }
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        MeniNotification("Error", errorMessage[0], "error");
      } else {
        MeniNotification(
          "Error",
          "Failed to rename this menu. Please try again later or contact support.",
          "error",
        );
      }
    },
  });

  const { mutate: deleteMenu } = api.setters.deleteMenu.useMutation({
    onSuccess: (a) => {
      if (a.success) {
        MeniNotification(
          "Success",
          "Menu has been deleted successfully.",
          "success",
        );
        void props.getRestaurantMenus();
        void refetchContextData();
        setDialogOpened(false);
        setOpenedMenu({ id: "", name: "" });
      } else {
        MeniNotification(
          "Error",
          "Failed to delete this menu. Please try again later or contact support.",
          "error",
        );
      }
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        MeniNotification("Error", errorMessage[0], "error");
      } else {
        MeniNotification(
          "Error",
          "Failed to delete this menu. Please try again later or contact support.",
          "error",
        );
      }
    },
  });

  const handleSetActiveMenu = (menuId: string) => {
    if (user) {
      setActiveMenu({
        clerkId: user.id,
        menuId: menuId,
        restaurantId: props.restaurantId,
      });
      void props.getRestaurantMenus();
    }
  };

  const handleDialogOpen = (d: string) => {
    setDialog(d);
    setDialogOpened(true);
  };

  const handleDialogClose = () => {
    setDialogOpened(false);
    setNewName("");
  };

  const handleRenameSubmit = () => {
    if (user) {
      renameMenu({
        clerkId: user.id,
        restaurantId: currentRestaurantSelected?.id as string,
        menuId: openedMenu.id,
        newName: newName,
      });
    }
    setNewName("");
  };

  const handleDeleteSubmit = () => {
    if (user) {
      deleteMenu({
        clerkId: user.id,
        restaurantId: currentRestaurantSelected?.id as string,
        menuId: openedMenu.id,
      });
    }
  };

  const openForEdit = (menuId: string) => {
    void router.push(`/edit/${currentRestaurantSelected?.id}/` + menuId);
  };

  const renderDialog = () => {
    if (dialog === "delete") {
      return (
        <MeniDialog open={dialogOpened} onClose={handleDialogClose}>
          <div className="flex flex-col gap-8 bg-card p-6 font-sans text-white">
            <h1 className="font-serif text-xl">Delete Menu</h1>
            <div className="flex flex-col gap-2">
              <p className="font-thin">
                Are you sure you want to delete {openedMenu.name}?
              </p>
              <p className="text-sm font-semibold">
                Note: This action is irreversible.
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setDialogOpened(false);
                }}
              >
                Cancel
              </button>
              <MeniButton onClick={handleDeleteSubmit}>Delete</MeniButton>
            </div>
          </div>
        </MeniDialog>
      );
    } else if (dialog === "rename") {
      return (
        <MeniDialog open={dialogOpened} onClose={handleDialogClose}>
          <div className="flex w-96 flex-col gap-8 bg-card p-6 font-sans text-white">
            <h1 className="font-serif text-xl">Rename {openedMenu.name}</h1>
            <MeniTextInput
              id="newName"
              value={newName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewName(e.target.value)
              }
              title="New Name"
            ></MeniTextInput>
            <div className="flex justify-between">
              <button onClick={handleDialogClose}>Cancel</button>
              <MeniButton
                onClick={handleRenameSubmit}
                disabled={newName.trim() === ""}
              >
                Save
              </MeniButton>
            </div>
          </div>
        </MeniDialog>
      );
    }
  };

  return (
    <div className="relative">
      <div
        className="flex gap-8 overflow-x-scroll py-8 scrollbar-hide hover:cursor-grab xs:px-6 md:px-24 xl:px-48"
        {...events}
        ref={ref} // add reference and events to the wrapping div
      >
        {props.menus.map((m) => (
          <MenuCard
            key={m.id}
            openSettings={handleOpenMenuSettings}
            setActive={handleSetActiveMenu}
            isActive={props.activeMenus.includes(m.id)}
            menu={m}
            opened={openedMenu.id === m.id}
            openDialog={handleDialogOpen}
            mode={props.mode}
            openForEdit={() => openForEdit(m.id)}
          ></MenuCard>
        ))}
      </div>
      {renderDialog()}
    </div>
  );
}

export default MenuList;
