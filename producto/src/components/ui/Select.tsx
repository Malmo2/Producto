import type { SelectHTMLAttributes, ReactNode } from "react";
import { Box } from "./Box";

type SelectOptionProps = { value: string; children: ReactNode };

export function SelectOption({ value, children }: SelectOptionProps) {
  return <option value={value}>{children}</option>;
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  size?: "small" | "medium";
};

export function Select({ label, value, onChange, children, size, style, className = "", ...rest }: SelectProps) {
  return (
    <Box className="ui-select-wrap" style={style}>
      {label && <label className="ui-select-label">{label}</label>}
      <select
        className={`ui-select ${className}`.trim()}
        value={value}
        onChange={onChange}
        style={style}
        {...rest}
      >
        {children}
      </select>
    </Box>
  );
}
