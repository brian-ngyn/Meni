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
