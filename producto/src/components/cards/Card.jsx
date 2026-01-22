function Card({ children, onClick }) {
  return (
    <div onClick={onClick} style={{ border: 'none', background: 'none', padding: 0 }}>
      {children}
    </div>
  );
}

export default Card;
