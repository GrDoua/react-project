// Données simulées (Base de données)
export const offresData = [
  { id: 1, image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop", titre: "Développeur Full Stack", entreprise: "TechSolutions", lieu: "Alger", duree: "6 mois", type: "Stage PFE", salaire: "30 000 DA", competences: ["React", "Node.js"], date: "30 Mai 2026", entrepriseId: 1, statut: "active" },
  { id: 2, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=150&h=150&fit=crop", titre: "Designer UI/UX", entreprise: "Creative Studio", lieu: "Oran", duree: "4 mois", type: "Stage", salaire: "25 000 DA", competences: ["Figma", "Photoshop"], date: "15 Juin 2026", entrepriseId: 2, statut: "active" },
  { id: 3, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop", titre: "Data Scientist", entreprise: "DataVision", lieu: "Constantine", duree: "6 mois", type: "Stage PFE", salaire: "35 000 DA", competences: ["Python", "SQL"], date: "20 Mai 2026", entrepriseId: 3, statut: "active" },
  { id: 4, image: "https://plus.unsplash.com/premium_photo-1683872921964-25348002a392?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D", titre: "Marketing Digital", entreprise: "DigitalBoost", lieu: "Tizi Ouzou", duree: "3 mois", type: "Stage", salaire: "20 000 DA", competences: ["SEO", "Social Media"], date: "10 Juin 2026", entrepriseId: 4, statut: "active" },
  { id: 5, image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=150&h=150&fit=crop", titre: "DevOps Engineer", entreprise: "CloudAlgérie", lieu: "Alger", duree: "5 mois", type: "Stage PFE", salaire: "40 000 DA", competences: ["Docker", "Kubernetes"], date: "25 Mai 2026", entrepriseId: 5, statut: "active" },
  { id: 6, image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&h=150&fit=crop", titre: "Comptable", entreprise: "FinancePro", lieu: "Annaba", duree: "4 mois", type: "Stage", salaire: "22 000 DA", competences: ["Comptabilité", "Excel"], date: "05 Juin 2026", entrepriseId: 6, statut: "active" },
];

export const entreprisesData = [
  { id: 1, nom: "TechSolutions", email: "contact@techsolutions.dz", logo: "💻", secteur: "Informatique", description: "Leader en solutions technologiques", password: "entreprise123" },
  { id: 2, nom: "Creative Studio", email: "contact@creativestudio.dz", logo: "🎨", secteur: "Design", description: "Agence de design créatif", password: "entreprise123" },
  { id: 3, nom: "DataVision", email: "contact@datavision.dz", logo: "📊", secteur: "Data", description: "Expert en analyse de données", password: "entreprise123" },
];


export const candidaturesData = [
  { id: 1, offreId: 1, offreTitre: "Développeur Full Stack", etudiantId: 1, etudiantNom: "Ahmed Benali", email: "ahmed@univ.dz", date: "2026-05-20", statut: "en_attente" },
  { id: 2, offreId: 2, offreTitre: "Designer UI/UX", etudiantId: 2, etudiantNom: "Sarah Mansouri", email: "sarah@univ.dz", date: "2026-05-21", statut: "en_attente" },
];
export const etudiantsData = [
  { 
    id: 1, 
    nom: "Ahmed Benali", 
    email: "ahmed@univ.dz", 
    password: "etudiant123",
    filiere: "Informatique", 
    universite: "USTHB", 
    competences: ["React", "Node.js", "Python"],
    telephone: "0551 12 34 56",
    adresse: "Alger, Algérie",
    bio: "Étudiant passionné par le développement web et les nouvelles technologies",
    cv: null
  },
  { 
    id: 2, 
    nom: "Sarah Mansouri", 
    email: "sarah@univ.dz", 
    password: "etudiant123",
    filiere: "Marketing Digital", 
    universite: "Université d'Alger", 
    competences: ["SEO", "Social Media", "Content Marketing"],
    telephone: "0551 23 45 67",
    adresse: "Alger, Algérie",
    bio: "Étudiante en marketing digital, passionnée par la création de contenu",
    cv: null
  },
];