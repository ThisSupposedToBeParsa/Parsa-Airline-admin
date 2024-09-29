import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/utils/db";

export const GET = async (req: NextRequest) => {
  const reqHeaders = headers();
  const apiKey = reqHeaders.get("X-Api-Key");
  const message = reqHeaders.get("Data-Message");
  const displayName = reqHeaders.get("Data-DisplayName");
  const email = reqHeaders.get("Data-Email");
  const name = reqHeaders.get("Data-Name");

  if (apiKey) {
    if (apiKey === process.env.API_KEY) {
      if (!message || !displayName || !email || !name) return;
      await prisma.message.create({
        data: {
          displayName: displayName!,
          email: email!,
          message: message!,
          name: name!,
        },
      });
      //   return NextResponse.json({
      //     displayName: displayName,
      //     email: email,
      //     message: message,
      //     name: name,
      //   });
    } else {
      return NextResponse.json({ error: "wrong api key" });
    }
  } else {
    return NextResponse.json({ error: "no api key recived." });
  }
};
