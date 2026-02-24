import type { ReactNode, HTMLAttributes } from "react";
import { Box } from "./Box";

type PaperProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  component?: keyof JSX.IntrinsicElements;
  elevation?: number;
  variant?: "outlined" | "elevation";
};

export function Paper({ component, className = "", style, ...rest }: PaperProps) {
  return (
    <Box
      component={component || "div"}
      className={`ui-paper ${className}`.trim()}
      style={{ padding: 16, ...(style as object) }}
      {...rest}
    />
  );
}
