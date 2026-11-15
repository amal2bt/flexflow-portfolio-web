import { useEffect, useRef, useState } from "react";

export default function CountUp({ value, duration = 1600, loopEvery = 6000 }: { value: number; duration?: number; loopEvery?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(value); return; }
    let raf = 0;
    let timer = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) {
        run();
        timer = window.setInterval(run, loopEvery);
      } else {
        cancelAnimationFrame(raf);
      }
    }, { threshold: .3 });
    observer.observe(node);
    return () => { observer.disconnect(); window.clearInterval(timer); cancelAnimationFrame(raf); };
  }, [value, duration, loopEvery]);
  return <span ref={ref}>{shown}%</span>;
}
