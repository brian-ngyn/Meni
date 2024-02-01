import { v4 as uuidv4 } from "uuid";

import { type Menus } from "@prisma/client";

export const EXAMPLEMENUS: Menus[] = [
  {
    restaurantId: "restaurant-1",
    id: "menu-1",
    name: "Main Menu",
    tags: ["burgers", "fries", "onion rings"],
    footer: "",
    mainCategories: [
      {
        id: "main-category-1",
        name: "Burgers",
        description: "",
        subCategories: [
          {
            id: "sub-category-1",
            name: "Beef Burgers",
            description: "",
            items: [
              {
                id: "item-1",
                name: "Classic Burger",
                price: "8.99",
                description:
                  "Beef patty with lettuce, tomato, onion, and pickles",
                image: "https://example.com/classic-burger.jpg",
                tags: [],
              },
              {
                id: "item-2",
                name: "Bacon Cheeseburger",
                price: "10.99",
                description:
                  "Beef patty with bacon, cheddar cheese, lettuce, tomato, onion, and pickles",
                image: "https://example.com/bacon-cheeseburger.jpg",
                tags: [],
              },
              {
                id: "item-3",
                name: "Mushroom Swiss Burger",
                price: "9.99",
                description:
                  "Beef patty with sautéed mushrooms, swiss cheese, lettuce, and tomato",
                image: "https://example.com/mushroom-swiss-burger.jpg",
                tags: ["vegetarian"],
              },
            ],
          },
          {
            id: "sub-category-2",
            name: "Chicken Burgers",
            description: "",
            items: [
              {
                id: "item-4",
                name: "Crispy Chicken Burger",
                price: "9.99",
                description:
                  "Breaded and fried chicken breast with lettuce, tomato, and mayonnaise",
                image: "https://example.com/crispy-chicken-burger.jpg",
                tags: [],
              },
              {
                id: "item-5",
                name: "Spicy Chicken Burger",
                price: "10.99",
                description:
                  "Breaded and fried chicken breast with spicy mayonnaise, lettuce, and tomato",
                image: "https://example.com/spicy-chicken-burger.jpg",
                tags: [],
              },
            ],
          },
        ],
      },
      {
        id: "main-category-2",
        name: "Sides",
        description: "",
        subCategories: [
          {
            id: "sub-category-3",
            name: "Fries",
            description: "",
            items: [
              {
                id: "item-6",
                name: "French Fries",
                price: "3.99",
                description: "Classic french fries",
                image: "https://example.com/french-fries.jpg",
                tags: ["vegetarian"],
              },
              {
                id: "item-7",
                name: "Sweet Potato Fries",
                price: "4.99",
                description: "Thinly sliced sweet potatoes fried to perfection",
                image: "https://example.com/sweet-potato-fries.jpg",
                tags: ["vegetarian"],
              },
            ],
          },
          {
            id: "sub-category-4",
            name: "Onion Rings",
            description: "",
            items: [
              {
                id: "item-8",
                name: "Classic Onion Rings",
                price: "5.99",
                description: "Thinly sliced onions battered and fried",
                image: "https://example.com/classic-onion-rings.jpg",
                tags: ["vegetarian"],
              },
              {
                id: "item-10",
                name: "Jalapeño Onion Rings",
                price: "6.99",
                description:
                  "Thinly sliced onions battered and fried with a spicy kick",
                image: "https://example.com/jalapeno-onion-rings.jpg",
                tags: ["vegetarian", "spicy"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    restaurantId: "restaurant-2",
    id: "menu-2",
    name: "Seasonal Menu",
    tags: ["appetizers", "entrees", "steak", "seafood"],
    footer: "",
    mainCategories: [
      {
        id: "main-category-1",
        name: "Appetizers",
        description: "",
        subCategories: [
          {
            id: "sub-category-1",
            name: "Hot Appetizers",
            description: "",
            items: [
              {
                id: "item-1",
                name: "Buffalo Wings",
                price: "9.99",
                description: "Crispy chicken wings tossed in buffalo sauce",
                image: "https://example.com/buffalo-wings.jpg",
                tags: ["spicy"],
              },
              {
                id: "item-2",
                name: "Mozzarella Sticks",
                price: "7.99",
                description:
                  "Breaded and fried mozzarella sticks served with marinara sauce",
                image: "https://example.com/mozzarella-sticks.jpg",
                tags: ["vegetarian"],
              },
            ],
          },
          {
            id: "sub-category-2",
            name: "Cold Appetizers",
            description: "",
            items: [
              {
                id: "item-3",
                name: "Caprese Salad",
                price: "8.99",
                description:
                  "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
                image: "https://example.com/caprese-salad.jpg",
                tags: ["vegetarian"],
              },
              {
                id: "item-4",
                name: "Shrimp Cocktail",
                price: "12.99",
                description: "Chilled jumbo shrimp served with cocktail sauce",
                image: "https://example.com/shrimp-cocktail.jpg",
                tags: [],
              },
            ],
          },
        ],
      },
      {
        id: "main-category-2",
        name: "Entrees",
        description: "",
        subCategories: [
          {
            id: "sub-category-3",
            name: "Steak",
            description: "",
            items: [
              {
                id: "item-5",
                name: "Filet Mignon",
                price: "29.99",
                description:
                  "8oz USDA Prime filet served with mashed potatoes and asparagus",
                image: "https://example.com/filet-mignon.jpg",
                tags: [],
              },
              {
                id: "item-6",
                name: "New York Strip",
                price: "24.99",
                description:
                  "12oz USDA Prime New York strip served with roasted potatoes and green beans",
                image: "https://example.com/new-york-strip.jpg",
                tags: [],
              },
            ],
          },
          {
            id: "sub-category-4",
            name: "Seafood",
            description: "",
            items: [
              {
                id: "item-7",
                name: "Grilled Salmon",
                price: "18.99",
                description:
                  "Fresh salmon fillet grilled to perfection and served with rice pilaf and mixed vegetables",
                image: "https://example.com/grilled-salmon.jpg",
                tags: [],
              },
              {
                id: "item-8",
                name: "Lobster Tail",
                price: "34.99",
                description:
                  "6oz cold water lobster tail served with drawn butter and lemon",
                image: "https://example.com/lobster-tail.jpg",
                tags: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

export function defaultStarterMenu(restaurantId: string): Menus {
  const newObjectId = () => {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const objectId =
      timestamp +
      "xxxxxxxxxxxxxxxx"
        .replace(/[x]/g, () => {
          return Math.floor(Math.random() * 16).toString(16);
        })
        .toLowerCase();

    return objectId;
  };

  const defaultStarterMenuObj: Menus = {
    id: newObjectId(),
    name: "Menu Name",
    restaurantId: restaurantId,
    footer: "",
    tags: ["Vegan", "Dairy Free", "Gluten Free", "Nut Free"],
    mainCategories: [
      {
        id: uuidv4(),
        name: "Food",
        description: "",
        subCategories: [
          {
            id: uuidv4(),
            name: "Appetizers",
            description: "",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: "",
                description: "",
                image: "fd347148-f0ae-4fe1-bcd0-81eacaf60bdb-jedoig.png",
                tags: ["Gluten Free", "Vegan"],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Pasta",
            description: "",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: "",
                description: "",
                image: "fd347148-f0ae-4fe1-bcd0-81eacaf60bdb-jedoig.png",
                tags: [],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Dessert",
        description: "",
        subCategories: [
          {
            id: uuidv4(),
            name: "Cake",
            description: "",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: "",
                description: "",
                image: "fd347148-f0ae-4fe1-bcd0-81eacaf60bdb-jedoig.png",
                tags: [],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Ice Cream",
            description: "",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: "",
                description: "",
                image: "fd347148-f0ae-4fe1-bcd0-81eacaf60bdb-jedoig.png",
                tags: [],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Drinks",
        description: "",
        subCategories: [
          {
            id: uuidv4(),
            name: "Pop",
            description: "",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: "",
                description: "",
                image: "fd347148-f0ae-4fe1-bcd0-81eacaf60bdb-jedoig.png",
                tags: [],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Juices",
            description: "",
            items: [
              {
                id: uuidv4(),
                name: "",
                price: "",
                description: "",
                image: "fd347148-f0ae-4fe1-bcd0-81eacaf60bdb-jedoig.png",
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
