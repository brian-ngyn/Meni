import { v4 as uuidv4 } from "uuid";

import { type Menus } from "@prisma/client";

export default function MeniGlobals() {
  const env = process.env.NODE_ENV;
  const globals = {
    apiRoot: "/",
    cdnRoot: "https://utfs.io/f/",
    webBase:
      env === "production" ? "https://meniapp.ca/" : "http://localhost:3000",
  };
  return globals;
}

export function defaultStarterMenu(restaurantId: string): Menus {
  const defaultStarterMenuObj: Menus = {
    id: uuidv4(),
    name: "Menu Name",
    restaurantId: restaurantId,
    tags: ["Vegan", "Dairy Free", "Gluten Free", "Nut Free"],
    mainCategories: [
      {
        id: uuidv4(),
        name: "Food",
        subCategories: [
          {
            id: uuidv4(),
            name: "Appetizers",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: 0,
                description: "",
                image: "",
                tags: ["Gluten Free", "Vegan"],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Pasta",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: 0,
                description: "",
                image: "",
                tags: [],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Desert",
        subCategories: [
          {
            id: uuidv4(),
            name: "Cake",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: 0,
                description: "",
                image: "",
                tags: [],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Ice Cream",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: 0,
                description: "",
                image: "",
                tags: [],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Drinks",
        subCategories: [
          {
            id: uuidv4(),
            name: "Pop",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: 0,
                description: "",
                image: "",
                tags: [],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Juices",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: 0,
                description: "",
                image: "",
                tags: [],
              },
            ],
          },
        ],
      },
    ],
  };

  return defaultStarterMenuObj;
}
