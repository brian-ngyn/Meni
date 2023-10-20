import { CircularProgress } from "@mui/material";

import { useMeniContext } from "~/context/meniContext";

export default function Loader() {
  const { interactibilityLoader } = useMeniContext();
  return (
    <>
      {interactibilityLoader && (
        <div className="no-scroll fixed z-50 flex h-screen w-full items-center justify-center bg-black opacity-75 ">
          <CircularProgress />
        </div>
      )}
    </>
  );
}
