import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { type Menus } from "@prisma/client";

import { defaultStarterMenu } from "~/lib/data";
import { type EditableFieldTypes } from "~/lib/types";
import { EditMode, type IEditableMenu } from "~/lib/types";

import MeniNotification from "~/components/meniComponents/MeniNotification";

interface Props {
  children: ReactNode | ReactNode[];
}
interface IEditableMenuReturn {
  editableMenuState: IEditableMenu;
  setEditableMenuState: (state: IEditableMenu) => void;
  setCurrentEditId: (id: string) => void;
  setMenuLoading: (val: boolean) => void;
  loadNewTemplate: (restaurantId: string) => void;
  updateField: (
    id: string,
    newValue: string | number | string[],
    field: EditableFieldTypes,
  ) => void;
  loadFromAPI: (loadMenu: Menus) => void;
  addCategory: () => void;
  addSubCategory: (id: string) => void;
  addFoodItem: (id: string) => void;
  deleteCategory: (id: string) => void;
  deleteSubCategory: (id: string) => void;
  deleteFoodItem: (id: string) => void;
}

const editableMenuContext = createContext<IEditableMenuReturn>(
  {} as IEditableMenuReturn,
);

export function EditableMenuContextProvider({ children }: Props) {
  const [editableMenuState, setEditableMenuState] = useState<IEditableMenu>({
    loading: true,
    mode: null,
    editingId: "",
    modified: false,
    menu: {} as Menus,
    originalMenu: {} as Menus,
  });

  const setCurrentEditId = (id: string) => {
    if (editableMenuState.editingId !== id) {
      setEditableMenuState((prev) => ({ ...prev, editingId: id }));
    }
  };

  const setMenuLoading = (val: boolean) => {
    setEditableMenuState((prev) => ({ ...prev, loading: val }));
  };

  // LOAD FUNCTIONS
  const loadFromAPI = (loadMenu: Menus) => {
    setEditableMenuState((prev) => ({
      ...prev,
      menu: loadMenu,
      originalMenu: loadMenu,
      mode: EditMode.EDIT,
      loading: false,
    }));
    MeniNotification("Menu loaded", "", "success");
  };

  const loadNewTemplate = (restaurantId: string) => {
    setEditableMenuState((prev) => ({
      ...prev,
      menu: defaultStarterMenu(restaurantId),
      originalMenu: defaultStarterMenu(restaurantId),
      mode: EditMode.CREATE,
      loading: false,
    }));
  };

  // ADD FUNCTIONS
  const addCategory = () => {
    setEditableMenuState((prev) => ({
      ...prev,
      menu: {
        ...prev.menu,
        mainCategories: [
          ...prev.menu.mainCategories,
          {
            id: uuidv4(),
            name: "New Category",
            description: "",
            subCategories: [],
          },
        ],
      },
    }));
  };
  const addSubCategory = (id: string) => {
    setEditableMenuState((prev) => ({
      ...prev,
      menu: {
        ...prev.menu,
        mainCategories: [
          ...prev.menu.mainCategories.map((item) => {
            if (item.id === id) {
              return {
                id: item.id,
                name: item.name,
                description: item.description,
                subCategories: [
                  ...item.subCategories,
                  {
                    id: uuidv4(),
                    name: "New Sub Category",
                    description: "",
                    items: [],
                  },
                ],
              };
            } else {
              return item;
            }
          }),
        ],
      },
    }));
  };

  const addFoodItem = (subCategoryId: string) => {
    setEditableMenuState((prev) => ({
      ...prev,
      menu: {
        ...prev.menu,
        mainCategories: [
          ...prev.menu.mainCategories.map((item) => {
            const subCategories = item.subCategories.map((subItem) => {
              const menuItems = subItem.items.map((menuItem) => {
                return {
                  id: menuItem.id,
                  name: menuItem.name,
                  price: menuItem.price,
                  description: menuItem.description,
                  image: menuItem.image,
                  tags: menuItem.tags,
                };
              });
              if (subItem.id === subCategoryId) {
                return {
                  id: subItem.id,
                  name: subItem.name,
                  description: subItem.description,
                  items: [
                    ...menuItems,
                    {
                      id: uuidv4(),
                      name: "",
                      price: "",
                      description: "",
                      image: "fd347148-f0ae-4fe1-bcd0-81eacaf60bdb-jedoig.png",
                      tags: [],
                    },
                  ],
                };
              }
              return {
                id: subItem.id,
                name: subItem.name,
                description: subItem.description,
                items: menuItems,
              };
            });
            return {
              id: item.id,
              name: item.name,
              description: item.description,
              subCategories: subCategories,
            };
          }),
        ],
      },
    }));
  };

  // Delete functions

  const deleteCategory = (id: string) => {
    setEditableMenuState((prev) => ({
      ...prev,
      menu: {
        ...prev.menu,
        mainCategories: [
          ...prev.menu.mainCategories.filter((item) => item.id !== id),
        ],
      },
    }));
  };

  const deleteSubCategory = (id: string) => {
    setEditableMenuState((prev) => ({
      ...prev,
      menu: {
        ...prev.menu,
        mainCategories: [
          ...prev.menu.mainCategories.map((item) => {
            const subCategories = item.subCategories.filter(
              (subItem) => subItem.id !== id,
            );
            return {
              id: item.id,
              name: item.name,
              description: item.description,
              subCategories: subCategories,
            };
          }),
        ],
      },
    }));
  };
  const deleteFoodItem = (id: string) => {
    setEditableMenuState((prev) => ({
      ...prev,
      menu: {
        ...prev.menu,
        mainCategories: [
          ...prev.menu.mainCategories.map((item) => {
            const subCategories = item.subCategories.map((subItem) => {
              const menuItems = subItem.items.filter(
                (menuItem) => menuItem.id !== id,
              );
              return {
                id: subItem.id,
                name: subItem.name,
                description: subItem.description,
                items: menuItems,
              };
            });
            return {
              id: item.id,
              name: item.name,
              description: item.description,
              subCategories: subCategories,
            };
          }),
        ],
      },
    }));
  };

  useEffect(() => {
    if (editableMenuState.menu.id) {
      setMenuLoading(false);
    }
  }, [editableMenuState.mode]);

  const updateField = (
    id: string,
    newValue: string | number | string[],
    field: EditableFieldTypes,
  ) => {
    let combinedTags = editableMenuState.menu.tags;
    if (field === "foodTags" && Array.isArray(newValue)) {
      const currentTags = editableMenuState.menu.tags;
      const newTagsToInsert = newValue.filter(
        (item) => !currentTags.includes(item),
      );
      combinedTags = [...currentTags, ...newTagsToInsert];
    }

    switch (field) {
      case "categoryName":
      case "categoryDescription":
        setEditableMenuState((prev) => {
          return {
            ...prev,
            tags: combinedTags,
            menu: {
              ...prev.menu,
              mainCategories: [
                ...prev.menu.mainCategories.map((item) => {
                  if (item.id === id) {
                    return {
                      id: item.id,
                      name: item.name,
                      description: item.description,
                      subCategories: item.subCategories,
                      [field.replace(/^[a-z]+/, "").toLowerCase()]: newValue,
                    };
                  }
                  return item;
                }),
              ],
            },
          };
        });
        break;
      case "subcategoryName":
      case "subcategoryDescription":
        setEditableMenuState((prev) => {
          return {
            ...prev,
            tags: combinedTags,
            menu: {
              ...prev.menu,
              mainCategories: [
                ...prev.menu.mainCategories.map((item) => {
                  const subCategories = item.subCategories.map((subItem) => {
                    if (subItem.id === id) {
                      return {
                        id: subItem.id,
                        name: subItem.name,
                        description: subItem.description,
                        items: subItem.items,
                        [field.replace(/^[a-z]+/, "").toLowerCase()]: newValue,
                      };
                    }
                    return subItem;
                  });
                  return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    subCategories: subCategories,
                  };
                }),
              ],
            },
          };
        });
        break;
      case "foodName":
      case "foodDescription":
      case "foodPrice":
      case "foodTags":
      case "foodImage":
        setEditableMenuState((prev) => {
          return {
            ...prev,
            menu: {
              ...prev.menu,
              tags: combinedTags,
              mainCategories: [
                ...prev.menu.mainCategories.map((item) => {
                  const subCategories = item.subCategories.map((subItem) => {
                    const menuItems = subItem.items.map((menuItem) => {
                      if (menuItem.id === id) {
                        return {
                          id: menuItem.id,
                          name: menuItem.name,
                          price: menuItem.price,
                          description: menuItem.description,
                          image: menuItem.image,
                          tags: menuItem.tags,
                          [field.replace(/^[a-z]+/, "").toLowerCase()]:
                            newValue,
                        };
                      }
                      return menuItem;
                    });
                    return {
                      id: subItem.id,
                      name: subItem.name,
                      description: subItem.description,
                      items: menuItems,
                    };
                  });
                  return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    subCategories: subCategories,
                  };
                }),
              ],
            },
          };
        });
        break;
      case "menuFooter":
        setEditableMenuState((prev) => {
          return {
            ...prev,
            menu: {
              ...prev.menu,
              tags: combinedTags,
              footer: newValue as string,
            },
          };
        });
        break;
    }
  };

  return (
    <editableMenuContext.Provider
      value={{
        editableMenuState,
        setEditableMenuState,
        setMenuLoading,
        setCurrentEditId,
        updateField,
        loadNewTemplate,
        loadFromAPI,
        addCategory,
        addSubCategory,
        addFoodItem,
        deleteCategory,
        deleteSubCategory,
        deleteFoodItem,
      }}
    >
      {children}
    </editableMenuContext.Provider>
  );
}

export function useEditableMenu(): IEditableMenuReturn {
  return useContext(editableMenuContext);
}
