"use client";

import { FormEvent } from "react";
import { Icon } from "./Icon";
import { useMarketplace } from "./MarketplaceProvider";

export function ContactForm() {
  const { notify } = useMarketplace();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    notify("Message received — we’ll be in touch soon");
  };
  return <form onSubmit={submit} className="surface-card p-5"><h3 className="font-bold">Send a message</h3><div className="mt-4 space-y-3"><input required placeholder="Your name" className="h-11 w-full rounded-xl border border-line bg-[#f8faf9] px-3 text-sm outline-none focus:border-primary/50"/><input required type="email" placeholder="Your email" className="h-11 w-full rounded-xl border border-line bg-[#f8faf9] px-3 text-sm outline-none focus:border-primary/50"/><select required defaultValue="" className="h-11 w-full rounded-xl border border-line bg-[#f8faf9] px-3 text-sm text-muted-ink outline-none"><option value="" disabled>Select a topic</option><option>Order help</option><option>Payment</option><option>Product quality</option></select><textarea required placeholder="Describe your issue..." rows={4} className="w-full resize-none rounded-xl border border-line bg-[#f8faf9] p-3 text-sm outline-none focus:border-primary/50"/><button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark"><Icon name="arrowRight" size={16}/>Send message</button></div></form>;
}
