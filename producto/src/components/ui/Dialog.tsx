import type { ReactNode } from "react";
import { useEffect } from "react";
import { Box } from "./Box";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md";
  fullWidth?: boolean;
};

export function Dialog({ open, onClose, children, maxWidth = "xs", fullWidth }: DialogProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ui-dialog-backdrop" onClick={onClose} role="presentation">
      <div
        className="ui-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

export function DialogTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ui-dialog-title ${className}`.trim()}>{children}</div>;
}

export function DialogContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ui-dialog-content ${className}`.trim()}>{children}</div>;
}

export function DialogActions({ children, style, className = "" }: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <Box className={`ui-dialog-actions ${className}`.trim()} style={style}>
      {children}
    </Box>
  );
}
