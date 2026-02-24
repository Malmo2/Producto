import type { ReactNode } from "react";
import { Box } from "./Box";

type ListProps = {
  children: ReactNode;
  dense?: boolean;
  style?: React.CSSProperties;
};

export function List({ children, dense, style }: ListProps) {
  return (
    <Box component="ul" className="ui-list" style={{ padding: 0, ...(dense && { paddingTop: 4, paddingBottom: 4 }), ...style }}>
      {children}
    </Box>
  );
}

type ListItemProps = {
  children: ReactNode;
  secondaryAction?: ReactNode;
  disablePadding?: boolean;
  style?: React.CSSProperties;
};

export function ListItem({ children, secondaryAction, style }: ListItemProps) {
  return (
    <Box component="li" className="ui-list-item" style={style}>
      <div style={{ flex: 1 }}>{children}</div>
      {secondaryAction}
    </Box>
  );
}

type ListItemTextProps = {
  primary?: ReactNode;
  secondary?: ReactNode;
};

export function ListItemText({ primary, secondary }: ListItemTextProps) {
  return (
    <div>
      <div className="ui-list-item-text-primary">{primary}</div>
      {secondary != null && <div className="ui-list-item-text-secondary">{secondary}</div>}
    </div>
  );
}
