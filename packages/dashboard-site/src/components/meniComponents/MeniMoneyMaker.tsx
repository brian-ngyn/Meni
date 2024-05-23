import { useRouter } from "next/router";
import QRCode from "qrcode.react";
import { Stripe } from "stripe";

const stripe = new Stripe(
  "sk_test_51PCFTR07WFzCJDijv0QAqIfkqecETirz2QEdHCSn4KOB8TNNv9bUAATuw7IwYsv4oFjnYBwXU4sxFTBy6W2PUDzx00wAjrMFGd",
);
const YOUR_DOMAIN = "https://dashboard.meniapp.ca";

type MMMProps = {
  restaurantId: string;
};

const MeniMoneyMaker = (props: MMMProps) => {
  const router = useRouter();

  const redirectToCheckout = async () => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: "price_1PDh5Q07WFzCJDij2QYtW5X4",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}/dashboard?stripe_return=success`,
      cancel_url: `${YOUR_DOMAIN}/dashboard?stripe_return=cancel`,
    });
    router.push(new URL(session.url as string));
  };

  const { restaurantId } = props;

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

  return (
    <div className="text-sans my-10">
      <h1 className="my-6 font-serif text-4xl">Menu Publication</h1>
      <div className="grid gap-10 font-sans text-white">
        <div className="m-auto grid grid-rows-2 gap-2">
          <div className="m-auto grid gap-y-10">
            <button
              className="text-light w-full border border-white bg-white px-6 py-3 font-semibold text-black transition hover:border-white hover:bg-backdrop hover:text-white sm:w-96"
              onClick={redirectToCheckout}
            >
              Pay
            </button>
            <p>
              DW Dimitar, this button will be replaced with the OG meni money
              maker plan selection box once I find it
            </p>
          </div>
          <div className="m-auto" id="edit-plan-button">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex justify-center">
                <button
                  className="text-light w-full border border-white bg-white px-6 py-3 font-semibold text-black transition hover:border-white hover:bg-backdrop hover:text-white sm:w-96"
                  onClick={handleQRCodeExport}
                >
                  Export QR Code
                </button>
              </div>
              <QRCode
                id="qr-gen"
                value={`https://meniapp.ca/qr/${restaurantId}`}
                size={290}
                level={"H"}
                includeMargin={true}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeniMoneyMaker;
