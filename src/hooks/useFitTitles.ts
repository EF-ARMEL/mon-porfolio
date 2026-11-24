"use client";

import { useEffect } from "react";

/**
 * Les grands titres éditoriaux (.stk-title) ne passent jamais à la ligne :
 * chaque ligne doit tenir dans la largeur disponible. Ce hook mesure la ligne
 * la plus longue de chaque titre et réduit la taille de police juste assez
 * pour qu'elle tienne (jamais au-delà de la taille prévue par le CSS).
 * Recalculé au redimensionnement et une fois les polices chargées.
 */
export function useFitTitles(selector = ".stk-title") {
  useEffect(() => {
    const fit = () => {
      document.querySelectorAll<HTMLElement>(selector).forEach((title) => {
        title.style.fontSize = ""; // repart de la taille CSS
        const box = title.parentElement;
        if (!box) return;
        const avail = box.clientWidth;
        let need = 0;
        title.querySelectorAll<HTMLElement>(".stk-ln").forEach((ln) => {
          need = Math.max(need, ln.scrollWidth);
        });
        if (need > avail && avail > 0) {
          const size = parseFloat(getComputedStyle(title).fontSize);
          title.style.fontSize = `${Math.floor(size * (avail / need) * 0.98)}px`;
        }
      });
    };

    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [selector]);
}
