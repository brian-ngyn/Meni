import Image from "next/image";
import { useEffect, useState } from "react";

import MeniGlobals from "~/MeniGlobals";
import { UploadButton } from "~/utils/uploadthing";

import MeniNotification from "~/components/items/MeniNotification";
import MeniTextInput from "~/components/items/MeniTextInput";

type RestaurantInfoProps = {
  restaurantName: string;
  address: string;
  restaurantPhoneNumber: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  restaurantImage: string;
  handleImageChange?: (imageUrl: string) => void;
  initial: boolean;
};

const RestaurantInfo: React.FunctionComponent<RestaurantInfoProps> = (
  props,
) => {
  const {
    restaurantName,
    address,
    restaurantPhoneNumber,
    description,
    onChange,
    restaurantImage,
    handleImageChange,
    initial,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };
  // set character count on initial render
  useEffect(() => {
    setCharCount(description.length);
  }, []);

  // use state for character count
  const [charCount, setCharCount] = useState(0);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChange(e);
    setCharCount(e.target.value.length);
  };

  return (
    <div className="font-sans" id="edit-restaurant-section">
      <h1 className="my-6 text-2xl">Restaurant Information</h1>
      <div className="grid grid-cols-1 gap-3 text-white md:grid-cols-3 lg:gap-10">
        <MeniTextInput
          id="restaurantName"
          name="restaurantName"
          value={restaurantName}
          onChange={handleChange}
          title="Name"
          validate={{
            required: true,
            pattern: /[a-zA-Z0-9\s\-@#$%&*]+[^\s\-@#$%&*]$/i,
            errorMessages: {
              required: "Restaurant name is required",
              pattern: "Restaurant name is not valid",
            },
          }}
        />
        <MeniTextInput
          id="address"
          name="address"
          value={address}
          onChange={handleChange}
          title="Address"
          validate={{
            required: true,
            pattern: /[a-zA-Z0-9\s\-@#$%&*]+[^\s\-@#$%&*]$/i,
            errorMessages: {
              required: "Address is required",
            },
          }}
        />
        <MeniTextInput
          id="tel"
          type="tel"
          name="restaurantPhoneNumber"
          value={restaurantPhoneNumber}
          onChange={handleChange}
          title="Phone Number"
          validate={{
            required: true,
            pattern: /^\d{3}[-]?\d{3}[-]?\d{4}$|^\(\d{3}\)\s*\d{3}[-]?\d{4}$/,
            errorMessages: {
              required: "Phone number is required",
              pattern: "Phone number is not valid",
            },
          }}
        />
        <div
          className={`${
            initial ? "h-48 md:col-span-3" : "md:col-span-2"
          } relative grid`}
        >
          <textarea
            onChange={handleDescriptionChange}
            name="description"
            value={description}
            maxLength={500}
            className="row-span-3 resize-none whitespace-normal bg-grey px-6 py-8 md:col-span-3 lg:col-span-3"
            placeholder="Description"
          ></textarea>
          <div className="absolute bottom-2 right-2 text-gray-400">
            {charCount}/{500}
          </div>
        </div>
        {!initial && handleImageChange && (
          <div className="flex flex-col gap-y-4 ">
            <div className="relative aspect-video">
              <Image
                src={MeniGlobals().cdnRoot + restaurantImage}
                fill
                style={{ objectFit: "contain" }}
                alt="Restaurant Image"
              />
            </div>
            <UploadButton
              endpoint="imageUploader"
              className="ut-button:bg-gray-500 ut-button:ut-readying:bg-gray-500/50 ut-uploading:cursor-not-allowed"
              appearance={{
                button: "after:bg-gray-600",
              }}
              onClientUploadComplete={(res) => {
                // Do something with the response
                if (res) {
                  const newUrl = res[0]?.key;
                  if (newUrl) {
                    handleImageChange(newUrl);
                    MeniNotification("Success!", "Upload Completed", "success");
                  }
                }
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                MeniNotification(
                  "Error!",
                  "There was an error uploading your image. Please try again later or contact support.",
                  "error",
                );
                console.log(`${error.message}`);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantInfo;
