# Plan d'Action - GameFund avec Claude Code

**Projet** : GameFund - Plateforme de crowdfunding pour jeux vidéo  
**Stack** : Vite + React + Tailwind CSS + Supabase  
**Développement** : Avec Claude Code

---

## 🎯 Vue d'ensemble

Ce plan décrit étape par étape comment démarrer et développer le projet GameFund en collaboration avec Claude Code.

**Principe :**
- **TOI** : Setup de base Vite (2 min)
- **CLAUDE CODE** : Tout le reste (configuration, composants, features)

---

## 📋 Prérequis

Avant de commencer, assure-toi d'avoir :

- [ ] Node.js installé (v18+ recommandé)
- [ ] npm ou pnpm installé
- [ ] Un éditeur de code (VS Code recommandé)
- [ ] Compte Supabase créé (gratuit)
- [ ] Les 3 fichiers de référence téléchargés :
  - [ ] `PRD_GameFund.md`
  - [ ] `SUPABASE_SETUP.md`
  - [ ] `DESIGN_GUIDE.md`

---

## 🚀 Étape 1 : Setup Vite de base (TOI - 2 minutes)

### 1.1 Créer le projet

```bash
# Créer le projet Vite avec React
npm create vite@latest gamefund -- --template react

# Naviguer dans le dossier
cd gamefund

# Installer les dépendances de base
npm install

# Lancer le serveur de développement
npm run dev
```

✅ **Validation :** Tu dois voir l'app Vite par défaut sur `http://localhost:5173`

---

### 1.2 Initialiser Git (Optionnel mais recommandé)

```bash
# Initialiser le repo Git
git init

# Créer le premier commit
git add .
git commit -m "Initial Vite setup"
```

✅ **Validation :** `git log` montre ton commit initial

---

### 1.3 Vérifier la structure de base

```
gamefund/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

✅ **Prêt pour Claude Code !**

---

## 🤖 Étape 2 : Ouvrir Claude Code et setup initial

### 2.1 Accéder à Claude Code

- Ouvrir [claude.ai](https://claude.ai)
- Aller dans "Projects" ou démarrer une nouvelle conversation
- Activer la fonctionnalité "Computer Use" si disponible

---

### 2.2 Uploader les fichiers de référence

📤 **Upload dans l'ordre :**
1. `PRD_GameFund.md`
2. `SUPABASE_SETUP.md`
3. `DESIGN_GUIDE.md`

---

### 2.3 Prompt initial pour Claude Code

Copie-colle exactement ce prompt :

```
Bonjour Claude Code !

Je viens de créer un projet Vite + React de base qui tourne sur localhost:5173.

Voici les documents de référence pour mon projet GameFund :
- PRD_GameFund.md (fonctionnalités complètes)
- SUPABASE_SETUP.md (configuration base de données)
- DESIGN_GUIDE.md (design system complet avec tous les composants)

Je veux que tu configures et développes ce projet en suivant EXACTEMENT 
ces spécifications.

IMPORTANT : Pour chaque fichier que tu crées ou modifies, génère-moi le 
contenu COMPLET que je vais copier dans mon projet local.

Commence maintenant par la PHASE 1 : Configuration Tailwind + Structure de base

Voici les étapes de la PHASE 1 :

1. Générer les commandes bash pour installer Tailwind CSS et les dépendances 
   (tailwindcss, postcss, autoprefixer, lucide-react, react-router-dom, 
   @supabase/supabase-js)

2. Créer le fichier tailwind.config.js selon DESIGN_GUIDE.md section 1.2

3. Créer le contenu complet de src/index.css selon DESIGN_GUIDE.md section 1.3

4. Créer un fichier STRUCTURE.md qui décrit la structure de dossiers complète 
   à créer selon DESIGN_GUIDE.md section 1.4

5. Créer un fichier .env.example avec les variables d'environnement Supabase

