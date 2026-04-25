// Ensure images defer decoding by default where possible.
// Adds `loading="lazy"` to existing and newly-added <img> elements.
(function () {
  if (typeof window === "undefined" || !window.MutationObserver) return;

  const applyLazy = (img) => {
    try {
      if (!img) return;
      if (img.tagName !== "IMG") return;
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    } catch (e) {}
  };

  const init = () => {
    document.querySelectorAll && document.querySelectorAll("img").forEach(applyLazy);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          try {
            if (node.nodeType !== 1) continue;
            if (node.tagName === "IMG") applyLazy(node);
            node.querySelectorAll && node.querySelectorAll("img").forEach(applyLazy);
          } catch (e) {}
        }
      }
    });

    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
