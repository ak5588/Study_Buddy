const Card = ({ title, children, className = "" }) => {
  return (
    <div className={`border rounded-lg p-4 shadow bg-white ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;