Commence par l'étape 1 maintenant.
```

---

## 📦 Étape 3 : Phase 1 - Configuration Tailwind

### 3.1 Installation des packages

**Claude Code te donnera des commandes bash à exécuter :**

```bash
# Dans ton terminal local (dossier gamefund/)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react react-router-dom @supabase/supabase-js
```

✅ **Validation :** `package.json` contient toutes les dépendances

---

### 3.2 Configuration Tailwind

**Claude Code te générera `tailwind.config.js`**

1. Copier le contenu généré
2. Remplacer le fichier `tailwind.config.js` à la racine
3. Sauvegarder

✅ **Validation :** Le fichier contient la palette de couleurs GameFund (primary, accent, etc.)

---

### 3.3 CSS de base

**Claude Code te générera le contenu de `src/index.css`**

1. Copier le contenu généré
2. Remplacer le contenu de `src/index.css`
3. Sauvegarder

✅ **Validation :** Le fichier contient `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`

---

### 3.4 Structure de dossiers

**Claude Code te générera un fichier `STRUCTURE.md`**

1. Lire le fichier généré
2. Créer manuellement tous les dossiers mentionnés :

```bash
# Dans src/
mkdir -p components/ui
mkdir -p components/layout
mkdir -p components/projects
mkdir -p components/donations
mkdir -p pages/public
mkdir -p pages/creator
mkdir -p pages/donor
mkdir -p pages/admin
mkdir -p hooks
mkdir -p services
mkdir -p utils
```

✅ **Validation :** La structure de `src/` correspond à DESIGN_GUIDE.md section 1.4

---

### 3.5 Variables d'environnement

**Claude Code te générera `.env.example`**

1. Copier le contenu généré
2. Créer le fichier `.env.example` à la racine
3. Créer aussi `.env` (copie de `.env.example`)
4. **NE PAS commit `.env`** (doit être dans `.gitignore`)

```env
# .env.example
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

✅ **Validation :** `.env.example` existe, `.env` existe et est dans `.gitignore`

---

### 3.6 Tester la configuration

**Modifier `src/App.jsx` pour tester Tailwind :**

```jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          GameFund
        </h1>
        <p className="text-gray-600">
          Tailwind CSS est configuré ! 🎉
        </p>
      </div>
    </div>
  )
}

export default App
```

```bash
# Lancer le serveur
npm run dev
```

✅ **Validation :** Tu vois une carte blanche centrée avec "GameFund" en violet

---

### 3.7 Git commit

```bash
git add .
git commit -m "feat: configure Tailwind CSS and project structure"
```

---

## 🎨 Étape 4 : Phase 2 - Composants UI de base

### 4.1 Prompt pour Phase 2

**Dire à Claude Code :**

```
Phase 1 terminée avec succès ✅

Tailwind est configuré et fonctionne parfaitement.

Maintenant, PHASE 2 : Créer tous les composants UI de base.

Selon DESIGN_GUIDE.md section 3, je veux que tu crées les 10 composants 
suivants avec leur code COMPLET.

Pour CHAQUE composant :
1. Génère le code complet du fichier .jsx
2. Indique le chemin exact du fichier (ex: src/components/ui/Button.jsx)
3. Attends ma confirmation avant de passer au suivant

Liste des composants à créer :
1. Button.jsx
2. Card.jsx (avec CardImage, CardContent, CardFooter, CardTitle, CardDescription)
3. Badge.jsx
4. Input.jsx
5. Textarea.jsx
6. ProgressBar.jsx
7. Avatar.jsx
8. Skeleton.jsx (avec SkeletonCard)
9. Modal.jsx
10. Select.jsx

Commence maintenant par Button.jsx.
```

---

### 4.2 Workflow pour chaque composant

**Pour CHAQUE composant que Claude Code génère :**

1. **Copier le code** généré
2. **Créer le fichier** au bon endroit (ex: `src/components/ui/Button.jsx`)
3. **Coller le code** et sauvegarder
4. **Tester le composant** dans `App.jsx` :

```jsx
// src/App.jsx - Exemple test Button
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
          <Button variant="ghost">Ghost</Button>
        </div>
        
        <div className="flex gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        
        <div className="flex gap-4">
          <Button loading>Loading...</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  )
}

export default App
```

5. **Valider visuellement** dans le navigateur
6. **Git commit** :

```bash
git add src/components/ui/Button.jsx
git commit -m "feat: add Button component"
```

7. **Dire à Claude Code** : "Button validé ✅, passe au suivant : Card.jsx"

---

### 4.3 Composants à créer (dans l'ordre)

- [ ] `src/components/ui/Button.jsx`
- [ ] `src/components/ui/Card.jsx`
- [ ] `src/components/ui/Badge.jsx`
- [ ] `src/components/ui/Input.jsx`
- [ ] `src/components/ui/Textarea.jsx`
- [ ] `src/components/ui/ProgressBar.jsx`
- [ ] `src/components/ui/Avatar.jsx`
- [ ] `src/components/ui/Skeleton.jsx`
- [ ] `src/components/ui/Modal.jsx`
- [ ] `src/components/ui/Select.jsx`

---

### 4.4 Page de démo des composants (Optionnel)

