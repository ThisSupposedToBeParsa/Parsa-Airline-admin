import { Metadata } from "next";
import ThemeProvider from "@/components/main/ThemeProvider";
import { Advent_Pro } from "next/font/google";
import CookieWrapper from "@/components/main/CookieWrapper";
import "../(root)/globals.css";

const ap = Advent_Pro({ subsets: ["latin"], weight: "700" });

export const metadata: Metadata = {
  title: "Parsa Airline Admin | Login",
  description: "Admin website of Parsa Airline",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={ap.className}>
        <CookieWrapper>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="w-[100%] h-full min-h-[100vh] min-w-[100vh] flex justify-center items-center bg-zinc-950">
              {children}
            </div>
          </ThemeProvider>
        </CookieWrapper>
      </body>
    </html>
  );
};

export default AuthLayout;
