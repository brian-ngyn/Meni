import { useRouter } from "next/router";

import { api } from "~/utils/api";

export default function RestaurantPage() {
  const router = useRouter();
  const { restaurantId } = router.query;
  const { data: menus, isLoading } = api.restaurant.getRestaurantMenus.useQuery(
    restaurantId as string,
    {
      enabled: true,
    },
  );
  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      {restaurantId}: {JSON.stringify(menus)}
    </>
  );
}
