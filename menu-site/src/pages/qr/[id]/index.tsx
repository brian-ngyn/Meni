import { useRouter } from "next/router";
import { useEffect } from "react";

import EditContainer from "~/components/Menu/EditContainer";

export default function RestaurantPage() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      // Send QR requests to /restaurant right now
      router.push(`/restaurant/${router.query.id}/`);
    }
  }, [router.isReady]);
  return false;
}
