import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const HFModal = ({
  open,
  onClose,
  children,
  ariaLabel = "Dialog",
}) => {
  useEffect(() => {
    if (!open) return;
    function handleEsc(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        role="document"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default HFModal;
