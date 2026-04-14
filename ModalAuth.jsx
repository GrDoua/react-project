import { useState } from 'react';
import { X, Eye, EyeOff } from "lucide-react"; // 👈 Zid Eye w EyeOff

export function ModalAuth({ type, onClose, onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [role, setRole] = useState("etudiant");
  const [filiere, setFiliere] = useState("");
  const [universite, setUniversite] = useState("");
  const [secteur, setSecteur] = useState("");
  const [competences, setCompetences] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // 👈 Ajout state pour afficher/masquer mot de passe
  const [currentType, setCurrentType] = useState(type);

  const validateLogin = () => {
    let newErrors = {};
    if (!email.trim()) newErrors.email = "Email obligatoire";
    if (!password.trim()) newErrors.password = "Mot de passe obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    let newErrors = {};
    if (!nom.trim()) newErrors.nom = "Nom obligatoire";
    if (!email.trim()) {
      newErrors.email = "Email obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email invalide";
    }
    if (!password.trim() || password.length < 6) newErrors.password = "Mot de passe (min 6 caractères)";
    if (role === "etudiant") {
      if (!filiere.trim()) newErrors.filiere = "Filière obligatoire";
      if (!universite.trim()) newErrors.universite = "Université obligatoire";
    }
    if (role === "entreprise") {
      if (!secteur.trim()) newErrors.secteur = "Secteur obligatoire";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentType === "login") {
      if (validateLogin()) onLogin(email, password);
    } else {
      if (validateRegister()) {
        const userData = { nom, email, password, role };
        if (role === "etudiant") {
          userData.filiere = filiere;
          userData.universite = universite;
          userData.competences = competences.split(",").map(c => c.trim());
        }
        if (role === "entreprise") {
          userData.secteur = secteur;
        }
        onRegister(userData);
      }
    }
  };

  const switchToRegister = () => {
    setCurrentType("register");
    setErrors({});
  };

  const switchToLogin = () => {
    setCurrentType("login");
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full transform transition-all duration-300">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">{currentType === "login" ? "Connexion" : "Inscription"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {currentType === "register" && (
            <>
              <input type="text" placeholder="Nom complet" value={nom} onChange={(e) => setNom(e.target.value)} className={`w-full p-2 border rounded-lg ${errors.nom ? "border-red-500" : ""}`} />
              {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
              
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="etudiant">Étudiant</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </>
          )}
          
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full p-2 border rounded-lg ${errors.email ? "border-red-500" : ""}`} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          
          {/* 👇 Champ mot de passe avec bouton pour afficher/masquer */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mot de passe" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={`w-full p-2 border rounded-lg pr-10 ${errors.password ? "border-red-500" : ""}`} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          
          {currentType === "register" && role === "etudiant" && (
            <>
              <input type="text" placeholder="Filière" value={filiere} onChange={(e) => setFiliere(e.target.value)} className={`w-full p-2 border rounded-lg ${errors.filiere ? "border-red-500" : ""}`} />
              {errors.filiere && <p className="text-red-500 text-sm">{errors.filiere}</p>}
              <input type="text" placeholder="Université" value={universite} onChange={(e) => setUniversite(e.target.value)} className={`w-full p-2 border rounded-lg ${errors.universite ? "border-red-500" : ""}`} />
              {errors.universite && <p className="text-red-500 text-sm">{errors.universite}</p>}
              <input type="text" placeholder="Compétences (React, Python, ...)" value={competences} onChange={(e) => setCompetences(e.target.value)} className="w-full p-2 border rounded-lg" />
            </>
          )}
          
          {currentType === "register" && role === "entreprise" && (
            <>
              <input type="text" placeholder="Secteur d'activité" value={secteur} onChange={(e) => setSecteur(e.target.value)} className={`w-full p-2 border rounded-lg ${errors.secteur ? "border-red-500" : ""}`} />
              {errors.secteur && <p className="text-red-500 text-sm">{errors.secteur}</p>}
            </>
          )}
          
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            {currentType === "login" ? "Se connecter" : "S'inscrire"}
          </button>

          {currentType === "login" && (
            <div className="text-center mt-2 pt-2 border-t">
              <p className="text-gray-600 text-sm">
                Vous n'avez pas de compte ?{" "}
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none"
                >
                  Inscrivez-vous
                </button>
              </p>
            </div>
          )}

          {currentType === "register" && (
            <div className="text-center mt-2 pt-2 border-t">
              <p className="text-gray-600 text-sm">
                Vous avez déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none"
                >
                  Connectez-vous
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}