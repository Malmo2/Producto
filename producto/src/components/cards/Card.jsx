function Card({ title, children, className = "", titleClassName = "", as: Component = "div", ...rest }) {
  return (
    <Component className={className} {...rest}>
      {title ? <h2 className={titleClassName}>{title}</h2> : null}
      <div>{children}</div>
    </Component>
  );
}

export default Card;
