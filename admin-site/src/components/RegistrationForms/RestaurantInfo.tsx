import { useEffect, useState } from "react";

import MeniTextInput from "~/components/items/MeniTextInput";

type RestaurantInfoProps = {
  restaurantName: string;
  address: string;
  restaurantPhoneNumber: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  restaurantImage: string;
  imageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
    imageChange,
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
      <div className="grid-flow-rows grid grid-cols-1 grid-rows-6 gap-4 text-white md:grid-cols-3 md:grid-rows-6 lg:grid-cols-3 lg:grid-rows-4 lg:gap-10">
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
          className={`grid-row-2 grid-col-1 relative row-span-3 grid ${
            !initial ? "lg:col-span-2" : "lg:col-span-3"
          } md:col-span-3`}
        >
          <textarea
            onChange={handleDescriptionChange}
            name="description"
            value={description}
            maxLength={2000}
            className="row-span-3 whitespace-normal bg-grey px-6 py-8 md:col-span-3 lg:col-span-3"
            placeholder="Description"
          ></textarea>
          <div className="absolute bottom-2 right-2 text-gray-400">
            {charCount}/{2000}
          </div>
        </div>
        {/* {!initial ? (
          <UploadyHolder
            imageChange={imageChange}
            restaurantImage={restaurantImage}
          />
        ) : null} */}
      </div>
    </div>
  );
};

export default RestaurantInfo;
