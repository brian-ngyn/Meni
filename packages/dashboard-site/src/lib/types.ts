import { type Menus } from "@prisma/client";

export interface IMenuBrief {
  id: string;
  name: string;
}

export type APIProps = {
  apiName: "string";
};

export type CDNQueryProps = {
  src: string;
  width?: number;
  quality?: number;
};

export type EditableFieldTypes =
  | "categoryName"
  | "categoryDescription"
  | "subcategoryName"
  | "subcategoryDescription"
  | "foodName"
  | "foodDescription"
  | "foodTags"
  | "foodPrice"
  | "foodImage"
  | "menuFooter";

export enum EditMode {
  CREATE = "Create",
  EDIT = "Edit",
}
export interface IEditableMenu {
  loading: boolean;
  mode: EditMode | null;
  modified: boolean;
  editingId: string;
  menu: Menus;
  originalMenu: Menus;
}
