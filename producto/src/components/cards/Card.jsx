function Card({ children, style = {} }) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '1rem',
        maxWidth: '300px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
