import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { type Menus } from "@prisma/client";

import { defaultStarterMenu } from "~/constants/types";

import MeniNotification from "~/components/items/MeniNotification";

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
  addTag: (value: string[]) => void;
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
      setEditableMenuState({ ...editableMenuState, editingId: id });
    }
  };

  const setMenuLoading = (val: boolean) => {
    setEditableMenuState({ ...editableMenuState, loading: val });
  };

  // LOAD FUNCTIONS
  const loadFromAPI = (loadMenu: Menus) => {
    setEditableMenuState({
      ...editableMenuState,
      menu: loadMenu,
      originalMenu: loadMenu,
      mode: EditMode.EDIT,
      loading: false,
    });
    MeniNotification("Menu loaded", "", "success");
  };

  const loadNewTemplate = (restaurantId: string) => {
    setEditableMenuState({
      ...editableMenuState,
      menu: defaultStarterMenu(restaurantId),
      originalMenu: defaultStarterMenu(restaurantId),
      mode: EditMode.CREATE,
      loading: false,
    });
  };

  // ADD FUNCTIONS
  const addCategory = () => {
    setEditableMenuState({
      ...editableMenuState,
      menu: {
        ...editableMenuState.menu,
        mainCategories: [
          ...editableMenuState.menu.mainCategories,
          {
            id: uuidv4(),
            name: "New Category",
            subCategories: [],
          },
        ],
      },
    });
  };
  const addSubCategory = (id: string) => {
    setEditableMenuState({
      ...editableMenuState,
      menu: {
        ...editableMenuState.menu,
        mainCategories: [
          ...editableMenuState.menu.mainCategories.map((item) => {
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
    });
  };

  const addFoodItem = (subCategoryId: string) => {
    setEditableMenuState({
      ...editableMenuState,
      menu: {
        ...editableMenuState.menu,
        mainCategories: [
          ...editableMenuState.menu.mainCategories.map((item) => {
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
                      name: "Food Item",
                      price: "0",
                      description: "description",
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
    });
  };

  // Delete functions

  const deleteCategory = (id: string) => {
    setEditableMenuState({
      ...editableMenuState,
      menu: {
        ...editableMenuState.menu,
        mainCategories: [
          ...editableMenuState.menu.mainCategories.filter(
            (item) => item.id !== id,
          ),
        ],
      },
    });
  };

  const deleteSubCategory = (id: string) => {
    setEditableMenuState({
      ...editableMenuState,
      menu: {
        ...editableMenuState.menu,
        mainCategories: [
          ...editableMenuState.menu.mainCategories.map((item) => {
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
    });
  };
  const deleteFoodItem = (id: string) => {
    setEditableMenuState({
      ...editableMenuState,
      menu: {
        ...editableMenuState.menu,
        mainCategories: [
          ...editableMenuState.menu.mainCategories.map((item) => {
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
    });
  };

  useEffect(() => {
    if (editableMenuState.menu.id) {
      setMenuLoading(false);
    }
  }, [editableMenuState.mode]);

  // useEffect(() => {
  //   console.log(editableMenuState.menu);
  // }, [editableMenuState.menu]);

  const addTag = (values: string[]) => {
    const newTags = editableMenuState.menu.tags;
    newTags.push(...values);
    const uniqueTags = [...new Set(newTags)];
    setEditableMenuState({
      ...editableMenuState,
      menu: { ...editableMenuState.menu, tags: uniqueTags },
    });
  };
  const updateField = (
    id: string,
    newValue: string | number | string[],
    field: string | undefined,
  ) => {
    setEditableMenuState({
      ...editableMenuState,
      menu: {
        ...editableMenuState.menu,
        mainCategories: [
          ...editableMenuState.menu.mainCategories.map((item) => {
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
                }
                return {
                  id: menuItem.id,
                  name: menuItem.name,
                  price: menuItem.price,
                  description: menuItem.description,
                  image: menuItem.image,
                  tags: menuItem.tags,
                };
              });
              if (subItem.id === id) {
                return {
                  id: subItem.id,
                  name: newValue as string,
                  items: menuItems,
                };
              }
              return {
                id: subItem.id,
                name: subItem.name,
                items: menuItems,
              };
            });
            if (item.id === id) {
              return {
                id: item.id,
                name: newValue as string,
                subCategories: subCategories,
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
    });
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
        addTag,
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
