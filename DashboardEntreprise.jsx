import React, { useState, useCallback, useMemo } from 'react';
import { 
  Briefcase, Users, BarChart3, Building, TrendingUp, Calendar,
  LogOut, Plus, Trash2, User, Key, Save, Edit2, X, CheckCircle, Clock,
  FileText, Upload, Download, FilePlus, Eye, Phone, MapPin, Mail, Search,
  Award, AlertCircle, Check, XCircle, HelpCircle,
  MessageCircle, BookOpen, ExternalLink, DollarSign
} from "lucide-react";

// ============================================
// COMPOSANT DASHBOARD ENTREPRISE PROFESSIONNEL
// ============================================
export function DashboardEntreprise({ 
  entreprise, 
  offres = [], 
  candidatures = [], 
  onAjouterOffre, 
  onSupprimerOffre, 
  onLogout, 
  onUpdateProfil, 
  onChangePassword,
  onAccepterCandidat,
  onRefuserCandidat
}) {
  // États principaux
  const [activeMenu, setActiveMenu] = useState("profil");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  
  // État local des candidatures pour mise à jour immédiate
  const [localCandidatures, setLocalCandidatures] = useState(candidatures);
  
  // Mettre à jour localCandidatures quand candidatures change
  React.useEffect(() => {
    setLocalCandidatures(candidatures);
  }, [candidatures]);
  
  // États pour le profil de l'entreprise
  const [isEditing, setIsEditing] = useState(false);
  const [entrepriseProfil, setEntrepriseProfil] = useState({
    nom: entreprise?.nom || "",
    email: entreprise?.email || "",
    secteur: entreprise?.secteur || "",
    description: entreprise?.description || "",
    telephone: entreprise?.telephone || "+213 5XX XX XX XX",
    adresse: entreprise?.adresse || "Alger, Algérie",
    siteWeb: entreprise?.siteWeb || "",
    nbEmployes: entreprise?.nbEmployes || ""
  });
  const [logoPreview, setLogoPreview] = useState(entreprise?.logo || null);
  
  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // États pour nouvelle offre
  const [newOffre, setNewOffre] = useState({ 
    titre: "", lieu: "Alger", duree: "6 mois", type: "Stage PFE", 
    salaire: "", description: "", dateCreation: "", dateFin: "", periode: ""
  });
  const [competenceInput, setCompetenceInput] = useState("");

  // ============================================
  // DONNÉES CALCULÉES
  // ============================================
  const mesOffres = useMemo(() => {
    if (!offres || !entreprise) return [];
    return offres.filter(o => o.entrepriseId === entreprise?.id);
  }, [offres, entreprise]);
  
  const mesCandidatures = useMemo(() => {
    if (!localCandidatures || !mesOffres.length) return [];
    const offresIds = mesOffres.map(o => o.id);
    return localCandidatures.filter(c => offresIds.includes(c.offreId));
  }, [localCandidatures, mesOffres]);

  // Statistiques
  const offresActives = useMemo(() => {
    return mesOffres.filter(o => {
      if (!o.dateFin) return true;
      return new Date(o.dateFin) > new Date();
    }).length;
  }, [mesOffres]);
  
  const candidaturesEnAttente = useMemo(() => mesCandidatures.filter(c => c.statut === "en_attente").length, [mesCandidatures]);
  const candidaturesAcceptees = useMemo(() => mesCandidatures.filter(c => c.statut === "acceptee").length, [mesCandidatures]);
  const candidaturesRefusees = useMemo(() => mesCandidatures.filter(c => c.statut === "refusee").length, [mesCandidatures]);
  const tauxAcceptation = useMemo(() => mesCandidatures.length > 0 ? Math.round((candidaturesAcceptees / mesCandidatures.length) * 100) : 0, [mesCandidatures, candidaturesAcceptees]);

  // Filtrage des candidatures
  const candidaturesFiltrees = useMemo(() => {
    let filtered = [...mesCandidatures];
    if (filterStatut !== "Tous") {
      filtered = filtered.filter(c => c.statut === filterStatut);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        (c.etudiantNom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.offreTitre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [mesCandidatures, filterStatut, searchTerm]);

  // ============================================
  // FONCTIONS UTILITAIRES
  // ============================================
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // ============================================
  // GESTION DU PROFIL
  // ============================================
  const handleInputChange = useCallback((e) => {
    setEntrepriseProfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSaveProfil = useCallback(() => {
    if (onUpdateProfil) onUpdateProfil(entrepriseProfil);
    setIsEditing(false);
    showNotification('success', "✅ Profil mis à jour avec succès");
  }, [entrepriseProfil, onUpdateProfil, showNotification]);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
      showNotification('success', "✅ Logo mis à jour");
    } else {
      showNotification('error', "❌ Image invalide ou trop volumineuse (max 5MB)");
    }
  }, [showNotification]);

  // ============================================
  // GESTION DES OFFRES
  // ============================================
  const handleAddOffre = useCallback(() => {
    if (!newOffre.titre || !newOffre.salaire || !newOffre.dateCreation || !newOffre.dateFin) {
      showNotification('error', "❌ Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const offreToAdd = {
      id: Date.now(),
      ...newOffre,
      entreprise: entrepriseProfil.nom,
      entrepriseId: entreprise?.id,
      datePublication: new Date().toLocaleDateString('fr-FR'),
      statut: "active",
      competences: competenceInput.split(",").map(c => c.trim()).filter(c => c)
    };
    if (onAjouterOffre) onAjouterOffre(offreToAdd);
    setShowAddModal(false);
    setNewOffre({ titre: "", lieu: "Alger", duree: "6 mois", type: "Stage PFE", salaire: "", description: "", dateCreation: "", dateFin: "", periode: "" });
    setCompetenceInput("");
    showNotification('success', "✅ Offre publiée avec succès");
  }, [newOffre, competenceInput, entrepriseProfil.nom, entreprise?.id, onAjouterOffre, showNotification]);

  // ============================================
  // GESTION DES CANDIDATURES (Accepter/Refuser) - CORRIGÉE
  // ============================================
  const handleViewCV = useCallback((candidature) => {
    setSelectedCandidature(candidature);
    setShowCvModal(true);
  }, []);

  // Fonction pour mettre à jour le statut localement
  const updateCandidatureStatut = useCallback((candidatureId, newStatut) => {
    setLocalCandidatures(prev => 
      prev.map(c => 
        c.id === candidatureId ? { ...c, statut: newStatut } : c
      )
    );
  }, []);

  const handleAccepterCandidat = useCallback(async (candidature) => {
    try {
      // Appeler la fonction du parent si elle existe
      if (onAccepterCandidat) {
        await onAccepterCandidat(candidature.id);
      }
      // Mettre à jour le statut localement
      updateCandidatureStatut(candidature.id, "acceptee");
      showNotification('success', `✅ Candidature de ${candidature.etudiantNom} acceptée !`);
      setShowCvModal(false);
    } catch (error) {
      showNotification('error', "❌ Erreur lors de l'acceptation");
    }
  }, [onAccepterCandidat, updateCandidatureStatut, showNotification]);

  const handleRefuserCandidat = useCallback(async (candidature) => {
    try {
      // Appeler la fonction du parent si elle existe
      if (onRefuserCandidat) {
        await onRefuserCandidat(candidature.id);
      }
      // Mettre à jour le statut localement
      updateCandidatureStatut(candidature.id, "refusee");
      showNotification('success', `❌ Candidature de ${candidature.etudiantNom} refusée.`);
      setShowCvModal(false);
    } catch (error) {
      showNotification('error', "❌ Erreur lors du refus");
    }
  }, [onRefuserCandidat, updateCandidatureStatut, showNotification]);

  // ============================================
  // GESTION DU MOT DE PASSE
  // ============================================
  const handlePasswordChange = useCallback((e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordErrors(prev => ({ ...prev, [e.target.name]: "" }));
  }, []);

  const handleSubmitPasswordChange = useCallback(() => {
    const errors = {};
    if (!passwordData.ancienMotDePasse) errors.ancienMotDePasse = "Champ requis";
    if (!passwordData.nouveauMotDePasse) errors.nouveauMotDePasse = "Champ requis";
    else if (passwordData.nouveauMotDePasse.length < 6) errors.nouveauMotDePasse = "Minimum 6 caractères";
    if (passwordData.nouveauMotDePasse !== passwordData.confirmerMotDePasse) errors.confirmerMotDePasse = "Les mots de passe ne correspondent pas";
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    if (passwordData.ancienMotDePasse !== entreprise?.password && passwordData.ancienMotDePasse !== "entreprise123") {
      showNotification('error', "❌ Ancien mot de passe incorrect");
      return;
    }
    
    if (onChangePassword) onChangePassword(passwordData.nouveauMotDePasse);
    setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
    showNotification('success', "✅ Mot de passe changé");
  }, [passwordData, entreprise, onChangePassword, showNotification]);

  // ============================================
  // MENU ITEMS
  // ============================================
  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "offres", label: "Mes offres", icon: <Briefcase size={18} /> },
    { id: "candidatures", label: "Candidatures reçues", icon: <Users size={18} /> },
    { id: "statistiques", label: "Statistiques", icon: <BarChart3 size={18} /> },
    { id: "changePassword", label: "Modifier mot de passe", icon: <Key size={18} /> },
    { id: "aide", label: "Conditions & Aide", icon: <HelpCircle size={18} /> },
  ];

  const getMenuTitle = (id) => {
    const titles = {
      profil: 'Mon profil', offres: 'Mes offres de stage',
      candidatures: 'Candidatures reçues', statistiques: 'Tableau de bord',
      changePassword: 'Changer le mot de passe',
      aide: 'Conditions & Aide'
    };
    return titles[id] || 'Dashboard';
  };

  if (!entreprise) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center"><div className="spinner mx-auto"></div><p className="mt-4 text-gray-600">Chargement...</p></div>
      </div>
    );
  }

  // ============================================
  // RENDU PRINCIPAL
  // ============================================
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* NOTIFICATION */}
      {notification.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`${notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* MODAL VISUALISATION CV CANDIDAT AVEC ACTIONS ACCEPTER/REFUSER */}
      {showCvModal && selectedCandidature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">CV de {selectedCandidature.etudiantNom}</h3>
              <button onClick={() => setShowCvModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><User size={16} className="text-emerald-600" /> Informations personnelles</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Nom complet:</span> <span className="text-gray-800 font-medium">{selectedCandidature.etudiantNom}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="text-gray-800">{selectedCandidature.email}</span></div>
                  <div><span className="text-gray-500">Téléphone:</span> <span className="text-gray-800">{selectedCandidature.telephone || "Non renseigné"}</span></div>
                  <div><span className="text-gray-500">Postulé le:</span> <span className="text-gray-800">{selectedCandidature.date}</span></div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Briefcase size={16} className="text-emerald-600" /> Candidature pour</h4>
                <p><span className="text-gray-500">Offre:</span> <span className="text-gray-800 font-medium">{selectedCandidature.offreTitre}</span></p>
                <div className="mt-2 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedCandidature.statut === "acceptee" ? "bg-emerald-100 text-emerald-700" : 
                    selectedCandidature.statut === "refusee" ? "bg-rose-100 text-rose-600" : 
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {selectedCandidature.statut === "acceptee" ? "Acceptée" : selectedCandidature.statut === "refusee" ? "Refusée" : "En attente"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FileText size={16} className="text-emerald-600" /> CV du candidat</h4>
                {selectedCandidature.cvContent ? (
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-4 rounded-lg max-h-96 overflow-y-auto border border-gray-100">
                    {selectedCandidature.cvContent}
                  </pre>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg">
                    <FileText size={48} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">Aucun CV disponible</p>
                  </div>
                )}
              </div>
            </div>
            
            {selectedCandidature.statut === "en_attente" && (
              <div className="border-t border-gray-100 p-6 flex gap-3">
                <button 
                  onClick={() => handleAccepterCandidat(selectedCandidature)} 
                  className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Accepter la candidature
                </button>
                <button 
                  onClick={() => handleRefuserCandidat(selectedCandidature)} 
                  className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Refuser la candidature
                </button>
              </div>
            )}
            
            {selectedCandidature.statut !== "en_attente" && (
              <div className="border-t border-gray-100 p-6">
                <button onClick={() => setShowCvModal(false)} className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition">
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-72 bg-gray-900 text-gray-300 flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
              {logoPreview ? <img src={logoPreview} className="w-10 h-10 rounded-xl object-cover" alt="logo" /> : <TrendingUp size={20} />}
            </div>
            <div><h1 className="text-xl font-bold text-white">Stag.io</h1><p className="text-emerald-400 text-xs">Espace Entreprise</p></div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800">
            <p className="text-sm font-medium text-white">{entrepriseProfil.nom}</p>
            <p className="text-emerald-400 text-xs">{entrepriseProfil.secteur || "Entreprise"}</p>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveMenu(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${activeMenu === item.id ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"}`}>
              {item.icon}<span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-3 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"><LogOut size={18} /><span className="text-sm font-medium">Déconnexion</span></button>
        </nav>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">{getMenuTitle(activeMenu)}</h2>
          <div className="flex items-center gap-3">
            {logoPreview ? <img src={logoPreview} alt="Logo" className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400" /> : <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"><Building size={18} className="text-gray-500" /></div>}
            <span className="text-gray-700 font-medium">{entrepriseProfil.nom}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* ==================== MON PROFIL ==================== */}
          {activeMenu === "profil" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
                  <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                      {logoPreview ? <img src={logoPreview} alt="Logo" className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white" /> : <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl">🏢</div>}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600"><Camera size={14} className="text-white" /><input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} /></label>
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start">
                    <div>
                      {!isEditing ? (
                        <><h3 className="text-2xl font-bold text-gray-800">{entrepriseProfil.nom}</h3><p className="text-emerald-600 font-medium">{entrepriseProfil.secteur}</p><p className="text-gray-500 text-sm">{entrepriseProfil.email}</p></>
                      ) : (
                        <div className="space-y-2"><input type="text" name="nom" value={entrepriseProfil.nom} onChange={handleInputChange} className="p-2 border rounded-lg w-full" /><input type="text" name="secteur" value={entrepriseProfil.secteur} onChange={handleInputChange} className="p-2 border rounded-lg w-full" /><input type="email" name="email" value={entrepriseProfil.email} onChange={handleInputChange} className="p-2 border rounded-lg w-full" /></div>
                      )}
                    </div>
                    {!isEditing ? <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Edit2 size={16} /> Modifier</button> : <div className="flex gap-2"><button onClick={handleSaveProfil} className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Enregistrer</button><button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2"><X size={16} /> Annuler</button></div>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Building size={18} className="text-emerald-500" /> Informations de l'entreprise</h4>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { label: "Téléphone", name: "telephone", value: entrepriseProfil.telephone, icon: <Phone size={14} /> },
                    { label: "Adresse", name: "adresse", value: entrepriseProfil.adresse, icon: <MapPin size={14} /> },
                    { label: "Site web", name: "siteWeb", value: entrepriseProfil.siteWeb, icon: <Globe size={14} /> },
                    { label: "Nombre d'employés", name: "nbEmployes", value: entrepriseProfil.nbEmployes, icon: <Users size={14} /> }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="text-sm text-gray-500 flex items-center gap-1 mb-1">{field.icon} {field.label}</label>
                      {!isEditing ? <p className="text-gray-800">{field.value || "Non renseigné"}</p> : <input type="text" name={field.name} value={entrepriseProfil[field.name]} onChange={handleInputChange} className="w-full p-2 border border-gray-200 rounded-lg" />}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-500 mb-1 block">Description</label>
                    {!isEditing ? <p className="text-gray-800 p-2 bg-gray-50 rounded-lg">{entrepriseProfil.description || "Aucune description"}</p> : <textarea name="description" value={entrepriseProfil.description} onChange={handleInputChange} rows="3" className="w-full p-2 border border-gray-200 rounded-lg"></textarea>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MES OFFRES ==================== */}
          {activeMenu === "offres" && (
            <div>
              <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                <h3 className="text-lg font-semibold text-gray-800">Mes offres de stage</h3>
                <button onClick={() => setShowAddModal(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-emerald-600 flex items-center gap-2"><Plus size={16} /> Publier une offre</button>
              </div>
              <div className="space-y-4">
                {mesOffres && mesOffres.length > 0 ? mesOffres.map(offre => (
                  <div key={offre.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex gap-2 mb-2">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">{offre.type || 'Stage'}</span>
                            {offre.dateFin && new Date(offre.dateFin) > new Date() ? 
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span> : 
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Expirée</span>
                            }
                          </div>
                          <h4 className="font-bold text-lg text-gray-800">{offre.titre}</h4>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><MapPin size={14} /> {offre.lieu}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {offre.duree}</span>
                            <span className="text-emerald-600 font-medium"><DollarSign size={14} /> {offre.salaire}</span>
                          </div>
                          <div className="flex gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Calendar size={12} /> Début: {offre.dateCreation}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} /> Fin: {offre.dateFin}</span>
                          </div>
                          {offre.description && <p className="text-gray-600 text-sm mt-2 line-clamp-2">{offre.description}</p>}
                          {offre.competences && offre.competences.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {offre.competences.slice(0, 3).map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-full">{s}</span>)}
                            </div>
                          )}
                        </div>
                        <button onClick={() => onSupprimerOffre && onSupprimerOffre(offre.id)} className="text-rose-400 hover:text-rose-600 p-2 transition"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Aucune offre publiée</p>
                    <button onClick={() => setShowAddModal(true)} className="mt-3 text-emerald-600 hover:text-emerald-700">Publier ma première offre →</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== CANDIDATURES REÇUES AVEC BOUTONS QUI MARCHENT ==================== */}
          {activeMenu === "candidatures" && (
            <div>
              <div className="flex flex-wrap gap-4 mb-5 items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Candidatures reçues</h3>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm w-64" />
                  </div>
                  <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm">
                    <option value="Tous">Tous</option>
                    <option value="en_attente">En attente</option>
                    <option value="acceptee">Acceptée</option>
                    <option value="refusee">Refusée</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {candidaturesFiltrees.length > 0 ? candidaturesFiltrees.map(c => (
                  <div key={c.id} className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 ${
                    c.statut === "acceptee" ? "border-emerald-400" : c.statut === "refusee" ? "border-rose-400" : "border-yellow-400"
                  }`}>
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-gray-800">{c.etudiantNom || "Candidat"}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            c.statut === "acceptee" ? "bg-emerald-100 text-emerald-700" : 
                            c.statut === "refusee" ? "bg-rose-100 text-rose-600" : 
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {c.statut === "acceptee" ? "Acceptée" : c.statut === "refusee" ? "Refusée" : "En attente"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{c.offreTitre || "Offre"}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Mail size={12} /> {c.email || "Email non renseigné"}</p>
                        <p className="text-xs text-gray-400 mt-1">Postulé le {c.date || new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleViewCV(c)} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-1">
                          <Eye size={14} /> Voir CV
                        </button>
                        {c.statut === "en_attente" && (
                          <>
                            <button 
                              onClick={() => handleAccepterCandidat(c)} 
                              className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-600 transition flex items-center gap-1"
                            >
                              <Check size={14} /> Accepter
                            </button>
                            <button 
                              onClick={() => handleRefuserCandidat(c)} 
                              className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-rose-600 transition flex items-center gap-1"
                            >
                              <XCircle size={14} /> Refuser
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Aucune candidature reçue</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== STATISTIQUES ==================== */}
          {activeMenu === "statistiques" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-emerald-400">
                  <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Total offres</p><p className="text-3xl font-bold text-gray-800">{mesOffres.length}</p></div><Briefcase size={32} className="text-emerald-500" /></div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-emerald-400">
                  <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Offres actives</p><p className="text-3xl font-bold text-green-600">{offresActives}</p></div><CheckCircle size={32} className="text-emerald-500" /></div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-emerald-400">
                  <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Candidatures</p><p className="text-3xl font-bold text-gray-800">{mesCandidatures.length}</p></div><Users size={32} className="text-emerald-500" /></div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-emerald-400">
                  <div className="flex justify-between"><div><p className="text-gray-500 text-sm">Taux acceptation</p><p className="text-3xl font-bold text-emerald-600">{tauxAcceptation}%</p></div><TrendingUp size={32} className="text-emerald-500" /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Users size={16} className="text-emerald-500" /> Répartition candidatures</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-600">En attente</span><span className="font-bold text-yellow-600">{candidaturesEnAttente}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Acceptées</span><span className="font-bold text-emerald-600">{candidaturesAcceptees}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Refusées</span><span className="font-bold text-rose-500">{candidaturesRefusees}</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Award size={16} className="text-emerald-500" /> Performance</h4>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>Traitement</span><span>{mesCandidatures.length > 0 ? Math.round(((candidaturesAcceptees + candidaturesRefusees) / mesCandidatures.length) * 100) : 0}%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: `${mesCandidatures.length > 0 ? ((candidaturesAcceptees + candidaturesRefusees) / mesCandidatures.length) * 100 : 0}%`}}></div></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Calendar size={16} className="text-emerald-500" /> Offres par type</h4>
                  <div className="space-y-2">
                    {["Stage PFE", "Stage"].map(type => {
                      const count = mesOffres.filter(o => o.type === type).length;
                      return (
                        <div key={type}>
                          <div className="flex justify-between text-sm"><span>{type}</span><span>{count}</span></div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{width: `${mesOffres.length > 0 ? (count / mesOffres.length) * 100 : 0}%`}}></div></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== CHANGER MOT DE PASSE ==================== */}
          {activeMenu === "changePassword" && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="text-center mb-6"><div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Key size={40} className="text-emerald-500" /></div><h3 className="text-2xl font-bold text-gray-800">Changer le mot de passe</h3><p className="text-gray-500 text-sm mt-2">Sécurisez votre compte</p></div>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label><input type="password" name="ancienMotDePasse" value={passwordData.ancienMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Entrez votre mot de passe actuel" />{passwordErrors.ancienMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.ancienMotDePasse}</p>}</div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label><input type="password" name="nouveauMotDePasse" value={passwordData.nouveauMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Minimum 6 caractères" />{passwordErrors.nouveauMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.nouveauMotDePasse}</p>}</div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label><input type="password" name="confirmerMotDePasse" value={passwordData.confirmerMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Retapez votre nouveau mot de passe" />{passwordErrors.confirmerMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.confirmerMotDePasse}</p>}</div>
                  <div className="flex gap-3 pt-4"><button onClick={handleSubmitPasswordChange} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">Changer</button><button onClick={() => { setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" }); setPasswordErrors({}); }} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300">Réinitialiser</button></div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== CONDITIONS & AIDE ==================== */}
          {activeMenu === "aide" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2"><HelpCircle size={24} className="text-emerald-500" /> Centre d'aide</h3>
                <p className="text-gray-500 text-sm mb-6">Retrouvez ici toutes les informations nécessaires pour utiliser la plateforme</p>
                
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2"><BookOpen size={16} className="text-emerald-500" /> Conditions générales d'utilisation</h4>
                    <p className="text-gray-600 text-sm">En utilisant StageFlow, vous acceptez de respecter les conditions suivantes : les offres publiées doivent être conformes à la législation en vigueur, les informations fournies doivent être exactes, et vous vous engagez à traiter les candidatures dans les meilleurs délais.</p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2"><MessageCircle size={16} className="text-emerald-500" /> Comment publier une offre ?</h4>
                    <p className="text-gray-600 text-sm">1. Allez dans la section "Mes offres"<br />2. Cliquez sur "Publier une offre"<br />3. Remplissez tous les champs (titre, dates, lieu, salaire, description)<br />4. Ajoutez les compétences requises<br />5. Cliquez sur "Publier"</p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2"><Eye size={16} className="text-emerald-500" /> Comment consulter les candidatures ?</h4>
                    <p className="text-gray-600 text-sm">1. Allez dans "Candidatures reçues"<br />2. Vous verrez la liste des candidats<br />3. Cliquez sur "Voir CV" pour consulter le détail<br />4. Vous pouvez accepter ou refuser chaque candidature</p>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-xl p-4 border-l-4 border-emerald-500">
                    <h4 className="font-semibold text-emerald-700 flex items-center gap-2 mb-2"><ExternalLink size={16} /> Support technique</h4>
                    <p className="text-gray-600 text-sm">En cas de problème, contactez notre équipe support :<br /><span className="font-medium text-emerald-600">support@stageflow.dz</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL AJOUTER OFFRE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center"><h3 className="font-bold text-lg text-gray-800">📢 Publier une offre</h3><button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button></div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Titre du poste *" value={newOffre.titre} onChange={(e) => setNewOffre({...newOffre, titre: e.target.value})} className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400" />
              <div className="grid grid-cols-2 gap-3"><input type="date" placeholder="Date début *" value={newOffre.dateCreation} onChange={(e) => setNewOffre({...newOffre, dateCreation: e.target.value})} className="p-2 border border-gray-200 rounded-xl" /><input type="date" placeholder="Date fin *" value={newOffre.dateFin} onChange={(e) => setNewOffre({...newOffre, dateFin: e.target.value})} className="p-2 border border-gray-200 rounded-xl" /></div>
              <input type="text" placeholder="Période (ex: Lundi-Vendredi, 9h-17h)" value={newOffre.periode} onChange={(e) => setNewOffre({...newOffre, periode: e.target.value})} className="w-full p-2 border border-gray-200 rounded-xl" />
              <select value={newOffre.lieu} onChange={(e) => setNewOffre({...newOffre, lieu: e.target.value})} className="w-full p-2 border border-gray-200 rounded-xl"><option>Alger</option><option>Oran</option><option>Constantine</option><option>Tizi Ouzou</option><option>Annaba</option></select>
              <select value={newOffre.type} onChange={(e) => setNewOffre({...newOffre, type: e.target.value})} className="w-full p-2 border border-gray-200 rounded-xl"><option>Stage PFE</option><option>Stage</option></select>
              <input type="text" placeholder="Salaire *" value={newOffre.salaire} onChange={(e) => setNewOffre({...newOffre, salaire: e.target.value})} className="w-full p-2 border border-gray-200 rounded-xl" />
              <input type="text" placeholder="Compétences (séparées par virgule)" value={competenceInput} onChange={(e) => setCompetenceInput(e.target.value)} className="w-full p-2 border border-gray-200 rounded-xl" />
              <textarea placeholder="Description détaillée *" rows="5" value={newOffre.description} onChange={(e) => setNewOffre({...newOffre, description: e.target.value})} className="w-full p-2 border border-gray-200 rounded-xl resize-none"></textarea>
              <div className="flex gap-3 pt-2"><button onClick={handleAddOffre} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600">Publier</button><button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200">Annuler</button></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .spinner { border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #10b981; width: 40px; height: 40px; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

// Composants manquants
const Camera = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const Globe = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);