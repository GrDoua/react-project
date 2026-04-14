import { useState } from 'react';
import { 
  User, Briefcase, Send, Calendar, Heart, Star, Settings, FileText,
  TrendingUp, LogOut, MapPin, Clock, DollarSign, Upload, Camera, Save,
  X, CheckCircle, AlertCircle, Key
} from "lucide-react";
import { Download, FilePlus } from "lucide-react";
import { GenerateurCV } from "../Components/GenerateurCV";

export function DashboardEtudiant({ etudiant, offres, candidatures, onPostuler, onLogout, onUpdateProfil, onChangePassword }) {
  const [activeMenu, setActiveMenu] = useState("profil");
  const [recherche, setRecherche] = useState("");
  const [typeStage, setTypeStage] = useState("Tous");
  const [ville, setVille] = useState("Tous");
  const [favoris, setFavoris] = useState({});
  const [showGenerateurCV, setShowGenerateurCV] = useState(false);
  const [savedCV, setSavedCV] = useState(null);
  
  // États pour la modification du profil
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: etudiant?.nom || "",
    email: etudiant?.email || "",
    filiere: etudiant?.filiere || "",
    universite: etudiant?.universite || "",
    competences: etudiant?.competences?.join(", ") || "",
    telephone: etudiant?.telephone || "",
    adresse: etudiant?.adresse || "",
    bio: etudiant?.bio || ""
  });
  
  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // États pour le CV
  const [cvName, setCvName] = useState(etudiant?.cvName || "");
  
  // États pour la photo de profil
  const [photoPreview, setPhotoPreview] = useState(etudiant?.profilePhoto || null);
  
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  // Vérification que les données existent
  if (!etudiant) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  const mesCandidatures = candidatures?.filter(c => c.etudiantId === etudiant.id) || [];
  const offresDisponibles = offres?.filter(o => o.statut === "active" && !mesCandidatures.some(c => c.offreId === o.id)) || [];
  
  // Fonction pour ajouter/retirer des favoris
  const toggleFavori = (offreId) => {
    setFavoris(prev => ({
      ...prev,
      [offreId]: !prev[offreId]
    }));
    const isFavori = !favoris[offreId];
    showMessage(isFavori ? "❤️ Offre ajoutée à vos favoris !" : "💔 Offre retirée des favoris", "success");
  };
  
  const offresFavoris = offres?.filter(o => favoris[o.id]) || [];
  
  const offresFiltrees = offresDisponibles.filter(offre => {
    const matchRecherche = offre.titre?.toLowerCase().includes(recherche.toLowerCase()) || offre.entreprise?.toLowerCase().includes(recherche.toLowerCase());
    const matchType = typeStage === "Tous" || offre.type === typeStage;
    const matchVille = ville === "Tous" || offre.lieu === ville;
    return matchRecherche && matchType && matchVille;
  });

  // Fonction pour afficher les notifications
  const showMessage = (message, type = "success") => {
    setNotificationMsg(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  const handleSaveCV = (cvData) => {
    setSavedCV(cvData);
    showMessage("✅ CV généré et sauvegardé avec succès!", "success");
  };

  // Gestionnaire de modification du profil
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfil = () => {
    if (!onUpdateProfil) return;
    
    const updatedEtudiant = {
      ...etudiant,
      ...formData,
      competences: formData.competences.split(",").map(c => c.trim()),
      profilePhoto: photoPreview,
      cvName: cvName
    };
    onUpdateProfil(updatedEtudiant);
    setIsEditing(false);
    showMessage("✅ Profil mis à jour avec succès !", "success");
  };

  // Gestionnaire pour le changement de mot de passe
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (passwordErrors[e.target.name]) {
      setPasswordErrors({ ...passwordErrors, [e.target.name]: "" });
    }
  };

  const validatePassword = () => {
    let errors = {};
    
    if (!passwordData.ancienMotDePasse) {
      errors.ancienMotDePasse = "L'ancien mot de passe est requis";
    }
    
    if (!passwordData.nouveauMotDePasse) {
      errors.nouveauMotDePasse = "Le nouveau mot de passe est requis";
    } else if (passwordData.nouveauMotDePasse.length < 6) {
      errors.nouveauMotDePasse = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (!passwordData.confirmerMotDePasse) {
      errors.confirmerMotDePasse = "Veuillez confirmer le mot de passe";
    } else if (passwordData.nouveauMotDePasse !== passwordData.confirmerMotDePasse) {
      errors.confirmerMotDePasse = "Les mots de passe ne correspondent pas";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitPasswordChange = () => {
    if (validatePassword()) {
      if (passwordData.ancienMotDePasse !== etudiant.password) {
        showMessage("❌ L'ancien mot de passe est incorrect", "error");
        return;
      }
      
      if (onChangePassword) {
        onChangePassword(etudiant.id, passwordData.nouveauMotDePasse);
      }
      
      setPasswordData({
        ancienMotDePasse: "",
        nouveauMotDePasse: "",
        confirmerMotDePasse: ""
      });
      setPasswordErrors({});
      showMessage("✅ Mot de passe changé avec succès !", "success");
    }
  };

  // Gestionnaire pour la photo de profil
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showMessage("❌ Veuillez sélectionner une image valide", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showMessage("❌ L'image ne doit pas dépasser 5MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        showMessage("✅ Photo de profil mise à jour !", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestionnaire pour le CV
  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        showMessage("❌ Format non supporté (PDF, DOC, DOCX uniquement)", "error");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showMessage("❌ Le fichier ne doit pas dépasser 10MB", "error");
        return;
      }
      setCvName(file.name);
      showMessage(`✅ CV "${file.name}" téléchargé !`, "success");
    }
  };

  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "offres", label: "Liste des offres", icon: <Briefcase size={18} /> },
    { id: "mesCandidatures", label: "Mes candidatures", icon: <Send size={18} /> },
    { id: "mesStages", label: "Mes stages", icon: <Calendar size={18} /> },
    { id: "favoris", label: "Mes favoris", icon: <Heart size={18} /> },
    { id: "evaluations", label: "Mes évaluations", icon: <Star size={18} /> },
    { id: "changePassword", label: "Changer mot de passe", icon: <Key size={18} /> },
    { id: "aide", label: "Conditions & Aide", icon: <FileText size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50">
          <div className={`${notificationType === "success" ? "bg-emerald-500" : "bg-rose-400"} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
            {notificationType === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{notificationMsg}</span>
          </div>
        </div>
      )}

      {/* Sidebar - Soft gray */}
      <div className="w-64 bg-gray-800 text-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Stage.io</h1>
          </div>
          <p className="text-gray-400 text-sm mt-2">{etudiant.nom}</p>
          <p className="text-emerald-400 text-xs">{etudiant.filiere}</p>
        </div>
        <nav className="p-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-300 ${
                activeMenu === item.id ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mt-4 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all duration-300"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{menuItems.find(m => m.id === activeMenu)?.label}</h2>
          <div className="flex items-center gap-3">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400" />
            ) : (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-500" />
              </div>
            )}
            <span className="text-gray-700">{etudiant.nom}</span>
          </div>
        </div>

        <div className="p-6">
          {/* PROFIL */}
          {activeMenu === "profil" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="h-32 bg-gradient-to-r from-gray-600 to-gray-700 relative">
                  <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Photo" className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white" />
                      ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                          <User size={40} className="text-gray-400" />
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600">
                        <Camera size={14} className="text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{etudiant.nom}</h3>
                      <p className="text-gray-500">{etudiant.email}</p>
                    </div>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2">
                        <Settings size={16} /> Modifier
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSaveProfil} className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-2">
                          <Save size={16} /> Enregistrer
                        </button>
                        <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2">
                          <X size={16} /> Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User size={20} className="text-emerald-500" />
                  Informations personnelles
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    {isEditing ? (
                      <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                    ) : (
                      <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{etudiant.nom}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                    ) : (
                      <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{etudiant.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    {isEditing ? (
                      <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} placeholder="+213 XX XXX XXXX" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                    ) : (
                      <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{formData.telephone || "Non renseigné"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    {isEditing ? (
                      <input type="text" name="adresse" value={formData.adresse} onChange={handleInputChange} placeholder="Ville, pays" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                    ) : (
                      <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{formData.adresse || "Non renseignée"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                    {isEditing ? (
                      <input type="text" name="filiere" value={formData.filiere} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                    ) : (
                      <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{etudiant.filiere}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Université</label>
                    {isEditing ? (
                      <input type="text" name="universite" value={formData.universite} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                    ) : (
                      <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{etudiant.universite}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compétences</label>
                    {isEditing ? (
                      <input type="text" name="competences" value={formData.competences} onChange={handleInputChange} placeholder="React, Python, JavaScript" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                    ) : (
                      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                        {etudiant.competences?.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" placeholder="Parlez de vous..." className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                    ) : (
                      <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{formData.bio || "Aucune présentation"}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-emerald-500" />
                  Curriculum Vitae (CV)
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Téléchargez votre CV</p>
                  <p className="text-sm text-gray-500 mb-4">Formats acceptés : PDF, DOC, DOCX (Max 10MB)</p>
                  <label className="bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition inline-flex items-center gap-2">
                    <Upload size={16} /> Choisir un fichier
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCVUpload} />
                  </label>
                  {cvName && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-emerald-500" />
                        <span className="text-sm text-gray-700">{cvName}</span>
                      </div>
                      <CheckCircle size={20} className="text-emerald-500" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setShowGenerateurCV(true)}
                    className="w-full bg-emerald-500 text-white px-4 py-3 rounded-lg hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                  >
                    <FilePlus size={20} />
                    Créer / Modifier mon CV
                  </button>
                </div>
                {savedCV && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">✅ CV sauvegardé</h4>
                    <p className="text-sm text-gray-600">Dernière modification: {savedCV.dateCreation}</p>
                    <button className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1">
                      <Download size={14} /> Télécharger le CV
                    </button>
                  </div>
                )}
              </div>
              {showGenerateurCV && (
                <GenerateurCV
                  etudiant={etudiant}
                  onSave={handleSaveCV}
                  onClose={() => setShowGenerateurCV(false)}
                />
              )}
            </div>
          )}

          {/* LISTE DES OFFRES - AVEC BOUTON J'ADORE ❤️ */}
          {activeMenu === "offres" && (
            <div>
              <div className="flex gap-4 mb-6 flex-wrap">
                <input type="text" placeholder="Rechercher..." value={recherche} onChange={(e) => setRecherche(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                <select value={typeStage} onChange={(e) => setTypeStage(e.target.value)} className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400">
                  <option>Tous</option><option>Stage PFE</option><option>Stage</option>
                </select>
                <select value={ville} onChange={(e) => setVille(e.target.value)} className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400">
                  <option>Tous</option><option>Alger</option><option>Oran</option><option>Constantine</option>
                </select>
              </div>
              {offresFiltrees.length > 0 ? (
                offresFiltrees.map(offre => (
                  <div key={offre.id} className="bg-white rounded-xl p-4 shadow-sm mb-4 border-l-4 border-emerald-400 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{offre.titre}</h3>
                        <p className="text-gray-600">{offre.entreprise}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span><MapPin size={14} className="inline" /> {offre.lieu}</span>
                          <span><Clock size={14} className="inline" /> {offre.duree}</span>
                          <span className="text-emerald-600 font-semibold"><DollarSign size={14} className="inline" /> {offre.salaire}</span>
                        </div>
                        {offre.description && (
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{offre.description}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {offre.competences?.slice(0, 3).map((s, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{s}</span>
                          ))}
                          {offre.competences?.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">+{offre.competences.length - 3}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button 
                          onClick={() => toggleFavori(offre.id)} 
                          className={`p-2 rounded-full transition-all duration-300 ${
                            favoris[offre.id] 
                              ? "bg-rose-500 text-white hover:bg-rose-600" 
                              : "bg-gray-100 text-gray-400 hover:bg-rose-100 hover:text-rose-500"
                          }`}
                          title={favoris[offre.id] ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          <Heart size={20} fill={favoris[offre.id] ? "white" : "none"} />
                        </button>
                        <button 
                          onClick={() => onPostuler(offre)} 
                          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition whitespace-nowrap"
                        >
                          Postuler
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <p className="text-gray-500">Aucune offre trouvée</p>
                </div>
              )}
            </div>
          )}

          {/* MES CANDIDATURES */}
          {activeMenu === "mesCandidatures" && (
            <div>
              {mesCandidatures.length > 0 ? (
                mesCandidatures.map(c => (
                  <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm mb-4 border-l-4 border-emerald-400">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-800">{c.offreTitre}</h4>
                        <p className="text-gray-500 text-sm">Postulé le {c.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.statut === "acceptee" ? "bg-emerald-100 text-emerald-700" : 
                        c.statut === "refusee" ? "bg-rose-100 text-rose-600" : 
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {c.statut === "acceptee" ? "Acceptée" : c.statut === "refusee" ? "Refusée" : "En attente"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <p className="text-gray-500">Aucune candidature</p>
                </div>
              )}
            </div>
          )}

          {/* MES FAVORIS */}
          {activeMenu === "favoris" && (
            <div>
              {offresFavoris.length > 0 ? (
                offresFavoris.map(offre => (
                  <div key={offre.id} className="bg-white rounded-xl p-4 shadow-sm mb-4 border-l-4 border-rose-400">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{offre.titre}</h4>
                        <p className="text-gray-600">{offre.entreprise}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span><MapPin size={14} className="inline" /> {offre.lieu}</span>
                          <span><Clock size={14} className="inline" /> {offre.duree}</span>
                          <span className="text-emerald-600 font-semibold"><DollarSign size={14} className="inline" /> {offre.salaire}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button 
                          onClick={() => toggleFavori(offre.id)} 
                          className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
                          title="Retirer des favoris"
                        >
                          <Heart size={20} fill="white" />
                        </button>
                        <button 
                          onClick={() => onPostuler(offre)} 
                          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
                        >
                          Postuler
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <p className="text-gray-500">Aucun favori</p>
                  <button 
                    onClick={() => setActiveMenu("offres")} 
                    className="mt-3 text-emerald-600 hover:text-emerald-700"
                  >
                    Découvrir des offres →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MES STAGES */}
          {activeMenu === "mesStages" && (
            <div className="bg-white rounded-xl p-12 text-center text-gray-500">
              <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
              <p>Mes stages apparaîtront ici</p>
            </div>
          )}

          {/* ÉVALUATIONS */}
          {activeMenu === "evaluations" && (
            <div className="bg-white rounded-xl p-12 text-center text-gray-500">
              <Star size={48} className="mx-auto text-gray-300 mb-3" />
              <p>Évaluations à venir</p>
            </div>
          )}

          {/* CHANGER MOT DE PASSE */}
          {activeMenu === "changePassword" && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Changer le mot de passe</h3>
                  <p className="text-gray-500 text-sm mt-2">Sécurisez votre compte avec un nouveau mot de passe</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
                    <input
                      type="password"
                      name="ancienMotDePasse"
                      value={passwordData.ancienMotDePasse}
                      onChange={handlePasswordChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    {passwordErrors.ancienMotDePasse && (
                      <p className="text-rose-500 text-xs mt-1">{passwordErrors.ancienMotDePasse}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      name="nouveauMotDePasse"
                      value={passwordData.nouveauMotDePasse}
                      onChange={handlePasswordChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
                      placeholder="Minimum 6 caractères"
                    />
                    {passwordErrors.nouveauMotDePasse && (
                      <p className="text-rose-500 text-xs mt-1">{passwordErrors.nouveauMotDePasse}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      name="confirmerMotDePasse"
                      value={passwordData.confirmerMotDePasse}
                      onChange={handlePasswordChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
                      placeholder="Retapez votre nouveau mot de passe"
                    />
                    {passwordErrors.confirmerMotDePasse && (
                      <p className="text-rose-500 text-xs mt-1">{passwordErrors.confirmerMotDePasse}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSubmitPasswordChange}
                      className="flex-1 bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition"
                    >
                      Changer le mot de passe
                    </button>
                    <button
                      onClick={() => {
                        setPasswordData({
                          ancienMotDePasse: "",
                          nouveauMotDePasse: "",
                          confirmerMotDePasse: ""
                        });
                        setPasswordErrors({});
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AIDE */}
          {activeMenu === "aide" && (
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Centre d'aide</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700">📝 Comment postuler ?</p>
                  <p className="text-gray-600 text-sm">Cliquez sur "Postuler" sur l'offre qui vous intéresse</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700">❤️ Comment ajouter une offre en favori ?</p>
                  <p className="text-gray-600 text-sm">Cliquez sur le cœur ❤️ à côté de l'offre pour la sauvegarder</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700">📄 Comment télécharger mon CV ?</p>
                  <p className="text-gray-600 text-sm">Allez dans "Mon profil" → Section CV</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700">🔒 Comment changer mon mot de passe ?</p>
                  <p className="text-gray-600 text-sm">Allez dans "Changer mot de passe"</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                  <p className="font-semibold text-emerald-700">📧 Besoin d'aide ?</p>
                  <p className="text-gray-600 text-sm">Contactez-nous : support@stageio.dz</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

