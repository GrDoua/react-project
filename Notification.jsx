import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from "lucide-react";

export function Notification({ message, onClose, type = "success" }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";
  
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        {type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span>{message}</span>
        <button onClick={onClose} className="hover:opacity-70">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}