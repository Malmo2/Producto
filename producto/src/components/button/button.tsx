import "../button/button.css";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "login" | "secondary" | "purple";
};

function Button({ children, variant = "primary", ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
