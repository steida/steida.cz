import * as Fathom from "fathom-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useFathom = () => {
  const router = useRouter();

  // https://vercel.com/guides/deploying-nextjs-using-fathom-analytics-with-vercel
  useEffect(() => {
    Fathom.load("ETYBSICL", {
      includedDomains: ["steida.cz", "www.steida.cz"],
    });

    const onRouteChangeComplete = () => {
      Fathom.trackPageview();
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
