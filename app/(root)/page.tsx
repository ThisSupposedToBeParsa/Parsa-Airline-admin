"use client";

import {
  authorizeUser,
  deleteMessage,
  getAbleToSees,
  getAllData,
  getUser,
  toggleMessageAble,
} from "@/lib/actions/getData";
import { DataType } from "@/types/types";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableRows } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { useCookies } from "react-cookie";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [messages, setMessages] = useState<DataType[] | undefined>([]);
  const [query, setQuery] = useState("");
  const [isRefetched, setIsRefetched] = useState(false);
  const [cookies] = useCookies(["user"]);
  const router = useRouter();
  const [ableToShowsCountAcceptable, setAbleToShowsCountAcceptable] = useState<
    { ableToShow: boolean }[] | "pending" | undefined
  >([]);

  const cookieUser = cookies.user;
  if (!cookies.user) router.push("/login");

  const searchFoundMessages = messages?.filter((item) => {
    if (item.email.toLowerCase().includes(query.toLowerCase())) {
      return item.email.toLowerCase().includes(query.toLowerCase());
    }

    if (item.name.toLowerCase().includes(query.toLowerCase())) {
      return item.name.toLowerCase().includes(query.toLowerCase());
    }

    if (item.displayName?.toLowerCase().includes(query.toLowerCase())) {
      return item.displayName?.toLowerCase().includes(query.toLowerCase());
    }

    if (item.message.toLowerCase().includes(query.toLowerCase())) {
      return item.message.toLowerCase().includes(query.toLowerCase());
    }

    if (item.id.toString().toLowerCase().includes(query.toLowerCase())) {
      item.id.toString().toLowerCase().includes(query.toLowerCase());
    }
  });

  useEffect(() => {
    const getMessages = async () => {
      const m = await getAllData();
      setMessages(m);

      const atsc = await getAbleToSees();
      setAbleToShowsCountAcceptable(atsc);

      const user = await getUser(cookieUser.email);
      const authorization = await authorizeUser(user?.id!);

      if (authorization.status === "alreadyAuthorized")
        cookieUser.authorized = true;
      if (authorization.status === "success") cookieUser.authorized = true;
      if (authorization.status === "csrfError") {
        cookieUser.authorized = false;
        router.push("/login");
      }
      if (authorization.status === "sessionError") {
        cookieUser.authorized = false;
        router.push("/login");
      }
      if (authorization.status === "operationFailure") {
        cookieUser.authorized = false;
        router.push("/login");
      }
    };

    getMessages();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      setMessages(await getAllData());
    };

    const interval = setInterval(() => {
      getMessages();
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefetched(false);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-8 py-16 flex flex-col w-full h-full overflow-y-auto justify-start items-start gap-10 right-0">
      <div className="flex flex-row justify-between items-center px-3 w-full h-[25px]">
        <h1 className="text-[28px] transition-all duration-300 hover:text-sky-400 hover:underline cursor-pointer font-bold">
          Node: Messages
        </h1>
        <p className="text-[14px] text-slate-600">
          <span className="text-slate-400">Note:</span> Actions might take a
          while because of time between fetch. Please be patient.
          <br />
          <span className="text-slate-400">Note:</span> Server will refetch data
          every minitue. Click refresh button to refetch
          <br />
          <span className="text-slate-400">Note:</span> Refetching data might
          take a few seconds because of time between fetch.
        </p>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row justify-start items-center gap-3">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-[450px] px-2 py-5 text-[16px] transition-all duration-500 focus-visible:border-sky-400 focus-visible:shadow-sm focus-visible:shadow-sky-400 ${
              query === "" ? "border-[1px] border-slate-700 shadow-none" : ""
            }`}
            placeholder="Search To Find Items ..."
          />
          <Button
            variant="outline"
            disabled={query === "" ? true : false}
            className="px-2 py-5 text-[16px] border-2"
            onClick={(e) => setQuery("")}
          >
            Cancel
          </Button>
        </div>
        <RefreshCwIcon
          onClick={() => {
            const revalidate = async () => {
              setMessages(await getAllData());
            };
            revalidate();
            setIsRefetched(true);
          }}
          className={`cursor-pointer p-2 rounded-md bg-slate-800 hover:bg-slate-700 w-[40px] h-[40px] transition-all duration-500 ${
            isRefetched ? "rotate-[360deg]" : ""
          }`}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {tableRows.map((i, index) => (
              <TableHead
                key={index}
                className="text-[20px] transition-all duration-300 hover:bg-slate-700 cursor-pointer"
              >
                {i}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="mt-5">
          {searchFoundMessages?.length !== 0 ? (
            searchFoundMessages?.map((i, index) => (
              <TableRow
                key={index}
                className={`overflow-y-hidden border-b max-h-[150px] transition-all duration-300 ${
                  !i.ableToShow
                    ? "border-b-red-600 shadow-sm shadow-red-600 "
                    : "border-b-sky-400 shadow-sm shadow-sky-400 "
                }`}
              >
                <TableCell className="text-white text-[20px]">{i.id}</TableCell>
                <TableCell className="py-8">
                  <p className="text-slate-500 text-[16px] text-ellipsis overflow-hidden cursor-pointer hover:text-sky-400 transition-all duration-300 max-w-[110px]">
                    {i.email}
                  </p>
                </TableCell>
                <TableCell className="py-8">
                  <p className="text-slate-500 text-[16px] text-ellipsis overflow-hidden cursor-pointer hover:text-sky-400 transition-all duration-300 max-w-[110px]">
                    {i.name}
                  </p>
                </TableCell>
                <TableCell className="py-8">
                  <p className="text-slate-500 text-ellipsis text-[16px] overflow-hidden cursor-pointer hover:text-sky-400 transition-all duration-300 max-w-[110px]">
                    @{i.displayName}
                  </p>
                </TableCell>
                <TableCell className="py-8">
                  <p className="text-slate-500 text-[16px] cursor-pointer hover:text-sky-400 transition-all duration-300 max-w-[200px] max-h-[150px] truncate">
                    {i.message}
                  </p>
                </TableCell>
                <TableCell className="py-8">
                  <p className="text-slate-500 text-[16px] text-ellipsis overflow-hidden cursor-pointer hover:text-sky-400 transition-all duration-300 max-w-[120px]">{`${new Date(
                    i.createdAt
                  ).getFullYear()}/${new Date(
                    i.createdAt
                  ).getMonth()}/${new Date(i.createdAt).getDate()} - ${new Date(
                    i.createdAt
                  ).getHours()}:${new Date(i.createdAt).getMinutes()}`}</p>
                </TableCell>
                <TableCell className="">
                  <p className="text-slate-500 text-[16px] text-ellipsis truncate">
                    <Input
                      type="checkbox"
                      checked={i.ableToShow === true ? true : false}
                      className="w-[20px] h-[20px] cursor-pointer checked:border-sky-400 checked:bg-sky-400 border transition-all duration-300"
                      onChange={() => {
                        const changeStatus = async () => {
                          await toggleMessageAble(i.id, !i.ableToShow);
                          const ableToSeesCount = await getAbleToSees();

                          setMessages(await getAllData());
                          setAbleToShowsCountAcceptable(ableToSeesCount);
                        };

                        changeStatus();
                      }}
                    />
                  </p>
                </TableCell>
                <TableCell className="flex flex-row justify-between max-w-[100px] items-center h-[100px]">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Image
                        src="/trash.svg"
                        width={20}
                        height={20}
                        alt="Delete"
                        className="text-white fill-white cursor-pointer rounded-md w-[30px] h-[30px] p-[2px] transition-all duration-300 bg-opacity-0 bg-red-800 hover:bg-opacity-[1] "
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete message with id of{" "}
                          <span className="text-sky-400">{i.id}</span> and
                          sender of{" "}
                          <span className="text-sky-500">{i.email}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            const deletedMessage = async () => {
                              await deleteMessage(i.id);
                              setMessages(await getAllData());
                            };

                            deletedMessage();
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Image
                    src="/arrow-right.svg"
                    width={20}
                    height={20}
                    alt="Delete"
                    className="text-white fill-white cursor-pointer rounded-md w-[30px] h-[30px] p-[2px] transition-all duration-300 bg-opacity-0 bg-sky-800 hover:bg-opacity-[1] "
                    onClick={() => router.push(`/message/${i.id}`)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <p className="text-slate-700 mt-8 text-[18px] pl-3 w-fit whitespace-nowrap overflow-hidden">
              No messages yet...
            </p>
          )}
          <TableFooter />
        </TableBody>
      </Table>
      <Alert
        variant="destructive"
        className={`fixed z-30 bg-slate-800 bg-opacity-[.85] h-fit max-w-[500px] right-5 top-5 transition-all duration-300 border-red-500 border-2 ${
          ableToShowsCountAcceptable?.length! < 5 ? "opacity-[1]" : "opacity-0"
        }`}
      >
        <AlertCircleIcon className="w-6 h-6 fill-red-500" />
        <AlertTitle className=" text-red-500 text-[20px]">
          Messages able to show are less than 5.
        </AlertTitle>
        <AlertDescription className=" text-red-500">
          According to main website, messages should be 5 or more. Consider
          adding more able to show messages.
        </AlertDescription>
      </Alert>
    </div>
  );
}
