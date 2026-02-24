import type { ReactNode, HTMLAttributes, ElementType } from "react";
import { Box } from "./Box";
import { Typography } from "./Typography";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  variant?: "outlined" | "elevation";
  as?: ElementType;
  component?: ElementType;
};

export function Card({ className = "", style, children, as, component, ...rest }: CardProps) {
  const Component = component ?? as ?? "div";
  return (
    <Box
      component={Component}
      className={`ui-card ${className}`.trim()}
      style={{ borderRadius: 8, border: "1px solid", borderColor: "var(--border)", backgroundColor: "var(--card)", ...(style as object) }}
      {...rest}
    >
      {children}
    </Box>
  );
}

export function CardContent({ className = "", style, children, ...rest }: CardProps) {
  return (
    <Box className={`ui-card-content ${className}`.trim()} style={{ paddingTop: 16, ...(style as object) }} {...rest}>
      {children}
    </Box>
  );
}

type CardWithTitleProps = CardProps & {
  title?: ReactNode;
  titleClassName?: string;
};

export function CardWithTitle({ title, titleClassName = "", children, style, ...rest }: CardWithTitleProps) {
  return (
    <Card style={style} {...rest}>
      {title && (
        <Typography component="h2" variant="h6" className={titleClassName} style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16 }}>
          {title}
        </Typography>
      )}
      <CardContent style={{ paddingTop: title ? 8 : 16 }}>{children}</CardContent>
    </Card>
  );
}
