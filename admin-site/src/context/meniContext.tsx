import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { type Dispatch, type SetStateAction } from "react";

import MeniGlobals from "~/MeniGlobals";

import MeniNotification from "~/components/items/MeniNotification";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

type userInfoType = {
  user: string;
  meniRefreshToke: string;
  meniToke: string;
};

type personalInfoType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isPaid: boolean;
  currentPlan: string;
  lastPaid: string;
  nextPayment: string;
};

type MeniContextReturnType = {
  userInfo: userInfoType | null;
  loading: boolean;
  interactibilityLoader: boolean;
  beginLoad: () => void;
  endLoad: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<userInfoType | null>>;
  logout: () => void;
  setLocalStorage: (newInfo: userInfoType) => void; // change later
  personalInfo: personalInfoType;
  getPersonalInfo: () => void; // change later
  setPersonalInfo: Dispatch<SetStateAction<personalInfoType>>;
};

const MeniContext = createContext<MeniContextReturnType>(
  {} as MeniContextReturnType,
);

export function MeniContextProvider({ children }: Props) {
  const [userInfo, setUserInfo] = useState<userInfoType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [interactibilityLoader, setInteractibilityLoader] =
    useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isPaid: false,
    currentPlan: "",
    lastPaid: "",
    nextPayment: "",
  });

  const getPersonalInfo = () => {
    return;
    // if (userInfo) {
    //   beginLoad();
    //   fetch(MeniGlobals().apiRoot + "/get-personal-info", {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${userInfo.meniToke}`,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       const paymentInfoValid = data.stripePaymentId ? true : false;
    //       setPersonalInfo({
    //         firstName: data.firstName,
    //         lastName: data.lastName,
    //         email: data.email,
    //         password: "",
    //         isPaid: paymentInfoValid,
    //         currentPlan: data.currentPlan,
    //         lastPaid: data.lastPaid,
    //         nextPayment: data.nextPayment,
    //       });
    //       endLoad();
    //     })
    //     .catch((err) => {
    //       endLoad();
    //     });
    // }
    // return "Loaded";
  };

  useEffect(() => {
    if (loadingCount <= 0) {
      setInteractibilityLoader(false);
    } else {
      setInteractibilityLoader(true);
    }
  }, [loadingCount]);

  const beginLoad = () => {
    setLoadingCount((prev) => prev + 1);
  };

  const endLoad = () => {
    setLoadingCount((prev) => prev - 1);
  };

  function checkIfTokenIsValid() {
    return;
    // const localstorage =
    //   typeof window !== "undefined" ? localStorage.getItem("session") : null;
    // if (localstorage) {
    //   beginLoad();
    //   try {
    //     const response = await fetch(MeniGlobals().apiRoot + "/validateToken", {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${JSON.parse(localstorage).meniToke}`,
    //       },
    //     });
    //     if (response && response.status === 200) {
    //       const data = await response.json();
    //       if (data.message === "Valid") {
    //         return "Valid Token";
    //       } else {
    //         MeniNotification(
    //           "Your session has expired",
    //           "Please login again",
    //           "warning",
    //         );
    //         return "Invalid Token, 401 error";
    //       }
    //     } else {
    //       MeniNotification(
    //         "Your session has expired",
    //         "Please login again",
    //         "warning",
    //       );
    //       return "Invalid Token, 401 error";
    //     }
    //   } catch (error) {
    //     MeniNotification(
    //       "Your session has expired",
    //       "Please login again",
    //       "warning",
    //     );
    //   }
    // } else {
    //   return "Nothing in local storage";
    // }
  }

  function setLocalStorage(newInfo: userInfoType) {
    return;
    // setLoading(true);
    // if (newInfo.meniToke) {
    //   localStorage.setItem("session", JSON.stringify(newInfo));
    //   const localstorage = localStorage.getItem("session");
    //   if (localstorage) {
    //     setUserInfo(JSON.parse(localstorage));
    //     setLoading(false);
    //     return "Saved";
    //   } else {
    //     setLoading(false);
    //     return "Error";
    //   }
    // } else {
    //   setLoading(false);
    //   return "Error";
    // }
  }

  function logout() {
    return;
    // if (typeof window !== "undefined") {
    //   localStorage.removeItem("session");
    //   setUserInfo(null);
    // }
  }

  useEffect(() => {
    // setLoading(true);
    // try {
    //   checkIfTokenIsValid()
    //     .then((res) => {
    //       if (res === "Valid Token") {
    //         const localstorage =
    //           typeof window !== "undefined"
    //             ? localStorage.getItem("session")
    //             : null;
    //         if (localstorage) {
    //           setUserInfo(JSON.parse(localstorage));
    //           setLoading(false);
    //           endLoad();
    //           return localstorage ? JSON.parse(localstorage) : null;
    //         }
    //       } else {
    //         logout();
    //         setLoading(false);
    //         endLoad();
    //         return null;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log("err", err);
    //       logout();
    //       endLoad();
    //     });
    // } catch (err) {
    //   console.log("err", err);
    //   logout();
    //   endLoad();
    //   MeniNotification(
    //     "Your session has expired",
    //     "Please login again",
    //     "warning",
    //   );
    // }
  }, []);

  return (
    <MeniContext.Provider
      value={{
        userInfo,
        loading,
        setUserInfo,
        logout,
        setLocalStorage,
        interactibilityLoader,
        beginLoad,
        endLoad,
        personalInfo,
        getPersonalInfo,
        setPersonalInfo,
      }}
    >
      {children}
    </MeniContext.Provider>
  );
}

export function useMeniContext(): MeniContextReturnType {
  return useContext(MeniContext);
}
