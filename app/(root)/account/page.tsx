"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser, modifyUser } from "@/lib/actions/getData";
// import { hashPass } from "@/lib/utils";
import { UserType } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Account = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const router = useRouter();

  if (!cookies.user) router.push("/login");

  const [user, setUser] = useState<UserType>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [passRepeat, setPassRepeat] = useState("");

  useEffect(() => {
    const setData = async () => {
      const data = await getUser(cookies.user?.email);
      setUser(data!);
      setUsername(data?.username!);
      setEmail(data?.email!);
      setName(data?.fullName!);
    };

    setData();
  }, []);

  const handleSubmit = async () => {
    // const hashedPass = hashPass(pass);
    if (pass === passRepeat) {
      await modifyUser(user?.id!, {
        email: email,
        fullName: name,
        username: username,
        password: pass,
      });

      router.push("/");
    }
  };

  return (
    <div className="w-full h-full px-4 py-8 flex flex-col items-start justify-between gap-8">
      <h1 className="text-[28px] text-slate-300 transition-all duration-300 mb-10">
        Modify Account : <span className="text-sky-400">{user?.fullName}</span>
      </h1>
      <form
        onSubmit={handleSubmit}
        method="post"
        action="/"
        className="w-full h-full flex flex-col justify-between gap-8"
      >
        <div className="w-[50%]">
          <Label
            className="pl-4 text-left text-[20px] text-slate-500 transition-all duration-300 hover:text-sky-400 cursor-pointer"
            htmlFor="username"
          >
            Username:
          </Label>
          <div className="w-full flex flex-row justify-start items-center p-0 m-0">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={user?.id !== undefined ? false : true}
              placeholder="Username"
              type="text"
              name="username"
              id="username"
              spellCheck={false}
              className="px-2 py-4 border-slate-500 text-slate-200 text-[20px] transition-all duration-300 focus-visible:border-sky-400"
            />
          </div>
        </div>
        <div className="w-[40%]">
          <Label
            className="pl-4 text-left text-[20px] text-slate-500 transition-all duration-300 hover:text-sky-400 cursor-pointer"
            htmlFor="name"
          >
            Full Name:
          </Label>
          <div className="w-full flex flex-row justify-start items-center p-0 m-0">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={user?.id !== undefined ? false : true}
              placeholder="Name"
              type="text"
              name="name"
              id="name"
              spellCheck={false}
              className="px-2 py-4 border-slate-500 text-slate-200 text-[20px] transition-all duration-300 focus-visible:border-sky-400"
            />
          </div>
        </div>
        <div className="w-[80%]">
          <Label
            className="pl-4 text-left text-[20px] text-slate-500 transition-all duration-300 hover:text-sky-400 cursor-pointer"
            htmlFor="email"
          >
            Email:
          </Label>
          <div className="w-full flex flex-row justify-start items-center p-0 m-0">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={user?.id !== undefined ? false : true}
              placeholder="Email"
              type="email"
              name="email"
              id="email"
              spellCheck={false}
              className="px-2 py-4 border-slate-500 text-slate-200 text-[20px] transition-all duration-300 focus-visible:border-sky-400"
            />
          </div>
        </div>
        <div className="w-[85%] flex flex-col items-start justify-start gap-2">
          <div className="flex flex-row items-center justify-start gap-3 w-full">
            <Label
              className="pl-4 text-left text-[20px] text-slate-500 transition-all duration-300 hover:text-sky-400 cursor-pointer"
              htmlFor="password"
            >
              Change Password:
            </Label>
            <div className="w-full flex flex-row justify-start items-center p-0 m-0 gap-3">
              <Input
                onChange={(e) => setPass(e.target.value)}
                disabled={user?.id !== undefined ? false : true}
                placeholder="New Password"
                type="password"
                name="password"
                id="password"
                spellCheck={false}
                className="px-2 py-4 border-slate-500 text-slate-200 text-[20px] transition-all duration-300 focus-visible:border-sky-400"
              />
              <Input
                onChange={(e) => setPassRepeat(e.target.value)}
                disabled={user?.id !== undefined ? false : true}
                placeholder="Repeat Password"
                type="password"
                name="passwordR"
                id="passwordR"
                spellCheck={false}
                className="px-2 py-4 border-slate-500 text-slate-200 text-[20px] transition-all duration-300 focus-visible:border-sky-400"
              />
            </div>
          </div>
          <p className="text-red-500 font-bold text-sm">
            {pass === passRepeat
              ? ""
              : "Password doesn't match with password repeat."}
          </p>
        </div>
        <div className="w-full h-fit px-4 py-3 flex justify-end items-center flex-row gap-3">
          <Button
            type="button"
            className="hover:bg-red-500 text-lg hover:border-red-500"
            variant="outline"
            disabled={user?.id !== undefined ? false : true}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={pass !== passRepeat || pass == "" ? true : false}
            className="hover:bg-green-500 text-lg hover:border-green-500 disabled:hover:bg-slate-500 disabled:hover:border-slate-500 disabled:cursor-not-allowed"
            variant="outline"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Account;
