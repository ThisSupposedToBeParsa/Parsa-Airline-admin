import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAbleToSees } from "@/lib/actions/getData";

export const GET = async (req: NextRequest) => {
  const data = await getAbleToSees();

  const reqHeaders = headers();
  const apiKey = reqHeaders.get("X-Api-Key");

  if (apiKey) {
    if (apiKey === process.env.API_KEY) {
      if (!data) return;
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "wrong api key" });
    }
  } else {
    return NextResponse.json({ error: "no api key recived." });
  }
};
