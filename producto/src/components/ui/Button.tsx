import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "contained"
  | "outlined"
  | "primary"
  | "secondary"
  | "login"
  | "logoutButton";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
};

const variantToClass: Record<ButtonVariant, string> = {
  contained: "ui-btn-contained",
  outlined: "ui-btn-outlined",
  primary: "ui-btn-contained",
  secondary: "ui-btn-outlined",
  login: "ui-btn-login",
  logoutButton: "ui-btn-logoutButton",
};

export function Button({
  children,
  variant = "contained",
  size = "medium",
  fullWidth,
  className = "",
  style,
  ...rest
}: ButtonProps) {
  let cls = "ui-btn";
  cls += " " + (variantToClass[variant] ?? "ui-btn-contained");
  if (size === "small") cls += " ui-btn-small";
  if (fullWidth || variant === "login" || variant === "logoutButton")
    cls += " ui-btn-fullWidth";

  const mergedStyle: React.CSSProperties = { ...(style as object) };
  if (fullWidth || variant === "login" || variant === "logoutButton")
    mergedStyle.width = "100%";

  return (
    <button type="button" className={`${cls} ${className}`.trim()} style={mergedStyle} {...rest}>
      {children}
    </button>
  );
}
