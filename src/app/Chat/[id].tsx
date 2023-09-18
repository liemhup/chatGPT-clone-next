import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";


const ChatById = () => {
  const router = useRouter();
  const session = useSession();
  const { id } = router.query;
  const [isUp, setIsUp] = useState(false);
  const chatWindowRef = useRef<HTMLOListElement>(null);
  const chat = api.chatRouter.chatById.useQuery({ id: id?.toString() ?? "" });
  const [isOpen, setIsOpen] = useState(false);

  const scrollToBot = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBot();
  }, [chat.data]);
  useLayoutEffect(() => {
    const handleScroll = () => {
      if (chatWindowRef.current) {
        const { scrollTop, clientHeight, scrollHeight } = chatWindowRef.current;
        setIsUp(scrollTop + clientHeight < scrollHeight);
      }
    };
    if (chatWindowRef.current) {
      chatWindowRef.current?.addEventListener("scroll", handleScroll);
    }
    return () => {
      chatWindowRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (chat.data == null) return;

  const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
    const id = (event.target as HTMLDialogElement).id;
    console.log(event.target);
    if (id === "wraper") setIsOpen(false);
  };

  return (
    <LayOut>
      {isOpen && (
        <Portal>
          <div className="absolute right-0 top-0 z-10 h-screen w-screen bg-black/25">
            <div className="flex" onClick={handleClose} id="wraper">
              <div className="h-screen">
                <SideBar></SideBar>
              </div>
              <button
                className="m-2 self-start border border-white"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Portal>
      )}
      {isUp && (
        <button onClick={scrollToBot} className="fixed bottom-1/4 right-6 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      )}
      <div className="w-100vw flex h-5/6 flex-col">
        <div
          id="stickyBar"
          className="sticky top-0 z-10 flex w-full bg-slate-600 md:hidden"
        >
          <button
            className="mx-4 my-3"
            type="button"
            id="sidebarOpener"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <p className="m-auto flex w-full justify-center ">
            {chat.data.chatTitle}
          </p>
        </div>
        <ol
          className="scrollbar relative h-full overflow-y-auto"
          ref={chatWindowRef}
        >
          {chat.data.messages?.map((mess) => {
            return (
              <li
                key={mess.id}
                className={`${
                  mess.role === "user" ? "bg-slate-700" : "bg-slate-500"
                } `}
              >
                <div className="mx-auto flex w-5/6 gap-4 break-all px-2 py-4 sm:w-10/12 md:w-3/4">
                  {mess.role === "user" ? (
                    <img
                      src={session.data?.user.image || ""}
                      className="h-6 w-6"
                      alt={mess.role}
                    ></img>
                  ) : (
                    <i>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0 0 64 64"
                        className="h-6 w-6"
                      >
                        <linearGradient
                          id="9yv_OTO3P9eepfu7Rtqera_kTuxVYRKeKEY_gr1"
                          x1="32"
                          x2="32"
                          y1="7"
                          y2="58"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0" stopColor="#6dc7ff"></stop>
                          <stop offset=".699" stopColor="#e6abff"></stop>
                        </linearGradient>
                        <path
                          fill="url(#9yv_OTO3P9eepfu7Rtqera_kTuxVYRKeKEY_gr1)"
                          d="M53.27,26.96c0.28-1.05,0.42-2.11,0.42-3.17c0-6.86-5.58-12.43-12.43-12.43 c-0.77,0-1.56,0.07-2.35,0.23C36.54,8.67,33.06,7,29.28,7c-5.55,0-10.36,3.62-11.92,8.89C11.43,16.9,7.04,22.05,7.04,28.14 c0,3.45,1.43,6.72,3.93,9.07c-0.44,1.3-0.66,2.64-0.66,4c0,6.86,5.58,12.43,12.43,12.43c0.44,0,0.88-0.02,1.38-0.08 C26.5,56.39,29.93,58,33.63,58c5.88,0,10.96-4.19,12.16-9.88c6.32-0.63,11.17-5.91,11.17-12.35 C56.96,32.46,55.62,29.29,53.27,26.96z M38.25,35.88l-6.63,4l-6.5-4v-7.26l6.63-3.87l6.63,3.75L38.25,35.88z"
                        ></path>
                        <linearGradient
                          id="9yv_OTO3P9eepfu7Rtqerb_kTuxVYRKeKEY_gr2"
                          x1="32"
                          x2="32"
                          y1=".872"
                          y2="62.679"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0" stopColor="#1a6dff"></stop>
                          <stop offset="1" stopColor="#c822ff"></stop>
                        </linearGradient>
                        <path
                          fill="url(#9yv_OTO3P9eepfu7Rtqerb_kTuxVYRKeKEY_gr2)"
                          d="M53.274,26.955 c0.275-1.045,0.415-2.107,0.415-3.166c0-6.855-5.578-12.434-12.434-12.434c-0.766,0-1.553,0.079-2.35,0.235 C36.536,8.665,33.062,7,29.278,7c-5.549,0-10.353,3.622-11.913,8.891c-5.93,1.012-10.32,6.163-10.32,12.254 c0,3.448,1.424,6.715,3.93,9.07c-0.44,1.299-0.664,2.64-0.664,3.996c0,6.855,5.578,12.434,12.434,12.434 c0.433,0,0.874-0.027,1.38-0.087C26.501,56.389,29.934,58,33.633,58c5.875,0,10.96-4.192,12.152-9.878 c6.327-0.629,11.17-5.908,11.17-12.355C56.956,32.463,55.622,29.286,53.274,26.955z M51.689,23.789c0,0.646-0.07,1.293-0.193,1.937 l-12.293-7.185l-13.146,7.991v-4.91l12.814-7.972c0.813-0.191,1.615-0.295,2.383-0.295C47.008,13.355,51.689,18.036,51.689,23.789z M37.397,35.171l-5.563,3.316l-5.776-3.303v-6.311l5.465-3.322l-0.031,0.052l5.905,3.48V35.171z M29.278,9 c2.997,0,5.755,1.251,7.728,3.457l-12.948,8.054V34.04l-4.898-2.801V16.922C20.319,12.254,24.462,9,29.278,9z M9.044,28.145 c0-4.923,3.419-9.109,8.116-10.169v14.424l12.701,7.264l-5.227,3.115l-11.897-6.674C10.392,34.107,9.044,31.211,9.044,28.145z M12.311,41.211c0-0.955,0.138-1.902,0.4-2.828l11.954,6.706l12.732-7.588v6.27l-13.172,7.754c-0.57,0.078-1.043,0.12-1.48,0.12 C16.992,51.645,12.311,46.964,12.311,41.211z M33.633,56c-2.886,0-5.578-1.175-7.546-3.252l13.31-7.835V30.261l4.539,2.675V47.09 C43.192,52.173,38.773,56,33.633,56z M45.936,46.091V31.793l-6.539-3.853v-0.068h-0.115l-5.879-3.465l5.821-3.538l12.309,7.195 c2.174,1.981,3.422,4.782,3.422,7.703C54.956,41.055,51.07,45.406,45.936,46.091z"
                        ></path>
                      </svg>
                    </i>
                  )}
                  <ol className="flex flex-col">
                    {mess.content.map((s, index) => {
                      return (
                        <li key={index}>
                          {s.includes(":") ? (
                            <>
                              <strong>{s.split(":")[0]}:</strong>
                              <span className="text-slate-100">
                                {s.split(":")[1]}
                              </span>
                            </>
                          ) : (
                            <span>{s}</span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </LayOut>
  );
};

export default ChatById;