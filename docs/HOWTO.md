# HOWTO - Démarrer GameFund avec Claude Code (VS Code)

**Guide de démarrage rapide** pour lancer le projet GameFund avec Claude Code directement dans VS Code.

---

## 🎯 Vue d'ensemble en 30 secondes

1. **TOI** : Setup Vite de base (2 min)
2. **TOI** : Ajouter les docs dans le projet (1 min)
3. **CLAUDE CODE** : Crée/modifie les fichiers directement dans VS Code
4. **TOI** : Valider et tester au fur et à mesure

**Durée totale estimée :** 18-20 heures (réparties sur plusieurs jours)

---

## 📦 Fichiers à ta disposition

Tu as **6 fichiers** de référence à mettre dans ton projet :

| Fichier | Description | Emplacement |
|---------|-------------|-------------|
| **HOWTO.md** | Guide de démarrage (ce fichier) | `docs/HOWTO.md` |
| **ACTION_PLAN.md** | Plan détaillé étape par étape | `docs/ACTION_PLAN.md` |
| **PROGRESS.md** | Checklist de suivi | `docs/PROGRESS.md` |
| **PRD_GameFund.md** | Spécifications complètes | `docs/PRD_GameFund.md` |
| **SUPABASE_SETUP.md** | Guide configuration BDD | `docs/SUPABASE_SETUP.md` |
| **DESIGN_GUIDE.md** | Design system complet | `docs/DESIGN_GUIDE.md` |

---

## 🚀 Démarrage rapide (3 étapes)

### **Étape 1 : Setup Vite (TOI - 2 minutes)**

```bash
# Terminal - Dans le dossier de ton choix
npm create vite@latest gamefund -- --template react
cd gamefund
npm install
npm run dev
```

✅ **Validation :** App Vite visible sur http://localhost:5173

**Optionnel (recommandé) :**
```bash
git init
git add .
git commit -m "Initial Vite setup"
```

---

### **Étape 2 : Ajouter les docs (TOI - 1 minute)**

```bash
# Dans le dossier gamefund/
mkdir docs
cd docs

# Copier les 6 fichiers markdown dans ce dossier
# HOWTO.md, ACTION_PLAN.md, PROGRESS.md, 
# PRD_GameFund.md, SUPABASE_SETUP.md, DESIGN_GUIDE.md
```

**Structure attendue :**
```
gamefund/
├── docs/                    ← NOUVEAU
│   ├── HOWTO.md
│   ├── ACTION_PLAN.md
│   ├── PROGRESS.md
│   ├── PRD_GameFund.md
│   ├── SUPABASE_SETUP.md
│   └── DESIGN_GUIDE.md
├── src/
├── public/
├── package.json
└── ...
```

**Optionnel mais recommandé - Créer `.clauderc` :**

```bash
# À la racine du projet gamefund/
touch .clauderc
```

**Contenu de `.clauderc` :**

```json
{
  "instructions": "Tu es un assistant de développement pour GameFund. Avant toute réponse, consulte les documents dans docs/. Stack: Vite + React + Tailwind + Supabase. Génère du code COMPLET. Suis EXACTEMENT le DESIGN_GUIDE.md. JavaScript uniquement (pas TypeScript).",
  "contextFiles": [
    "docs/PRD_GameFund.md",
    "docs/DESIGN_GUIDE.md",
    "docs/SUPABASE_SETUP.md",
    "docs/ACTION_PLAN.md"
  ]
}
```

---

### **Étape 3 : Ouvrir dans VS Code avec Claude Code**

```bash
# Ouvrir le projet dans VS Code
code .
```

**Dans VS Code :**
1. ✅ Extension Claude Code activée
2. ✅ Ouvrir le chat Claude Code (icône dans la sidebar)
3. ✅ Envoyer le premier message (voir ci-dessous)

---

## 💬 Premier Message à Claude Code

Copie-colle ceci dans Claude Code :

