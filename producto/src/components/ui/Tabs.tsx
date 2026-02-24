import type { ReactNode } from "react";

type TabProps = {
  label: string;
  value?: number;
};

export function Tab({ label }: TabProps) {
  return <>{label}</>;
}

type TabsProps = {
  value: number;
  onChange: (_: unknown, v: number) => void;
  children: ReactNode;
};

export function Tabs({ value, onChange, children }: TabsProps) {
  const childArray = Array.isArray(children) ? children : [children];
  return (
    <div className="ui-tabs">
      {childArray.map((child, i) => {
        if (typeof child === "object" && child && "props" in child && typeof child.props === "object" && child.props && "label" in child.props) {
          const label = (child.props as { label: string }).label;
          return (
            <button
              key={i}
              type="button"
              className={`ui-tab ${value === i ? "ui-tab-active" : ""}`}
              onClick={() => onChange(null, i)}
            >
              {label}
            </button>
          );
        }
        return null;
      })}
    </div>
  );
}