Créer une page pour visualiser tous les composants :

```jsx
// src/pages/ComponentsDemo.jsx
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
// ... importer tous les composants

export function ComponentsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8">Composants UI</h1>
      
      {/* Section Button */}
      <Card className="mb-8">
        <CardContent>
          <CardTitle>Buttons</CardTitle>
          <div className="flex gap-4 mt-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            {/* ... */}
          </div>
        </CardContent>
      </Card>
      
      {/* Section Card */}
      {/* Section Badge */}
      {/* etc. */}
    </div>
  )
}
```

---

### 4.5 Git commit final Phase 2

```bash
git add .
git commit -m "feat: add all UI base components (Phase 2 complete)"
```

---

## 🏗️ Étape 5 : Phase 3 - Layout Components

### 5.1 Prompt pour Phase 3

```
Phase 2 terminée avec succès ✅

Tous les composants UI de base sont créés et testés.

Maintenant, PHASE 3 : Créer les composants de Layout.

Selon DESIGN_GUIDE.md section 5, crée les composants suivants :

1. Container.jsx (section 5.1)
2. Header.jsx (section 5.2)
3. Footer.jsx (section 5.3)

Pour chaque composant, génère le code complet.

Commence par Container.jsx.
```

---

### 5.2 Composants à créer

- [ ] `src/components/layout/Container.jsx`
- [ ] `src/components/layout/Header.jsx`
- [ ] `src/components/layout/Footer.jsx`

---

### 5.3 Tester le layout

Créer une page de test :

```jsx
// src/App.jsx
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Container } from './components/layout/Container'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Container>
          <h1 className="text-4xl font-bold my-8">
            Bienvenue sur GameFund
          </h1>
          <p className="text-gray-600">
            Le layout fonctionne ! 🎉
          </p>
        </Container>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
```

---

### 5.4 Git commit

```bash
git add .
git commit -m "feat: add layout components (Phase 3 complete)"
```

---

## 🔧 Étape 6 : Phase 4 - Configuration Supabase

### 6.1 Suivre SUPABASE_SETUP.md

**Avant de continuer avec Claude Code, tu dois :**

1. Créer ton projet Supabase (selon SUPABASE_SETUP.md)
2. Exécuter le script SQL de création du schéma
3. Configurer le Storage
4. Créer un utilisateur admin
5. Récupérer les credentials (URL + anon key)

---

### 6.2 Mettre à jour .env

```env
# .env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 6.3 Prompt pour Phase 4

```
Base de données Supabase configurée ✅

J'ai exécuté tout le SQL de SUPABASE_SETUP.md.
Mes credentials Supabase sont dans .env.

Maintenant, PHASE 4 : Créer les services et hooks Supabase.

Crée les fichiers suivants :

1. src/services/supabase.js (client Supabase)
2. src/services/authService.js (login, signup, logout)
3. src/services/projectService.js (CRUD projects)
4. src/services/donationService.js (CRUD donations)
5. src/hooks/useAuth.js (AuthContext et useAuth hook)

Génère chaque fichier avec le code complet.

Commence par supabase.js.
```

---

### 6.4 Fichiers à créer

- [ ] `src/services/supabase.js`
- [ ] `src/services/authService.js`
- [ ] `src/services/projectService.js`
- [ ] `src/services/donationService.js`
- [ ] `src/hooks/useAuth.js`

---

### 6.5 Wrapper l'app avec AuthProvider

**Modifier `src/main.jsx` :**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './hooks/useAuth'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

---

### 6.6 Git commit

```bash
git add .
git commit -m "feat: add Supabase services and auth hook (Phase 4 complete)"
```

---

## 📄 Étape 7 : Phase 5 - Pages d'authentification

### 7.1 Prompt pour Phase 5

```
Supabase configuré et services créés ✅

Maintenant, PHASE 5 : Créer les pages d'authentification.

Selon PRD_GameFund.md section 3.1, crée :

1. src/pages/public/LoginPage.jsx
2. src/pages/public/SignupPage.jsx
3. src/App.jsx avec React Router configuré (routes de base)

Génère chaque fichier avec le code complet.

Commence par LoginPage.jsx.
```

---

### 7.2 Fichiers à créer

- [ ] `src/pages/public/LoginPage.jsx`
- [ ] `src/pages/public/SignupPage.jsx`

---

### 7.3 Configurer React Router

**Claude Code modifiera `src/App.jsx` :**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/public/LoginPage'
import { SignupPage } from './pages/public/SignupPage'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<div>Home (TODO)</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
```