```
Salut Claude Code !

Je viens de setup le projet GameFund dans VS Code.

📁 Structure actuelle :
- docs/ contient 6 fichiers de référence
- src/ contient le code Vite de base

📚 Documents de référence disponibles :
1. docs/HOWTO.md - Guide de démarrage
2. docs/ACTION_PLAN.md - Plan détaillé
3. docs/PROGRESS.md - Checklist
4. docs/PRD_GameFund.md - Spécifications
5. docs/SUPABASE_SETUP.md - Config BDD
6. docs/DESIGN_GUIDE.md - Design system

🎯 Projet : Plateforme de crowdfunding pour jeux vidéo
Stack : Vite + React + Tailwind CSS + Supabase

Peux-tu :
1. Lire docs/HOWTO.md pour comprendre le contexte
2. Lire docs/ACTION_PLAN.md pour le workflow
3. Confirmer que tu as accès aux fichiers

Ensuite, on commencera la Phase 1 : Configuration Tailwind.

Prêt ?
```

---

## 🔄 Workflow avec Claude Code (VS Code)

**Claude Code peut :**
✅ Lire tous les fichiers de ton projet  
✅ Créer des fichiers directement  
✅ Modifier des fichiers existants  
✅ Exécuter des commandes terminal  
✅ Voir la structure complète du projet  

**Workflow type :**

1. **TOI → Demande**
   ```
   Crée le composant Button selon docs/DESIGN_GUIDE.md section 3.1
   ```

2. **CLAUDE CODE → Action**
   - Lit `docs/DESIGN_GUIDE.md` section 3.1
   - Crée `src/components/ui/Button.jsx`
   - Écrit le code complet dans le fichier

3. **TOI → Validation**
   - Vérifies le code dans VS Code
   - Testes dans le navigateur (`npm run dev`)
   - Valides : "✅ Button OK ! Passe à Card"

4. **Répète** pour chaque composant/feature

---

## 📋 Les 12 Phases du projet

| # | Phase | Durée | Complexité | Tâches clés |
|---|-------|-------|------------|-------------|
| 1 | Setup & Config | 30 min | ⭐ | Tailwind, structure, packages |
| 2 | Composants UI | 2h | ⭐⭐ | Button, Card, Input, etc. (10 composants) |
| 3 | Layout | 30 min | ⭐ | Header, Footer, Container |
| 4 | Supabase | 1h | ⭐⭐ | BDD, services, hooks |
| 5 | Auth Pages | 1h | ⭐⭐ | Login, Signup, routing |
| 6 | Galerie Publique | 2h | ⭐⭐⭐ | HomePage, ProjectCard, filtres |
| 7 | CRUD Projets | 3h | ⭐⭐⭐ | Créer, éditer, supprimer projets |
| 8 | Dashboard Créateur | 2h | ⭐⭐⭐ | Stats, gestion projets |
| 9 | Système Dons | 2h | ⭐⭐⭐ | Faire don, gérer donations |
| 10 | Dashboard Donateur | 1h | ⭐⭐ | Stats donations |
| 11 | Dashboard Admin | 2h | ⭐⭐⭐ | Gestion globale |
| 12 | Polish & Deploy | 2h | ⭐⭐ | Responsive, déploiement |

**Total : 18-20h** (à répartir sur plusieurs jours)

---

## ✨ Avantages de Claude Code (VS Code)

| Avantage | Description |
|----------|-------------|
| **Édition directe** | Crée/modifie les fichiers automatiquement |
| **Context complet** | Voit tout ton projet en temps réel |
| **Terminal intégré** | Peut exécuter des commandes npm |
| **Multi-fichiers** | Peut modifier plusieurs fichiers d'un coup |
| **Git awareness** | Comprend l'historique et les changements |
| **Pas de copier-coller** | Le code est directement dans tes fichiers |

---

## 💡 Exemple concret : Créer le composant Button

### **1. Toi dans Claude Code (VS Code) :**
```
Phase 2 : Crée le composant Button

Selon docs/DESIGN_GUIDE.md section 3.1, crée src/components/ui/Button.jsx 
avec tous les variants (primary, secondary, outline, ghost, danger, success) 
et tailles (sm, md, lg).
```

### **2. Claude Code :**
- ✅ Lit automatiquement `docs/DESIGN_GUIDE.md` section 3.1
- ✅ Crée le fichier `src/components/ui/Button.jsx` directement dans VS Code
- ✅ Écrit le code complet dans le fichier
- ✅ Te montre un résumé de ce qui a été fait

