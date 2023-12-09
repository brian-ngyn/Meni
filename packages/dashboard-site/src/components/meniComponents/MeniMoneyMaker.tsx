import QRCode from "qrcode.react";

import { useUser } from "@clerk/nextjs";

type MMMProps = {
  hasPaymentMethod: boolean;
  isPaid: boolean;
  currentTier: string;
  restaurantId: string;
};

const MeniMoneyMaker: React.FunctionComponent<MMMProps> = (props) => {
  const { hasPaymentMethod, isPaid, currentTier, restaurantId } = props;

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
      <div className="grid gap-10 text-white">
        <div className="m-auto grid grid-rows-2 gap-2">
          <div className="m-auto grid gap-y-10">
            <p className="text-center">
              The Meni Team appreciates your continued support. Thanks for
              helping Beta test!
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
                value={"https://meniapp.ca/qr/" + restaurantId}
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
