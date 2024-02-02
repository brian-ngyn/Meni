import { useRouter } from "next/router";

import { MenuPage } from "~/components/menu/MenuPage";

export default function RestaurantPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <MenuPage restaurantId={id as string} tableMode={false} />
    </>
  );
}
