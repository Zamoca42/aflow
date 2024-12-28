"use client";

import { useState, useEffect } from "react";
import { Button } from "@/component/ui/button";
import Link from "next/link";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
      window.gtag?.("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
    });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-t">
      <div className="container flex items-center gap-4 py-4">
        <p className="text-sm text-muted-foreground">
          We use cookies to enhance your experience. By continuing to visit this
          site you agree to our use of cookies.{" "}
          <Link
            href="/docs/privacy-policy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Privacy Policy
          </Link>
        </p>
        <Button
          onClick={acceptCookies}
          variant="outline"
          size="sm"
          className="ml-auto whitespace-nowrap"
        >
          Accept All
        </Button>
      </div>
    </div>
  );
}
