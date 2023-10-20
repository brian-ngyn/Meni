import { useRouter } from "next/router";
import { useEffect } from "react";

import EditContainer from "~/components/Menu/EditContainer";

export default function EditMenu() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <EditContainer restaurantId={id as string} tableMode={false} />
    </>
  );
}
