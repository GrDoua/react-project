import { useState } from 'react';
import { 
  Briefcase, Users, BarChart3, Building, TrendingUp, Calendar,
  LogOut, Plus, Trash2, User, Key, Save, Edit2, X, CheckCircle, Clock
} from "lucide-react";

export function DashboardEntreprise({ entreprise, offres, candidatures, onAjouterOffre, onSupprimerOffre, onLogout, onUpdateProfil, onChangePassword }) {
  const [activeMenu, setActiveMenu] = useState("profil");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  
  // États pour le profil de l'entreprise
  const [isEditing, setIsEditing] = useState(false);
  const [entrepriseProfil, setEntrepriseProfil] = useState({
    nom: entreprise?.nom || "",
    email: entreprise?.email || "",
    secteur: entreprise?.secteur || "",
    description: entreprise?.description || "",
    telephone: entreprise?.telephone || "+213 5XX XX XX XX",
    adresse: entreprise?.adresse || "Alger, Algérie"
  });
  const [logoPreview, setLogoPreview] = useState(entreprise?.logo || null);
  
  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  const [newOffre, setNewOffre] = useState({ 
    titre: "", 
    lieu: "Alger", 
    duree: "6 mois", 
    type: "Stage PFE", 
    salaire: "", 
    description: "",
    dateCreation: "",
    dateFin: "",
    periode: ""
  });
  const [competenceInput, setCompetenceInput] = useState("");

  const mesOffres = offres.filter(o => o.entrepriseId === entreprise.id);
  const mesCandidatures = candidatures.filter(c => mesOffres.some(o => o.id === c.offreId));

  // Statistiques détaillées
  const offresActives = mesOffres.filter(o => new Date(o.dateFin) > new Date()).length;
  const offresExpirees = mesOffres.filter(o => new Date(o.dateFin) <= new Date()).length;
  const candidaturesEnAttente = mesCandidatures.filter(c => c.statut === "en_attente").length;
  const candidaturesAcceptees = mesCandidatures.filter(c => c.statut === "acceptee").length;
  const candidaturesRefusees = mesCandidatures.filter(c => c.statut === "refusee").length;
  const tauxAcceptation = mesCandidatures.length > 0 ? Math.round((candidaturesAcceptees / mesCandidatures.length) * 100) : 0;

  // Notification
  const showMessage = (message, type = "success") => {
    setNotificationMsg(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Gestionnaires profil
  const handleInputChange = (e) => {
    setEntrepriseProfil({ ...entrepriseProfil, [e.target.name]: e.target.value });
  };

  const handleSaveProfil = () => {
    if (onUpdateProfil) onUpdateProfil(entrepriseProfil);
    setIsEditing(false);
    showMessage("✅ Profil mis à jour avec succès !", "success");
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Gestionnaires mot de passe
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
      if (passwordData.ancienMotDePasse !== "entreprise123") {
        showMessage("❌ L'ancien mot de passe est incorrect", "error");
        return;
      }
      if (onChangePassword) {
        onChangePassword(passwordData.nouveauMotDePasse);
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

  // Menu réorganisé : Mon profil en premier, Modifier mot de passe
  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "offres", label: "Mes offres", icon: <Briefcase size={18} /> },
    { id: "candidatures", label: "Candidatures reçues", icon: <Users size={18} /> },
    { id: "statistiques", label: "Statistiques", icon: <BarChart3 size={18} /> },
    { id: "changePassword", label: "Modifier mot de passe", icon: <Key size={18} /> },
  ];

  const handleAddOffre = () => {
    if (newOffre.titre && newOffre.salaire && newOffre.dateCreation && newOffre.dateFin) {
      const offreToAdd = {
        id: Date.now(),
        ...newOffre,
        entreprise: entreprise.nom,
        entrepriseId: entreprise.id,
        image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop",
        datePublication: new Date().toLocaleDateString('fr-FR'),
        statut: "active",
        competences: competenceInput.split(",").map(c => c.trim())
      };
      onAjouterOffre(offreToAdd);
      setShowAddModal(false);
      setNewOffre({ 
        titre: "", lieu: "Alger", duree: "6 mois", type: "Stage PFE", 
        salaire: "", description: "", dateCreation: "", dateFin: "", periode: "" 
      });
      setCompetenceInput("");
      showMessage("✅ Offre publiée avec succès !", "success");
    } else {
      showMessage("❌ Veuillez remplir tous les champs obligatoires", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50">
          <div className={`${notificationType === "success" ? "bg-emerald-500" : "bg-rose-400"} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
            {notificationType === "success" ? <CheckCircle size={20} /> : <X size={20} />}
            <span>{notificationMsg}</span>
          </div>
        </div>
      )}

      {/* Sidebar - Soft gray */}
      <div className="w-64 bg-gray-800 text-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            {logoPreview ? (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xl bg-emerald-500">
                {logoPreview}
              </div>
            ) : (
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
            )}
            <h1 className="text-xl font-bold text-white">Stage.io</h1>
          </div>
          <p className="text-gray-400 text-sm mt-2">{entrepriseProfil.nom}</p>
          <p className="text-emerald-400 text-xs mt-1">Entreprise</p>
        </div>
        <nav className="p-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-300 ${
                activeMenu === item.id 
                  ? "bg-gray-700 text-white" 
                  : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
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
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find(m => m.id === activeMenu)?.label || "Mon profil"}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
              {logoPreview || "🏢"}
            </div>
            <span className="text-gray-700">{entrepriseProfil.nom}</span>
          </div>
        </div>

        <div className="p-6">
          {/* MON PROFIL */}
          {activeMenu === "profil" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-gray-600 to-gray-700 relative">
                  <div className="absolute -bottom-10 left-6 flex gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl">
                        {logoPreview || "🏢"}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1 rounded-full cursor-pointer hover:bg-emerald-600">
                        <Camera size={12} className="text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      {!isEditing ? (
                        <>
                          <h3 className="text-2xl font-bold text-gray-800">{entrepriseProfil.nom}</h3>
                          <p className="text-emerald-600 font-medium">{entrepriseProfil.secteur}</p>
                          <p className="text-gray-500 text-sm">{entrepriseProfil.email}</p>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <input type="text" name="nom" value={entrepriseProfil.nom} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
                          <input type="text" name="secteur" value={entrepriseProfil.secteur} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
                          <input type="email" name="email" value={entrepriseProfil.email} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
                        </div>
                      )}
                    </div>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2">
                        <Edit2 size={16} /> Modifier
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

              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building size={18} className="text-emerald-500" />
                  Informations de l'entreprise
                </h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Téléphone</label>
                      {!isEditing ? (
                        <p className="text-gray-800">{entrepriseProfil.telephone}</p>
                      ) : (
                        <input type="tel" name="telephone" value={entrepriseProfil.telephone} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Adresse</label>
                      {!isEditing ? (
                        <p className="text-gray-800">{entrepriseProfil.adresse}</p>
                      ) : (
                        <input type="text" name="adresse" value={entrepriseProfil.adresse} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Description</label>
                    {!isEditing ? (
                      <p className="text-gray-800">{entrepriseProfil.description || "Aucune description"}</p>
                    ) : (
                      <textarea name="description" value={entrepriseProfil.description} onChange={handleInputChange} rows="3" className="p-2 border border-gray-300 rounded-lg w-full"></textarea>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MES OFFRES */}
          {activeMenu === "offres" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Mes offres de stage</h3>
                <button onClick={() => setShowAddModal(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition flex items-center gap-2">
                  <Plus size={16} /> Publier une offre
                </button>
              </div>
              <div className="space-y-4">
                {mesOffres.map(offre => (
                  <div key={offre.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800">{offre.titre}</h4>
                        <p className="text-gray-500 text-sm">{offre.type} • {offre.lieu} • {offre.duree}</p>
                        <p className="text-emerald-600 font-semibold mt-1">{offre.salaire}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar size={12} /> Début: {offre.dateCreation}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> Fin: {offre.dateFin}</span>
                          {offre.periode && <span className="flex items-center gap-1"><Clock size={12} /> Période: {offre.periode}</span>}
                        </div>
                        {offre.description && <p className="text-gray-600 text-sm mt-2">{offre.description}</p>}
                        <div className="flex gap-2 mt-2">
                          {offre.competences?.map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{s}</span>)}
                        </div>
                      </div>
                      <button onClick={() => onSupprimerOffre(offre.id)} className="text-rose-400 hover:text-rose-600 p-2"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                {mesOffres.length === 0 && <div className="text-center py-12 bg-white rounded-xl"><p className="text-gray-500">Aucune offre publiée</p><button onClick={() => setShowAddModal(true)} className="mt-3 text-emerald-600">Publier ma première offre →</button></div>}
              </div>
            </div>
          )}

          {/* CANDIDATURES REÇUES */}
          {activeMenu === "candidatures" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Candidatures reçues</h3>
              <div className="space-y-4">
                {mesCandidatures.map(c => (
                  <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">{c.offreTitre}</h4>
                        <p className="text-gray-600">{c.etudiantNom}</p>
                        <p className="text-sm text-gray-500">{c.email}</p>
                        <p className="text-xs text-gray-400 mt-1">Postulé le {c.date}</p>
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
                ))}
                {mesCandidatures.length === 0 && <div className="text-center py-12 bg-white rounded-xl"><p className="text-gray-500">Aucune candidature reçue</p></div>}
              </div>
            </div>
          )}

          {/* STATISTIQUES - Version agrandie et enrichie */}
          {activeMenu === "statistiques" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">📊 Tableau de bord des statistiques</h3>
              
              {/* Cartes principales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-emerald-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Total offres</p>
                      <p className="text-3xl font-bold text-gray-800">{mesOffres.length}</p>
                    </div>
                    <Briefcase size={32} className="text-emerald-500" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-emerald-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Offres actives</p>
                      <p className="text-3xl font-bold text-green-600">{offresActives}</p>
                    </div>
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-emerald-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Offres expirées</p>
                      <p className="text-3xl font-bold text-rose-500">{offresExpirees}</p>
                    </div>
                    <X size={32} className="text-rose-400" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-emerald-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Taux d'acceptation</p>
                      <p className="text-3xl font-bold text-emerald-600">{tauxAcceptation}%</p>
                    </div>
                    <TrendingUp size={32} className="text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Statistiques des candidatures */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-emerald-500" />
                    Candidatures
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total reçues</span>
                      <span className="font-bold text-gray-800">{mesCandidatures.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">En attente</span>
                      <span className="font-bold text-yellow-600">{candidaturesEnAttente}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Acceptées</span>
                      <span className="font-bold text-emerald-600">{candidaturesAcceptees}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Refusées</span>
                      <span className="font-bold text-rose-500">{candidaturesRefusees}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-emerald-500" />
                    Répartition par type
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Stage PFE</span>
                        <span>{mesOffres.filter(o => o.type === "Stage PFE").length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(mesOffres.filter(o => o.type === "Stage PFE").length / mesOffres.length) * 100 || 0}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Stage</span>
                        <span>{mesOffres.filter(o => o.type === "Stage").length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(mesOffres.filter(o => o.type === "Stage").length / mesOffres.length) * 100 || 0}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-emerald-500" />
                    Offres par période
                  </h4>
                  <div className="space-y-2">
                    {mesOffres.map(offre => (
                      <div key={offre.id} className="text-sm">
                        <p className="font-medium text-gray-700">{offre.titre}</p>
                        <p className="text-gray-400 text-xs">{offre.dateCreation} → {offre.dateFin}</p>
                      </div>
                    ))}
                    {mesOffres.length === 0 && <p className="text-gray-400 text-sm">Aucune offre</p>}
                  </div>
                </div>
              </div>

              {/* Graphique d'évolution */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-4">📈 Évolution des candidatures</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Taux de traitement</span>
                      <span>{mesCandidatures.length > 0 ? Math.round(((candidaturesAcceptees + candidaturesRefusees) / mesCandidatures.length) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{width: `${mesCandidatures.length > 0 ? ((candidaturesAcceptees + candidaturesRefusees) / mesCandidatures.length) * 100 : 0}%`}}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">{candidaturesAcceptees}</p>
                      <p className="text-xs text-gray-500">Candidatures acceptées</p>
                    </div>
                    <div className="text-center p-3 bg-rose-50 rounded-lg">
                      <p className="text-2xl font-bold text-rose-500">{candidaturesRefusees}</p>
                      <p className="text-xs text-gray-500">Candidatures refusées</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODIFIER MOT DE PASSE */}
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
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
        </div>
      </div>

      {/* Modal Ajouter Offre avec dates */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">📢 Publier une offre</h3>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              <input type="text" placeholder="Titre du poste *" value={newOffre.titre} onChange={(e) => setNewOffre({...newOffre, titre: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
              
              <div className="grid grid-cols-2 gap-3">
                <input type="date" placeholder="Date de début *" value={newOffre.dateCreation} onChange={(e) => setNewOffre({...newOffre, dateCreation: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
                <input type="date" placeholder="Date de fin *" value={newOffre.dateFin} onChange={(e) => setNewOffre({...newOffre, dateFin: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
              </div>
              
              <input type="text" placeholder="Période (ex: Lundi-Vendredi, 9h-17h)" value={newOffre.periode} onChange={(e) => setNewOffre({...newOffre, periode: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400" />
              
              <select value={newOffre.lieu} onChange={(e) => setNewOffre({...newOffre, lieu: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400">
                <option>Alger</option><option>Oran</option><option>Constantine</option><option>Tizi Ouzou</option><option>Annaba</option>
              </select>
              
              <select value={newOffre.type} onChange={(e) => setNewOffre({...newOffre, type: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400">
                <option>Stage PFE</option><option>Stage</option>
              </select>
              
              <input type="text" placeholder="Salaire *" value={newOffre.salaire} onChange={(e) => setNewOffre({...newOffre, salaire: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
              
              <input type="text" placeholder="Compétences (séparées par virgule)" value={competenceInput} onChange={(e) => setCompetenceInput(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
              
              <textarea placeholder="Description détaillée du stage *" rows="5" value={newOffre.description} onChange={(e) => setNewOffre({...newOffre, description: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg resize-none"></textarea>
              
              <p className="text-xs text-gray-400">* Champs obligatoires</p>
              
              <div className="flex gap-3 mt-4">
                <button onClick={handleAddOffre} className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition">Publier</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ajout du composant Camera manquant
const Camera = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);