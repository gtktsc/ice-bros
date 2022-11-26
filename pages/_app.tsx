import type { AppProps } from "next/app";
import React from "react";

function SafeHydrate({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SafeHydrate>
      <Component {...pageProps} />
    </SafeHydrate>
  );
}

export default MyApp;
