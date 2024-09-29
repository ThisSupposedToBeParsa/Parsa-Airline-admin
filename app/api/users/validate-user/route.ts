import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getUser, modifyUser } from "@/lib/actions/getData";

export const GET = async (req: NextRequest) => {
  const reqHeaders = headers();
  const apiKey = reqHeaders.get("X-Auth-Api-Key");
  const authorized =
    reqHeaders.get("X-User-Authorized") === "true" ? true : false;
  const email = reqHeaders.get("X-User-Email");
  const csrf = reqHeaders.get("X-User-CSRF-Token");
  const session = reqHeaders.get("X-User-Session");

  if (apiKey) {
    if (apiKey === process.env.AUTH_API_KEY) {
      if (!authorized) {
        const data = await getUser(email!);
        if (data?.csrfToken !== csrf)
          return NextResponse.json({ error: "wrong csrf" });
        if (data?.sessionId !== session)
          return NextResponse.json({ error: "wrong session id" });

        await modifyUser(data.id, { authorized: true });
        return NextResponse.json({ success: "authorized" });
      }
      return NextResponse.json({ error: "user already authorized" });
    } else {
      return NextResponse.json({ error: "wrong api key" });
    }
  } else {
    return NextResponse.json({ error: "no api key recived." });
  }
};
