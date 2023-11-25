import MeniGlobals from "~/MeniGlobals";

type APIProps = {
  apiName: "string";
};

export const APILoader = ({ apiName }: APIProps) => {
  return MeniGlobals().apiRoot + apiName;
};
