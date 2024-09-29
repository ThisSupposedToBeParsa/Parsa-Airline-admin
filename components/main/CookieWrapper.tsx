"use client";

import { CookiesProvider } from "react-cookie";

const CookieWrapper = ({ children }: { children: React.ReactNode }) => {
  return <CookiesProvider>{children}</CookiesProvider>;
};

export default CookieWrapper;