### **3. Toi :**
- ✅ Ouvres `src/components/ui/Button.jsx` dans VS Code
- ✅ Vérifies que le code correspond aux specs
- ✅ Testes dans le navigateur (`npm run dev`)
- ✅ Git commit si OK

### **4. Toi dans Claude Code :**
```
✅ Button validé ! Passe au composant Card (section 3.2)
```

**Claude Code répète le processus pour Card...**

---

## 🎨 Tester visuellement les composants

### Option A : Tester dans App.jsx

Demande à Claude Code :
```
Dans src/App.jsx, crée une page de test pour le composant Button avec 
tous les variants et tailles
```

Claude Code modifiera `src/App.jsx` pour inclure :

```jsx
import { Button } from './components/ui/Button'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Test Button</h1>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
        {/* ... */}
      </div>
    </div>
  )
}

export default App
```

### Option B : Créer une page démo (recommandé)

Demande à Claude Code :
```
Crée src/pages/ComponentsDemo.jsx avec tous les composants UI 
pour les tester visuellement
```

---

## 🗄️ Configuration Supabase (Phase 4)

**Avant de commencer la Phase 4, tu DOIS configurer Supabase :**

### 1. Créer le projet Supabase
- Aller sur https://supabase.com
- Cliquer "New Project"
- Remplir : nom, mot de passe BDD, région
- Attendre 2-3 min

### 2. Exécuter le SQL
- Aller dans **SQL Editor**
- Copier TOUT le script de `docs/SUPABASE_SETUP.md` section 2.2
- Cliquer **Run**
- Vérifier dans **Table Editor** : 3 tables créées

### 3. Configurer Storage
- Aller dans **Storage**
- Créer bucket `project-images` (public)
- Ajouter les policies (section 3.2 du SUPABASE_SETUP.md)

### 4. Créer un admin
- Suivre section 4 de `docs/SUPABASE_SETUP.md`

### 5. Récupérer credentials
- Aller dans **Settings** > **API**
- Copier **Project URL** et **anon public key**

### 6. Mettre à jour .env
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

✅ **Supabase prêt !** Tu peux lancer la Phase 4 avec Claude Code.

---

## 🔧 Commandes utiles

### Développement
```bash
npm run dev          # Lancer le serveur (http://localhost:5173)
npm run build        # Build production
npm run preview      # Preview du build
```

### Git
```bash
git status                           # Voir les changements
git add .                            # Ajouter tous les fichiers
git commit -m "feat: add Button"    # Commit avec message
git log                              # Historique des commits
```

### Claude Code dans VS Code
```bash
# Claude Code peut exécuter ces commandes pour toi
# Demande-lui : "Installe tailwindcss"
# Il exécutera : npm install -D tailwindcss postcss autoprefixer
```

---

## 🐛 Troubleshooting

### Problème : "Module not found"
```bash
# Vérifier que le package est installé
npm list [package-name]

# Demander à Claude Code de réinstaller
"Installe [package-name]"
```

### Problème : Tailwind ne s'applique pas
Demande à Claude Code :
```
Vérifie que tailwind.config.js et src/index.css sont corrects
```

### Problème : Erreur Supabase
```
J'ai cette erreur Supabase : [erreur]
Voici mon .env : [variables sans les vraies valeurs]
Qu'est-ce qui ne va pas ?
```

### Problème : Import fails
Demande à Claude Code :
```
Corrige les imports dans Button.jsx, j'ai une erreur
```

---

## 📊 Suivre ta progression

Utilise **docs/PROGRESS.md** comme checklist :

```markdown
## Phase 2 : Composants UI
- [x] Button.jsx créé et testé
- [x] Card.jsx créé et testé
- [ ] Badge.jsx
- [ ] Input.jsx
- [ ] ...
```

**Astuce :** Ouvre PROGRESS.md dans VS Code et coche au fur et à mesure.

---

## 💬 Commandes utiles pour Claude Code

### Créer des fichiers
```
Crée src/components/ui/Button.jsx selon docs/DESIGN_GUIDE.md section 3.1
```

