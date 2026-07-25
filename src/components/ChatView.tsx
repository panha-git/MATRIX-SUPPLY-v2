"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getChatRooms, getMessages, PLATFORM_CHANGED_EVENT, sendMessage, type ChatRoom, type Message } from "@/lib/localStorage";
import { getMockChatRooms, getMockMessages } from "@/lib/mock/chat";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";

function messageTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatView() {
  const { user } = useAuth();
  const params = useSearchParams();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [active, setActive] = useState(params.get("room") || "");
  const [text, setText] = useState("");

  useEffect(() => {
    const sync = () => {
      const allRooms = (user ? getChatRooms() : getMockChatRooms()) as ChatRoom[];
      const visible = user ? allRooms.filter((room) => room.customerId === user.id || room.supplierId === user.id) : allRooms.slice(0, 10);
      setRooms(visible);
      setMessages((user ? getMessages() : getMockMessages()) as Message[]);
      if (!active && visible[0]) setActive(visible[0].id);
    };
    sync();
    window.addEventListener(PLATFORM_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PLATFORM_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [user, active]);

  const room = rooms.find((item) => item.id === active);
  const conversation = messages.filter((message) => message.chatRoomId === active);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!room || !user || !text.trim()) return;
    sendMessage(room, user, text);
    setText("");
  };

  return (
    <div className="container-shell page-pad">
      <span className="eyebrow">Verified Marketplace Chat</span>
      <h1 className="mt-3 text-3xl font-black tracking-tight">Chat Inbox</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-ink">
        {user ? "Manage active supplier conversations." : "Preview active procurement conversations across live supplier rooms."}
      </p>

      <div className="mt-7 grid min-h-[560px] overflow-hidden rounded-2xl border border-line bg-surface shadow-sm md:grid-cols-[300px_1fr]">
        <aside className="border-b border-line bg-surface-muted/55 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between gap-3 border-b border-line p-4">
            <h2 className="font-bold">Conversations</h2>
            <span className="rounded-full bg-primary-soft px-2 py-1 text-[11px] font-bold text-primary">{rooms.length}</span>
          </div>
          <div className="max-h-72 overflow-y-auto md:max-h-[500px]">
            {rooms.map((item) => {
              const selected = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`flex w-full gap-3 border-b border-line p-4 text-left transition hover:bg-primary-soft/70 ${
                    selected ? "bg-primary-soft text-primary" : "text-foreground"
                  }`}
                >
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${selected ? "bg-primary text-white" : "bg-surface text-muted-ink"}`}>
                    <Icon name="headset" size={16} />
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-sm">{user && user.id === item.customerId ? item.supplierName : item.customerName}</strong>
                    <span className="mt-1 block truncate text-xs text-muted-ink">{item.productTitle || "Order conversation"}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-[460px] flex-col bg-background/45">
          {room ? (
            <>
              <header className="border-b border-line bg-surface px-4 py-4">
                <strong className="block truncate text-sm">
                  {room.customerName} / {room.supplierName}
                </strong>
                {!user && <p className="mt-1 text-xs text-muted-ink">Marketplace preview conversation</p>}
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                {conversation.map((message) => {
                  const mine = Boolean(user && message.senderId === user.id);
                  return (
                    <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <article
                        className={`max-w-[86%] rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                          mine ? "border-primary bg-primary text-white" : "border-line bg-surface text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <strong className={`text-xs ${mine ? "text-white/90" : "text-muted-ink"}`}>{message.senderName}</strong>
                          <span className={`text-[10px] ${mine ? "text-white/70" : "text-muted-ink"}`}>{messageTime(message.createdAt)}</span>
                        </div>
                        <p className="mt-1.5 leading-6">{message.message}</p>
                      </article>
                    </div>
                  );
                })}
              </div>

              {user ? (
                <form onSubmit={submit} className="flex gap-2 border-t border-line bg-surface p-3 sm:p-4">
                  <input
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Write a message"
                    className="form-control mt-0"
                    aria-label="Write a message"
                  />
                  <button className="primary-btn px-4" disabled={!text.trim()}>
                    Send
                  </button>
                </form>
              ) : (
                <div className="border-t border-line bg-surface p-4 text-sm text-muted-ink">
                  Sign in to start a private RFQ conversation with a supplier.
                </div>
              )}
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center text-sm text-muted-ink">
              <div>
                <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Icon name="headset" size={20} />
                </span>
                <p className="mt-3 font-semibold">Select a conversation</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
