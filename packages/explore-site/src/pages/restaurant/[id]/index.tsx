import { useRouter } from "next/router";

import EditContainer from "~/components/Menu/EditContainer";

export default function RestaurantPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <EditContainer restaurantId={id as string} tableMode={false} />
    </>
  );
}
