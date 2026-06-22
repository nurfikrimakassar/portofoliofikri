"use client";

import { useEffect, useRef, useState } from "react";

export function LiveClock() {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const wita = new Date(utcMs + 8 * 60 * 60000);
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(wita.getHours())}:${p(wita.getMinutes())}:${p(wita.getSeconds())} WITA`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span>
      {clock}
      <span className="blink">_</span>
    </span>
  );
}

export function RoleTyping({ roles }: { roles: string[] }) {
  const [text, setText] = useState("");
  const ri = useRef(0);
  const ci = useRef(0);
  const deleting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const loop = () => {
      const word = roles[ri.current] ?? "";
      if (!deleting.current) {
        ci.current++;
        if (ci.current > word.length) {
          deleting.current = true;
          setText(word);
          timer.current = setTimeout(loop, 1400);
          return;
        }
      } else {
        ci.current--;
        if (ci.current === 0) {
          deleting.current = false;
          ri.current = (ri.current + 1) % roles.length;
        }
      }
      setText((roles[ri.current] ?? "").slice(0, ci.current));
      timer.current = setTimeout(loop, deleting.current ? 45 : 90);
    };
    timer.current = setTimeout(loop, 90);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span>
      {text}
      <span className="blink" style={{ color: "#f5f5f5" }}>
        ▋
      </span>
    </span>
  );
}
