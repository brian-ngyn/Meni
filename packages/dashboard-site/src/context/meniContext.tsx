import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { type Dispatch, type SetStateAction } from "react";

import { useUser } from "@clerk/nextjs";
import { type Account, type RestaurantInfo } from "@prisma/client";
import { type UseQueryResult } from "@tanstack/react-query";

import { api } from "~/utils/api";

import MeniNotification from "~/components/meniComponents/MeniNotification";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

interface EditedAccount {
  firstName: string;
  lastName: string;
}

interface EditedRestaurantInfo {
  name: string;
  address: string;
  phoneNumber: string;
  description: string;
  image: string;
}

type MeniContextReturnType = {
  loading: boolean;
  accountInfo: Account | null | undefined;
  allRestaurantInfo: RestaurantInfo[] | null | undefined;
  refetchAccountInfo: () => Promise<UseQueryResult>;
  refetchAllRestaurantInfo: () => Promise<UseQueryResult>;
  updateAccountInfo: (newInfo: EditedAccount) => void;
  updateRestaurantInfo: (newInfo: EditedRestaurantInfo) => void;
  currentRestaurantSelectedIndex: number;
  setCurrentRestaurantSelectedIndex: Dispatch<SetStateAction<number>>;
  currentRestaurantSelected: RestaurantInfo | undefined;
};

const MeniContext = createContext<MeniContextReturnType>(
  {} as MeniContextReturnType,
);

export function MeniContextProvider({ children }: Props) {
  const { user, isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const [currentRestaurantSelectedIndex, setCurrentRestaurantSelectedIndex] =
    useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    data: accountInfo,
    refetch: refetchAccountInfo,
    isLoading: isAccountInfoLoading,
  } = api.getters.getAccountInfo.useQuery(
    { clerkId: user?.id || "" },
    {
      enabled: (user &&
        isSignedIn &&
        router.pathname === "/dashboard") as boolean,
    },
  );
  const {
    data: allRestaurantInfo,
    refetch: refetchAllRestaurantInfo,
    isLoading: isAllRestaurantInfoLoading,
  } = api.getters.getAllRestaurantInfo.useQuery(
    { clerkId: user?.id || "" },
    {
      enabled: (user &&
        isSignedIn &&
        router.pathname === "/dashboard") as boolean,
    },
  );

  const currentRestaurantSelected = allRestaurantInfo
    ? allRestaurantInfo[currentRestaurantSelectedIndex]
    : undefined;

  const { mutate: mutateRestaurantInfo } =
    api.setters.updateRestaurantInfo.useMutation({
      onSuccess: (a) => {
        if (a.success) {
          MeniNotification(
            "Success",
            "Restaurant information has been updated.",
            "success",
          );
        } else {
          MeniNotification(
            "Error",
            "Failed to update restaurant information. Please try again later or contact support.",
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
            "Failed to update restaurant information. Please try again later or contact support.",
            "error",
          );
        }
      },
    });
  const { mutate: mutateAccount } = api.setters.updateAccount.useMutation({
    onSuccess: (a) => {
      if (a.success) {
        MeniNotification(
          "Success",
          "Personal information has been updated.",
          "success",
        );
      } else {
        MeniNotification(
          "Error",
          "Failed to update personal information. Please try again later or contact support.",
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
          "Failed to update personal information. Please try again later or contact support.",
          "error",
        );
      }
    },
  });

  const updateRestaurantInfo = (newInfo: EditedRestaurantInfo) => {
    if (user && currentRestaurantSelected) {
      mutateRestaurantInfo({
        ...newInfo,
        clerkId: user.id,
        restaurantId: currentRestaurantSelected.id,
      });
    }
  };

  const updateAccountInfo = (newInfo: EditedAccount) => {
    mutateAccount({
      ...newInfo,
      clerkId: user?.id || "",
    });
  };

  useEffect(() => {
    if (isAccountInfoLoading || isAllRestaurantInfoLoading || !isClerkLoaded) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isAccountInfoLoading, isClerkLoaded, isAllRestaurantInfoLoading]);

  return (
    <MeniContext.Provider
      value={{
        loading,
        accountInfo,
        allRestaurantInfo,
        currentRestaurantSelectedIndex,
        setCurrentRestaurantSelectedIndex,
        refetchAccountInfo,
        refetchAllRestaurantInfo,
        updateAccountInfo,
        updateRestaurantInfo,
        currentRestaurantSelected,
      }}
    >
      {children}
    </MeniContext.Provider>
  );
}

export function useMeniContext(): MeniContextReturnType {
  return useContext(MeniContext);
}
