// Patch addEventListener defaults to make scroll-like events passive by default.
// This reduces main-thread blocking from touch/scroll handlers and improves scroll performance.
(function () {
  if (typeof window === "undefined" || !window.EventTarget) return;
  try {
    const orig = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      // Events that should generally be passive for better scroll performance
      const passiveEvents = new Set(["scroll", "wheel", "touchstart", "touchmove"]);
      if (passiveEvents.has(type)) {
        if (options === undefined) options = { passive: true };
        else if (typeof options === "boolean") options = { capture: options, passive: true };
        else if (typeof options === "object" && options.passive === undefined) options = Object.assign({}, options, { passive: true });
      }
      return orig.call(this, type, listener, options);
    };
  } catch (e) {
    // Fail silently - patch is best-effort
  }
})();
