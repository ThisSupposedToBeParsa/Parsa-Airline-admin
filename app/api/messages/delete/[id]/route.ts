import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { deleteMessage, getMessage } from "@/lib/actions/getData";
import { DataType } from "@/types/types";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const data: DataType = (await getMessage(parseInt(params.id)).then(
    (res) => res
  )) as DataType;

  const reqHeaders = headers();
  const apiKey = reqHeaders.get("X-Api-Key");

  if (apiKey) {
    if (apiKey === process.env.API_KEY) {
      if (!data) return;
      await deleteMessage(data.id);
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "wrong api key" });
    }
  } else {
    return NextResponse.json({ error: "no api key recived." });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const data: DataType = (await getMessage(parseInt(params.id)).then(
    (res) => res
  )) as DataType;

  const reqHeaders = headers();
  const apiKey = reqHeaders.get("X-Api-Key");

  if (apiKey) {
    if (apiKey === process.env.API_KEY) {
      if (!data) return;
      await deleteMessage(data.id);
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "wrong api key" });
    }
  } else {
    return NextResponse.json({ error: "no api key recived." });
  }
};
