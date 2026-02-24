import type { InputHTMLAttributes } from "react";

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color?: "primary";
  inputProps?: Record<string, unknown>;
};

export function Switch({ checked, onChange, inputProps, id, ...rest }: SwitchProps) {
  const switchId = id || `switch-${Math.random().toString(36).slice(2)}`;
  return (
    <label htmlFor={switchId} className={`ui-switch-wrap ${rest.className || ""}`} style={{ cursor: "pointer", position: "relative" }}>
      <div className={`ui-switch ${checked ? "ui-switch-checked" : ""}`}>
        <div className="ui-switch-thumb" />
      </div>
      <input
        id={switchId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...inputProps}
        style={{ position: "absolute", opacity: 0, inset: 0, width: "100%", height: "100%", margin: 0, cursor: "pointer" }}
      />
    </label>
  );
}
