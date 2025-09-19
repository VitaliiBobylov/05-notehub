import { useEffect, type ReactNode } from "react";
import ReactDOM from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return ReactDOM.createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={css.modal}>
        <button type="button" className={css.closeBtn} onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
