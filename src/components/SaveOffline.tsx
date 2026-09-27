"use client";

import { useEffect, useState } from "react";

type State = { kind: "idle" } | { kind: "saving"; done: number; total: number } | { kind: "done"; total: number } | { kind: "error" };

// Asks the service worker (public/sw.js) to download every page and its phone-sized photos.
export function SaveOffline() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setSupported(false);
      return;
    }
    const onMsg = (e: MessageEvent) => {
      const m = e.data;
      if (m?.type === "save-progress") setState({ kind: "saving", done: m.done, total: m.total });
      if (m?.type === "save-done") setState({ kind: "done", total: m.total });
      if (m?.type === "save-error") setState({ kind: "error" });
    };
    navigator.serviceWorker.addEventListener("message", onMsg);
    return () => navigator.serviceWorker.removeEventListener("message", onMsg);
  }, []);

  if (!supported) return null;

  const start = async () => {
    setState({ kind: "saving", done: 0, total: 0 });
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.active?.postMessage("save-all");
    } catch {
      setState({ kind: "error" });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={start}
        disabled={state.kind === "saving"}
        className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {state.kind === "saving" ? "Saving…" : state.kind === "done" ? "Saved ✓ — update" : "Save for offline"}
      </button>
      <span className="text-xs text-ink-soft" aria-live="polite">
        {state.kind === "saving" && state.total > 0 && `${state.done} / ${state.total} files`}
        {state.kind === "done" && `All pages and ${state.total} files stored on this phone.`}
        {state.kind === "error" && "Couldn't save — try again on Wi-Fi."}
        {state.kind === "idle" && "Use Wi-Fi: about 10–15 MB."}
      </span>
    </div>
  );
}
