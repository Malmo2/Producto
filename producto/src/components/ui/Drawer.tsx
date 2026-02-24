import type { ReactNode } from "react";
import { useEffect } from "react";

type DrawerProps = {
  variant?: "temporary" | "permanent";
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ModalProps?: { keepMounted?: boolean };
  style?: React.CSSProperties;
};

export function Drawer({ variant = "temporary", open, onClose, children, style }: DrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={`ui-drawer-backdrop ${open ? "ui-drawer-backdrop-open" : ""}`}
        onClick={onClose}
        role="presentation"
        aria-hidden
      />
      <aside
        className={`ui-drawer ${open ? "ui-drawer-open" : ""}`}
        style={style || {}}
      >
        {children}
      </aside>
    </>
  );
}
