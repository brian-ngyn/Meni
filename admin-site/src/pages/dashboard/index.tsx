import { Button } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { type ChangeEvent, useEffect, useState } from "react";

import MeniGlobals from "~/MeniGlobals";
import { useMeniContext } from "~/context/meniContext";

import MenuList, { MenuCardMode } from "~/components/Dashboard/MenuList";
import { LoadingPage } from "~/components/LoadingPage";
import Navbar from "~/components/Navbar";
import MeniMoneyMaker from "~/components/RegistrationForms/MeniMoneyMaker";
import PersonalInfo from "~/components/RegistrationForms/PersonalInfo";
import RestaurantInfo from "~/components/RegistrationForms/RestaurantInfo";
import MeniButton from "~/components/items/MeniButton";
import MeniNotification from "~/components/items/MeniNotification";

const PADDING = "xl:mx-48 md:mx-24 xs:mx-6";

export type IMenuBrief = {
  id: "string";
  name: "string";
  active: true;
};

const Tour = dynamic(() => import("reactour"), { ssr: false });

export default function Dashboard() {
  const {
    loading,
    accountInfo,
    restaurantInfo,
    refetchAccountInfo,
    refetchRestaurantInfo,
    updateAccountInfo,
    updateRestaurantInfo,
  } = useMeniContext();
  const router = useRouter();

  const [menus, setMenus] = useState<IMenuBrief[]>([]);
  const [activeMenu, setActiveMenu] = useState<string>(""); // active menu for the restaurant
  const [tourEnable, setTourEnable] = useState(false);

  const [newForm, setNewForm] = useState({
    firstName: "",
    lastName: "",
    restaurantName: "",
    address: "",
    restaurantPhoneNumber: "",
    description: "",
    image: "",
    edited: false,
  });

  useEffect(() => {
    if (accountInfo && restaurantInfo) {
      setNewForm({
        firstName: accountInfo.firstName,
        lastName: accountInfo.lastName,
        restaurantName: restaurantInfo.name,
        address: restaurantInfo.address,
        restaurantPhoneNumber: restaurantInfo.phoneNumber,
        description: restaurantInfo.description,
        image: restaurantInfo.image,
        edited: false,
      });
    }
  }, [accountInfo, restaurantInfo]);

  const handleInfoChange = (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    setNewForm({ ...newForm, [e.target.name]: e.target.value, edited: true });
  };

  const handleSubmitNewInfo = (buttonOrigin: string) => {
    if (newForm.edited === false) {
      return;
    }
    if (buttonOrigin === "restaurant") {
      updateRestaurantInfo({
        name: newForm.restaurantName,
        address: newForm.address,
        phoneNumber: newForm.restaurantPhoneNumber,
        description: newForm.description,
        image: newForm.image,
      });
    } else {
      updateAccountInfo({
        firstName: newForm.firstName,
        lastName: newForm.lastName,
      });
    }
  };

  const getRestaurantMenus = () => {
    // if (userInfo) {
    //   beginLoad();
    //   fetch(MeniGlobals().apiRoot + "/list-restaurant-menus", {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${userInfo.meniToke}`,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setMenus(data);
    //       data.forEach((m: IMenuBrief) => {
    //         if (m.active) {
    //           setActiveMenu(m.id);
    //         }
    //       });
    //       endLoad();
    //     })
    //     .catch((err) => {
    //       endLoad();
    //     });
    // }
  };

  // useEffect(() => {
  //   setTourEnable(true);
  // }, [interactibilityLoader]);

  const handleCreateMenu = () => {
    let maxMenus = 0;
    switch (accountInfo?.currentPlan) {
      case "tier0":
        maxMenus = 1;
        break;
      case "tier1":
        maxMenus = 1;
        break;
      case "tier2":
        maxMenus = 2;
        break;
      case "tier3":
        maxMenus = 4;
        break;
    }

    if (menus.length >= maxMenus) {
      MeniNotification(
        "Error!",
        `You have reached the maximum number of menus (${maxMenus}) for your plan.`,
        "error",
      );
    } else {
      void router.push({
        pathname: "/edit/new",
        query: { restaurantId: restaurantInfo?.id },
      });
    }
  };

  // const renderTour = () => {
  //   const steps = [
  //     {
  //       selector: "#create-menu-button",
  //       content: "Add menus by clicking here",
  //     },
  //     {
  //       selector: "#edit-plan-button",
  //       content: "You can change your active plan or billing information here",
  //     },
  //     {
  //       selector: "#edit-restaurant-section",
  //       content: "Edit your restaurant information here",
  //     },
  //     {
  //       selector: "#edit-personal-section",
  //       content: "Edit your personal information here",
  //     },
  //     {
  //       selector: "",
  //       content:
  //         "Pleae use the Feedback button at anytime if you encounter bugs or have questions. Enjoy Meni!",
  //     },
  //   ];
  //   return (
  //     <Tour
  //       className="font-sans text-lg"
  //       steps={steps}
  //       isOpen={tourEnable}
  //       onRequestClose={() => setTourEnable(false)}
  //       accentColor="#5cb7b7"
  //       badgeContent={(curr, tot) => `${curr} of ${tot}`}
  //       rounded={5}
  //       onAfterOpen={() => (document.body.style.overflow = "hidden")}
  //       onBeforeClose={() => (document.body.style.overflow = "auto")}
  //       lastStepNextButton={<Button>Done</Button>}
  //     />
  //   );
  // };

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen w-full bg-backdrop">
      {/* {renderTour()} */}
      <Navbar page="dashboard" />
      <div className="pb-8">
        <div className={`pt-20 font-serif text-6xl ${PADDING}`}>
          <h1>Dashboard</h1>
        </div>
        <div className={`my-6 font-sans text-3xl font-medium ${PADDING}`}>
          <h2>Welcome Back, {accountInfo?.firstName}!</h2>{" "}
        </div>
        <div className={`my-6 font-sans text-2xl font-thin ${PADDING}`}>
          <p>
            Manage your menus, and update your personal and restaurant
            information from the dashboard.
          </p>
        </div>
        <div className={`my-10 h-px bg-white ${PADDING}`}></div>
        <div className={`flex ${PADDING} justify-between`}>
          <h3 className="font-serif text-4xl font-medium">My Menus</h3>
          <div className="hidden sm:block" id="create-menu-button">
            <MeniButton onClick={handleCreateMenu}>Create Menu</MeniButton>
          </div>
          <div className="block sm:hidden">
            <MeniButton onClick={handleCreateMenu}>+</MeniButton>
          </div>
        </div>
        {menus.length > 0 ? (
          <MenuList
            mode={MenuCardMode.MENU}
            activeMenu={activeMenu}
            menus={menus}
            restaurantId={restaurantInfo?.id || ""}
            getRestaurantMenus={getRestaurantMenus}
            currentPlan={accountInfo?.currentPlan || ""}
          />
        ) : (
          <div className={`w-full py-8 text-center font-sans`}>
            <div className="create-button hidden sm:block">
              Click CREATE MENU above to create your first menu!
            </div>
            <div className="block sm:hidden">
              Click + above to create your first menu!
            </div>
          </div>
        )}
        {/* space for menus components*/}
        <div className={`${PADDING}`}>
          <div className="grid font-sans">
            <MeniMoneyMaker
              paymentProvided={accountInfo?.isPaid || false}
              currentTier={accountInfo?.currentPlan || ""}
              restaurantId={restaurantInfo?.id || ""}
            />
          </div>
          <h1 className="my-6 font-serif text-4xl">Edit Account Information</h1>

          <div className="grid">
            {/* <Uploady
              noPortal
              accept=".heic, .jpg, .jpeg, .png, .tiff"
              multiple={false}
              destination={{
                url: MeniGlobals().apiRoot + "/upload-image",
                method: "POST",
                headers: {
                  Authorization: `Bearer ${
                    userInfo ? userInfo.meniToke : null
                  }`,
                },
              }}
            > */}
            <RestaurantInfo
              restaurantName={newForm.restaurantName}
              address={newForm.address}
              restaurantPhoneNumber={newForm.restaurantPhoneNumber}
              restaurantImage={newForm.image}
              description={newForm.description}
              onChange={handleInfoChange}
              imageChange={() => {}}
              initial={false}
            />
            {/* </Uploady> */}
            <button
              className="ml-auto mt-6 h-11 w-40 border-2 border-white bg-backdrop font-sans uppercase text-white"
              onClick={() => handleSubmitNewInfo("restaurant")}
            >
              Save
            </button>
          </div>
          <div className="grid">
            <PersonalInfo
              firstName={newForm.firstName}
              lastName={newForm.lastName}
              onChange={handleInfoChange}
            />
            <button
              className="ml-auto mt-6 h-11 w-40 border-2 border-white bg-backdrop font-sans uppercase text-white"
              onClick={() => handleSubmitNewInfo("personal")}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
