"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";

export function GoogleMeta() {
  const [consent, setConsent] = useState<boolean>(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookie-consent");
    setConsent(!!storedConsent);

    if (storedConsent) {
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    }
  }, []);

  if (!consent) return null;

  return (
    <>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      <meta
        name="google-site-verification"
        content="oSV9NtTWaNbiQLGBEQoyeABgw0rLEsPLWryHpK-SqCI"
      />
      <meta name="google-adsense-account" content="ca-pub-8854904636978298" />
    </>
  );
}
