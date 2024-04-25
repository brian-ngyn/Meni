import { useRouter } from "next/router";

import { MenuPage } from "~/components/menu/MenuPage";

export default function TablePage() {
  const router = useRouter();
  const { restaurantId, menuId } = router.query;

  return (
    <>
      <MenuPage
        restaurantId={restaurantId as string}
        menuId={menuId as string}
        tableMode={true}
      />
    </>
  );
}
