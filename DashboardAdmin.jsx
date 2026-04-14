import { useState, useEffect } from 'react';
import { 
  BarChart3, Briefcase, Building, Users, GraduationCap, TrendingUp,
  User, LogOut, Check, X, CheckCircle, Camera, Save, Edit2, Key
} from "lucide-react";
import { etudiantsData } from "../data/data";

export function DashboardAdmin({ offres, entreprises, candidatures, onDeleteOffre, onUpdateCandidature, onLogout, onUpdateProfil, onChangePassword }) {
  const [activeMenu, setActiveMenu] = useState("profil");
  const [stats, setStats] = useState({});
  
  // États pour le profil du chef du département
  const [isEditing, setIsEditing] = useState(false);
  const [chefProfil, setChefProfil] = useState({
    nom: "Dr. Karim Benali",
    titre: "Chef du Département Informatique",
    email: "karim.benali@universite.dz",
    telephone: "+213 5XX XX XX XX",
    bureau: "Bâtiment A, Bureau 204",
    bio: "Professeur en informatique, responsable du département et des stages étudiants."
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  useEffect(() => {
    setStats({
      totalOffres: offres?.length || 0,
      totalEntreprises: entreprises?.length || 0,
      totalCandidatures: candidatures?.length || 0,
      offresActives: offres?.filter(o => o.statut === "active").length || 0,
      tauxAcceptation: candidatures?.length ? Math.round((candidatures.filter(c => c.statut === "acceptee").length / candidatures.length) * 100) : 0
    });
  }, [offres, entreprises, candidatures]);

  // Gestionnaires pour l'édition du profil
  const handleInputChange = (e) => {
    setChefProfil({ ...chefProfil, [e.target.name]: e.target.value });
  };

  const handleSaveProfil = () => {
    if (onUpdateProfil) onUpdateProfil(chefProfil);
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Gestionnaires pour le changement de mot de passe
  const showMessage = (message, type = "success") => {
    setNotificationMsg(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

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
      if (passwordData.ancienMotDePasse !== "admin123") {
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

  // Menu réorganisé : Mon profil en premier, Modifier mot de passe à la place de Paramètres
  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "dashboard", label: "Tableau de bord", icon: <BarChart3 size={18} /> },
    { id: "entreprises", label: "Entreprises", icon: <Building size={18} /> },
    { id: "candidatures", label: "Candidatures", icon: <Users size={18} /> },
    { id: "etudiants", label: "Étudiants", icon: <GraduationCap size={18} /> },
    { id: "statistiques", label: "Statistiques", icon: <TrendingUp size={18} /> },
    { id: "changePassword", label: "Modifier mot de passe", icon: <Key size={18} /> },
  ];

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

      {/* Sidebar - Soft gray avec nouvel ordre */}
      <div className="w-64 bg-gray-800 text-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
            )}
            <h1 className="text-xl font-bold text-white">Stage.io</h1>
          </div>
          <p className="text-gray-400 text-sm mt-2">Chef du Département</p>
          <p className="text-emerald-400 text-xs mt-1">{chefProfil.nom}</p>
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
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400" />
            ) : (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-500" />
              </div>
            )}
            <span className="text-gray-700">{chefProfil.nom}</span>
          </div>
        </div>

        <div className="p-6">
          {/* MON PROFIL - Premier dans la sidebar */}
          {activeMenu === "profil" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Bannière */}
                <div className="h-28 bg-gradient-to-r from-gray-600 to-gray-700 relative">
                  <div className="absolute -bottom-10 left-6 flex gap-4">
                    <div className="relative">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Photo" className="w-20 h-20 rounded-full border-4 border-white object-cover bg-white" />
                      ) : (
                        <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                          <User size={36} className="text-gray-400" />
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1 rounded-full cursor-pointer hover:bg-emerald-600">
                        <Camera size={12} className="text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                    <div className="relative mt-12">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-10 h-10 rounded-lg border-2 border-white object-cover bg-white" />
                      ) : (
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <TrendingUp size={18} className="text-white" />
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-0.5 rounded-full cursor-pointer hover:bg-emerald-600">
                        <Camera size={8} className="text-white" />
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
                          <h3 className="text-2xl font-bold text-gray-800">{chefProfil.nom}</h3>
                          <p className="text-emerald-600 font-medium">{chefProfil.titre}</p>
                          <p className="text-gray-500 text-sm">{chefProfil.email}</p>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <input type="text" name="nom" value={chefProfil.nom} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
                          <input type="text" name="titre" value={chefProfil.titre} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
                          <input type="email" name="email" value={chefProfil.email} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
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

              {/* Informations détaillées */}
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={18} className="text-emerald-500" />
                  Informations professionnelles
                </h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Téléphone</label>
                      {!isEditing ? (
                        <p className="text-gray-800">{chefProfil.telephone}</p>
                      ) : (
                        <input type="tel" name="telephone" value={chefProfil.telephone} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Bureau</label>
                      {!isEditing ? (
                        <p className="text-gray-800">{chefProfil.bureau}</p>
                      ) : (
                        <input type="text" name="bureau" value={chefProfil.bureau} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg w-full" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Bio</label>
                    {!isEditing ? (
                      <p className="text-gray-800">{chefProfil.bio}</p>
                    ) : (
                      <textarea name="bio" value={chefProfil.bio} onChange={handleInputChange} rows="3" className="p-2 border border-gray-300 rounded-lg w-full"></textarea>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD - Tableau de bord */}
          {activeMenu === "dashboard" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Bonjour, {chefProfil.nom} 👋</h3>
                <p className="text-gray-500 text-sm">Voici le résumé de votre département</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Total Offres</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalOffres}</p>
                    </div>
                    <Briefcase className="text-emerald-500" size={32} />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Entreprises</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalEntreprises}</p>
                    </div>
                    <Building className="text-emerald-500" size={32} />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Candidatures</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalCandidatures}</p>
                    </div>
                    <Users className="text-emerald-500" size={32} />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Taux d'acceptation</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.tauxAcceptation}%</p>
                    </div>
                    <CheckCircle className="text-emerald-500" size={32} />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">📋 Dernières offres ajoutées</h4>
                  <div className="space-y-3">
                    {offres?.slice(0, 3).map(offre => (
                      <div key={offre.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{offre.titre}</p>
                          <p className="text-sm text-gray-500">{offre.entreprise}</p>
                        </div>
                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{offre.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">🎓 Dernières candidatures</h4>
                  <div className="space-y-3">
                    {candidatures?.slice(0, 3).map(c => (
                      <div key={c.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{c.etudiantNom}</p>
                          <p className="text-sm text-gray-500">{c.offreTitre}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          c.statut === "acceptee" ? "bg-emerald-100 text-emerald-700" : 
                          c.statut === "refusee" ? "bg-rose-100 text-rose-600" : 
                          "bg-gray-100 text-gray-600"
                        }`}>{c.statut}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CANDIDATURES */}
          {activeMenu === "candidatures" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Toutes les candidatures</h3>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm text-gray-600">Offre</th>
                      <th className="p-3 text-left text-sm text-gray-600">Étudiant</th>
                      <th className="p-3 text-left text-sm text-gray-600">Statut</th>
                      <th className="p-3 text-left text-sm text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidatures?.map(c => (
                      <tr key={c.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-gray-800">{c.offreTitre}</td>
                        <td className="p-3 text-gray-800">{c.etudiantNom}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${
                          c.statut === "acceptee" ? "bg-emerald-100 text-emerald-700" : 
                          c.statut === "refusee" ? "bg-rose-100 text-rose-600" : 
                          "bg-gray-100 text-gray-600"
                        }`}>{c.statut}</span></td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => onUpdateCandidature?.(c.id, "acceptee")} className="text-emerald-500 hover:text-emerald-700"><Check size={18} /></button>
                          <button onClick={() => onUpdateCandidature?.(c.id, "refusee")} className="text-rose-400 hover:text-rose-600"><X size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ENTREPRISES */}
          {activeMenu === "entreprises" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Entreprises partenaires</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entreprises?.map(ent => (
                  <div key={ent.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{ent.logo || "🏢"}</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{ent.nom}</h4>
                        <p className="text-sm text-gray-500">{ent.secteur}</p>
                        <p className="text-xs text-gray-400">{ent.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ÉTUDIANTS */}
          {activeMenu === "etudiants" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Étudiants inscrits</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {etudiantsData?.map(etud => (
                  <div key={etud.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{etud.nom}</h4>
                        <p className="text-sm text-gray-500">{etud.email}</p>
                        <p className="text-xs text-gray-400">{etud.filiere} - {etud.universite}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATISTIQUES */}
          {activeMenu === "statistiques" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Statistiques détaillées</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4">Répartition des offres</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600"><span>Stage PFE</span><span>{offres?.filter(o => o.type === "Stage PFE").length || 0}</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(offres?.filter(o => o.type === "Stage PFE").length / offres?.length) * 100 || 0}%`}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600"><span>Stage</span><span>{offres?.filter(o => o.type === "Stage").length || 0}</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(offres?.filter(o => o.type === "Stage").length / offres?.length) * 100 || 0}%`}}></div></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4">Statut des candidatures</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600"><span>En attente</span><span>{candidatures?.filter(c => c.statut === "en_attente").length || 0}</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(candidatures?.filter(c => c.statut === "en_attente").length / candidatures?.length) * 100 || 0}%`}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600"><span>Acceptées</span><span>{candidatures?.filter(c => c.statut === "acceptee").length || 0}</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(candidatures?.filter(c => c.statut === "acceptee").length / candidatures?.length) * 100 || 0}%`}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600"><span>Refusées</span><span>{candidatures?.filter(c => c.statut === "refusee").length || 0}</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-rose-400 h-2 rounded-full" style={{width: `${(candidatures?.filter(c => c.statut === "refusee").length / candidatures?.length) * 100 || 0}%`}}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODIFIER MOT DE PASSE - Remplacé Paramètres */}
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
    </div>
  );
}