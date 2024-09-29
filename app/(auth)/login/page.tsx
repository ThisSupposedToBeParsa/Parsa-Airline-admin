"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser, validatePassword } from "@/lib/actions/getData";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";

const Login = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [eyeHovered, setEyeHovered] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const user = await getUser(email);
    const isValid = await validatePassword(
      email,
      password,
      user?.csrfToken as string,
      user?.sessionId as string
    );

    if (isValid?.status === false) {
      setFormError("Invalid Data!");
      return;
    }

    if (isValid?.status) {
      const username = isValid?.username;
      const authorized = false;

      setCookies(
        "user",
        { email, username, authorized },
        {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        }
      );
      router.push("/");
    }
  };

  return (
    <div className="w-[1000px] h-[700px] flex flex-col justify-start items-center px-3 py-3 relative bg-slate-900 rounded-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-3 w-full h-full"
      >
        <h1 className="text-sky-400 text-[36px] py-10 font-bold">Login</h1>
        <div>
          <Label
            htmlFor="emailLogin"
            className="w-full text-[28px] text-slate-500 pl-5 transition-all duration-300 hover:text-sky-400 cursor-pointer"
          >
            Email:
          </Label>
          <Input
            value={email}
            type="email"
            id="emailLogin"
            name="emailLogin"
            onChange={(e) => setEmail(e.target.value)}
            className="w-[500px] text-[24px] bg-transparent border border-slate-500 text-white focus-visible:border-sky-400 transition-all duration-300 focus-visible:shadow-md focus-visible:shadow-sky-400"
          />
        </div>
        <div>
          <div className="flex flex-row justify-between items-center w-full">
            <Label
              htmlFor="passwordLogin"
              className="w-full text-[28px] text-slate-500 pl-5 transition-all duration-300 hover:text-sky-400 cursor-pointer"
            >
              Password:
            </Label>
            <Eye
              className={`translate-y-[42px] mr-3 cursor-pointer transition-all duration-300 text-sky-400 ${
                eyeHovered ? "opacity-[1]" : "opacity-0"
              }`}
              onMouseEnter={() => setEyeHovered(true)}
              onMouseLeave={() => setEyeHovered(false)}
              color={`${eyeHovered ? "#38bdf8" : "currentColor"}`}
              onClick={() => setPasswordShown(!passwordShown)}
            />
          </div>
          <Input
            value={password}
            type={`${passwordShown ? "text" : "password"}`}
            id="passwordLogin"
            name="passwordLogin"
            onChange={(e) => setPassword(e.target.value)}
            className="w-[500px] text-[24px] bg-transparent border border-slate-500 text-white focus-visible:border-sky-400 transition-all duration-300 focus-visible:shadow-md focus-visible:shadow-sky-400"
            onMouseEnter={() => setEyeHovered(true)}
            onMouseLeave={() => setEyeHovered(false)}
          />
        </div>
        <Button
          variant="outlineSuccess"
          type="submit"
          className="text-white text-[24px] mt-5"
        >
          Login
        </Button>
        {formError !== "" && (
          <p className="pt-3 text-[24px] text-red-500 underline">{formError}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
