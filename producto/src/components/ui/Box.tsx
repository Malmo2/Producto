import type { ReactNode, HTMLAttributes, ElementType } from "react";

type BoxProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  component?: ElementType;
};

export function Box({ component: Component = "div", style, className, ...rest }: BoxProps) {
  return <Component style={style} className={className} {...rest} />;
}
