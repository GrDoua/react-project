import { useState } from 'react';
import { Star, User, Briefcase, ShieldCheck, CheckCircle, Mail, Phone, MapPin, Award, TrendingUp } from "lucide-react";

export function PageAccueil({ allerAuxOffres, onEnvoyerContact }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!nom.trim()) newErrors.nom = "Nom obligatoire";
    if (!email.trim()) {
      newErrors.email = "Email obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email invalide";
    }
    if (!message.trim()) newErrors.message = "Message obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onEnvoyerContact();
      setNom("");
      setEmail("");
      setMessage("");
      setErrors({});
    }
  };

  return (
    <div>
      <div className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <img 
            src="https://www.e-relation-client.com/wp-content/uploads/2019/05/adults-analysis-brainstorming-1661004.jpg" 
            alt="background" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-white max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span>#1 Plateforme de stages en Algérie</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Décrochez le stage <br />
              <span className="text-yellow-300">de vos rêves</span>
            </h1>
            <p className="text-lg md:text-3xl font-bold mb-8">
              Rejoignez +3000 étudiants et trouvez votre stage idéal dans les meilleures entreprises
            </p>
            <button onClick={allerAuxOffres} className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transform transition-all duration-300 hover:scale-110">
              Explorer les offres →
            </button>
          </div>
        </div>
      </div>
      
      <div className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group transform transition-all duration-300 hover:scale-110 hover:-translate-y-2">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-900">Offres</div>
            </div>
            <div className="group transform transition-all duration-300 hover:scale-110 hover:-translate-y-2">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-900">Entreprises</div>
            </div>
            <div className="group transform transition-all duration-300 hover:scale-110 hover:-translate-y-2">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">3000+</div>
              <div className="text-gray-900">Étudiants</div>
            </div>
            <div className="group transform transition-all duration-300 hover:scale-110 hover:-translate-y-2">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-900">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-yellow-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Fonctionnalités</h2>
          <p className="text-gray-600 text-center mb-12">Tout ce dont vous avez besoin pour réussir</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-3 transform group">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                <User className="text-white" size={28} />
              </div>
              <h3 className="text-xl text-center font-bold mb-2">Espace Étudiant</h3>
              <p className="text-gray-600 text-center">Créez votre CV et postulez facilement</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-3 transform group">
              <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                <Briefcase className="text-white" size={28} />
              </div>
              <h3 className="text-xl text-center font-bold mb-2">Espace Entreprise</h3>
              <p className="text-gray-600 text-center">Publiez vos offres gratuitement</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-3 transform group">
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <h3 className="text-xl text-center font-bold mb-2">Offres Vérifiées</h3>
              <p className="text-gray-600 text-center">Qualité et sécurité garanties</p>
            </div>
          </div>
        </div>
      </div>
      
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-blue-700">À propos de Stag.io</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Stag.io est la première plateforme algérienne dédiée à la mise en relation entre étudiants et entreprises pour les stages.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Notre mission est de simplifier la recherche de stages et d'accompagner les jeunes talents vers leur réussite professionnelle.
              </p>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Pourquoi nous choisir ?</h3>
                <ul className="space-y-2">
                  {["100% Gratuit pour les étudiants", "Offres vérifiées", "Support réactif 7j/7", "Accès illimité"].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle size={18} className="text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=500&fit=crop" 
                className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                alt="Team"
              />
            </div>
          </div>
        </div>
      </section>
      
      <div className="py-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-yellow-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Contactez-nous</h2>
          <p className="text-gray-600 text-center mb-12">Une question ? Notre équipe est là pour vous aider</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div>
                <input type="text" placeholder="Votre nom" value={nom} onChange={(e) => setNom(e.target.value)} className={`w-full p-3 mb-1 border rounded-lg ${errors.nom ? "border-red-500" : ""}`} />
                {errors.nom && <p className="text-red-500 text-sm mb-2">{errors.nom}</p>}
              </div>
              <div>
                <input type="email" placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full p-3 mb-1 border rounded-lg ${errors.email ? "border-red-500" : ""}`} />
                {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
              </div>
              <div>
                <textarea placeholder="Votre message" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} className={`w-full p-3 mb-1 border rounded-lg ${errors.message ? "border-red-500" : ""}`} />
                {errors.message && <p className="text-red-500 text-sm mb-2">{errors.message}</p>}
              </div>
              <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Envoyer</button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4"><Mail size={24} className="text-blue-600" /><div><p className="font-semibold">Email</p><p>contact@stag.io</p></div></div>
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4"><Phone size={24} className="text-indigo-600" /><div><p className="font-semibold">Téléphone</p><p>+213 123 456 789</p></div></div>
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4"><MapPin size={24} className="text-blue-700" /><div><p className="font-semibold">Adresse</p><p>Constantine, Algérie</p></div></div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}