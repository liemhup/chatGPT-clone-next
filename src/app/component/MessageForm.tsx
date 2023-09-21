"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import type { ChatRequestOptions } from "ai";
import { ChangeEvent, FormEvent, useRef } from "react";
import { StopIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

type Props = {
  handleInputChange: (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  onStop: () => void;
  onReload: (
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => Promise<string | null | undefined>;
  // ...Props
};

export default function ({
  handleInputChange,
  handleSubmit,
  onStop,
  onReload,
}: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef(null);
  return (
    <div className="w-full flex bg-chat-150 absolute bottom-0 h-1/5">
      <div className="m-auto w-4/5 relative">
        <button
          className="absolute -right-6 -top-12"
          onClick={(event) => {
            onReload();
          }}
        >
          <ArrowPathIcon className="h-6 w-6"></ArrowPathIcon>
        </button>
        <button
          className="flex absolute -top-16 right-1/2 translate-x-1/2 border p-2 rounded-xl"
          onClick={onStop}
        >
          <StopIcon className="h-6 w-6"></StopIcon>
          Stop genarating
        </button>
        <form
          ref={formRef}
          className="mx-auto p-4 w-full relative"
          onSubmit={(event) => {
            // event.preventDefault();
            handleSubmit(event);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          <textarea
            // value={input}
            onChange={handleInputChange}
            ref={inputRef}
            className="overflow-y-auto bg-chat-300 outline-none resize-none w-full p-4 rounded-xl relative"
            placeholder="Câu hỏi của bạn?"
            rows={1}
            style={{ maxHeight: "200px" }}
          ></textarea>
          <button
            type="submit"
            className="h-6 w-6 absolute right-6 top-1/2 -translate-y-1/2"
          >
            <PaperAirplaneIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
