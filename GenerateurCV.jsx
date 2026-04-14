import { useState } from 'react';
import { Download, FileText, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Code, Save, Eye, X } from "lucide-react";

export function GenerateurCV({ etudiant, onSave, onClose }) {
  const [cvData, setCvData] = useState({
    // Informations personnelles
    nom: etudiant?.nom || "",
    email: etudiant?.email || "",
    telephone: etudiant?.telephone || "",
    adresse: etudiant?.adresse || "",
    titre: "Étudiant en Informatique",
    bio: etudiant?.bio || "",
    
    // Formation
    formation: [
      {
        diplome: etudiant?.filiere || "Licence en Informatique",
        etablissement: etudiant?.universite || "Université",
        annee: "2023 - 2026",
        description: ""
      }
    ],
    
    // Expériences
    experiences: [
      {
        poste: "",
        entreprise: "",
        periode: "",
        description: ""
      }
    ],
    
    // Compétences
    competences: etudiant?.competences?.join(", ") || "",
    
    // Langues
    langues: [
      { nom: "Arabe", niveau: "Langue maternelle" },
      { nom: "Français", niveau: "Courant" },
      { nom: "Anglais", niveau: "Intermédiaire" }
    ],
    
    // Projets
    projets: [
      {
        nom: "",
        description: "",
        technologies: ""
      }
    ],
    
    // Centres d'intérêt
    interets: ""
  });

  const [activeSection, setActiveSection] = useState("info");
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (e) => {
    setCvData({ ...cvData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (section, index, field, value) => {
    const newArray = [...cvData[section]];
    newArray[index][field] = value;
    setCvData({ ...cvData, [section]: newArray });
  };

  const addItem = (section, newItem) => {
    setCvData({ ...cvData, [section]: [...cvData[section], newItem] });
  };

  const removeItem = (section, index) => {
    const newArray = cvData[section].filter((_, i) => i !== index);
    setCvData({ ...cvData, [section]: newArray });
  };

  const handleSave = () => {
    const cvComplete = {
      ...cvData,
      competences: cvData.competences.split(",").map(c => c.trim()),
      dateCreation: new Date().toLocaleDateString()
    };
    onSave(cvComplete);
    onClose();
  };

  const CVPreview = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="border-b-2 border-blue-500 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{cvData.nom || "Nom Prénom"}</h1>
        <p className="text-blue-600 text-lg mt-1">{cvData.titre}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {cvData.email && <span className="flex items-center gap-1"><Mail size={14} /> {cvData.email}</span>}
          {cvData.telephone && <span className="flex items-center gap-1"><Phone size={14} /> {cvData.telephone}</span>}
          {cvData.adresse && <span className="flex items-center gap-1"><MapPin size={14} /> {cvData.adresse}</span>}
        </div>
      </div>

      {/* Bio */}
      {cvData.bio && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Profil</h2>
          <p className="text-gray-600">{cvData.bio}</p>
        </div>
      )}

      {/* Formation */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <GraduationCap size={20} className="text-blue-500" /> Formation
        </h2>
        {cvData.formation.map((f, i) => (
          <div key={i} className="mb-3">
            <h3 className="font-semibold text-gray-800">{f.diplome}</h3>
            <p className="text-gray-600 text-sm">{f.etablissement} | {f.annee}</p>
            {f.description && <p className="text-gray-500 text-sm mt-1">{f.description}</p>}
          </div>
        ))}
      </div>

      {/* Expériences */}
      {cvData.experiences.some(e => e.poste) && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Briefcase size={20} className="text-blue-500" /> Expériences
          </h2>
          {cvData.experiences.map((e, i) => e.poste && (
            <div key={i} className="mb-3">
              <h3 className="font-semibold text-gray-800">{e.poste}</h3>
              <p className="text-gray-600 text-sm">{e.entreprise} | {e.periode}</p>
              {e.description && <p className="text-gray-500 text-sm mt-1">{e.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Compétences */}
      {cvData.competences && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Code size={20} className="text-blue-500" /> Compétences
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.competences.split(",").map((skill, i) => skill.trim() && (
              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{skill.trim()}</span>
            ))}
          </div>
        </div>
      )}

      {/* Langues */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Langues</h2>
        <div className="space-y-2">
          {cvData.langues.map((l, i) => (
            <div key={i}>
              <span className="font-medium text-gray-800">{l.nom}</span>
              <span className="text-gray-500 text-sm ml-2">- {l.niveau}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projets */}
      {cvData.projets.some(p => p.nom) && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Projets</h2>
          {cvData.projets.map((p, i) => p.nom && (
            <div key={i} className="mb-3">
              <h3 className="font-semibold text-gray-800">{p.nom}</h3>
              <p className="text-gray-500 text-sm">{p.description}</p>
              {p.technologies && <p className="text-xs text-gray-400 mt-1">Technologies: {p.technologies}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const sections = [
    { id: "info", label: "Informations", icon: <User size={16} /> },
    { id: "formation", label: "Formation", icon: <GraduationCap size={16} /> },
    { id: "experiences", label: "Expériences", icon: <Briefcase size={16} /> },
    { id: "competences", label: "Compétences", icon: <Code size={16} /> },
    { id: "langues", label: "Langues", icon: <FileText size={16} /> },
    { id: "projets", label: "Projets", icon: <Save size={16} /> }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">📄 Générateur de CV</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 flex items-center gap-2 ${
                activeSection === section.id 
                  ? "border-b-2 border-blue-500 text-blue-600 font-semibold" 
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <Eye size={16} /> {previewMode ? "Modifier" : "Aperçu"}
          </button>
        </div>

        <div className="p-6">
          {previewMode ? (
            <CVPreview />
          ) : (
            <div className="space-y-6">
              {/* Informations personnelles */}
              {activeSection === "info" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations personnelles</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" name="nom" value={cvData.nom} onChange={handleChange} placeholder="Nom complet" className="p-2 border rounded-lg" />
                    <input type="email" name="email" value={cvData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded-lg" />
                    <input type="tel" name="telephone" value={cvData.telephone} onChange={handleChange} placeholder="Téléphone" className="p-2 border rounded-lg" />
                    <input type="text" name="adresse" value={cvData.adresse} onChange={handleChange} placeholder="Adresse" className="p-2 border rounded-lg" />
                    <input type="text" name="titre" value={cvData.titre} onChange={handleChange} placeholder="Titre professionnel" className="p-2 border rounded-lg md:col-span-2" />
                    <textarea name="bio" value={cvData.bio} onChange={handleChange} placeholder="Bio / Présentation" rows="3" className="p-2 border rounded-lg md:col-span-2" />
                  </div>
                </div>
              )}

              {/* Formation */}
              {activeSection === "formation" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Formation</h3>
                  {cvData.formation.map((f, i) => (
                    <div key={i} className="border p-4 rounded-lg mb-4">
                      <input type="text" value={f.diplome} onChange={(e) => handleArrayChange("formation", i, "diplome", e.target.value)} placeholder="Diplôme" className="w-full p-2 border rounded-lg mb-2" />
                      <input type="text" value={f.etablissement} onChange={(e) => handleArrayChange("formation", i, "etablissement", e.target.value)} placeholder="Établissement" className="w-full p-2 border rounded-lg mb-2" />
                      <input type="text" value={f.annee} onChange={(e) => handleArrayChange("formation", i, "annee", e.target.value)} placeholder="Année" className="w-full p-2 border rounded-lg mb-2" />
                      <textarea value={f.description} onChange={(e) => handleArrayChange("formation", i, "description", e.target.value)} placeholder="Description" rows="2" className="w-full p-2 border rounded-lg" />
                      <button onClick={() => removeItem("formation", i)} className="text-red-500 text-sm mt-2">Supprimer</button>
                    </div>
                  ))}
                  <button onClick={() => addItem("formation", { diplome: "", etablissement: "", annee: "", description: "" })} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    + Ajouter une formation
                  </button>
                </div>
              )}

              {/* Expériences */}
              {activeSection === "experiences" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Expériences</h3>
                  {cvData.experiences.map((e, i) => (
                    <div key={i} className="border p-4 rounded-lg mb-4">
                      <input type="text" value={e.poste} onChange={(e) => handleArrayChange("experiences", i, "poste", e.target.value)} placeholder="Poste" className="w-full p-2 border rounded-lg mb-2" />
                      <input type="text" value={e.entreprise} onChange={(e) => handleArrayChange("experiences", i, "entreprise", e.target.value)} placeholder="Entreprise" className="w-full p-2 border rounded-lg mb-2" />
                      <input type="text" value={e.periode} onChange={(e) => handleArrayChange("experiences", i, "periode", e.target.value)} placeholder="Période" className="w-full p-2 border rounded-lg mb-2" />
                      <textarea value={e.description} onChange={(e) => handleArrayChange("experiences", i, "description", e.target.value)} placeholder="Description" rows="2" className="w-full p-2 border rounded-lg" />
                      <button onClick={() => removeItem("experiences", i)} className="text-red-500 text-sm mt-2">Supprimer</button>
                    </div>
                  ))}
                  <button onClick={() => addItem("experiences", { poste: "", entreprise: "", periode: "", description: "" })} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    + Ajouter une expérience
                  </button>
                </div>
              )}

              {/* Compétences */}
              {activeSection === "competences" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Compétences</h3>
                  <textarea name="competences" value={cvData.competences} onChange={handleChange} placeholder="Séparez vos compétences par des virgules (ex: React, Python, JavaScript)" rows="4" className="w-full p-2 border rounded-lg" />
                  <p className="text-sm text-gray-500 mt-2">💡 Astuce: Ajoutez vos compétences techniques et soft skills</p>
                </div>
              )}

              {/* Langues */}
              {activeSection === "langues" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Langues</h3>
                  {cvData.langues.map((l, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                      <input type="text" value={l.nom} onChange={(e) => handleArrayChange("langues", i, "nom", e.target.value)} placeholder="Langue" className="flex-1 p-2 border rounded-lg" />
                      <select value={l.niveau} onChange={(e) => handleArrayChange("langues", i, "niveau", e.target.value)} className="flex-1 p-2 border rounded-lg">
                        <option>Débutant</option><option>Intermédiaire</option><option>Courant</option><option>Langue maternelle</option>
                      </select>
                      <button onClick={() => removeItem("langues", i)} className="text-red-500">✕</button>
                    </div>
                  ))}
                  <button onClick={() => addItem("langues", { nom: "", niveau: "Intermédiaire" })} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    + Ajouter une langue
                  </button>
                </div>
              )}

              {/* Projets */}
              {activeSection === "projets" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Projets</h3>
                  {cvData.projets.map((p, i) => (
                    <div key={i} className="border p-4 rounded-lg mb-4">
                      <input type="text" value={p.nom} onChange={(e) => handleArrayChange("projets", i, "nom", e.target.value)} placeholder="Nom du projet" className="w-full p-2 border rounded-lg mb-2" />
                      <textarea value={p.description} onChange={(e) => handleArrayChange("projets", i, "description", e.target.value)} placeholder="Description" rows="2" className="w-full p-2 border rounded-lg mb-2" />
                      <input type="text" value={p.technologies} onChange={(e) => handleArrayChange("projets", i, "technologies", e.target.value)} placeholder="Technologies utilisées" className="w-full p-2 border rounded-lg" />
                      <button onClick={() => removeItem("projets", i)} className="text-red-500 text-sm mt-2">Supprimer</button>
                    </div>
                  ))}
                  <button onClick={() => addItem("projets", { nom: "", description: "", technologies: "" })} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    + Ajouter un projet
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save size={16} /> Enregistrer le CV
          </button>
        </div>
      </div>
    </div>
  );
}