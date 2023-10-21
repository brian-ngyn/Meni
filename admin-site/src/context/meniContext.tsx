import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { type Dispatch, type SetStateAction } from "react";

import { useUser } from "@clerk/nextjs";
import { type Account, type RestaurantInfo } from "@prisma/client";

import { api } from "~/utils/api";

import MeniNotification from "~/components/items/MeniNotification";

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
  restaurantInfo: RestaurantInfo | null | undefined;
  refetchAccountInfo: unknown;
  refetchRestaurantInfo: unknown;
  updateAccountInfo: (newInfo: EditedAccount) => void;
  updateRestaurantInfo: (newInfo: EditedRestaurantInfo) => void;
};

const MeniContext = createContext<MeniContextReturnType>(
  {} as MeniContextReturnType,
);

export function MeniContextProvider({ children }: Props) {
  const { user, isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    data: accountInfo,
    refetch: refetchAccountInfo,
    isLoading: isAccountInfoLoading,
  } = api.getters.getAccountInfo.useQuery(
    { clerkId: user?.id || "" },
    { enabled: false },
  );
  const {
    data: restaurantInfo,
    refetch: refetchRestaurantInfo,
    isLoading: isRestaurantInfoLoading,
  } = api.getters.getRestaurantInfo.useQuery(
    { clerkId: user?.id || "" },
    { enabled: false },
  );
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
    mutateRestaurantInfo({
      ...newInfo,
      id: restaurantInfo?.id || "",
      clerkId: user?.id || "",
    });
  };

  const updateAccountInfo = (newInfo: EditedAccount) => {
    mutateAccount({
      ...newInfo,
      id: accountInfo?.id || "",
      clerkId: user?.id || "",
    });
  };

  useEffect(() => {
    if (user && isSignedIn && router.pathname === "/dashboard") {
      void refetchAccountInfo();
      void refetchRestaurantInfo();
    }
  }, [
    isSignedIn,
    refetchAccountInfo,
    refetchRestaurantInfo,
    router.pathname,
    user,
  ]);

  useEffect(() => {
    if (isAccountInfoLoading || isRestaurantInfoLoading || !isClerkLoaded) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isAccountInfoLoading, isClerkLoaded, isRestaurantInfoLoading]);

  return (
    <MeniContext.Provider
      value={{
        loading,
        accountInfo,
        restaurantInfo,
        refetchAccountInfo,
        refetchRestaurantInfo,
        updateAccountInfo,
        updateRestaurantInfo,
      }}
    >
      {children}
    </MeniContext.Provider>
  );
}

export function useMeniContext(): MeniContextReturnType {
  return useContext(MeniContext);
}
