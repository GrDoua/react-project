import { useState } from 'react';
import { Search,TrendingUp, Filter, MapPin, Clock, DollarSign, Heart, ChevronRight, Award, X, Calendar, Building, Tag, ArrowLeft } from "lucide-react";
import { offresData } from "../data/data";

export function PageOffres({ onPostulerClick }) {
  const [recherche, setRecherche] = useState("");
  const [typeStage, setTypeStage] = useState("Tous");
  const [ville, setVille] = useState("Tous");
  const [likes, setLikes] = useState({});
  const [selectedOffre, setSelectedOffre] = useState(null); // État pour l'offre sélectionnée

  const offresFiltrees = offresData.filter(offre => {
    const memeRecherche = offre.titre.toLowerCase().includes(recherche.toLowerCase()) || 
                         offre.entreprise.toLowerCase().includes(recherche.toLowerCase());
    const memeType = typeStage === "Tous" || offre.type === typeStage;
    const memeVille = ville === "Tous" || offre.lieu === ville;
    return memeRecherche && memeType && memeVille;
  });

  // Fonction pour ouvrir les détails d'une offre
  const openOffreDetails = (offre) => {
    setSelectedOffre(offre);
    document.body.style.overflow = 'hidden';
  };

  // Fonction pour fermer les détails
  const closeOffreDetails = () => {
    setSelectedOffre(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <div className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Award size={18} className="text-blue-600" />
              <span className="text-blue-600 font-semibold">+1000 Offres disponibles</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Trouvez votre stage idéal</h2>
            <p className="text-gray-600">Découvrez des milliers d'opportunités en Algérie</p>
          </div>
          
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-20"></div>
              <div className="relative bg-white rounded-xl shadow-lg p-1">
                <div className="flex items-center">
                  <Search className="text-gray-400 ml-3" size={20} />
                  <input type="text" placeholder="Rechercher par titre, entreprise..." className="flex-1 px-3 py-3 outline-none rounded-lg" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold">Chercher</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                <Filter size={16} className="text-blue-700" />
                <span className="font-bold">Filtres:</span>
              </div>
              <select value={typeStage} onChange={(e) => setTypeStage(e.target.value)} className="px-4 py-2 border rounded-lg bg-blue-100">
                <option>Tous</option><option>Stage PFE</option><option>Stage</option>
              </select>
              <select value={ville} onChange={(e) => setVille(e.target.value)} className="px-4 py-2 bg-blue-100 border rounded-lg">
                <option>Tous</option><option>Alger</option><option>Oran</option><option>Constantine</option><option>Tizi Ouzou</option><option>Annaba</option>
              </select>
            </div>
            <button onClick={() => { setTypeStage("Tous"); setVille("Tous"); setRecherche(""); }} className="text-red-500 hover:text-red-600 bg-red-100 px-4 py-2 border rounded-lg text-sm font-bold">Réinitialiser</button>
          </div>
          
          <p className="mb-6 text-gray-600"><span className="font-bold text-blue-600">{offresFiltrees.length}</span> offre(s) trouvée(s)</p>
          
          {offresFiltrees.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offresFiltrees.map(offre => (
                <div key={offre.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-3 overflow-hidden group">
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    <span className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600">{offre.type}</span>
                    <button onClick={() => setLikes({...likes, [offre.id]: !likes[offre.id]})} className="absolute top-3 right-3 bg-white p-2 rounded-full hover:scale-110 transition-all duration-300">
                      <Heart className={`w-4 h-4 ${likes[offre.id] ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-20 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <img src={offre.image} alt={offre.entreprise} className="w-20 h-16 rounded-xl object-cover border-2 border-gray-200" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition">{offre.titre}</h3>
                        <p className="text-gray-500 text-sm">{offre.entreprise}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="flex items-center gap-2 text-gray-600 text-sm"><MapPin size={14} className="text-yellow-500" />{offre.lieu}</p>
                      <p className="flex items-center gap-2 text-gray-600 text-sm"><Clock size={14} className="text-blue-500" />{offre.duree}</p>
                      <p className="flex items-center gap-2 text-gray-600 text-sm"><DollarSign size={14} className="text-green-500" /><span className="font-bold text-green-600">{offre.salaire}</span></p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {offre.competences.map((skill, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-yellow-100 transition-all duration-300">{skill}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-xs text-gray-400">📅 {offre.date}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openOffreDetails(offre)} 
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all hover:scale-105 flex items-center gap-1"
                        >
                          Voir détails
                        </button>
                        <button 
                          onClick={() => onPostulerClick(offre)} 
                          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                        >
                          Postuler <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500">Aucune offre trouvée</p>
              <button onClick={() => { setTypeStage("Tous"); setVille("Tous"); setRecherche(""); }} className="mt-3 text-red-700 font-bold hover:text-red-700">Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Page des détails de l'offre */}
      {selectedOffre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fadeInUp">
            {/* En-tête avec image de couverture */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl">
              <button 
                onClick={closeOffreDetails}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition"
              >
                <X size={24} className="text-white" />
              </button>
              <div className="absolute -bottom-12 left-6">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={selectedOffre.image} alt={selectedOffre.entreprise} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Contenu des détails */}
            <div className="pt-16 pb-8 px-6">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedOffre.titre}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building size={16} />
                    <span>{selectedOffre.entreprise}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setLikes({...likes, [selectedOffre.id]: !likes[selectedOffre.id]})}
                    className={`p-3 rounded-full transition-all ${likes[selectedOffre.id] ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-100'}`}
                  >
                    <Heart size={20} fill={likes[selectedOffre.id] ? "white" : "none"} />
                  </button>
                  <button 
                    onClick={() => onPostulerClick(selectedOffre)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Postuler maintenant
                  </button>
                </div>
              </div>

              {/* Informations clés */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <MapPin size={20} className="mx-auto text-blue-500 mb-1" />
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="font-semibold text-gray-800">{selectedOffre.lieu}</p>
                </div>
                <div className="text-center">
                  <Clock size={20} className="mx-auto text-blue-500 mb-1" />
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="font-semibold text-gray-800">{selectedOffre.duree}</p>
                </div>
                <div className="text-center">
                  <DollarSign size={20} className="mx-auto text-green-500 mb-1" />
                  <p className="text-sm text-gray-500">Salaire</p>
                  <p className="font-semibold text-green-600">{selectedOffre.salaire}</p>
                </div>
                <div className="text-center">
                  <Calendar size={20} className="mx-auto text-blue-500 mb-1" />
                  <p className="text-sm text-gray-500">Date limite</p>
                  <p className="font-semibold text-gray-800">{selectedOffre.date}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Tag size={20} className="text-blue-500" />
                  Description du poste
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedOffre.description || `Nous recherchons un(e) ${selectedOffre.titre} talentueux(se) pour rejoindre notre équipe chez ${selectedOffre.entreprise}. 
                  Vous serez responsable de contribuer aux projets innovants et de développer vos compétences dans un environnement professionnel stimulant.
                  Le stage d'une durée de ${selectedOffre.duree} vous permettra d'acquérir une expérience précieuse et de mettre en pratique vos connaissances théoriques.`}
                </p>
              </div>

              {/* Compétences requises */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Compétences requises</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedOffre.competences.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Avantages */}
              <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-3">✨ Avantages du stage</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Indemnité de stage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Attestation de stage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Encadrement professionnel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Opportunité d'embauche</span>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-4 pt-4 border-t">
                <button 
                  onClick={closeOffreDetails}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
                >
                  <ArrowLeft size={18} />
                  Retour aux offres
                </button>
                <button 
                  onClick={() => onPostulerClick(selectedOffre)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Postuler maintenant
                </button>
              </div>
              
                    
            </div>
          </div>
        </div>
      )}

        {/* Footer */}
                    <footer className="bg-gray-900 text-white py-12 px-6">
                      <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                                <TrendingUp size={16} className="text-white" />
                              </div>
                              <h3 className="text-xl font-bold text-blue-700">
                                Stag.io
                              </h3>
                            </div>
                            <p className="text-gray-400 text-sm">La plateforme #1 pour trouver votre stage idéal en Algérie</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-4">Liens rapides</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                              <li><button onClick={() => setPage("accueil")} className="hover:text-white transition">Accueil</button></li>
                              <li><button onClick={() => setPage("offres")} className="hover:text-white transition">Offres</button></li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                              <li><a href="#" className="hover:text-white transition">Conditions</a></li>
                              <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
                              <li><a href="#" className="hover:text-white transition">Aide</a></li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-4">Suivez-nous</h4>
                            <div className="flex gap-3">
                              {["LinkedIn", "Twitter", "Facebook"].map((social, i) => (
                                <a key={i} href="#" className="text-gray-400 hover:text-white transition">{social}</a>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                          <p>© 2026 Stag.io - Tous droits réservés</p>
                        </div>
                      </div>
                    </footer>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}