# Documentation GameFund

Ce dossier contient toute la documentation de référence pour le projet GameFund.

---

## 📚 Fichiers

### **HOWTO.md** ⭐ COMMENCE ICI
Guide de démarrage rapide pour lancer le projet avec Claude Code dans VS Code.

**À lire en premier !** (5 minutes)

---

### **ACTION_PLAN.md**
Plan de développement détaillé en 12 phases avec tous les prompts à utiliser pour Claude Code.

**Utilisation :** Référence pendant le développement pour savoir quoi demander à Claude Code.

---

### **PROGRESS.md**
Checklist complète de suivi du projet.

**Utilisation :** Coche les cases au fur et à mesure. Ouvre ce fichier dans VS Code et garde-le visible.

---

### **PRD_GameFund.md**
Product Requirements Document - Spécifications fonctionnelles complètes du projet.

**Contenu :**
- Vue d'ensemble du projet
- 3 types d'acteurs (Visiteur, User, Admin)
- Fonctionnalités détaillées
- Modèle de données
- User stories
- Plan de développement

**Utilisation :** Référence pour Claude Code. À consulter pour comprendre les fonctionnalités.

---

### **SUPABASE_SETUP.md**
Guide complet de configuration de la base de données Supabase.

**Contenu :**
- Création du projet Supabase
- Script SQL complet (tables, fonctions, triggers, RLS)
- Configuration du Storage
- Création d'un utilisateur admin
- Tests et troubleshooting

**Utilisation :** À suivre étape par étape lors de la Phase 4.

---

### **DESIGN_GUIDE.md**
Design system complet avec tous les composants UI.

**Contenu :**
- Setup Tailwind CSS complet
- Palette de couleurs GameFund (purple/green)
- 10 composants UI avec code complet prêt à l'emploi
- Composants spécifiques (ProjectCard, ProjectGrid, etc.)
- Layout components (Header, Footer, Container)
- Conventions de code
- Responsive patterns
- Animations

**Utilisation :** Référence principale pour Claude Code lors des phases de développement UI.

---

## 🚀 Comment utiliser cette documentation

### **Pour démarrer :**
1. Lis `HOWTO.md` (5 min)
2. Suis les 3 étapes de setup
3. Lance Claude Code avec le premier prompt

### **Pendant le développement :**
1. Consulte `ACTION_PLAN.md` pour savoir quelle phase tu travailles
2. Copie les prompts de `ACTION_PLAN.md` pour Claude Code
3. Coche `PROGRESS.md` au fur et à mesure
4. Réfère-toi à `DESIGN_GUIDE.md` pour voir le code des composants
5. Consulte `PRD_GameFund.md` pour comprendre les fonctionnalités

### **Pour Supabase (Phase 4) :**
1. Ouvre `SUPABASE_SETUP.md`
2. Suis les instructions étape par étape
3. Exécute le script SQL complet
4. Configure le Storage
5. Récupère les credentials pour `.env`

---

## 📁 Structure du projet

```
gamefund/
├── docs/                          ← Tu es ici
│   ├── README.md                 ← Ce fichier
│   ├── HOWTO.md                  ← ⭐ Commence ici
│   ├── ACTION_PLAN.md            ← Plan détaillé
│   ├── PROGRESS.md               ← Checklist
│   ├── PRD_GameFund.md           ← Spécifications
│   ├── SUPABASE_SETUP.md         ← Guide BDD
│   └── DESIGN_GUIDE.md           ← Design system
│
├── src/                          ← Code React (créé par Claude Code)
│   ├── components/
│   │   ├── ui/                   ← Composants réutilisables
│   │   ├── layout/               ← Header, Footer, Container
│   │   ├── projects/             ← Composants projets
│   │   └── donations/            ← Composants donations
│   ├── pages/
│   │   ├── public/               ← Pages publiques
│   │   ├── creator/              ← Pages créateur
│   │   ├── donor/                ← Pages donateur
│   │   └── admin/                ← Pages admin
│   ├── hooks/                    ← Custom hooks
│   ├── services/                 ← Services Supabase
│   └── utils/                    ← Fonctions utilitaires
│
├── .clauderc                     ← Config Claude Code (optionnel)
├── .env                          ← Variables d'environnement
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## ⏱️ Durée estimée par phase

| Phase | Durée | Tâches |
|-------|-------|--------|
| 1. Setup & Config | 30 min | Tailwind, structure |
| 2. Composants UI | 2h | 10 composants |
| 3. Layout | 30 min | Header, Footer |
| 4. Supabase | 1h | BDD, services |
| 5. Auth Pages | 1h | Login, Signup |
| 6. Galerie | 2h | HomePage, filtres |
| 7-12. Features | 12h | CRUD, dashboards |

**Total : 18-20 heures**

---

## 🎯 Ordre de lecture recommandé

1. **HOWTO.md** (5 min) - Comprendre le workflow global
2. **ACTION_PLAN.md** (10 min) - Parcourir rapidement les phases
3. **DESIGN_GUIDE.md** (optionnel) - Si tu veux voir le design system
4. **PRD_GameFund.md** (optionnel) - Pour comprendre les fonctionnalités en détail

**Note :** Les fichiers sont volumineux. Pas besoin de tout lire, Claude Code les consultera pour toi !

---

## 💡 Tips

- **Ne lis pas tout !** Commence par HOWTO.md et laisse Claude Code lire le reste
- **Utilise PROGRESS.md** comme checklist (ouvre-le dans VS Code)
- **Consulte ACTION_PLAN.md** pour les prompts exacts à donner à Claude Code
- **Réfère à DESIGN_GUIDE.md** quand tu as besoin de voir le code d'un composant

---

**Prêt ? Ouvre HOWTO.md et c'est parti ! 🚀**
