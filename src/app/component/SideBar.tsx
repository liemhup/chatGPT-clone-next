"use client";
import {
  EllipsisHorizontalIcon,
  ArrowLeftIcon,
  TrashIcon,
  PencilIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Chat = {
  id: string;
  title: string;
  message: [];
};

export default function () {
  const session = useSession();
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "chat 1 121312312312321213121111111111111 2222",
      message: [],
    },
  ]);
  const src = session.data?.user.image;
  const newChatHandler = () => {};
  useEffect(() => {}, []);
  return (
    <div className="w-full flex flex-col h-screen bg-chat-100">
      <div className="flex p-2 gap-2 ">
        <button
          className="text-left flex-grow p-2 border-slate-400 border bg-chat-300 rounded-lg"
          onClick={newChatHandler}
        >
          + New Chat
        </button>
        <button className=" p-2 my-auto border-slate-400  border bg-chat-300 rounded-lg">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      </div>
      <ol className="flex-grow">
        {chats.map((chat) => {
          return (
            <li key={chat.id} className="w-64">
              <Link
                href={`/chat/${chat.id}`}
                className="flex justify-between p-2 group h-8"
              >
                <button className="flex gap-2 h-6 w-40 break-all overflow-hidden">
                  <div className="w-6">
                    <ChatBubbleLeftIcon className="h-6 w-6" />
                  </div>
                  {chat.title}
                </button>
                <div className="hidden group-hover:flex">
                  <button className="h-6 w-6 p-0.5 text-stone-300">
                    <PencilIcon />
                  </button>
                  <button className="h-6 w-6 p-0.5 text-slate-300">
                    <TrashIcon />
                  </button>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
      <div className="flex p-2 gap-2 border-slate-400 border-t">
        {!!src && (
          <Image
            src={session.data.user.image}
            alt="user Avatar"
            height={32}
            width={32}
          />
        )}
        <strong className="flex-grow font-semibold my-auto">
          {session?.data?.user.name}
        </strong>
        <button
          className="h-6 w-6"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <EllipsisHorizontalIcon />
        </button>
      </div>
    </div>
  );
}
