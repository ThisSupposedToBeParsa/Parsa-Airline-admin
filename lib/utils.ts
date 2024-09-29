import { type ClassValue, clsx } from "clsx";
// import { randomBytes, scryptSync } from "";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function hashPass(password: string) {
//   const salt = randomBytes(16).toString("hex");
//   const hashedPass = scryptSync(password, salt, 64).toString("hex");

//   return `${salt}:${hashedPass}`;
// }
