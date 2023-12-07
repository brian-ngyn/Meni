import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { type ChangeEvent, useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";

import { useMeniContext } from "~/context/meniContext";
import { type IMenuBrief } from "~/lib/types";
import { api } from "~/utils/api";

import MenuList, { MenuCardMode } from "~/components/dashboard/MenuList";
import { LoadingPage } from "~/components/loadingPage";
import MeniButton from "~/components/meniComponents/MeniButton";
import MeniMoneyMaker from "~/components/meniComponents/MeniMoneyMaker";
import MeniNotification from "~/components/meniComponents/MeniNotification";
import Navbar from "~/components/navbar";
import PersonalInfo from "~/components/registrationForms/PersonalInfo";
import RestaurantInfo from "~/components/registrationForms/RestaurantInfo";

const PADDING = "xl:mx-48 md:mx-24 xs:mx-6";

const Tour = dynamic(() => import("reactour"), { ssr: false });

export default function Dashboard() {
  const {
    loading,
    accountInfo,
    allRestaurantInfo,
    currentRestaurantSelected,
    currentRestaurantSelectedIndex,
    setCurrentRestaurantSelectedIndex,
    updateAccountInfo,
    updateRestaurantInfo,
  } = useMeniContext();
  const router = useRouter();
  const { user } = useUser();

  const [activeMenu, setActiveMenu] = useState<string>(""); // active menu for the restaurant
  const [tourEnable, setTourEnable] = useState(false);

  const {
    data: menus,
    refetch: fetchMenusBrief,
    isLoading: isLoadingMenus,
  } = api.getters.getMenusBrief.useQuery(
    {
      clerkId: accountInfo?.clerkId as string,
      restaurantId: currentRestaurantSelected?.id as string,
    },
    { enabled: false },
  );

  const { refetch: fetchCanCreateMenu } =
    api.meniMoneyMaker.createMenuCheck.useQuery(
      {
        clerkId: accountInfo?.clerkId as string,
        restaurantId: currentRestaurantSelected?.id as string,
      },
      { enabled: false, retry: false },
    );

  useEffect(() => {
    if (accountInfo?.clerkId && currentRestaurantSelected?.id) {
      void fetchMenusBrief();
      menus?.forEach((menu: IMenuBrief) => {
        if (menu.id === currentRestaurantSelected?.activeMenuId) {
          setActiveMenu(menu.id);
        }
      });
    }
  }, [
    accountInfo?.clerkId,
    fetchMenusBrief,
    menus,
    currentRestaurantSelected?.id,
    currentRestaurantSelected?.activeMenuId,
  ]);

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
    if (accountInfo && currentRestaurantSelected) {
      setNewForm({
        firstName: accountInfo.firstName,
        lastName: accountInfo.lastName,
        restaurantName: currentRestaurantSelected.name,
        address: currentRestaurantSelected.address,
        restaurantPhoneNumber: currentRestaurantSelected.phoneNumber,
        description: currentRestaurantSelected.description,
        image: currentRestaurantSelected.image,
        edited: false,
      });
    }
  }, [accountInfo, currentRestaurantSelected]);

  const handleInfoChange = (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    setNewForm({ ...newForm, [e.target.name]: e.target.value, edited: true });
  };

  const handleImageChange = (imageUrl: string) => {
    setNewForm({ ...newForm, image: imageUrl, edited: true });
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

  // useEffect(() => {
  //   setTourEnable(true);
  // }, [interactibilityLoader]);

  const handleCreateMenu = async () => {
    if (user && menus && currentRestaurantSelected) {
      const response = await fetchCanCreateMenu();
      if (response?.data?.success) {
        void router.push({
          pathname: `/edit/${currentRestaurantSelected?.id}/new`,
        });
      } else {
        MeniNotification(
          "Error!",
          `You have reached the maximum number of menus for your plan.`,
          "error",
        );
      }
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
  if (user && !user.publicMetadata.onboardingComplete) {
    void router.push("/register");
  }

  if (loading || isLoadingMenus) return <LoadingPage />;

  return (
    <div className="min-h-screen w-full bg-backdrop">
      {/* {renderTour()} */}
      <Navbar page="dashboard" />
      <div className="pb-8">
        <div
          className={`flex justify-between pt-20 font-serif text-6xl ${PADDING} flex-col md:flex-row`}
        >
          <div>Dashboard</div>
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
            <MeniButton onClick={() => void handleCreateMenu()}>
              Create Menu
            </MeniButton>
          </div>
          <div className="block sm:hidden">
            <MeniButton onClick={() => void handleCreateMenu()}>+</MeniButton>
          </div>
        </div>
        {menus && menus.length > 0 ? (
          <MenuList
            mode={MenuCardMode.MENU}
            activeMenu={activeMenu}
            menus={menus}
            restaurantId={currentRestaurantSelected?.id || ""}
            getRestaurantMenus={() => fetchMenusBrief()}
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
              hasPaymentMethod={
                // !!(
                //   accountInfo?.stripePaymentId && accountInfo?.stripeCustomerId
                // ) || true
                // WHEN WE GO OUT OF BETA UNCOMMENT THIS
                true
              }
              isPaid={accountInfo?.isPaid || false}
              currentTier={accountInfo?.currentPlan || ""}
              restaurantId={currentRestaurantSelected?.id || ""}
            />
          </div>
          <h1 className="my-6 font-serif text-4xl">Edit Account Information</h1>

          <div className="grid">
            <RestaurantInfo
              restaurantName={newForm.restaurantName}
              address={newForm.address}
              restaurantPhoneNumber={newForm.restaurantPhoneNumber}
              restaurantImage={newForm.image}
              description={newForm.description}
              onChange={handleInfoChange}
              handleImageChange={handleImageChange}
              initial={false}
            />
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
