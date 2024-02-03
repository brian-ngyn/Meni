import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { type Dispatch, type SetStateAction } from "react";

import { useUser } from "@clerk/nextjs";
import { type Account, type RestaurantInfo } from "@prisma/client";
import { type UseQueryResult } from "@tanstack/react-query";

import { type IPlanFeatures } from "~/server/utils/helpers";
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
  userEntitlements: IPlanFeatures | undefined;
  refetchUserEntitlements: () => Promise<UseQueryResult>;
  refetchContextData: () => Promise<UseQueryResult>;
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
    data: contextData,
    refetch: refetchContextData,
    isLoading: isContextDataLoading,
  } = api.getters.getContextData.useQuery(
    { clerkId: user?.id || "" },
    { enabled: !!(user && isSignedIn && router.pathname === "/dashboard") },
  );

  const {
    data: userEntitlements,
    refetch: refetchUserEntitlements,
    isLoading: isUserEntitlementsLoading,
  } = api.getters.getEntitlements.useQuery(
    { clerkId: user?.id || "" },
    { enabled: !!(user && isSignedIn && router.pathname === "/dashboard") },
  );

  const accountInfo = contextData?.accountInfo;
  const allRestaurantInfo = contextData?.allRestaurantInfo;

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
    if (isContextDataLoading || !isClerkLoaded || isUserEntitlementsLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isContextDataLoading, isClerkLoaded, isUserEntitlementsLoading]);

  return (
    <MeniContext.Provider
      value={{
        loading,
        accountInfo,
        allRestaurantInfo,
        userEntitlements,
        refetchUserEntitlements,
        currentRestaurantSelectedIndex,
        setCurrentRestaurantSelectedIndex,
        refetchContextData,
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
