import { useState } from 'react';
import { TrendingUp, Mail, Phone, MapPin } from "lucide-react";
import { offresData, entreprisesData, etudiantsData, candidaturesData } from './data/data';
import { Notification } from './Components/Notification';
import { ModalAuth } from './Components/ModalAuth';
import { ModalPostuler } from './Components/ModalPostuler';
import { PageAccueil } from './pages/Accueil';
import { PageOffres } from './pages/Offres';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DashboardEntreprise } from './pages/DashboardEntreprise';
import { DashboardEtudiant } from './pages/DashboardEtudiant';

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [notification, setNotification] = useState(null);
  const [modalPostuler, setModalPostuler] = useState(null);
  const [page, setPage] = useState("accueil");
  
  const [offres, setOffres] = useState(offresData);
  const [entreprises, setEntreprises] = useState(entreprisesData);
  const [etudiants, setEtudiants] = useState(etudiantsData);
  const [candidatures, setCandidatures] = useState(candidaturesData);

  const handleLogin = (email, password) => {
    if (email === "admin@stag.io" && password === "admin123") {
      setUser({ id: 0, nom: "Administrateur", email, role: "admin" });
      setNotification({ message: "✅ Bienvenue Administrateur!", type: "success" });
      setShowAuthModal(false);
      return;
    }
    
    const entreprise = entreprises.find(e => e.email === email && e.password === password);
    if (entreprise) {
      setUser({ id: entreprise.id, nom: entreprise.nom, email, role: "entreprise" });
      setNotification({ message: `✅ Bienvenue ${entreprise.nom}!`, type: "success" });
      setShowAuthModal(false);
      return;
    }
    
    const etudiant = etudiants.find(e => e.email === email && e.password === password);
    if (etudiant) {
      setUser({ id: etudiant.id, nom: etudiant.nom, email, role: "etudiant" });
      setNotification({ message: `✅ Bienvenue ${etudiant.nom}!`, type: "success" });
      setShowAuthModal(false);
      return;
    }
    
    setNotification({ message: "❌ Email ou mot de passe incorrect", type: "error" });
  };

  const handleLogout = () => {
    setUser(null);
    setNotification({ message: "👋 Déconnecté avec succès!", type: "success" });
    setPage("accueil");
  };

  const handleAjouterOffre = (nouvelleOffre) => {
    setOffres([...offres, nouvelleOffre]);
    setNotification({ message: `✅ Offre "${nouvelleOffre.titre}" publiée!`, type: "success" });
  };

  const handleSupprimerOffre = (offreId) => {
    setOffres(offres.filter(o => o.id !== offreId));
    setNotification({ message: "✅ Offre supprimée!", type: "success" });
  };

  const handleUpdateCandidature = (candidatureId, statut) => {
    setCandidatures(candidatures.map(c => c.id === candidatureId ? { ...c, statut } : c));
    setNotification({ message: `✅ Candidature ${statut === "acceptee" ? "acceptée" : "refusée"}!`, type: "success" });
  };

  const handlePostuler = (offre, etudiantId) => {
    const nouvelleCandidature = {
      id: candidatures.length + 1,
      offreId: offre.id,
      offreTitre: offre.titre,
      etudiantId: user.id,
      etudiantNom: user.nom,
      email: user.email,
      date: new Date().toLocaleDateString('fr-FR'),
      statut: "en_attente"
    };
    setCandidatures([...candidatures, nouvelleCandidature]);
    setNotification({ message: `✅ Candidature envoyée pour "${offre.titre}"!`, type: "success" });
  };

  const handleEnvoyerCandidature = (titre) => {
    setNotification({ message: `✅ Candidature envoyée pour "${titre}" avec succès !`, type: "success" });
  };
  
  const handleUpdateProfil = (updatedEtudiant) => {
    setEtudiants(etudiants.map(e => e.id === updatedEtudiant.id ? updatedEtudiant : e));
    if (user && user.id === updatedEtudiant.id) {
      setUser({ ...user, nom: updatedEtudiant.nom });
    }
    setNotification({ message: "✅ Profil mis à jour!", type: "success" });
  };

  const handleChangePassword = (etudiantId, newPassword) => {
    setEtudiants(etudiants.map(e => e.id === etudiantId ? { ...e, password: newPassword } : e));
    setNotification({ message: "✅ Mot de passe changé!", type: "success" });
  };

  const handleEnvoyerContact = () => {
    setNotification({ message: "📧 Votre message a été envoyé avec succès !", type: "success" });
  };
  
  // 👇 Fonction pour gérer le clic sur Postuler
  const handlePostulerClick = (offre) => {
    if (!user) {
      // Si pas connecté → ouvrir modal connexion
      setAuthType("login");
      setShowAuthModal(true);
      // Sauvegarder l'offre pour postuler après connexion
      setModalPostuler(offre);
    } else if (user.role === "etudiant") {
      // Si étudiant connecté → ouvrir modal postuler
      setModalPostuler(offre);
    } else {
      // Si entreprise ou admin → message erreur
      setNotification({ message: "❌ Seuls les étudiants peuvent postuler aux stages!", type: "error" });
    }
  };

  const renderDashboard = () => {
    if (!user) return null;
    
    if (user.role === "admin") {
      return (
        <DashboardAdmin 
          offres={offres}
          entreprises={entreprises}
          candidatures={candidatures}
          onUpdateOffre={() => {}}
          onDeleteOffre={handleSupprimerOffre}
          onUpdateCandidature={handleUpdateCandidature}
          onLogout={handleLogout}
        />
      );
    }
    
    if (user.role === "entreprise") {
      const entreprise = entreprises.find(e => e.id === user.id);
      return (
        <DashboardEntreprise 
          entreprise={entreprise}
          offres={offres}
          candidatures={candidatures}
          onAjouterOffre={handleAjouterOffre}
          onSupprimerOffre={handleSupprimerOffre}
          onLogout={handleLogout}
        />
      );
    }
    
    if (user.role === "etudiant") {
      const etudiant = etudiants.find(e => e.id === user.id);
      return (
        <DashboardEtudiant 
          etudiant={etudiant}
          offres={offres}
          candidatures={candidatures}
          onPostuler={(offre) => handlePostuler(offre, user.id)}
          onLogout={handleLogout}
          onUpdateProfil={handleUpdateProfil}
          onChangePassword={handleChangePassword}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Stag.io</h1>
          </div>
          
          {!user && (
            <div className="flex gap-6">
              <button onClick={() => setPage("accueil")} className={`${page === "accueil" ? "text-blue-600 font-semibold" : "text-gray-600"} hover:text-blue-600 transition-all duration-300 hover:scale-110`}>Accueil</button>
              <button onClick={() => setPage("offres")} className={`${page === "offres" ? "text-blue-600 font-semibold" : "text-gray-600"} hover:text-blue-600 transition-all duration-300 hover:scale-110`}>Offres</button>
            </div>
          )}
          
          <div className="flex gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg">
                    {user.role === "entreprise" ? "🏢" : user.role === "admin" ? "👨‍💼" : "👨‍🎓"}
                  </div>
                  <span className="font-semibold">{user.nom}</span>
                </div>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-semibold">Déconnexion</button>
              </div>
            ) : (
              <>
                <button onClick={() => { setAuthType("login"); setShowAuthModal(true); }} className="px-4 py-1.5 text-blue-600 font-semibold hover:scale-105 transition">Connexion</button>
                <button onClick={() => { setAuthType("register"); setShowAuthModal(true); }} className="bg-blue-500 text-white px-5 py-1.5 rounded-lg font-semibold hover:bg-blue-600 transition">Inscription</button>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {user ? (
        renderDashboard()
      ) : (
        <>
          {page === "accueil" ? (
            <PageAccueil 
              allerAuxOffres={() => setPage("offres")} 
              onEnvoyerContact={handleEnvoyerContact}
            />
          ) : (
            <PageOffres onPostulerClick={handlePostulerClick} />
          )}
        </>
      )}
      
      {/* 👇 Modal Postuler modifié avec isLoggedIn et onOpenAuth */}
      {modalPostuler  && (
        <ModalPostuler 
          offre={modalPostuler}
          onClose={() => setModalPostuler(null)}
          onEnvoyer={handleEnvoyerCandidature}
          isLoggedIn={!!user}
          onOpenAuth={() => {
            setAuthType("login");
            setShowAuthModal(true);
          }}
        />
      )}
      
      {showAuthModal && (
        <ModalAuth 
          type={authType}
          onClose={() => {
            setShowAuthModal(false);
            setModalPostuler(null); // Effacer l'offre sauvegardée si ferme
          }}
          onLogin={handleLogin}
          onRegister={(data) => {
            if (data.role === "entreprise") {
              const newEntreprise = { id: entreprises.length + 1, ...data, logo: "🏢" };
              setEntreprises([...entreprises, newEntreprise]);
            } else {
              const newEtudiant = { id: etudiants.length + 1, ...data };
              setEtudiants([...etudiants, newEtudiant]);
            }
            setNotification({ message: "✅ Inscription réussie! Connectez-vous.", type: "success" });
            setShowAuthModal(false);
          }}
        />
      )}
      
    
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;