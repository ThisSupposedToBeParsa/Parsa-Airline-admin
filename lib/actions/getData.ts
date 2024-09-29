"use server";

import {
  DataModifyType,
  DataType,
  UserModifyType,
  UserType,
} from "@/types/types";
import { prisma } from "@/utils/db";
import { scryptSync, timingSafeEqual } from "crypto";

export const getAllData = async () => {
  try {
    // const mainSiteData = await fetch("http://localhost:3001/api/messages", {
    //   headers: {
    //     "Content-Type": "application",
    //     "X-Api-Key": process.env.API_KEY!,
    //   },
    // });

    // if (mainSiteData.ok) return await mainSiteData.json();

    return await prisma.message.findMany();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const toggleMessageAble = async (id: number, ableToShow: boolean) => {
  try {
    await prisma.message.update({
      where: { id: id },
      data: { ableToShow: ableToShow },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const modifyMessage = async (id: number, options: DataModifyType) => {
  await prisma.message.update({
    where: { id: id },
    data: {
      ableToShow: options.ableToShow,
      createdAt: options.createdAt,
      displayName: options.displayName!,
      email: options.email,
      message: options.message,
      name: options.name,
    },
  });
};

export const deleteMessage = async (id: number) => {
  await prisma.message.delete({
    where: { id: id },
  });
};

export const getMessage = async (id: number) => {
  const message = await prisma.message.findFirst({
    where: { id: id },
  });

  return message;
};

export const getLatestMessages = async (amount: number) => {
  try {
    const data: DataType[] = (await prisma.message
      .findMany({
        where: {
          ableToShow: true,
        },
        take: amount,
        orderBy: { createdAt: "desc" },
        select: {
          ableToShow: true,
          createdAt: true,
          displayName: true,
          email: true,
          id: true,
          message: true,
          name: true,
        },
      })
      .then((res) => res)) as DataType[];

    return data as DataType[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAbleToSees = async () => {
  try {
    const data = await prisma.message.findMany({
      where: { ableToShow: true },
      select: { ableToShow: true },
    });

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAbleToSeesCountByFetch = async () => {
  const data = await prisma.message.count({ where: { ableToShow: true } });

  return data;
};

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUser = async (email: string) => {
  try {
    const fUser = await prisma.user.findFirst({ where: { email: email } });
    return fUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const validatePassword = async (
  email: string,
  rawPassword: string,
  csrf: string,
  sessionId: string
) => {
  try {
    const user = await prisma.user.findFirst({ where: { email: email } });
    const [salt, hp] = user?.password.split(":")!;

    const hashedBuffer = scryptSync(rawPassword, salt, 64);
    const keyBuffer = Buffer.from(hp, "hex");

    const isCorrectPassword = timingSafeEqual(hashedBuffer, keyBuffer);
    if (!isCorrectPassword)
      return {
        status: false,
        username: user?.username,
        csrfToken: "",
        sessionId: "",
        error: "password",
      };

    const data = await getUser(email);

    if (!data) {
      return {
        status: false,
        username: user?.username,
        csrfToken: "",
        sessionId: "",
        error: "not ok data",
      };
    }
    if (csrf !== data.csrfToken || sessionId !== data.sessionId) {
      return {
        status: false,
        username: user?.username,
        csrfToken: "",
        sessionId: "",
        error: "csrf or session",
      };
    }

    return {
      status: true,
      username: user?.username,
      csrfToken: data.csrfToken,
      sessionId: data.sessionId,
      error: "no error",
    };
  } catch (error: any) {
    return {
      status: false,
      username: "",
      csrfToken: "",
      sessionId: "",
      error: "Invalid email or password",
    };
  }
};

export const modifyUser = async (id: string, data: UserModifyType) => {
  try {
    await prisma.user.update({
      where: { id: id },
      data: {
        authorized: data.authorized,
        csrfToken: data.csrfToken,
        email: data.email,
        fullName: data.fullName,
        sessionId: data.sessionId,
        username: data.username,
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const authorizeUser = async (id: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: id } });
    const clientData = {
      email: user?.email,
      authorized: user?.authorized,
      csrf: user?.csrfToken,
      session: user?.csrfToken,
    };

    const data = await fetch("http://admin-parsaairline.vercel.app/api/users/validate-user", {
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Api-Key": process.env.AUTH_API_KEY!,
        "X-User-Authorized": clientData.authorized ? "true" : "false",
        "X-User-CSRF-Token": clientData.csrf!,
        "X-User-Session": clientData.session!,
        "X-User-Email": clientData.email!,
      },
    });

    if (!data.ok) return { status: "dataError" };

    const res = await data.json();

    if (res.error === "user already authorized")
      return { status: "alreadyAuthorized" };
    else if (res.success === "authorized") return { status: "success" };
    else if (res.error === "wrong csrf") return { status: "csrfError" };
    else if (res.error === "wrong session id")
      return { status: "sessionError" };
    else return { status: "operationFailure" };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
