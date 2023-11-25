import { useRouter } from "next/router";
import { useEffect } from "react";

export default function QRPage() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      // Send QR requests to /restaurant right now
      void router.push(`/restaurant/${router.query.id as string}/`);
    }
  }, [router, router.isReady]);
  return <></>;
}
