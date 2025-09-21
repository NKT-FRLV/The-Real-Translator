// app/_components/SessionHeartbeat.tsx
"use client";

import { useEffect } from "react";

export default function SessionHeartbeat() {
  useEffect(() => {
    const send = () => {
      // не передаём тело — sendBeacon ок, роут читает куки
      navigator.sendBeacon("/api/sessions/heartbeat/edge");
    };
    send(); // сразу при монтировании
    const iv = setInterval(send, 10 * 60 * 1000); // каждые 10 минут
    // const onVis = () => {
    //   if (document.visibilityState === "visible") send();
    // };
    // document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(iv);
    //   document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return null;
}
