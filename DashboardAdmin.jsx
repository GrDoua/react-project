import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BarChart3, Briefcase, Building, Users, GraduationCap, TrendingUp,
  User, LogOut, Check, X, CheckCircle, Camera, Save, Edit2, Key,
  Eye, Phone, Mail, MapPin, Calendar, Clock, Award, AlertCircle,
  Search, Filter, Trash2, FileText, MessageCircle, HelpCircle, BookOpen,
  ExternalLink, DollarSign, Star, Upload, Download, FilePlus, Send,
  PieChart, Activity, ArrowUp, ArrowDown, MoreHorizontal, Zap,
  Target, Calendar as CalendarIcon, Clock as ClockIcon
} from "lucide-react";

// ============================================
// COMPOSANT DASHBOARD ADMIN PROFESSIONNEL
// ============================================
export function DashboardAdmin({ 
  offres = [], 
  entreprises = [], 
  candidatures = [], 
  onDeleteOffre, 
  onUpdateCandidature, 
  onLogout, 
  onUpdateProfil, 
  onChangePassword 
}) {
  // États principaux
  const [activeMenu, setActiveMenu] = useState("profil");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // États pour le profil
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

  // États pour les candidatures avec conventions
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showConventionModal, setShowConventionModal] = useState(false);
  const [conventionFile, setConventionFile] = useState(null);
  const [conventionName, setConventionName] = useState("");
  const [showSendConventionModal, setShowSendConventionModal] = useState(false);
  
  // États pour les stagiaires et évaluations
  const [stagiaires, setStagiaires] = useState([]);
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluation, setEvaluation] = useState({
    note: 0,
    commentaire: "",
    ponctualite: 0,
    qualiteTravail: 0,
    autonomie: 0,
    espritEquipe: 0,
    progression: ""
  });

  // États pour les graphiques (simulation)
  const [selectedPeriode, setSelectedPeriode] = useState("mois");

  // ============================================
  // DONNÉES CALCULÉES
  // ============================================
  useEffect(() => {
    const acceptedCandidatures = candidatures.filter(c => c.statut === "acceptee");
    const stagiairesList = acceptedCandidatures.map(c => ({
      id: c.id,
      nom: c.etudiantNom,
      email: c.email,
      telephone: c.telephone || "Non renseigné",
      offreTitre: c.offreTitre,
      entreprise: c.entrepriseNom || "Entreprise",
      dateDebut: c.dateDebut || "01/07/2025",
      dateFin: c.dateFin || "31/08/2025",
      statut: "En stage",
      evaluation: c.evaluation || null,
      convention: c.convention || null
    }));
    setStagiaires(stagiairesList);
  }, [candidatures]);

  const stats = useMemo(() => ({
    totalOffres: offres?.length || 0,
    totalEntreprises: entreprises?.length || 0,
    totalCandidatures: candidatures?.length || 0,
    offresActives: offres?.filter(o => o.statut === "active").length || 0,
    offresExpirees: offres?.filter(o => o.statut === "expiree" || (o.dateFin && new Date(o.dateFin) < new Date())).length || 0,
    totalStagiaires: stagiaires.length,
    tauxAcceptation: candidatures?.length ? Math.round((candidatures.filter(c => c.statut === "acceptee").length / candidatures.length) * 100) : 0,
    tauxRefus: candidatures?.length ? Math.round((candidatures.filter(c => c.statut === "refusee").length / candidatures.length) * 100) : 0,
    tauxAttente: candidatures?.length ? Math.round((candidatures.filter(c => c.statut === "en_attente").length / candidatures.length) * 100) : 0,
    evolutionOffres: +12,
    evolutionCandidatures: +23,
    evolutionStagiaires: +8
  }), [offres, entreprises, candidatures, stagiaires]);

  // Données pour les graphiques
  const graphData = {
    mois: { offres: [12, 15, 18, 22, 28, 35, 42, 48, 52, 58, 62, 68], candidatures: [8, 12, 18, 25, 35, 48, 62, 78, 95, 112, 128, 145] },
    semaine: { offres: [8, 12, 15, 18, 22, 25, 28], candidatures: [5, 8, 12, 18, 25, 32, 40] },
    annee: { offres: [120, 145, 168, 192, 215], candidatures: [85, 110, 145, 185, 230] }
  };

  const currentData = graphData[selectedPeriode];

  const candidaturesFiltrees = useMemo(() => {
    let filtered = [...candidatures];
    if (filterStatut !== "Tous") filtered = filtered.filter(c => c.statut === filterStatut);
    if (searchTerm) filtered = filtered.filter(c => 
      (c.etudiantNom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.offreTitre || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered;
  }, [candidatures, filterStatut, searchTerm]);

  const stagiairesFiltres = useMemo(() => {
    if (!searchTerm) return stagiaires;
    return stagiaires.filter(s => 
      s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.offreTitre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stagiaires, searchTerm]);

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
    setChefProfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSaveProfil = useCallback(() => {
    if (onUpdateProfil) onUpdateProfil(chefProfil);
    setIsEditing(false);
    showNotification('success', "✅ Profil mis à jour");
  }, [chefProfil, onUpdateProfil, showNotification]);

  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      showNotification('success', "✅ Photo mise à jour");
    } else showNotification('error', "❌ Image invalide");
  }, [showNotification]);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
      showNotification('success', "✅ Logo mis à jour");
    } else showNotification('error', "❌ Image invalide");
  }, [showNotification]);

  // ============================================
  // GESTION DES CANDIDATURES
  // ============================================
  const handleAccepterCandidature = useCallback((candidature) => {
    setSelectedCandidature(candidature);
    setShowConventionModal(true);
  }, []);

  const handleRefuserCandidature = useCallback((candidatureId) => {
    if (onUpdateCandidature) {
      onUpdateCandidature(candidatureId, "refusee");
      showNotification('warning', "❌ Candidature refusée");
    }
  }, [onUpdateCandidature, showNotification]);

  const handleUploadConvention = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size <= 5 * 1024 * 1024) {
        setConventionFile(file);
        setConventionName(file.name);
        showNotification('success', "✅ Convention chargée");
      } else showNotification('error', "❌ Fichier trop volumineux (max 5MB)");
    } else showNotification('error', "❌ Format PDF uniquement");
  }, [showNotification]);

  const handleConfirmAcceptation = useCallback(() => {
    if (!conventionFile) {
      showNotification('error', "❌ Veuillez télécharger la convention");
      return;
    }
    if (onUpdateCandidature) {
      onUpdateCandidature(selectedCandidature.id, "acceptee", { convention: conventionName });
      showNotification('success', `✅ Candidature acceptée - Convention: ${conventionName}`);
    }
    setShowConventionModal(false);
    setSelectedCandidature(null);
    setConventionFile(null);
    setConventionName("");
  }, [conventionFile, selectedCandidature, onUpdateCandidature, showNotification]);

  const handleSendConvention = useCallback((candidature) => {
    setSelectedCandidature(candidature);
    setConventionFile(null);
    setConventionName("");
    setShowSendConventionModal(true);
  }, []);

  const handleSendConventionToCandidat = useCallback(() => {
    if (!conventionFile) {
      showNotification('error', "❌ Veuillez sélectionner une convention");
      return;
    }
    showNotification('success', `📧 Convention envoyée à ${selectedCandidature.etudiantNom} (${selectedCandidature.email})`);
    setShowSendConventionModal(false);
    setSelectedCandidature(null);
    setConventionFile(null);
    setConventionName("");
  }, [conventionFile, selectedCandidature, showNotification]);

  // ============================================
  // GESTION DES ÉVALUATIONS DES STAGIAIRES
  // ============================================
  const handleEvaluaterStagiaire = useCallback((stagiaire) => {
    setSelectedStagiaire(stagiaire);
    setEvaluation({
      note: stagiaire.evaluation?.note || 0,
      commentaire: stagiaire.evaluation?.commentaire || "",
      ponctualite: stagiaire.evaluation?.ponctualite || 0,
      qualiteTravail: stagiaire.evaluation?.qualiteTravail || 0,
      autonomie: stagiaire.evaluation?.autonomie || 0,
      espritEquipe: stagiaire.evaluation?.espritEquipe || 0,
      progression: stagiaire.evaluation?.progression || ""
    });
    setShowEvaluationModal(true);
  }, []);

  const handleSaveEvaluation = useCallback(() => {
    const updatedEvaluation = {
      ...evaluation,
      date: new Date().toLocaleDateString('fr-FR'),
      moyenne: Math.round((evaluation.ponctualite + evaluation.qualiteTravail + evaluation.autonomie + evaluation.espritEquipe) / 4)
    };
    
    if (onUpdateCandidature) {
      onUpdateCandidature(selectedStagiaire.id, "acceptee", { evaluation: updatedEvaluation });
    }
    
    setStagiaires(prev => prev.map(s => 
      s.id === selectedStagiaire.id ? { ...s, evaluation: updatedEvaluation } : s
    ));
    
    showNotification('success', `✅ Évaluation enregistrée pour ${selectedStagiaire.nom}`);
    setShowEvaluationModal(false);
    setSelectedStagiaire(null);
  }, [evaluation, selectedStagiaire, onUpdateCandidature, showNotification]);

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
    
    if (passwordData.ancienMotDePasse !== "admin123") {
      showNotification('error', "❌ Ancien mot de passe incorrect");
      return;
    }
    
    if (onChangePassword) onChangePassword(passwordData.nouveauMotDePasse);
    setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
    showNotification('success', "✅ Mot de passe changé");
  }, [passwordData, onChangePassword, showNotification]);

  // ============================================
  // MENU ITEMS (Mon profil en premier)
  // ============================================
  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "statistiques", label: "Tableau de bord", icon: <BarChart3 size={18} /> },
    { id: "candidatures", label: "Candidatures", icon: <Users size={18} /> },
    { id: "stagiaires", label: "Stagiaires", icon: <GraduationCap size={18} /> },
    { id: "changePassword", label: "Changer mot de passe", icon: <Key size={18} /> },
    { id: "aide", label: "Conditions & Aide", icon: <HelpCircle size={18} /> },
  ];

  const getMenuTitle = (id) => {
    const titles = {
      profil: 'Mon profil', statistiques: 'Tableau de bord',
      candidatures: 'Candidatures', stagiaires: 'Stagiaires',
      entreprises: 'Entreprises', changePassword: 'Changer le mot de passe',
      aide: 'Conditions & Aide'
    };
    return titles[id] || 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* NOTIFICATION */}
      {notification.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`${notification.type === 'success' ? 'bg-emerald-500' : notification.type === 'warning' ? 'bg-amber-500' : 'bg-rose-500'} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* MODAL CONVENTION POUR ACCEPTATION */}
      {showConventionModal && selectedCandidature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Accepter la candidature</h3>
              <button onClick={() => setShowConventionModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                <p className="font-medium text-gray-800">{selectedCandidature.etudiantNom}</p>
                <p className="text-sm text-gray-600">{selectedCandidature.offreTitre}</p>
                <p className="text-xs text-gray-500 mt-1">📧 {selectedCandidature.email}</p>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-emerald-400 transition">
                <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">Télécharger la convention de stage</p>
                <p className="text-xs text-gray-400 mb-3">Format PDF uniquement (max 5MB)</p>
                <label className="bg-emerald-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-600 inline-flex items-center gap-2 text-sm">
                  <Upload size={14} /> Choisir un fichier
                  <input type="file" accept=".pdf" className="hidden" onChange={handleUploadConvention} />
                </label>
                {conventionName && (
                  <div className="mt-3 p-2 bg-emerald-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2"><FileText size={16} className="text-emerald-500" /><span className="text-sm">{conventionName}</span></div>
                    <CheckCircle size={16} className="text-emerald-500" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">La convention sera envoyée automatiquement à l'étudiant par email</p>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={handleConfirmAcceptation} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2"><Send size={16} /> Accepter & Envoyer</button>
              <button onClick={() => setShowConventionModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ENVOI CONVENTION À UN CANDIDAT ACCEPTÉ */}
      {showSendConventionModal && selectedCandidature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Envoyer une convention</h3>
              <button onClick={() => setShowSendConventionModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                <p className="font-medium text-gray-800">{selectedCandidature.etudiantNom}</p>
                <p className="text-sm text-gray-600">{selectedCandidature.offreTitre}</p>
                <p className="text-xs text-gray-500 mt-1">📧 {selectedCandidature.email}</p>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-emerald-400 transition">
                <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">Sélectionner la convention (PDF)</p>
                <p className="text-xs text-gray-400 mb-3">Format PDF uniquement (max 5MB)</p>
                <label className="bg-emerald-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-600 inline-flex items-center gap-2 text-sm">
                  <Upload size={14} /> Choisir un fichier
                  <input type="file" accept=".pdf" className="hidden" onChange={handleUploadConvention} />
                </label>
                {conventionName && (
                  <div className="mt-3 p-2 bg-emerald-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2"><FileText size={16} className="text-emerald-500" /><span className="text-sm">{conventionName}</span></div>
                    <CheckCircle size={16} className="text-emerald-500" />
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={handleSendConventionToCandidat} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2"><Send size={16} /> Envoyer la convention</button>
              <button onClick={() => setShowSendConventionModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ÉVALUATION STAGIAIRE */}
      {showEvaluationModal && selectedStagiaire && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Évaluation du stagiaire</h3>
              <button onClick={() => setShowEvaluationModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                <h4 className="font-bold text-gray-800">{selectedStagiaire.nom}</h4>
                <p className="text-sm text-gray-600">{selectedStagiaire.offreTitre} - {selectedStagiaire.entreprise}</p>
                <p className="text-xs text-gray-500 mt-1"><Calendar size={12} className="inline" /> {selectedStagiaire.dateDebut} → {selectedStagiaire.dateFin}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Critères d'évaluation (sur 20)</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Ponctualité / Assiduité", value: evaluation.ponctualite, set: (v) => setEvaluation(prev => ({ ...prev, ponctualite: v })) },
                      { label: "Qualité du travail", value: evaluation.qualiteTravail, set: (v) => setEvaluation(prev => ({ ...prev, qualiteTravail: v })) },
                      { label: "Autonomie / Initiative", value: evaluation.autonomie, set: (v) => setEvaluation(prev => ({ ...prev, autonomie: v })) },
                      { label: "Esprit d'équipe", value: evaluation.espritEquipe, set: (v) => setEvaluation(prev => ({ ...prev, espritEquipe: v })) }
                    ].map((critere, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span>{critere.label}</span>
                          <span className="font-medium text-emerald-600">{critere.value}/20</span>
                        </div>
                        <div className="flex gap-1">
                          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(score => (
                            <button key={score} onClick={() => critere.set(score)} className={`flex-1 h-2 rounded-full transition-all ${critere.value >= score ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Note générale (sur 5)</h4>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setEvaluation(prev => ({ ...prev, note: star }))} className="text-3xl">
                        <Star size={32} className={evaluation.note >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Commentaire général</h4>
                  <textarea rows="3" value={evaluation.commentaire} onChange={(e) => setEvaluation(prev => ({ ...prev, commentaire: e.target.value }))} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Appréciation générale..." />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Progression / Axes d'amélioration</h4>
                  <textarea rows="2" value={evaluation.progression} onChange={(e) => setEvaluation(prev => ({ ...prev, progression: e.target.value }))} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Points forts et axes d'amélioration..." />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={handleSaveEvaluation} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600"><Save size={16} className="inline mr-2" /> Enregistrer l'évaluation</button>
              <button onClick={() => setShowEvaluationModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200">Annuler</button>
            </div>
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
            <div><h1 className="text-xl font-bold text-white">Stag.io</h1><p className="text-emerald-400 text-xs">Espace Admin</p></div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800">
            <p className="text-sm font-medium text-white">{chefProfil.nom}</p>
            <p className="text-emerald-400 text-xs">{chefProfil.titre}</p>
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
            <span className="text-gray-700 font-medium">{chefProfil.nom}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* MON PROFIL (Premier) */}
          {activeMenu === "profil" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
                  <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                      {photoPreview ? <img src={photoPreview} alt="Photo" className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white" /> : <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center"><User size={40} className="text-gray-400" /></div>}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600"><Camera size={14} className="text-white" /><input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} /></label>
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start">
                    <div>{!isEditing ? (<><h3 className="text-2xl font-bold text-gray-800">{chefProfil.nom}</h3><p className="text-emerald-600 font-medium">{chefProfil.titre}</p><p className="text-gray-500 text-sm">{chefProfil.email}</p></>) : (<div className="space-y-2"><input type="text" name="nom" value={chefProfil.nom} onChange={handleInputChange} className="p-2 border rounded-lg w-full" /><input type="text" name="titre" value={chefProfil.titre} onChange={handleInputChange} className="p-2 border rounded-lg w-full" /><input type="email" name="email" value={chefProfil.email} onChange={handleInputChange} className="p-2 border rounded-lg w-full" /></div>)}</div>
                    {!isEditing ? <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Edit2 size={16} /> Modifier</button> : <div className="flex gap-2"><button onClick={handleSaveProfil} className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Enregistrer</button><button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2"><X size={16} /> Annuler</button></div>}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><User size={18} className="text-emerald-500" /> Informations professionnelles</h4>
                <div className="grid md:grid-cols-2 gap-5">
                  <div><label className="text-sm text-gray-500 flex items-center gap-1 mb-1"><Phone size={14} /> Téléphone</label>{!isEditing ? <p className="text-gray-800">{chefProfil.telephone}</p> : <input type="tel" name="telephone" value={chefProfil.telephone} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />}</div>
                  <div><label className="text-sm text-gray-500 flex items-center gap-1 mb-1"><MapPin size={14} /> Bureau</label>{!isEditing ? <p className="text-gray-800">{chefProfil.bureau}</p> : <input type="text" name="bureau" value={chefProfil.bureau} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />}</div>
                  <div className="md:col-span-2"><label className="text-sm text-gray-500 mb-1 block">Bio</label>{!isEditing ? <p className="text-gray-800 p-2 bg-gray-50 rounded-lg">{chefProfil.bio}</p> : <textarea name="bio" value={chefProfil.bio} onChange={handleInputChange} rows="3" className="w-full p-2 border rounded-lg"></textarea>}</div>
                </div>
              </div>
            </div>
          )}

          {/* STATISTIQUES */}
          {activeMenu === "statistiques" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-2xl font-bold text-gray-800">Tableau de bord</h3><p className="text-gray-500 text-sm">Bienvenue, {chefProfil.nom} 👋</p></div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedPeriode("semaine")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedPeriode === "semaine" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Semaine</button>
                  <button onClick={() => setSelectedPeriode("mois")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedPeriode === "mois" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Mois</button>
                  <button onClick={() => setSelectedPeriode("annee")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedPeriode === "annee" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Année</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Total Offres</p><p className="text-3xl font-bold text-gray-800">{stats.totalOffres}</p><p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ArrowUp size={12} /> +{stats.evolutionOffres}%</p></div><div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center"><Briefcase size={24} className="text-emerald-600" /></div></div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-blue-500">
                  <div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Entreprises</p><p className="text-3xl font-bold text-gray-800">{stats.totalEntreprises}</p><p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ArrowUp size={12} /> +5</p></div><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Building size={24} className="text-blue-600" /></div></div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-purple-500">
                  <div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Candidatures</p><p className="text-3xl font-bold text-gray-800">{stats.totalCandidatures}</p><p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ArrowUp size={12} /> +{stats.evolutionCandidatures}%</p></div><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><Users size={24} className="text-purple-600" /></div></div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-orange-500">
                  <div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Stagiaires</p><p className="text-3xl font-bold text-gray-800">{stats.totalStagiaires}</p><p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ArrowUp size={12} /> +{stats.evolutionStagiaires}%</p></div><div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><GraduationCap size={24} className="text-orange-600" /></div></div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4"><h4 className="font-semibold text-gray-800">📈 Évolution des offres et candidatures</h4><Activity size={18} className="text-gray-400" /></div>
                  <div className="h-64 relative"><div className="absolute inset-0 flex items-end gap-2 pt-6">{currentData.offres.map((value, idx) => (<div key={idx} className="flex-1 flex flex-col items-center gap-1"><div className="w-full flex flex-col gap-1"><div className="bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600" style={{ height: `${(value / Math.max(...currentData.offres)) * 180}px` }}></div><div className="bg-blue-400 rounded-t-lg transition-all hover:bg-blue-500" style={{ height: `${(currentData.candidatures[idx] / Math.max(...currentData.candidatures)) * 120}px` }}></div></div><span className="text-xs text-gray-500 mt-2">{idx + 1}</span></div>))}</div></div>
                  <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded"></div><span className="text-xs text-gray-600">Offres</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded"></div><span className="text-xs text-gray-600">Candidatures</span></div></div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4">🎯 Répartition des candidatures</h4>
                  <div className="space-y-4"><div><div className="flex justify-between text-sm mb-1"><span>Acceptées</span><span className="font-semibold text-emerald-600">{stats.tauxAcceptation}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: `${stats.tauxAcceptation}%`}}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span>En attente</span><span className="font-semibold text-yellow-600">{stats.tauxAttente}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full" style={{width: `${stats.tauxAttente}%`}}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span>Refusées</span><span className="font-semibold text-rose-600">{stats.tauxRefus}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-rose-500 h-2 rounded-full" style={{width: `${stats.tauxRefus}%`}}></div></div></div></div>
                </div>
              </div>
            </div>
          )}

          {/* CANDIDATURES */}
          {activeMenu === "candidatures" && (
            <div>
              <div className="flex flex-wrap gap-4 mb-5 items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Gestion des candidatures</h3>
                <div className="flex gap-3">
                  <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm w-64" /></div>
                  <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm"><option value="Tous">Tous</option><option value="en_attente">En attente</option><option value="acceptee">Acceptée</option><option value="refusee">Refusée</option></select>
                </div>
              </div>
              <div className="space-y-3">
                {candidaturesFiltrees.map(c => (
                  <div key={c.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${c.statut === "acceptee" ? "border-emerald-400" : c.statut === "refusee" ? "border-rose-400" : "border-yellow-400"}`}>
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{c.etudiantNom}</h4>
                        <p className="text-gray-600 text-sm">{c.offreTitre}</p>
                        <p className="text-xs text-gray-400">Postulé le {c.date}</p>
                        {c.convention && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600"><FileText size={12} /> Convention: {c.convention}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {c.statut === "acceptee" && (
                          <button onClick={() => handleSendConvention(c)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-600 flex items-center gap-1"><Send size={14} /> Convention</button>
                        )}
                        {c.statut === "en_attente" && (
                          <>
                            <button onClick={() => handleAccepterCandidature(c)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-600 flex items-center gap-1"><FileText size={14} /> Accepter + Convention</button>
                            <button onClick={() => handleRefuserCandidature(c.id)} className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-rose-600 flex items-center gap-1"><X size={14} /> Refuser</button>
                          </>
                        )}
                        {c.statut === "refusee" && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-600">Refusée</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGIAIRES - Avec bouton Évaluer */}
          {activeMenu === "stagiaires" && (
            <div>
              <div className="flex gap-4 mb-5">
                <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Rechercher un stagiaire..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {stagiairesFiltres.map(s => (
                  <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"><User size={20} className="text-emerald-600" /></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{s.nom}</h4>
                        <p className="text-sm text-gray-600">{s.offreTitre}</p>
                        <p className="text-xs text-gray-500">{s.entreprise}</p>
                        <div className="flex gap-3 mt-2 text-xs text-gray-400"><span><Calendar size={12} className="inline" /> {s.dateDebut} → {s.dateFin}</span></div>
                      </div>
                      <button onClick={() => handleEvaluaterStagiaire(s)} className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${s.evaluation ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-blue-500 text-white hover:bg-blue-600"}`}>
                        <Star size={14} /> {s.evaluation ? "Modifier évaluation" : "Évaluer"}
                      </button>
                    </div>
                    {s.evaluation && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < s.evaluation.note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />)}</div>
                          <span className="text-xs text-gray-500">Note: {s.evaluation.note}/5</span>
                          <span className="text-xs text-gray-400">• {s.evaluation.date}</span>
                        </div>
                        {s.evaluation.commentaire && <p className="text-xs text-gray-600 mt-1 line-clamp-1">{s.evaluation.commentaire}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {stagiairesFiltres.length === 0 && <div className="bg-white rounded-xl p-12 text-center"><GraduationCap size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">Aucun stagiaire pour le moment</p></div>}
            </div>
          )}

         

          {/* CHANGER MOT DE PASSE */}
          {activeMenu === "changePassword" && (
            <div className="max-w-md mx-auto"><div className="bg-white rounded-2xl shadow-sm p-8"><div className="text-center mb-6"><div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Key size={40} className="text-emerald-500" /></div><h3 className="text-2xl font-bold text-gray-800">Changer le mot de passe</h3><p className="text-gray-500 text-sm mt-2">Sécurisez votre compte</p></div><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label><input type="password" name="ancienMotDePasse" value={passwordData.ancienMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Entrez votre mot de passe actuel" />{passwordErrors.ancienMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.ancienMotDePasse}</p>}</div><div><label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label><input type="password" name="nouveauMotDePasse" value={passwordData.nouveauMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Minimum 6 caractères" />{passwordErrors.nouveauMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.nouveauMotDePasse}</p>}</div><div><label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label><input type="password" name="confirmerMotDePasse" value={passwordData.confirmerMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Retapez votre nouveau mot de passe" />{passwordErrors.confirmerMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.confirmerMotDePasse}</p>}</div><div className="flex gap-3 pt-4"><button onClick={handleSubmitPasswordChange} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">Changer</button><button onClick={() => { setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" }); setPasswordErrors({}); }} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300">Réinitialiser</button></div></div></div></div>
          )}

          {/* AIDE */}
          {activeMenu === "aide" && (
            <div className="max-w-4xl mx-auto space-y-6"><div className="bg-white rounded-2xl shadow-sm p-6"><h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2"><HelpCircle size={24} className="text-emerald-500" /> Centre d'aide</h3><p className="text-gray-500 text-sm mb-6">Retrouvez ici toutes les informations nécessaires pour utiliser la plateforme</p><div className="space-y-4"><div className="border-b border-gray-100 pb-4"><h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2"><BookOpen size={16} className="text-emerald-500" /> Rôle de l'administrateur</h4><p className="text-gray-600 text-sm">En tant qu'administrateur, vous pouvez gérer les candidatures (accepter avec convention, refuser), évaluer les stagiaires, et superviser l'ensemble du processus.</p></div><div className="border-b border-gray-100 pb-4"><h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2"><Star size={16} className="text-emerald-500" /> Comment évaluer un stagiaire ?</h4><p className="text-gray-600 text-sm">1. Allez dans "Stagiaires"<br />2. Cliquez sur le bouton "Évaluer"<br />3. Remplissez les critères (ponctualité, qualité, autonomie, esprit d'équipe)<br />4. Ajoutez un commentaire et enregistrez</p></div><div className="bg-emerald-50 rounded-xl p-4 border-l-4 border-emerald-500"><h4 className="font-semibold text-emerald-700 flex items-center gap-2 mb-2"><ExternalLink size={16} /> Support technique</h4><p className="text-gray-600 text-sm">support@stageflow.dz</p></div></div></div></div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}