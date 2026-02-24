import type { ReactNode, HTMLAttributes } from "react";

type Variant = "h2" | "h3" | "h5" | "h6" | "subtitle1" | "body1" | "body2" | "caption";

type TypographyProps = Omit<HTMLAttributes<HTMLElement>, "color"> & {
  children?: ReactNode;
  component?: keyof JSX.IntrinsicElements;
  variant?: Variant;
  color?: "text" | "muted" | "accent" | "error" | "success";
  gutterBottom?: boolean;
  textAlign?: React.CSSProperties["textAlign"];
  fontWeight?: number | string;
  fontStyle?: React.CSSProperties["fontStyle"];
};

const variantMap: Record<Variant, string> = {
  h2: "ui-typography ui-typography-h2",
  h3: "ui-typography ui-typography-h3",
  h5: "ui-typography ui-typography-h5",
  h6: "ui-typography ui-typography-h6",
  subtitle1: "ui-typography ui-typography-subtitle1",
  body1: "ui-typography ui-typography-body1",
  body2: "ui-typography ui-typography-body2",
  caption: "ui-typography ui-typography-caption",
};

export function Typography({
  component: Component = "p",
  variant = "body1",
  color,
  gutterBottom,
  style,
  className = "",
  ...rest
}: TypographyProps) {
  let cls = variantMap[variant] || "ui-typography ui-typography-body1";
  const c = String(color || "");
  if (c === "text.secondary" || c === "muted") cls += " ui-typography-muted";
  else if (c === "primary" || c === "primary.main" || c === "accent") cls += " ui-typography-accent";
  else if (c === "error") cls += " ui-typography-error";
  else if (c === "success" || c === "success.main") cls += " ui-typography-success";
  if (gutterBottom) cls += " ui-typography-gutter";

  return <Component className={`${cls} ${className}`.trim()} style={style} {...rest} />;
}
