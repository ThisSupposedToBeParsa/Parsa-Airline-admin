"use client";

import { navItems } from "@/utils/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Navbar = () => {
  const current = usePathname();
  const [cookies, setCookies, deleteCookies] = useCookies(["user"]);
  const router = useRouter();

  if (!cookies.user) router.push("/login");

  const userData = cookies?.user;

  const handleLogout = () => {
    deleteCookies("user");
  };

  return (
    <div className="left-0 top-0 flex-1 w-[20%] flex flex-col justify-between items-start h-[100vh] py-5 px-3 border-r-2 border-r-sky-500 shadow-md fixed shadow-sky-500">
      <div className="flex flex-col justify-start items-start h-full">
        {navItems.map((i, index) => (
          <Link
            href={i.to}
            key={index}
            className={`w-fit text-left py-7 text-[26px] transition-all duration-300 ${
              current === i.to
                ? "text-sky-400  hover:pl-1  hover:text-sky-400 underline"
                : "text-slate-500 hover:text-sky-400 hover:pl-2"
            }`}
          >
            {i.name}
          </Link>
        ))}
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col gap-1">
          <p
            onClick={() => router.push("/account")}
            className="text-[16px] text-slate-500 transition-all duration-300 hover:text-sky-400 cursor-pointer"
          >
            @{userData?.username}
          </p>
          <p className="text-[12px] text-slate-700 transition-all duration-300 hover:text-sky-400 cursor-pointer">
            {userData.email}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="outline">Logout</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out and redirect to login page. If you are
                sure to logout from your account click Continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleLogout;
                  router.push("login");
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Navbar;
