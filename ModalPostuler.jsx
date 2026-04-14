import { useState } from 'react';
import { X } from "lucide-react";

export function ModalPostuler({ offre, onClose, onEnvoyer, isLoggedIn, onOpenAuth }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!nom.trim()) newErrors.nom = "Nom obligatoire";
    if (!email.trim()) {
      newErrors.email = "Email obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      onClose();        // Fermer modal postuler
      onOpenAuth();     // Ouvrir modal connexion/inscription
      return;
    }
    
    if (validate()) {
      onEnvoyer(offre.titre);
      onClose();
    }
  };
  
  // Si utilisateur pas connecté → afficher formulaire connexion/inscription directement
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-xl max-w-md w-full transform transition-all duration-300">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-lg">Connexion requise</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-medium mb-2">
                🔐 Vous devez être connecté pour postuler
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Veuillez vous connecter ou créer un compte
              </p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Se connecter / S'inscrire
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Si utilisateur connecté → afficher formulaire candidature
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-md w-full transform transition-all duration-300 hover:scale-105">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Postuler à {offre.titre}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Votre nom complet" 
              className={`w-full p-2 border rounded-lg ${errors.nom ? "border-red-500" : ""}`} 
              value={nom} 
              onChange={(e) => setNom(e.target.value)} 
            />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Votre email" 
              className={`w-full p-2 border rounded-lg ${errors.email ? "border-red-500" : ""}`} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transform transition-all duration-300 hover:scale-105">
            Envoyer ma candidature
          </button>
        </form>
      </div>
    </div>
  );
}