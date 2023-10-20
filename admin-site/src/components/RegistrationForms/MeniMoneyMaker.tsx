import QRCode from "qrcode.react";
import { useState } from "react";

import MeniGlobals from "~/MeniGlobals";
import { useMeniContext } from "~/context/meniContext";

import MeniButton from "~/components/items/MeniButton";
import MeniNotification from "~/components/items/MeniNotification";
import MeniTextInput from "~/components/items/MeniTextInput";

type Plan = {
  key: string;
  tier: string;
  price: number;
  period: string;
  description: string;
};

type MMMProps = {
  paymentProvided: boolean;
  currentTier: string;
  restaurantId: string;
};

const MeniMoneyMaker: React.FunctionComponent<MMMProps> = (props) => {
  const {
    interactibilityLoader,
    userInfo,
    beginLoad,
    endLoad,
    getPersonalInfo,
    personalInfo,
  } = useMeniContext();
  const [pageStep, setPageStep] = useState(1);
  const [paymentPlans, setPaymentPlans] = useState<Plan[]>([
    {
      key: "tier0",
      tier: "Free",
      price: 0.0,
      period: "",
      description: "Create 1 free menu, no publishing",
    },
    {
      key: "tier1",
      tier: "Tier1",
      price: 9.99,
      period: "1 month",
      description: "Create and publish 1 menu",
    },
    {
      key: "tier2",
      tier: "Tier2",
      price: 14.99,
      period: "1 month",
      description: "Create 2 menus, select 1 to publish at a time",
    },
    {
      key: "tier3",
      tier: "Tier3",
      price: 19.99,
      period: "1 month",
      description:
        "Create 4 menus, select 1 to publish at a time. Your menu will be featured on Meni Explore!",
    },
  ]);
  const [selectedTier, setSelectedTier] = useState("");
  const [paymentInfo, setPaymentInfo] = useState({
    paymentFirstName: "",
    paymentLastName: "",
    paymentAddress: "",
    creditCardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [localLoader, setLocalLoader] = useState(false);

  const handleChangePayment = (e: any) => {
    // const expDateRegex = /^(\d{1,2})\/(\d{1,2})$/;
    // if (e.target.name === "creditCardNumber") {
    //   if (e.target.value.length > 16 || isNaN(e.target.value)) {
    //     return;
    //   }
    // }
    // if (e.target.name === "expiryDate" || e.target.value === "") {
    //   if (e.target.value.length > 5) {
    //     return;
    //   }
    //   if (e.target.value.length < 2 && isNaN(e.target.value)) {
    //     return;
    //   }
    //   if (e.target.value.length > 3 && isNaN(e.target.value.substring(3))) {
    //     return;
    //   }
    //   if (e.target.value.length === 3 && e.target.value[2] !== "/") {
    //     return;
    //   }
    // }
    // if (e.target.name === "cvc") {
    //   if (e.target.value.length > 3 || isNaN(e.target.value)) {
    //     return;
    //   }
    // }
    // setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleQRCodeExport = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen")! as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `MeniQR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleSubmitPaymentInfo = () => {
    return;
    // if (userInfo) {
    //   beginLoad();
    //   setLocalLoader(true);
    //   const customerParamsForStripe = {
    //     creditCardNumber: paymentInfo.creditCardNumber,
    //     expiryDate: paymentInfo.expiryDate,
    //     cvc: parseInt(paymentInfo.cvc),
    //   };
    //   fetch(MeniGlobals().apiRoot + "/create-stripe-user", {
    //     body: JSON.stringify(customerParamsForStripe),
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${userInfo.meniToke}`,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       handleUserPickedPaymentPlan(selectedTier.toLowerCase()).then(
    //         (response2) => {
    //           endLoad();
    //           setPageStep(4);
    //           return data;
    //         },
    //       );
    //     })
    //     .catch((error) => {
    //       endLoad();
    //       return error;
    //     });
    // }
  };

  const handleUserPickedPaymentPlan = (e: string) => {
    return;
    // if (
    //   e === props.currentTier ||
    //   (e === "free" && props.currentTier === "tier0")
    // ) {
    //   return "You are currently on this plan!";
    // }
    // if (userInfo) {
    //   beginLoad();
    //   setLocalLoader(true);
    //   fetch(MeniGlobals().apiRoot + "/set-payment-plan", {
    //     method: "POST",
    //     body: JSON.stringify({ type: e }),
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${userInfo.meniToke}`,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       getPersonalInfo().then((res) => {
    //         endLoad();
    //         setLocalLoader(false);
    //         return data;
    //       });
    //     })
    //     .catch((error) => {
    //       endLoad();
    //       return error;
    //     });
    // }
  };

  const handleUserPickedPlan = (e: string) => {
    return;
    // setSelectedTier(e);
    // if (props.paymentProvided) {
    //   handleUserPickedPaymentPlan(e.toLowerCase()).then((status) => {
    //     if (status === "You are currently on this plan!") {
    //       MeniNotification("Error!", status, "warning");
    //     } else {
    //       setPageStep(5);
    //     }
    //   });
    // } else {
    //   if (e === "Free") {
    //     MeniNotification(
    //       "Error!",
    //       "You are currently on this plan!",
    //       "warning",
    //     );
    //   } else {
    //     setPageStep(3);
    //   }
    // }
  };

  return (
    <div className="text-sans my-10">
      <h1 className="my-6 font-serif text-4xl">Menu Publication</h1>
      <div className="grid gap-10 text-white">
        {pageStep === 1 ? (
          <div className="m-auto grid grid-rows-2 gap-5">
            <div className="m-auto grid gap-y-10">
              {props.paymentProvided && props.currentTier !== "tier0" ? (
                <p className="text-center">
                  The Meni Team appreciates your continued support. Your current
                  plan is{" "}
                  {paymentPlans
                    .find((tier) => tier.key === personalInfo.currentPlan)
                    ?.tier.replace(/Tier(\d)/, "Tier $1")}{" "}
                  paying $
                  {
                    paymentPlans.find(
                      (tier) => tier.key === personalInfo.currentPlan,
                    )?.price
                  }{" "}
                  per month. You will be charged again on{" "}
                  {new Date(
                    parseInt(personalInfo.nextPayment) * 1000,
                  ).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  .
                </p>
              ) : (
                <p>
                  Your active menu will be visible to customers after you choose
                  one of our Meni plans ©
                </p>
              )}
            </div>
            <div className="m-auto" id="edit-plan-button">
              {props.paymentProvided && props.currentTier !== "tier0" ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className={`flex justify-center`}>
                    <button
                      className="text-light w-full border border-white bg-white px-6 py-3 font-semibold text-black transition hover:border-white hover:bg-backdrop hover:text-white sm:w-96"
                      onClick={handleQRCodeExport}
                    >
                      Export QR Code
                    </button>
                  </div>
                  <QRCode
                    id="qr-gen"
                    value={"https://meniapp.ca/table/" + props.restaurantId}
                    size={290}
                    level={"H"}
                    includeMargin={true}
                    className="hidden"
                  />
                  <MeniButton
                    onClick={() => {
                      setPageStep(2);
                    }}
                  >
                    Change your plan
                  </MeniButton>
                </div>
              ) : (
                <MeniButton
                  onClick={() => {
                    setPageStep(2);
                  }}
                >
                  Select Plan
                </MeniButton>
              )}
            </div>
          </div>
        ) : pageStep === 2 ? (
          <div className="my-6 grid grid-cols-1 gap-y-4 font-sans text-3xl font-medium md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-x-4">
            {paymentPlans.map((currPlan: Plan, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => handleUserPickedPlan(currPlan.tier)}
                  className="col-span-1 row-span-1 rounded-md bg-card hover:cursor-pointer"
                >
                  <div className="flex h-full flex-col items-center justify-between gap-y-6 p-6">
                    <div className="font-medium">
                      {currPlan.tier.replace(/([a-z])([0-9])/i, "$1 $2")}
                    </div>
                    <div className="text-center text-base font-thin">
                      {currPlan.description}
                    </div>
                    <div className="text-2xl">${currPlan.price}/mo</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : pageStep === 3 ? (
          <>
            <div className="col-span-2 row-span-1">
              <MeniTextInput
                id="paymentFirstName"
                name="paymentFirstName"
                value={paymentInfo.paymentFirstName}
                onChange={handleChangePayment}
                title="First Name"
              />
            </div>
            <div className="col-span-2 row-span-1">
              <MeniTextInput
                id="paymentLastName"
                name="paymentLastName"
                value={paymentInfo.paymentLastName}
                onChange={handleChangePayment}
                title="Last Name"
              />
            </div>
            <div className="col-span-4 row-span-1">
              <MeniTextInput
                id="paymentAddress"
                name="paymentAddress"
                value={paymentInfo.paymentAddress}
                onChange={handleChangePayment}
                title="Address"
              />
            </div>
            <div className="col-span-4 row-span-1">
              <MeniTextInput
                id="creditCardNumber"
                name="creditCardNumber"
                value={paymentInfo.creditCardNumber}
                onChange={handleChangePayment}
                title="Credit Card Number"
              />
            </div>
            <div className=" col-span-2 row-span-1">
              <MeniTextInput
                id="expiryDate"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handleChangePayment}
                title="Expiry Date (MM/YY)"
              />
            </div>
            <div className=" col-span-1 row-span-1">
              <MeniTextInput
                id="cvc"
                name="cvc"
                value={paymentInfo.cvc}
                onChange={handleChangePayment}
                title="CVC"
              />
            </div>
            <div className="col-span-1 row-span-1 grid">
              <MeniButton onClick={handleSubmitPaymentInfo}>Submit</MeniButton>
            </div>

            <div className="col-span-4 grid justify-items-center">
              <p>
                Your privacy is our top priority. Payment information is safely
                handled and stored by a third party platform and is never stored
                on our servers.{" "}
              </p>
            </div>
          </>
        ) : pageStep === 4 ? (
          <div>
            {!localLoader ? (
              <>
                <div className="flex flex-col items-center justify-center gap-y-6 text-center">
                  {personalInfo.currentPlan !== "tier0" ? (
                    <>
                      Thank you! Your payment info has been saved. You have paid
                      $
                      {
                        paymentPlans.find(
                          (tier) => tier.key === personalInfo.currentPlan,
                        )?.price
                      }{" "}
                      for{" "}
                      {paymentPlans
                        .find((tier) => tier.key === personalInfo.currentPlan)
                        ?.tier.replace(/Tier(\d)/, "Tier $1")}
                      . You will be charged again on{" "}
                      {new Date(
                        parseInt(personalInfo.nextPayment) * 1000,
                      ).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      .
                      <div className={`flex justify-center`}>
                        <button
                          className="text-light w-full border border-white bg-white px-6 py-3 font-semibold text-black transition hover:border-white hover:bg-backdrop hover:text-white sm:w-96"
                          onClick={handleQRCodeExport}
                        >
                          Export QR Code
                        </button>
                      </div>
                      <QRCode
                        id="qr-gen"
                        value={"https://meniapp.ca/table/" + props.restaurantId}
                        size={290}
                        level={"H"}
                        includeMargin={true}
                        className="hidden"
                      />
                    </>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center">
                  Processing your payment...
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            {!localLoader ? (
              <>
                <div className="flex flex-row items-center justify-center text-center">
                  {selectedTier === "Free"
                    ? `You have successfully changed your plan. You will no longer be charged monthy for Meni.`
                    : `You have successfully changed your plan. You have been charged $${paymentPlans.find(
                        (tier) => tier.key === personalInfo.currentPlan,
                      )?.price} for ${paymentPlans
                        .find((tier) => tier.key === personalInfo.currentPlan)
                        ?.tier.replace(
                          /Tier(\d)/,
                          "Tier $1",
                        )}. You will be charged again on
                  ${new Date(
                    parseInt(personalInfo.nextPayment) * 1000,
                  ).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}.`}
                </div>
                {selectedTier === "Free" ? null : (
                  <div className="flex justify-center pt-8">
                    <button
                      className="text-light w-full border border-white bg-white px-6 py-3 font-semibold text-black transition hover:border-white hover:bg-backdrop hover:text-white sm:w-96"
                      onClick={handleQRCodeExport}
                    >
                      Export QR Code
                    </button>
                    <QRCode
                      id="qr-gen"
                      value={"https://meniapp.ca/table/" + props.restaurantId}
                      size={290}
                      level={"H"}
                      includeMargin={true}
                      className="hidden"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-center">
                  Processing your payment...
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeniMoneyMaker;