---

### 7.4 Tester l'authentification

1. Lancer l'app : `npm run dev`
2. Aller sur `/signup`
3. Créer un compte test
4. Vérifier dans Supabase → Authentication → Users

✅ **Validation :** L'utilisateur apparaît dans Supabase

---

### 7.5 Git commit

```bash
git add .
git commit -m "feat: add authentication pages and routing (Phase 5 complete)"
```

---

## 🎮 Étape 8 : Phase 6 - Galerie de projets (Vue publique)

### 8.1 Prompt pour Phase 6

```
Authentification fonctionnelle ✅

Maintenant, PHASE 6 : Créer la galerie de projets publique.

Selon PRD_GameFund.md section 3.2, crée :

1. src/components/projects/ProjectCard.jsx (DESIGN_GUIDE section 4.1)
2. src/components/projects/ProjectGrid.jsx (DESIGN_GUIDE section 4.2)
3. src/components/projects/ProjectFilters.jsx (DESIGN_GUIDE section 4.3)
4. src/pages/public/HomePage.jsx (galerie complète)

Génère chaque fichier avec le code complet.

Commence par ProjectCard.jsx.
```

---

### 8.2 Fichiers à créer

- [ ] `src/components/projects/ProjectCard.jsx`
- [ ] `src/components/projects/ProjectGrid.jsx`
- [ ] `src/components/projects/ProjectFilters.jsx`
- [ ] `src/pages/public/HomePage.jsx`

---

### 8.3 Ajouter la route

**Modifier `src/App.jsx` :**

```jsx
import { HomePage } from './pages/public/HomePage'

// Dans <Routes>
<Route path="/" element={<HomePage />} />
```

---

### 8.4 Tester avec des données mockées

Si pas encore de projets en BDD, tester avec des données mockées :

```jsx
// src/pages/public/HomePage.jsx
const mockProjects = [
  {
    id: '1',
    title: 'Mystic Quest',
    description: 'Un RPG épique...',
    image_url: 'https://picsum.photos/seed/game1/800/400',
    goal_amount: 50000,
    total_collected: 32500,
    donors_count: 234,
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    status: 'active',
    creator: {
      display_name: 'Alice Johnson',
      avatar_url: 'https://i.pravatar.cc/150?img=1'
    }
  },
  // ... plus de projets
]
```

---

### 8.5 Git commit

```bash
git add .
git commit -m "feat: add public project gallery (Phase 6 complete)"
```

---

## 🚀 Phases suivantes (7-12)

**À ce stade, tu as un MVP fonctionnel avec :**
- ✅ Authentification
- ✅ Galerie publique
- ✅ Design system complet

**Continue avec Claude Code pour :**

- **Phase 7** : Création de projets (créateur)
- **Phase 8** : Dashboard créateur
- **Phase 9** : Système de dons
- **Phase 10** : Dashboard donateur
- **Phase 11** : Dashboard admin
- **Phase 12** : Fonctionnalités avancées

---

## 💡 Conseils généraux

### Workflow optimal

1. **Une phase = une session avec Claude Code**
2. **Tester CHAQUE composant** avant de passer au suivant
3. **Git commit fréquemment** (après chaque composant validé)
4. **Demander des explications** si quelque chose n'est pas clair
5. **Adapter les prompts** selon tes besoins

---

### En cas de problème

**Si un composant ne marche pas :**
```
"Le composant Button génère une erreur : [copier l'erreur].
Peux-tu corriger le code ?"
```

**Si tu veux modifier quelque chose :**
```
"Le Button est trop gros, réduis le padding de 30%"
"Change la couleur primary pour #9333ea"
```

**Si tu es bloqué :**
```
"Je ne comprends pas comment utiliser forwardRef dans Input.
Peux-tu m'expliquer ?"
```

---

### Validation continue

Après chaque phase :
- [ ] Code compile sans erreur (`npm run dev`)
- [ ] Composants s'affichent correctement
- [ ] Pas d'erreurs dans la console
- [ ] Git commit fait
- [ ] PROGRESS.md mis à jour

---

## 📞 Support

**Ressources :**
- Tailwind CSS : https://tailwindcss.com/docs
- React Router : https://reactrouter.com/
- Supabase Docs : https://supabase.com/docs
- Lucide Icons : https://lucide.dev/

**Fichiers de référence :**
- `PRD_GameFund.md` → Fonctionnalités
- `SUPABASE_SETUP.md` → Base de données
- `DESIGN_GUIDE.md` → Design system

---

**Bon développement ! 🚀**
