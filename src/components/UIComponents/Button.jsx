export const Button = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded text-white bg-[#27272a] hover:bg-[#3f3f46] ${className}`}
    >
      {children}
    </button>
  );
};