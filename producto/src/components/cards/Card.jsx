function Card({ children, onClick}) {
  return (
    <button onClick={onClick}
    
    >
      {children}
    </button>
  );
}

export default Card;
