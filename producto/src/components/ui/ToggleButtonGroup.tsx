import { Children, type ReactNode } from "react";

type ToggleButtonGroupProps = {
  value: number | string;
  exclusive?: boolean;
  onChange: (_: unknown, newVal: number | string | null) => void;
  children: ReactNode;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

export function ToggleButtonGroup({
  value,
  exclusive = true,
  onChange,
  children,
  style,
  ariaLabel,
}: ToggleButtonGroupProps) {
  return (
    <div
      className="ui-toggle-group"
      style={style || {}}
      role={exclusive ? "radiogroup" : "group"}
      aria-label={ariaLabel}
    >
      {Children.toArray(children).map((child, i) => {
        if (typeof child === "object" && child && "props" in child) {
          const props = (child as React.ReactElement).props;
          const childValue = props.value;
          const isSelected = value === childValue;
          return (
            <button
              key={i}
              type="button"
              className={`ui-toggle-btn ${isSelected ? "ui-toggle-btn-selected" : ""}`}
              onClick={() => onChange(null, childValue)}
              role={exclusive ? "radio" : undefined}
              aria-checked={exclusive ? isSelected : undefined}
              aria-pressed={exclusive ? undefined : isSelected}
            >
              {props.children}
            </button>
          );
        }
        return child;
      })}
    </div>
  );
}

export function ToggleButton({ value, children }: { value: number | string; children: ReactNode }) {
  return <>{children}</>;
}
