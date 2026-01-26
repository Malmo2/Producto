function Card({
  title,
  style,
  children,
  className = "",
  titleClassName = "",
  as: Component = "div",
  ...rest
}) {
  return (
    <Component className={className} style={style} {...rest}>
      {title ? <h2 className={titleClassName}>{title}</h2> : null}
      <div>{children}</div>
    </Component>
  );
}



export default Card;
