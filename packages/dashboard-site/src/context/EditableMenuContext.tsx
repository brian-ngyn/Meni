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

import MeniNotification from "~/components/meniComponents/MeniNotification";

interface Props {
  children: ReactNode | ReactNode[];
}

export enum EditMode {
  CREATE = "Create",
  EDIT = "Edit",
}

interface IEditableMenu {
  loading: boolean;
  mode: EditMode | null;
  modified: boolean;
  editingId: string;
  menu: Menus;
  originalMenu: Menus;
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
    field: string | undefined,
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
              return {
                id: subItem.id,
                name: subItem.name,
                items: menuItems,
              };
            });
            if (item.id === id) {
              return {
                id: item.id,
                name: item.name,
                subCategories: [
                  ...subCategories,
                  {
                    id: uuidv4(),
                    name: "New Subcategory",
                    items: [],
                  },
                ],
              };
            }
            return {
              id: item.id,
              name: item.name,
              subCategories: subCategories,
            };
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
                items: menuItems,
              };
            });
            return {
              id: item.id,
              name: item.name,
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
                items: menuItems,
              };
            });
            return {
              id: item.id,
              name: item.name,
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
    field: string | undefined,
  ) => {
    let combinedTags = editableMenuState.menu.tags;
    if (field === "tags" && Array.isArray(newValue)) {
      const currentTags = editableMenuState.menu.tags;
      const newTagsToInsert = newValue.filter(
        (item) => !currentTags.includes(item),
      );
      combinedTags = [...currentTags, ...newTagsToInsert];
    }
    setEditableMenuState((prev) => ({
      ...prev,
      menu: {
        ...prev.menu,
        tags: combinedTags,
        mainCategories: [
          ...prev.menu.mainCategories.map((item) => {
            const subCategories = item.subCategories.map((subItem) => {
              const menuItems = subItem.items.map((menuItem) => {
                if (menuItem.id === id && field) {
                  return {
                    id: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    description: menuItem.description,
                    image: menuItem.image,
                    tags: menuItem.tags,
                    [field]: newValue,
                  };
                } else {
                  return menuItem;
                }
              });
              if (subItem.id === id) {
                return {
                  id: subItem.id,
                  name: newValue as string,
                  items: menuItems,
                };
              } else {
                return {
                  id: subItem.id,
                  name: subItem.name,
                  items: menuItems,
                };
              }
            });
            if (item.id === id) {
              return {
                id: item.id,
                name: newValue as string,
                subCategories: subCategories,
              };
            } else {
              return {
                id: item.id,
                name: item.name,
                subCategories: subCategories,
              };
            }
          }),
        ],
      },
    }));
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