### Modifier des fichiers
```
Dans src/App.jsx, remplace le contenu par un test du composant Button
```

### Installer des packages
```
Installe tailwindcss, postcss, autoprefixer, lucide-react, 
react-router-dom, @supabase/supabase-js
```

### Créer une structure
```
Crée la structure de dossiers selon docs/DESIGN_GUIDE.md section 1.4
```

### Debug
```
J'ai cette erreur dans Button.jsx : [erreur]
Comment corriger ?
```

### Exécuter des commandes
```
Lance npm run dev dans le terminal
```

---

## 🎯 Stratégie de développement

### Semaine 1 : Fondations (Phases 1-3)
**Objectif :** Setup + Composants UI + Layout  
**Livrable :** Design system complet et fonctionnel

### Semaine 2 : Backend & Auth (Phases 4-5)
**Objectif :** Supabase + Authentification  
**Livrable :** Login/Signup fonctionnels

### Semaine 3 : Features Core (Phases 6-7)
**Objectif :** Galerie publique + CRUD projets  
**Livrable :** Créer et publier un projet

### Semaine 4 : Features Avancées (Phases 8-9)
**Objectif :** Dashboards + Donations  
**Livrable :** Système de dons complet

### Semaine 5 : Admin & Polish (Phases 10-12)
**Objectif :** Admin + Finitions + Déploiement  
**Livrable :** App en production

---

## ✅ Checklist avant de démarrer

Assure-toi d'avoir :

- [ ] Node.js installé (v18+)
- [ ] npm installé
- [ ] Git installé
- [ ] VS Code installé
- [ ] Extension Claude Code installée
- [ ] Compte Supabase créé
- [ ] Les 6 fichiers markdown téléchargés
- [ ] Dossier `docs/` créé dans le projet
- [ ] 15 minutes pour lire ce fichier
- [ ] Motivation à 100% ! 🚀

---

## 🎓 Ressources

### Documentation
- **Tailwind CSS** : https://tailwindcss.com/docs
- **React Router** : https://reactrouter.com/
- **Supabase** : https://supabase.com/docs
- **Lucide Icons** : https://lucide.dev/

### Fichiers du projet
- `docs/ACTION_PLAN.md` → Guide détaillé avec tous les prompts
- `docs/PROGRESS.md` → Checklist complète à cocher
- `docs/PRD_GameFund.md` → Spécifications fonctionnelles
- `docs/SUPABASE_SETUP.md` → Guide base de données
- `docs/DESIGN_GUIDE.md` → Design system complet

---

## 🚀 Prêt à démarrer ?

**Étapes suivantes :**

1. ✅ Lis ce fichier (HOWTO.md) ← **TU ES ICI**
2. ⚡ Setup Vite de base (2 min)
3. 📁 Crée `docs/` et copie les 6 fichiers (1 min)
4. 💻 Ouvre le projet dans VS Code
5. 🤖 Lance Claude Code avec le prompt Phase 1
6. 🎨 Code, teste, commit, répète !

---

**Bon développement ! Tu as tout ce qu'il faut pour réussir ! 🎉**

---

## 💡 En cas de problème

Si tu bloques à n'importe quelle étape :

1. **Relis la section concernée** dans docs/ACTION_PLAN.md
2. **Consulte docs/DESIGN_GUIDE.md** pour les détails techniques
3. **Demande à Claude Code** de t'expliquer ce qu'il a généré
4. **Vérifie docs/PROGRESS.md** pour voir ce qui a été fait

**Important :** Claude Code est là pour t'aider ! N'hésite pas à lui demander :
- Des explications sur le code généré
- Des modifications si quelque chose ne te convient pas
- De corriger des erreurs
- De simplifier ou d'améliorer quelque chose

**Exemple de prompts utiles :**
```
"Explique-moi pourquoi tu as utilisé forwardRef dans Input.jsx"
"Le Button est trop gros, réduis le padding de 30%"
"J'ai cette erreur : [copier l'erreur]. Comment la corriger ?"
"Peux-tu simplifier ce composant ?"
```

---

**C'est parti ! 🚀**
