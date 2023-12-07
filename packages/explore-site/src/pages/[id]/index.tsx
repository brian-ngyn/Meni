import { useRouter } from "next/router";

import { MenuPage } from "~/components/menu/MenuPage";

export default function TablePage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <MenuPage restaurantId={id as string} tableMode={true} />
    </>
  );
}
