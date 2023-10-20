import MeniGlobals from "~/MeniGlobals";

type CDNQueryProps = {
  src: string;
  width?: number;
  quality?: number;
};

export const CDNLoader = ({ src, width, quality }: CDNQueryProps) => {
  // return `https://cdn.meniapp.ca/${src}?w=${width}&q=${quality}` --- this width and quality need to be implmeneted eventually
  return MeniGlobals().cdnRoot + src;
};
