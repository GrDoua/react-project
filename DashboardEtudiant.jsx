import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  User, Briefcase, Send, Calendar, Heart, Star, Settings, FileText,
  TrendingUp, LogOut, MapPin, Clock, DollarSign, Upload, Camera, Save,
  X, CheckCircle, AlertCircle, Key, Download, FilePlus, Edit, Building2, Search,
  Trash2, Eye, ChevronDown, ChevronRight, Globe, Phone, Mail, MapPin as MapPinIcon
} from "lucide-react";

// ============================================
// COMPOSANT PRINCIPAL DASHBOARD ETUDIANT
// ============================================
export function DashboardEtudiant({ etudiant, offres, candidatures, onPostuler, onLogout, onUpdateProfil, onChangePassword }) {
  // États principaux
  const [activeMenu, setActiveMenu] = useState("profil");
  const [filters, setFilters] = useState({ search: '', type: 'Tous', ville: 'Tous' });
  const [favoris, setFavoris] = useState({});
  const [showCvModal, setShowCvModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // États pour le profil (source unique de vérité)
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(etudiant?.profilePhoto || null);
  const [formData, setFormData] = useState({
    nom: etudiant?.nom || "", prenom: etudiant?.prenom || "", email: etudiant?.email || "",
    matricule: etudiant?.matricule || "", filiere: etudiant?.filiere || "",
    universite: etudiant?.universite || "", niveau: etudiant?.niveau || "",
    competences: etudiant?.competences?.join(", ") || "", telephone: etudiant?.telephone || "",
    adresse: etudiant?.adresse || "", bio: etudiant?.bio || ""
  });
  
  // États pour le CV (lié aux infos personnelles)
  const [uploadedCv, setUploadedCv] = useState(null);
  const [cvName, setCvName] = useState(etudiant?.cvName || "");
  const [isCvEditing, setIsCvEditing] = useState(false);
  const [customCvExtra, setCustomCvExtra] = useState({
    experience: "", formation: "", langues: "", centresInteret: ""
  });
  
  // États pour le mot de passe
  const [passwordData, setPasswordData] = useState({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
  const [passwordErrors, setPasswordErrors] = useState({});

  // ============================================
  // FONCTIONS UTILITAIRES
  // ============================================
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // ============================================
  // DONNÉES CALCULÉES
  // ============================================
  const mesCandidatures = useMemo(() => candidatures?.filter(c => c.etudiantId === etudiant.id) || [], [candidatures, etudiant.id]);
  const offresDisponibles = useMemo(() => offres?.filter(o => o.statut === 'active' && !mesCandidatures.some(c => c.offreId === o.id)) || [], [offres, mesCandidatures]);
  
  const offresFiltrees = useMemo(() => {
    return offresDisponibles.filter(offre => {
      const matchSearch = offre.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         offre.entreprise?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         offre.description?.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === 'Tous' || offre.type === filters.type;
      const matchVille = filters.ville === 'Tous' || offre.lieu === filters.ville;
      return matchSearch && matchType && matchVille;
    });
  }, [offresDisponibles, filters]);

  const offresFavoris = useMemo(() => offres?.filter(o => favoris[o.id]) || [], [offres, favoris]);

  // CV construit à partir des informations personnelles
  const getCurrentCv = useCallback(() => {
    return {
      nom: formData.nom || etudiant?.nom || "",
      prenom: formData.prenom || etudiant?.prenom || "",
      email: formData.email || etudiant?.email || "",
      telephone: formData.telephone || etudiant?.telephone || "",
      adresse: formData.adresse || etudiant?.adresse || "",
      competences: (formData.competences || etudiant?.competences?.join(", ") || "").split(",").map(c => c.trim()).filter(c => c),
      universite: formData.universite || etudiant?.universite || "",
      filiere: formData.filiere || etudiant?.filiere || "",
      niveau: formData.niveau || etudiant?.niveau || "",
      ...customCvExtra
    };
  }, [formData, etudiant, customCvExtra]);

  // ============================================
  // GESTION DES FAVORIS
  // ============================================
  const toggleFavori = useCallback((offreId) => {
    setFavoris(prev => ({ ...prev, [offreId]: !prev[offreId] }));
    showNotification('success', !favoris[offreId] ? "❤️ Ajouté aux favoris" : "💔 Retiré des favoris");
  }, [favoris, showNotification]);

  // ============================================
  // GESTION DE LA CANDIDATURE AVEC CV
  // ============================================
  const handlePostuler = useCallback((offre) => {
    setSelectedOffre(offre);
    setShowCvModal(true);
  }, []);

  const handleConfirmPostuler = useCallback(() => {
    if (!uploadedCv && !getCurrentCv().nom) {
      showNotification('error', "❌ Veuillez compléter votre profil ou télécharger un CV");
      return;
    }
    
    const cvToSend = uploadedCv || { type: 'generated', data: getCurrentCv() };
    onPostuler(selectedOffre, cvToSend);
    setShowCvModal(false);
    setSelectedOffre(null);
    showNotification('success', `✅ Candidature envoyée pour ${selectedOffre.titre}`);
  }, [uploadedCv, getCurrentCv, onPostuler, selectedOffre, showNotification]);

  // ============================================
  // GESTION DU CV
  // ============================================
  const handleCVUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('error', "❌ Format non supporté (PDF, DOC, DOCX, TXT)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showNotification('error', "❌ Fichier trop volumineux (max 10MB)");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedCv({ name: file.name, content: event.target.result, type: file.type, dateCreation: new Date().toLocaleDateString('fr-FR') });
      setCvName(file.name);
      showNotification('success', `✅ CV "${file.name}" téléchargé`);
    };
    reader.readAsText(file);
  }, [showNotification]);

  const handleGenerateCVFromProfile = useCallback(() => {
    showNotification('success', "✅ CV généré à partir de vos informations personnelles");
    setIsCvEditing(false);
  }, [showNotification]);

  const handleDownloadCV = useCallback(() => {
    const cv = getCurrentCv();
    
    let cvContent = "=".repeat(50) + "\n";
    cvContent += "                 CURRICULUM VITAE\n";
    cvContent += "=".repeat(50) + "\n\n";
    cvContent += "INFORMATIONS PERSONNELLES\n";
    cvContent += "-" .repeat(50) + "\n";
    cvContent += `Nom complet : ${cv.nom} ${cv.prenom}\n`;
    cvContent += `Email : ${cv.email}\n`;
    cvContent += `Téléphone : ${cv.telephone || 'Non renseigné'}\n`;
    cvContent += `Adresse : ${cv.adresse || 'Non renseignée'}\n\n`;
    cvContent += "FORMATION ACADÉMIQUE\n";
    cvContent += "-" .repeat(50) + "\n";
    cvContent += `Université : ${cv.universite || 'Non renseignée'}\n`;
    cvContent += `Filière : ${cv.filiere || 'Non renseignée'}\n`;
    cvContent += `Niveau : ${cv.niveau || 'Non renseigné'}\n\n`;
    cvContent += "COMPÉTENCES\n";
    cvContent += "-" .repeat(50) + "\n";
    cvContent += cv.competences.join(", ") || 'Non renseignées\n';
    cvContent += "\n";
    if (cv.experience) { cvContent += "EXPÉRIENCE PROFESSIONNELLE\n" + "-".repeat(50) + `\n${cv.experience}\n\n`; }
    if (cv.formation) { cvContent += "FORMATION COMPLÉMENTAIRE\n" + "-".repeat(50) + `\n${cv.formation}\n\n`; }
    if (cv.langues) { cvContent += "LANGUES\n" + "-".repeat(50) + `\n${cv.langues}\n\n`; }
    if (cv.centresInteret) { cvContent += "CENTRES D'INTÉRÊT\n" + "-".repeat(50) + `\n${cv.centresInteret}\n\n`; }
    cvContent += "=".repeat(50) + "\n";
    cvContent += `Date de création : ${new Date().toLocaleDateString('fr-FR')}\n`;
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${cv.nom}_${cv.prenom}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('success', "✅ CV téléchargé");
  }, [getCurrentCv, showNotification]);

  const handleCvExtraChange = useCallback((e) => {
    setCustomCvExtra(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // ============================================
  // GESTION DU PROFIL
  // ============================================
  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSaveProfil = useCallback(() => {
    const updatedEtudiant = {
      ...etudiant, ...formData,
      competences: formData.competences.split(",").map(c => c.trim()).filter(c => c),
      profilePhoto: photoPreview, cvName: cvName
    };
    onUpdateProfil(updatedEtudiant);
    setIsEditing(false);
    showNotification('success', "✅ Profil mis à jour");
  }, [etudiant, formData, photoPreview, cvName, onUpdateProfil, showNotification]);

  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      showNotification('success', "✅ Photo mise à jour");
    } else {
      showNotification('error', "❌ Image invalide ou trop volumineuse (max 5MB)");
    }
  }, [showNotification]);

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
    
    if (passwordData.ancienMotDePasse !== etudiant.password) {
      showNotification('error', "❌ Ancien mot de passe incorrect");
      return;
    }
    
    onChangePassword(etudiant.id, passwordData.nouveauMotDePasse);
    setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
    showNotification('success', "✅ Mot de passe changé");
  }, [passwordData, etudiant, onChangePassword, showNotification]);

  // ============================================
  // MENU ITEMS
  // ============================================
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

  const getMenuTitle = (id) => {
    const titles = { profil: 'Mon Profil', offres: 'Offres de Stage', mesCandidatures: 'Mes Candidatures', mesStages: 'Mes Stages', favoris: 'Mes Favoris', evaluations: 'Mes Évaluations', changePassword: 'Changer le Mot de Passe', aide: 'Centre d\'Aide' };
    return titles[id] || 'Dashboard';
  };

  if (!etudiant) {
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

      {/* MODAL CV POUR POSTULATION - UTILISE LES INFOS PROFIL */}
      {showCvModal && selectedOffre && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Postuler pour : {selectedOffre.titre}</h3>
              <button onClick={() => setShowCvModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700 leading-relaxed">{selectedOffre.description || "Aucune description disponible"}</p>
                <div className="flex gap-2 mt-3"><span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">{selectedOffre.type}</span><span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{selectedOffre.lieu}</span></div>
              </div>
              
              <div className="space-y-4">
                {/* Upload CV */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-emerald-400 transition">
                  <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Télécharger un CV existant</p>
                  <label className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 inline-flex items-center gap-2 text-sm">
                    <Upload size={16} /> Choisir un fichier
                    <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleCVUpload} />
                  </label>
                  {uploadedCv && <div className="mt-3 p-2 bg-emerald-50 rounded-lg text-sm flex items-center justify-between"><span>📄 {uploadedCv.name}</span><CheckCircle size={16} className="text-emerald-500" /></div>}
                </div>
                
                <div className="text-center text-gray-400 text-sm">OU</div>
                
                {/* Utiliser le CV du profil */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FileText size={18} className="text-emerald-500" /> Utiliser mon CV du profil</h4>
                  <div className="bg-white rounded-lg p-3 mb-3 text-sm">
                    <p className="font-medium text-gray-800">{getCurrentCv().nom} {getCurrentCv().prenom}</p>
                    <p className="text-gray-500 text-xs">{getCurrentCv().email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getCurrentCv().competences.slice(0, 3).map((s, i) => <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{s}</span>)}
                      {getCurrentCv().competences.length > 3 && <span className="text-xs text-gray-400">+{getCurrentCv().competences.length - 3}</span>}
                    </div>
                  </div>
                  <button onClick={handleGenerateCVFromProfile} className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm hover:bg-emerald-600 flex items-center justify-center gap-2">
                    <FilePlus size={14} /> Utiliser ce CV
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 p-6 flex gap-3">
              <button onClick={handleConfirmPostuler} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600">Confirmer la candidature</button>
              <button onClick={() => setShowCvModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-72 bg-gray-900 text-gray-300 flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center"><TrendingUp size={20} className="text-white" /></div>
            <div><h1 className="text-xl font-bold text-white">Stag.io</h1><p className="text-emerald-400 text-xs">Plateforme de stages</p></div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800">
            <p className="text-sm font-medium text-white">{formData.nom || etudiant.nom} {formData.prenom || etudiant.prenom}</p>
            <p className="text-emerald-400 text-xs">{formData.filiere || etudiant.filiere}</p>
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
            {photoPreview ? <img src={photoPreview} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400" /> : <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"><User size={18} className="text-gray-500" /></div>}
            <span className="text-gray-700 font-medium">{formData.nom || etudiant.nom} {formData.prenom || etudiant.prenom}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* ==================== MON PROFIL ==================== */}
          {activeMenu === "profil" && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Bannière et photo */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
                  <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                      {photoPreview ? <img src={photoPreview} alt="Photo" className="w-24 h-24 rounded-full border-4 border-white object-cover" /> : <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center"><User size={40} className="text-gray-400" /></div>}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600"><Camera size={14} className="text-white" /><input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} /></label>
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start">
                    <div><h3 className="text-2xl font-bold text-gray-800">{formData.nom || etudiant.nom} {formData.prenom || etudiant.prenom}</h3><p className="text-gray-500">{formData.email || etudiant.email}</p><p className="text-gray-400 text-sm">Matricule: {formData.matricule || etudiant.matricule || "Non renseigné"}</p></div>
                    {!isEditing ? <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 flex items-center gap-2"><Settings size={16} /> Modifier</button> : <div className="flex gap-2"><button onClick={handleSaveProfil} className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Enregistrer</button><button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2"><X size={16} /> Annuler</button></div>}
                  </div>
                </div>
              </div>

              {/* Informations personnelles - SOURCE UNIQUE */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800"><User size={20} className="text-emerald-500" /> Informations personnelles</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { label: "Nom", name: "nom", value: formData.nom || etudiant.nom },
                    { label: "Prénom", name: "prenom", value: formData.prenom || etudiant.prenom },
                    { label: "Email", name: "email", value: formData.email || etudiant.email, type: "email" },
                    { label: "Matricule", name: "matricule", value: formData.matricule || etudiant.matricule },
                    { label: "Téléphone", name: "telephone", value: formData.telephone || etudiant.telephone, placeholder: "+213 XX XXX XXXX" },
                    { label: "Adresse", name: "adresse", value: formData.adresse || etudiant.adresse, placeholder: "Ville, pays" },
                    { label: "Filière", name: "filiere", value: formData.filiere || etudiant.filiere },
                    { label: "Université", name: "universite", value: formData.universite || etudiant.universite },
                    { label: "Niveau", name: "niveau", value: formData.niveau || etudiant.niveau }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      {isEditing ? <input type={field.type || "text"} name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder} className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400" /> : <p className="text-gray-900 p-2 bg-gray-50 rounded-xl">{field.value || "Non renseigné"}</p>}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compétences (séparées par des virgules)</label>
                    {isEditing ? <input type="text" name="competences" value={formData.competences} onChange={handleInputChange} placeholder="React, Python, JavaScript" className="w-full p-2 border border-gray-200 rounded-xl" /> : <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl">{(formData.competences || etudiant.competences?.join(", ") || "").split(",").map((s, i) => s.trim() && <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm">{s.trim()}</span>)}</div>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    {isEditing ? <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" placeholder="Parlez de vous..." className="w-full p-2 border border-gray-200 rounded-xl" /> : <p className="text-gray-900 p-2 bg-gray-50 rounded-xl">{formData.bio || etudiant.bio || "Aucune présentation"}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION CV UNIQUE - Liée aux infos personnelles */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800"><FileText size={20} className="text-emerald-500" /> Curriculum Vitae (CV)</h3>
                  <button onClick={() => setIsCvEditing(!isCvEditing)} className="text-emerald-600 text-sm hover:text-emerald-700 flex items-center gap-1"><Edit size={14} /> {isCvEditing ? "Fermer" : "Personnaliser"}</button>
                </div>
                
                {/* Aperçu du CV généré à partir des informations personnelles */}
                <div className="bg-gray-50 rounded-xl p-5 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div><h4 className="font-bold text-gray-800">{getCurrentCv().nom} {getCurrentCv().prenom}</h4><p className="text-gray-500 text-sm">{getCurrentCv().email}</p></div>
                    <div className="flex gap-2">
                      <button onClick={handleGenerateCVFromProfile} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs hover:bg-emerald-600 flex items-center gap-1"><FilePlus size={12} /> Générer</button>
                      <button onClick={handleDownloadCV} className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 flex items-center gap-1"><Download size={12} /> Télécharger</button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Téléphone:</span> <span className="text-gray-700">{getCurrentCv().telephone || "Non renseigné"}</span></div>
                    <div><span className="text-gray-500">Adresse:</span> <span className="text-gray-700">{getCurrentCv().adresse || "Non renseignée"}</span></div>
                    <div><span className="text-gray-500">Université:</span> <span className="text-gray-700">{getCurrentCv().universite || "Non renseignée"}</span></div>
                    <div><span className="text-gray-500">Filière:</span> <span className="text-gray-700">{getCurrentCv().filiere || "Non renseignée"}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500">Compétences:</span> <div className="flex flex-wrap gap-1 mt-1">{getCurrentCv().competences.map((s, i) => <span key={i} className="text-xs px-2 py-0.5 bg-white rounded-full">{s}</span>)}</div></div>
                  </div>
                </div>

                {/* Section personnalisation supplémentaire du CV */}
                {isCvEditing && (
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><Edit size={16} className="text-emerald-500" /> Informations complémentaires</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-600 mb-1">Expérience professionnelle</label><textarea name="experience" value={customCvExtra.experience} onChange={handleCvExtraChange} rows="3" placeholder="Décrivez vos expériences..." className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                      <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-600 mb-1">Formation complémentaire</label><textarea name="formation" value={customCvExtra.formation} onChange={handleCvExtraChange} rows="2" placeholder="Certifications, formations..." className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-600 mb-1">Langues</label><input type="text" name="langues" value={customCvExtra.langues} onChange={handleCvExtraChange} placeholder="Arabe, Français, Anglais..." className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-600 mb-1">Centres d'intérêt</label><input type="text" name="centresInteret" value={customCvExtra.centresInteret} onChange={handleCvExtraChange} placeholder="Sport, lecture, voyage..." className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={handleGenerateCVFromProfile} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600">Mettre à jour le CV</button>
                      <button onClick={() => setCustomCvExtra({ experience: "", formation: "", langues: "", centresInteret: "" })} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">Effacer</button>
                    </div>
                  </div>
                )}

                {/* Upload CV externe */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-500 mb-2">Ou téléchargez un CV existant :</p>
                  <label className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 inline-flex items-center gap-2 text-sm"><Upload size={14} /> Choisir un fichier<input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleCVUpload} /></label>
                  {uploadedCv && <div className="mt-2 p-2 bg-emerald-50 rounded-lg text-sm flex items-center justify-between"><span>📄 {uploadedCv.name}</span><button onClick={() => { setUploadedCv(null); setCvName(""); }} className="text-rose-500 text-xs">Supprimer</button></div>}
                </div>
              </div>
            </div>
          )}

          {/* ==================== LISTE DES OFFRES ==================== */}
          {activeMenu === "offres" && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl p-4 shadow-sm flex gap-3 flex-wrap">
                <div className="flex-1 relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Rechercher une offre, entreprise..." value={filters.search} onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400" /></div>
                <select value={filters.type} onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))} className="px-4 py-2 border border-gray-200 rounded-xl"><option>Tous</option><option>Stage PFE</option><option>Stage</option><option>Alternance</option></select>
                <select value={filters.ville} onChange={(e) => setFilters(prev => ({ ...prev, ville: e.target.value }))} className="px-4 py-2 border border-gray-200 rounded-xl"><option>Tous</option><option>Alger</option><option>Oran</option><option>Constantine</option><option>Annaba</option></select>
              </div>
              
              {offresFiltrees.length > 0 ? offresFiltrees.map(offre => (
                <div key={offre.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">{offre.type || 'Stage'}</span>{offre.salaire !== 'Non rémunéré' && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Rémunéré</span>}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{offre.titre}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-3"><Building2 size={16} /><span className="text-sm">{offre.entreprise}</span></div>
                        <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-500"><span className="flex items-center gap-1"><MapPin size={14} /> {offre.lieu}</span><span className="flex items-center gap-1"><Clock size={14} /> {offre.duree}</span><span className="flex items-center gap-1 text-emerald-600 font-medium"><DollarSign size={14} /> {offre.salaire}</span></div>
                        {offre.description && (<div className="mt-3 p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-700 leading-relaxed">{offre.description}</p></div>)}
                        {offre.competences && offre.competences.length > 0 && (<div className="mt-3"><p className="text-xs text-gray-500 mb-2">Compétences requises :</p><div className="flex flex-wrap gap-2">{offre.competences.slice(0, 4).map((s, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{s}</span>)}{offre.competences.length > 4 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{offre.competences.length - 4}</span>}</div></div>)}
                      </div>
                      <div className="flex flex-col items-end gap-3 ml-4">
                        <button onClick={() => toggleFavori(offre.id)} className={`p-2 rounded-full transition-all ${favoris[offre.id] ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-gray-100 text-gray-400 hover:bg-rose-100 hover:text-rose-500"}`}><Heart size={20} fill={favoris[offre.id] ? "white" : "none"} /></button>
                        <button onClick={() => handlePostuler(offre)} className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium">Postuler</button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : <div className="bg-white rounded-xl p-12 text-center"><p className="text-gray-500">Aucune offre trouvée</p></div>}
            </div>
          )}

          {/* ==================== MES CANDIDATURES ==================== */}
          {activeMenu === "mesCandidatures" && (
            <div className="space-y-3">
              {mesCandidatures.length > 0 ? mesCandidatures.map(c => (
                <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-emerald-400">
                  <div className="flex justify-between items-center"><div><h4 className="font-bold text-gray-800">{c.offreTitre}</h4><p className="text-gray-500 text-sm">Postulé le {c.date}</p></div><span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.statut === "acceptee" ? "bg-emerald-100 text-emerald-700" : c.statut === "refusee" ? "bg-rose-100 text-rose-600" : "bg-yellow-100 text-yellow-700"}`}>{c.statut === "acceptee" ? "Acceptée" : c.statut === "refusee" ? "Refusée" : "En attente"}</span></div>
                </div>
              )) : <div className="bg-white rounded-xl p-12 text-center"><Send size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">Aucune candidature</p></div>}
            </div>
          )}

          {/* ==================== MES STAGES ==================== */}
          {activeMenu === "mesStages" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-400"><div className="flex justify-between items-center"><div><h4 className="font-bold text-gray-800">Data Science</h4><p className="text-gray-600">TechAlgerie</p><p className="text-gray-500 text-sm">Période: 01/07/2025 au 31/08/2025</p></div><span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">En attente</span></div></div>
              <div className="bg-white rounded-xl p-12 text-center"><Calendar size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">Mes stages apparaîtront ici</p></div>
            </div>
          )}

          {/* ==================== MES FAVORIS ==================== */}
          {activeMenu === "favoris" && (
            <div className="space-y-3">
              {offresFavoris.length > 0 ? offresFavoris.map(offre => (
                <div key={offre.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-rose-400">
                  <div className="flex justify-between items-start"><div><h4 className="font-bold text-gray-800">{offre.titre}</h4><p className="text-gray-600">{offre.entreprise}</p><div className="flex gap-3 mt-1 text-xs text-gray-500"><span><MapPin size={12} className="inline" /> {offre.lieu}</span><span><Clock size={12} className="inline" /> {offre.duree}</span></div></div><div className="flex flex-col gap-2 items-end"><button onClick={() => toggleFavori(offre.id)} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600"><Heart size={18} fill="white" /></button><button onClick={() => handlePostuler(offre)} className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-600">Postuler</button></div></div>
                </div>
              )) : <div className="bg-white rounded-xl p-12 text-center"><Heart size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">Aucun favori</p><button onClick={() => setActiveMenu("offres")} className="mt-3 text-emerald-600 hover:text-emerald-700">Découvrir des offres →</button></div>}
            </div>
          )}

          {/* ==================== MES ÉVALUATIONS ==================== */}
          {activeMenu === "evaluations" && (
            <div className="bg-white rounded-xl p-12 text-center"><Star size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">Évaluations à venir</p></div>
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
            <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl mx-auto">
              <h3 className="font-bold text-xl mb-5 text-gray-800">📚 Centre d'aide</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-xl"><p className="font-semibold text-gray-700">📝 Comment postuler ?</p><p className="text-gray-600 text-sm mt-1">1. Allez dans "Liste des offres"<br />2. Choisissez une offre<br />3. Cliquez sur "Postuler"<br />4. Choisissez votre CV (upload ou CV du profil)<br />5. Confirmez</p></div>
                <div className="p-4 bg-gray-50 rounded-xl"><p className="font-semibold text-gray-700">❤️ Comment ajouter une offre en favori ?</p><p className="text-gray-600 text-sm mt-1">Cliquez sur le cœur ❤️ à côté de l'offre</p></div>
                <div className="p-4 bg-gray-50 rounded-xl"><p className="font-semibold text-gray-700">📄 Comment fonctionne mon CV ?</p><p className="text-gray-600 text-sm mt-1">Votre CV est automatiquement généré à partir de vos informations personnelles. Vous pouvez ajouter des sections supplémentaires (expérience, formation, langues) en cliquant sur "Personnaliser" dans la section CV.</p></div>
                <div className="p-4 bg-gray-50 rounded-xl"><p className="font-semibold text-gray-700">🔒 Comment changer mon mot de passe ?</p><p className="text-gray-600 text-sm mt-1">Allez dans "Changer mot de passe"</p></div>
                <div className="p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-500"><p className="font-semibold text-emerald-700">📧 Besoin d'aide ?</p><p className="text-gray-600 text-sm mt-1">Contactez-nous : support@stageflow.dz</p></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STYLES CSS INTEGRES */}
      <style jsx>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .spinner { border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #10b981; width: 40px; height: 40px; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}