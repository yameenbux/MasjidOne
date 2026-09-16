"use client";

import { useEffect } from "react";

/**
 * Behaviour for the ported sections, carried over from the original
 * single-file build and given real types:
 *
 *  - theme toggle (no storage, by design — resets on reload)
 *  - one reveal mechanism for the whole page
 *  - the prayer board: split-flap settle, live clock, next-jamāʿah countdown
 *  - preview tabs, the objections accordion, copy-to-clipboard
 *  - the pointer-origin button fill
 *
 * The pricing section is a React component and is not touched here.
 */
export function SiteBehaviour() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    const pad = (n: number) => (n < 10 ? "0" : "") + n;

    /* ---- Theme toggle ---- */
    const tBtn = document.getElementById("theme");
    if (tBtn) {
      const current = () =>
        root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
      const sync = () => {
        const dark = current() === "dark";
        tBtn.setAttribute("aria-pressed", String(dark));
        tBtn.setAttribute(
          "aria-label",
          "Switch to " + (dark ? "light" : "dark") + " theme"
        );
        /* Keep shadcn's .dark class in step, since the pricing component
           reads its tokens from that class rather than the attribute. */
        root.classList.toggle("dark", dark);
      };
      const onClick = () => {
        root.setAttribute(
          "data-theme",
          current() === "dark" ? "light" : "dark"
        );
        sync();
      };
      tBtn.addEventListener("click", onClick);
      sync();
      cleanups.push(() => tBtn.removeEventListener("click", onClick));
    }

    /* ---- Header hairline once the page has moved ---- */
    const hdr = document.getElementById("hdr");
    const onScroll = () => hdr?.classList.toggle("stuck", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    /* ---- Reveals ---- */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    document.querySelectorAll<HTMLElement>(".rv").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    /* ---- The board ---- */
    const board = document.getElementById("board");
    const clock = document.getElementById("clock");
    const nextOut = document.getElementById("next");

    const tick = () => {
      const now = new Date();
      if (clock) {
        clock.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes());
      }
      const mins = now.getHours() * 60 + now.getMinutes();
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      document.querySelectorAll<HTMLElement>("#rows tr").forEach((tr) => {
        tr.removeAttribute("data-next");
        const j = tr.querySelector<HTMLElement>("[data-j]");
        if (!j) return;
        const parts = (j.getAttribute("data-j") || "").split(":");
        let d = (+parts[0] * 60 + +parts[1]) - mins;
        if (d < 0) d += 1440;
        if (d < bestD) {
          bestD = d;
          best = tr;
        }
      });
      if (best && nextOut) {
        (best as HTMLElement).setAttribute("data-next", "");
        const h = Math.floor(bestD / 60);
        const m = bestD % 60;
        nextOut.innerHTML =
          "Next jamāʿah in <b>" + (h ? h + "h " : "") + m + "m</b>";
      }
    };
    tick();
    const timer = window.setInterval(tick, 20000);
    cleanups.push(() => window.clearInterval(timer));

    /* ---- Split-flap settle. The one page-load moment. ---- */
    if (board) {
      const flip = () => {
        board.classList.add("flip");
        if (reduce) return;
        document
          .querySelectorAll<HTMLElement>(".flap")
          .forEach((el, i) => {
            const target = el.getAttribute("data-t") || "";
            el.style.setProperty("--d", i * 70 + "ms");
            const inner = document.createElement("span");
            inner.textContent = target;
            el.textContent = "";
            el.appendChild(inner);
            const start = performance.now() + i * 70;
            const dur = 460;
            const scramble = (now: number) => {
              const t = now - start;
              if (t < 0) {
                requestAnimationFrame(scramble);
                return;
              }
              if (t >= dur) {
                inner.textContent = target;
                return;
              }
              inner.textContent =
                pad(Math.floor(Math.random() * 24)) +
                ":" +
                pad(Math.floor(Math.random() * 60));
              requestAnimationFrame(scramble);
            };
            requestAnimationFrame(scramble);
          });
      };
      const bio = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            flip();
            bio.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      bio.observe(board);
      cleanups.push(() => bio.disconnect());
    }

    /* ---- Preview tabs ---- */
    const tabs = Array.from(document.querySelectorAll<HTMLElement>(".tab"));
    const select = (i: number) => {
      tabs.forEach((t, n) => {
        const on = n === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(
          t.getAttribute("aria-controls") || ""
        );
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      const onTabClick = () => select(i);
      const onKey = (e: KeyboardEvent) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const n = (i + d + tabs.length) % tabs.length;
        select(n);
        tabs[n].focus();
      };
      t.addEventListener("click", onTabClick);
      t.addEventListener("keydown", onKey);
      cleanups.push(() => {
        t.removeEventListener("click", onTabClick);
        t.removeEventListener("keydown", onKey);
      });
    });

    /* ---- Objections accordion ---- */
    document
      .querySelectorAll<HTMLDetailsElement>(".qa details")
      .forEach((d) => {
        const body = d.querySelector<HTMLElement>(".qa__body");
        const onToggle = () => {
          if (reduce || !body || !d.open) return;
          body.animate(
            [
              { height: "0px", opacity: 0 },
              { height: body.scrollHeight + "px", opacity: 1 },
            ],
            { duration: 280, easing: "cubic-bezier(.3,.8,.3,1)" }
          );
        };
        d.addEventListener("toggle", onToggle);
        cleanups.push(() => d.removeEventListener("toggle", onToggle));
      });

    /* ---- Buttons: the fill starts where you touched it ---- */
    const coverFrom = (el: HTMLElement, x: number, y: number) => {
      const r = el.getBoundingClientRect();
      const cov =
        2 *
        Math.max(
          Math.hypot(x, y),
          Math.hypot(r.width - x, y),
          Math.hypot(x, r.height - y),
          Math.hypot(r.width - x, r.height - y)
        );
      el.style.setProperty("--ox", x + "px");
      el.style.setProperty("--oy", y + "px");
      el.style.setProperty("--cov", Math.ceil(cov) + "px");
    };
    document.querySelectorAll<HTMLElement>(".btn").forEach((el) => {
      const fromPointer = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        coverFrom(el, e.clientX - r.left, e.clientY - r.top);
      };
      const fromCentre = () => {
        const r = el.getBoundingClientRect();
        coverFrom(el, r.width / 2, r.height / 2);
      };
      el.addEventListener("pointerenter", fromPointer);
      el.addEventListener("pointerdown", fromPointer);
      el.addEventListener("focus", fromCentre);
      cleanups.push(() => {
        el.removeEventListener("pointerenter", fromPointer);
        el.removeEventListener("pointerdown", fromPointer);
        el.removeEventListener("focus", fromCentre);
      });
    });

    /* ---- Copy address ---- */
    const copy = document.getElementById("copy");
    const mail = document.getElementById("mail");
    if (copy && mail) {
      const onCopy = () => {
        navigator.clipboard.writeText(mail.textContent?.trim() || "").then(
          () => {
            copy.textContent = "Copied";
            copy.setAttribute("data-done", "");
            window.setTimeout(() => {
              copy.textContent = "Copy address";
              copy.removeAttribute("data-done");
            }, 2200);
          },
          () => {
            copy.textContent = "Press Ctrl+C to copy";
          }
        );
      };
      copy.addEventListener("click", onCopy);
      cleanups.push(() => copy.removeEventListener("click", onCopy));
    }

    const yr = document.getElementById("yr");
    if (yr) yr.textContent = String(new Date().getFullYear());

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
