import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  titleClassName?: string | undefined;
  children: React.ReactNode;
};

function Card({
  title,
  titleClassName = "",
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div className={className} {...rest}>
      {title ? <h2 className={titleClassName}>{title}</h2> : null}
      <div>{children}</div>
    </div>
  );
}

export default Card;
