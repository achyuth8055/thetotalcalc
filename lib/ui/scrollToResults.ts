/**
 * Smoothly scroll the results section into view. Used by calculators that have
 * an explicit "Calculate" button so the user is taken straight to the answer
 * instead of having to hunt for it below the form.
 *
 * Pass the same id you put on your results container (default "results").
 * Respects users who prefer reduced motion.
 */
export function scrollToResults(id = "results"): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "start",
  });
}
