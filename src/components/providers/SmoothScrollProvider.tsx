"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Instance Lenis accessible pour les défilements programmatiques
   (le type global `window.lenis` de lenis est trop restrictif : on garde
   notre propre référence typée). */
let lenisInstance: Lenis | null = null;
export const getLenis = (): Lenis | null => lenisInstance;

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Sur mobile, le redressement de la barre d'adresse provoque un resize
    // en plein scroll : sans ce réglage, ScrollTrigger refresh au mauvais
    // moment et les sections épinglées sautent / restent bloquées.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Instance exposée pour les défilements programmatiques (ex. bouton Hero → contact).
    lenisInstance = lenis;

    // Les composants se montent après l'événement load : ScrollTrigger a
    // calculé ses positions sur un layout non stabilisé (images/polices non
    // chargées). Un refresh différé recale tous les triggers sur le vrai layout.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t1 = setTimeout(refresh, 1000);
    const t2 = setTimeout(refresh, 3000);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t1);
      clearTimeout(t2);
      lenisInstance = null;
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
}
