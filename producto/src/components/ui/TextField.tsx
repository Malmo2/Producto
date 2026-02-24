import type { InputHTMLAttributes } from "react";
import { Box } from "./Box";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  margin?: "none" | "normal";
  InputLabelProps?: Record<string, unknown>;
  inputProps?: Record<string, unknown>;
  wrapperStyle?: React.CSSProperties;
};

export function TextField({
  label,
  error,
  helperText,
  fullWidth = true,
  size = "medium",
  id,
  InputLabelProps,
  inputProps,
  style,
  wrapperStyle,
  className = "",
  ...rest
}: TextFieldProps) {
  const inputId = id || `textfield-${Math.random().toString(36).slice(2)}`;
  const isSmall = size === "small";

  return (
    <Box className="ui-textfield-wrap" style={wrapperStyle}>
      {label && (
        <label htmlFor={inputId} className="ui-textfield-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`ui-textfield ${isSmall ? "ui-textfield-small" : ""} ${error ? "ui-textfield-error" : ""} ${className}`.trim()}
        style={style}
        {...inputProps}
        {...rest}
      />
      {helperText && (
        <span className={`ui-textfield-helper ${error ? "ui-textfield-helper-error" : ""}`}>
          {helperText}
        </span>
      )}
    </Box>
  );
}
