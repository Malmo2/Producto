import type { ReactNode, ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  size?: "small" | "medium";
  edge?: "start" | "end";
  color?: "default" | "error";
};

export function IconButton({
  children,
  size = "medium",
  color = "default",
  className = "",
  style,
  ...rest
}: IconButtonProps) {
  let cls = "ui-icon-btn";
  if (size === "small") cls += " ui-icon-btn-small";
  if (color === "error") cls += " ui-icon-btn-error";

  return (
    <button type="button" className={`${cls} ${className}`.trim()} style={style} {...rest} aria-label={rest["aria-label"]}>
      {children}
    </button>
  );
}
