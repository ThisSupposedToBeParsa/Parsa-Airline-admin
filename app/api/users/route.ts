import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getUsers } from "@/lib/actions/getData";

export const GET = async (req: NextRequest) => {
  const data = await getUsers();

  const reqHeaders = headers();
  const apiKey = reqHeaders.get("X-Auth-Api-Key");

  if (apiKey) {
    if (apiKey === process.env.AUTH_API_KEY) {
      if (!data) return;
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "wrong api key" });
    }
  } else {
    return NextResponse.json({ error: "no api key recived." });
  }
};
