"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getMessage, modifyMessage } from "@/lib/actions/getData";
import { SingleMessageType } from "@/types/types";
import { editMessageFormItems } from "@/utils/utils";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = ({ params }: { params: { messageId: string } }) => {
  const [message, setMessage] = useState<SingleMessageType>({});
  const [contentMessage, setContentMessage] = useState(message.message);
  const [contentName, setContentName] = useState(message.name);
  const [contentDisplayName, setContentDisplayName] = useState(
    message.displayName
  );
  const [contentEmail, setContentEmail] = useState(message.email);
  const [contentAbleToShow, setContentAbleToShow] = useState(
    message.ableToShow
  );
  const router = useRouter();

  useEffect(() => {
    const setData = async () => {
      const data = await getMessage(parseInt(params.messageId));
      setMessage({
        ableToShow: data?.ableToShow,
        createdAt: data?.createdAt,
        displayName: data?.displayName,
        email: data?.email,
        id: data?.id,
        message: data?.message,
        name: data?.name,
      });

      setContentDisplayName(data?.displayName);
      setContentName(data?.name);
      setContentEmail(data?.email);
      setContentMessage(data?.message);
      setContentAbleToShow(data?.ableToShow);
    };

    setData();
  }, []);

  const handleSubmit = async () => {
    await modifyMessage(message.id!, {
      ableToShow: contentAbleToShow,
      displayName: contentDisplayName,
      email: contentEmail,
      message: contentMessage,
      name: contentName,
    });

    router.push("/");
  };

  return (
    <div className="py-9 px-4 w-[100%]">
      <form
        onSubmit={handleSubmit}
        action="/"
        method="post"
        className="flex flex-col gap-5 w-full h-fit py-5 px-4 rounded-md justify-center items-start"
      >
        <h1 className="text-[28px] text-slate-200">
          Editting Message With ID Of:{" "}
          <span className="text-sky-400 underline">{message.id}</span> | Sender:{" "}
          <span className="text-sky-400 underline">{message.email}</span>
        </h1>
        {editMessageFormItems.map((i, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-start gap-2 w-full"
          >
            <Label
              className="pl-4 text-left text-[20px] text-slate-500 transition-all duration-300 hover:text-sky-400 cursor-pointer"
              htmlFor={i.valueSet}
            >
              {i.label}:
            </Label>
            <div className="w-full flex flex-row justify-start items-center p-0 m-0">
              <Input
                disabled={message.id !== undefined ? false : true}
                placeholder={i.label}
                type={i.inputType}
                name={i.valueSet}
                id={i.valueSet}
                spellCheck={false}
                value={
                  i.valueSet === "name"
                    ? contentName!
                    : i.valueSet === "email"
                    ? contentEmail!
                    : i.valueSet === "displayName"
                    ? contentDisplayName!
                    : ""
                }
                onChange={(e) =>
                  i.valueSet === "name"
                    ? setContentName(e.target.value)
                    : i.valueSet === "email"
                    ? setContentEmail(e.target.value)
                    : i.valueSet === "displayName"
                    ? setContentDisplayName(e.target.value)
                    : ""
                }
                className={`${
                  i.valueSet === "displayName" ? "w-[80%]" : "w-full"
                } px-2 py-4 border-slate-500 text-slate-200 text-[20px] transition-all duration-300 focus-visible:border-sky-400`}
              />
              {i.valueSet === "displayName" && (
                <div className="flex flex-row justify-center items-center gap-2 ml-3">
                  {/* TODO: Add other inputs and this label and other pages */}
                  <Label
                    htmlFor="ableToShow"
                    className="w-[75%] text-left text-[20px] text-slate-500 transition-all duration-300 hover:text-sky-400 cursor-pointer"
                  >
                    Able To Show:{" "}
                  </Label>
                  <Input
                    disabled={message.id !== undefined ? false : true}
                    type="checkbox"
                    name="ableToShow"
                    id="ableToShow"
                    checked={contentAbleToShow}
                    onChange={() => setContentAbleToShow(!contentAbleToShow)}
                    className="w-[25%] px-2 py-4 border-slate-500 text-slate-200 text-[20px] cursor-pointer checked:bg-sky-400 transition-all duration-300"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="flex flex-col justify-center items-start gap-2 w-full">
          <Label
            className="pl-4 text-left text-[20px] text-slate-500 transition-all duration-300 hover:text-sky-400 cursor-pointer"
            htmlFor="message"
          >
            Message:
          </Label>
          <div className="w-full flex flex-row justify-start items-center p-0 m-0">
            <Textarea
              disabled={message.id !== undefined ? false : true}
              placeholder="Message"
              name="message"
              id="message"
              value={contentMessage}
              onChange={(e) => setContentMessage(e.target.value)}
              className={`w-full px-2 py-4 border-slate-500 text-slate-200 text-[20px] bg-transparent border-2 transition-all duration-300 focus-visible:border-sky-400`}
              spellCheck={false}
              rows={6}
            />
          </div>
        </div>
        <div className="w-full h-fit px-4 py-3 flex justify-end items-center flex-row gap-3">
          <Button
            type="button"
            className="hover:bg-red-500 text-lg hover:border-red-500"
            variant="outline"
            disabled={message.id !== undefined ? false : true}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="hover:bg-green-500 text-lg hover:border-green-500"
            variant="outline"
            disabled={message.id !== undefined ? false : true}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
