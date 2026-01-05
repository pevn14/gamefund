# Design Guide - GameFund (Tailwind CSS v4)

**Version** : 2.0 - Tailwind CSS v4  
**Framework CSS** : Tailwind CSS v4 (CSS-first configuration)  
**Optimisé pour** : Claude Code  
**Style** : Minimaliste & Moderne

---

## 📋 Table des matières

1. [Setup initial](#1-setup-initial)
2. [Système de design](#2-système-de-design)
3. [Composants UI de base](#3-composants-ui-de-base)
4. [Composants spécifiques GameFund](#4-composants-spécifiques-gamefund)
5. [Layout & Grid](#5-layout--grid)
6. [Conventions de code](#6-conventions-de-code)
7. [Responsive Design](#7-responsive-design)
8. [Animations](#8-animations)
9. [Accessibilité](#9-accessibilité)
10. [Évolutions futures](#10-évolutions-futures)

---

## 1. Setup initial

### 1.1 Installation

```bash
# Créer le projet Vite + React
npm create vite@latest gamefund -- --template react
cd gamefund

# Installer les dépendances
npm install

# Installer Tailwind CSS v4 (nouvelle méthode)
npm install tailwindcss @tailwindcss/vite

# Installer les autres dépendances
npm install lucide-react react-router-dom @supabase/supabase-js
```

### 1.2 Configuration Vite

**`vite.config.js` :**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

**Note importante :** Dans Tailwind v4, il n'y a **plus de fichier `tailwind.config.js`** ni de `postcss.config.js`. Toute la configuration se fait dans le CSS !

### 1.3 CSS de base

**`src/index.css` :**

```css
/* Import Tailwind CSS v4 */
@import "tailwindcss";

/* Import Inter font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Theme configuration - Palette GameFund */
@theme {
  /* Couleurs principales (Purple Gaming) */
  --color-primary-50: #faf5ff;
  --color-primary-100: #f3e8ff;
  --color-primary-200: #e9d5ff;
  --color-primary-300: #d8b4fe;
  --color-primary-400: #c084fc;
  --color-primary-500: #a855f7;
  --color-primary-600: #9333ea;
  --color-primary-700: #7e22ce;
  --color-primary-800: #6b21a8;
  --color-primary-900: #581c87;
  
  /* Couleurs accent (Green Success) */
  --color-accent-50: #f0fdf4;
  --color-accent-100: #dcfce7;
  --color-accent-200: #bbf7d0;
  --color-accent-300: #86efac;
  --color-accent-400: #4ade80;
  --color-accent-500: #22c55e;
  --color-accent-600: #16a34a;
  --color-accent-700: #15803d;
  --color-accent-800: #166534;
  --color-accent-900: #14532d;
  
  /* États sémantiques */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Font family */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  
  /* Border radius personnalisés */
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  
  /* Shadows personnalisées */
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-strong: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Base styles */
@layer base {
  body {
    @apply font-sans antialiased;
    @apply bg-gray-50 text-gray-900;
  }
  
  * {
    @apply border-gray-200;
  }
}

/* Utility classes personnalisées */
@layer utilities {
  /* Animation de shimmer pour les barres de progression */
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  
  /* Skeleton loading */
  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  .skeleton {
    background: linear-gradient(
      90deg, 
      rgb(229 231 235) 0%, 
      rgb(243 244 246) 50%, 
      rgb(229 231 235) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }
}

/* Components layer (optionnel, pour des patterns réutilisables) */
@layer components {
  /* Container responsive avec padding */
  .container-custom {
    @apply max-w-7xl mx-auto px-6;
  }
  
  /* Text gradient effect */
  .text-gradient {
    background: linear-gradient(to right, #9333ea, #a855f7);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}
```

### 1.4 Structure de dossiers

```
src/
├── components/
│   ├── ui/                    # Composants UI réutilisables
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Input.jsx
│   │   ├── Textarea.jsx
│   │   ├── Select.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Avatar.jsx
│   │   ├── Skeleton.jsx
│   │   └── Modal.jsx
│   │
│   ├── layout/                # Composants de layout
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Container.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── projects/              # Composants spécifiques projets
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectGrid.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── ProjectForm.jsx
│   │   └── ProjectFilters.jsx
│   │
│   └── donations/             # Composants spécifiques donations
│       ├── DonationForm.jsx
│       ├── DonationList.jsx
│       └── DonationCard.jsx
│
├── pages/                     # Pages de l'application
├── hooks/                     # Custom hooks React
├── services/                  # Services (Supabase, API)
├── utils/                     # Fonctions utilitaires
└── App.jsx
```

---

## 2. Système de design

### 2.1 Palette de couleurs

#### Couleurs principales (Primary - Purple)

```jsx
// Usage dans les composants
<div className="bg-primary-600">      // Background principal
<div className="text-primary-600">    // Texte principal
<div className="border-primary-600">  // Bordure principale
<div className="hover:bg-primary-700"> // Hover state
```

**Hiérarchie :**
- `primary-50` → Backgrounds très légers
- `primary-100` → Backgrounds légers, badges
- `primary-600` → Couleur principale (boutons, liens)
- `primary-700` → Hover states
- `primary-900` → Texte sombre sur fond clair

#### Couleurs accent (Accent - Green)

```jsx
<div className="bg-accent-500">      // Success, progression
<div className="text-accent-600">    // Texte de succès
```

**Usage :**
- Barres de progression
- Badges "completed", "active"
- Messages de succès
- Indicateurs positifs

#### Couleurs neutres (Gray)

```jsx
<div className="bg-gray-50">     // Background général de l'app
<div className="bg-gray-100">    // Background secondaire
<div className="bg-white">       // Cards, modales
<div className="text-gray-600">  // Texte secondaire
<div className="text-gray-900">  // Texte principal
<div className="border-gray-200"> // Bordures
```

#### Couleurs sémantiques

```jsx
<div className="bg-green-100 text-green-700">  // Success
<div className="bg-yellow-100 text-yellow-700"> // Warning
<div className="bg-red-100 text-red-700">      // Error
<div className="bg-blue-100 text-blue-700">    // Info
```

### 2.2 Typographie

#### Tailles de texte

```jsx
<h1 className="text-5xl font-bold">     // Hero titles
<h2 className="text-4xl font-bold">     // Page titles
<h3 className="text-3xl font-semibold"> // Section titles
<h4 className="text-2xl font-semibold"> // Card titles
<h5 className="text-xl font-semibold">  // Subsection titles
<p className="text-base">               // Body text (défaut)
<p className="text-sm">                 // Small text
<p className="text-xs">                 // Very small text (labels)
```

#### Font weights

```jsx
<span className="font-light">      // 300
<span className="font-normal">     // 400 (défaut)
<span className="font-medium">     // 500
<span className="font-semibold">   // 600
<span className="font-bold">       // 700
<span className="font-extrabold">  // 800
```

#### Line heights

```jsx
<p className="leading-tight">    // 1.25
<p className="leading-snug">     // 1.375
<p className="leading-normal">   // 1.5 (défaut)
<p className="leading-relaxed">  // 1.625
<p className="leading-loose">    // 2
```

### 2.3 Espacements

**Tailwind utilise une échelle de 4px (1 = 0.25rem = 4px)**

```jsx
// Padding
<div className="p-4">    // padding: 1rem (16px) sur tous les côtés
<div className="px-6">   // padding horizontal: 1.5rem (24px)
<div className="py-3">   // padding vertical: 0.75rem (12px)
<div className="pt-8">   // padding-top: 2rem (32px)

// Margin
<div className="m-4">    // margin: 1rem
<div className="mx-auto"> // margin horizontal: auto (centrer)
<div className="mt-6">   // margin-top: 1.5rem
<div className="mb-8">   // margin-bottom: 2rem

// Gap (pour flexbox/grid)
<div className="gap-4">  // gap: 1rem
<div className="gap-x-6"> // gap horizontal: 1.5rem
<div className="gap-y-8"> // gap vertical: 2rem
```

**Échelle recommandée pour GameFund :**
- `2` (8px) → Espacement minimal (entre icône et texte)
- `4` (16px) → Espacement standard (padding de card)
- `6` (24px) → Espacement moyen (entre sections)
- `8` (32px) → Espacement large (entre blocs)
- `12` (48px) → Espacement très large (entre sections principales)

### 2.4 Border radius

**Note Tailwind v4 :** Les noms ont changé !

```jsx
<div className="rounded-xs">    // 2px (était rounded-sm en v3)
<div className="rounded-sm">    // 4px (était rounded en v3)
<div className="rounded-md">    // 6px
<div className="rounded-lg">    // 8px (défaut pour boutons/inputs)
<div className="rounded-xl">    // 12px
<div className="rounded-2xl">   // 16px (cards) - custom dans @theme
<div className="rounded-3xl">   // 24px (très arrondi) - custom dans @theme
<div className="rounded-full">  // 9999px (cercles, pills)
```

**Usage recommandé :**
- Boutons, inputs : `rounded-lg`
- Cards : `rounded-2xl`
- Badges : `rounded-full`
- Avatars : `rounded-full`

### 2.5 Shadows

```jsx
<div className="shadow-sm">     // Ombre légère
<div className="shadow">        // Ombre standard
<div className="shadow-md">     // Ombre moyenne (cards)
<div className="shadow-lg">     // Ombre large
<div className="shadow-xl">     // Ombre très large (hover cards)
<div className="shadow-2xl">    // Ombre massive
<div className="shadow-none">   // Pas d'ombre
```

**Custom shadows (définies dans @theme) :**
```css
/* Utilisation avec arbitrary values */
<div className="shadow-[var(--shadow-soft)]">
<div className="shadow-[var(--shadow-medium)]">
<div className="shadow-[var(--shadow-strong)]">
```

---

## 3. Composants UI de base

### 3.1 Button

**`src/components/ui/Button.jsx` :**

```jsx
import { Loader2 } from 'lucide-react'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md",
    success: "bg-accent-600 hover:bg-accent-700 text-white shadow-sm hover:shadow-md",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={18} />}
      {children}
    </button>
  )
}
```

**Usage :**

```jsx
import { Button } from '@/components/ui/Button'
import { Send, Trash2 } from 'lucide-react'

// Variants
<Button variant="primary">Se connecter</Button>
<Button variant="secondary">Annuler</Button>
<Button variant="outline">Paramètres</Button>
<Button variant="ghost">Fermer</Button>
<Button variant="danger">Supprimer</Button>
<Button variant="success">Valider</Button>

// Sizes
<Button size="sm">Petit</Button>
<Button size="md">Moyen</Button>
<Button size="lg">Grand</Button>

// Loading state
<Button loading>Chargement...</Button>

// Disabled
<Button disabled>Désactivé</Button>

// Avec icône
<Button variant="primary">
  <Send size={18} />
  Envoyer
</Button>

<Button variant="danger" size="sm">
  <Trash2 size={16} />
  Supprimer
</Button>
```

---

### 3.2 Card

**`src/components/ui/Card.jsx` :**

```jsx
export function Card({ children, hover = false, className = '' }) {
  const hoverClasses = hover 
    ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" 
    : ""
  
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${hoverClasses} ${className}`}>
      {children}
    </div>
  )
}

export function CardImage({ src, alt, className = '' }) {
  return (
    <div className={`aspect-video overflow-hidden bg-gray-100 ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-600 mt-2 ${className}`}>
      {children}
    </p>
  )
}
```

**Usage :**

```jsx
import { Card, CardImage, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/Card'

<Card hover>
  <CardImage src="/project.jpg" alt="Project name" />
  <CardContent>
    <CardTitle>Mystic Quest: The Awakening</CardTitle>
    <CardDescription>
      Un RPG épique mêlant magie et technologie
    </CardDescription>
  </CardContent>
  <CardFooter>
    <div className="flex gap-4 text-sm text-gray-600">
      <span>👥 234 donateurs</span>
      <span>⏱ 12 jours</span>
    </div>
  </CardFooter>
</Card>
```

---

### 3.3 Badge

**`src/components/ui/Badge.jsx` :**

```jsx
export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseClasses = "inline-flex items-center gap-1.5 font-medium rounded-full uppercase tracking-wide"
  
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary-100 text-primary-700",
    success: "bg-accent-100 text-accent-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    // Statuts de projets
    draft: "bg-gray-100 text-gray-700",
    active: "bg-accent-100 text-accent-700",
    completed: "bg-primary-100 text-primary-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
    suspended: "bg-yellow-100 text-yellow-700",
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  }
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}
```

**Usage :**

```jsx
import { Badge } from '@/components/ui/Badge'

// Variants
<Badge variant="default">Par défaut</Badge>
<Badge variant="primary">Principal</Badge>
<Badge variant="success">Succès</Badge>
<Badge variant="warning">Attention</Badge>
<Badge variant="error">Erreur</Badge>
<Badge variant="info">Info</Badge>

// Statuts de projets
<Badge variant="draft">Brouillon</Badge>
<Badge variant="active">Actif</Badge>
<Badge variant="completed">Terminé</Badge>
<Badge variant="failed">Échoué</Badge>
<Badge variant="cancelled">Annulé</Badge>
<Badge variant="suspended">Suspendu</Badge>

// Sizes
<Badge size="sm">Petit</Badge>
<Badge size="md">Moyen</Badge>
<Badge size="lg">Grand</Badge>

// Avec icône
<Badge variant="active">
  <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
  En ligne
</Badge>
```

---

### 3.4 Input

**`src/components/ui/Input.jsx` :**

```jsx
import { forwardRef } from 'react'

export const Input = forwardRef(({ 
  label, 
  error, 
  helperText,
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-11' : ''}
            text-base text-gray-900 
            bg-white border border-gray-300 rounded-lg 
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
```

**Usage :**

```jsx
import { Input } from '@/components/ui/Input'
import { Mail, Lock, Search } from 'lucide-react'

// Basique
<Input 
  type="email" 
  placeholder="Entrez votre email"
/>

// Avec label
<Input 
  label="Email"
  type="email"
  placeholder="exemple@email.com"
  required
/>

// Avec icône
<Input 
  label="Email"
  type="email"
  icon={Mail}
  placeholder="exemple@email.com"
/>

<Input 
  label="Mot de passe"
  type="password"
  icon={Lock}
  placeholder="••••••••"
/>

// Avec erreur
<Input 
  label="Email"
  type="email"
  error="Email invalide"
  defaultValue="bad-email"
/>

// Avec helper text
<Input 
  label="Nom d'utilisateur"
  helperText="Entre 3 et 20 caractères"
  placeholder="johndoe"
/>

// Disabled
<Input 
  label="Compte vérifié"
  value="user@example.com"
  disabled
/>
```

---

### 3.5 Textarea

**`src/components/ui/Textarea.jsx` :**

```jsx
import { forwardRef, useState } from 'react'

export const Textarea = forwardRef(({ 
  label, 
  error, 
  helperText,
  rows = 4,
  maxLength,
  showCount = false,
  className = '',
  ...props 
}, ref) => {
  const [count, setCount] = useState(props.defaultValue?.length || 0)
  
  const handleChange = (e) => {
    setCount(e.target.value.length)
    props.onChange?.(e)
  }
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        onChange={handleChange}
        className={`
          w-full px-4 py-3
          text-base text-gray-900 
          bg-white border border-gray-300 rounded-lg 
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
          resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      
      {showCount && maxLength && (
        <div className="mt-1.5 text-xs text-gray-500 text-right">
          {count} / {maxLength}
        </div>
      )}
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'
```

**Usage :**

```jsx
import { Textarea } from '@/components/ui/Textarea'

// Basique
<Textarea 
  placeholder="Décrivez votre projet..."
/>

// Avec label et compteur
<Textarea 
  label="Description du projet"
  placeholder="Décrivez votre projet en détail..."
  maxLength={500}
  showCount
  required
/>

// Avec erreur
<Textarea 
  label="Message"
  error="Le message est trop court"
  defaultValue="Salut"
/>
```

---

### 3.6 ProgressBar

**`src/components/ui/ProgressBar.jsx` :**

```jsx
export function ProgressBar({ 
  value = 0, 
  max = 100, 
  showLabel = true,
  showPercentage = true,
  size = 'md',
  variant = 'primary',
  animated = false,
  className = ''
}) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    success: 'bg-gradient-to-r from-accent-500 to-accent-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
  }
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progression</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-primary-600">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`${sizes[size]} ${variants[variant]} rounded-full transition-all duration-500 ease-out relative ${animated ? 'overflow-hidden' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  )
}
```

**Usage :**

```jsx
import { ProgressBar } from '@/components/ui/ProgressBar'

// Basique
<ProgressBar value={65} max={100} />

// Sans label
<ProgressBar value={45} showLabel={false} />

// Animée
<ProgressBar value={80} animated />

// Variants
<ProgressBar value={50} variant="primary" />
<ProgressBar value={75} variant="success" />
<ProgressBar value={30} variant="warning" />
<ProgressBar value={20} variant="error" />

// Sizes
<ProgressBar value={60} size="sm" />
<ProgressBar value={60} size="md" />
<ProgressBar value={60} size="lg" />

// Custom (montant collecté)
<ProgressBar 
  value={32500} 
  max={50000}
  showLabel={false}
/>
<div className="flex justify-between mt-2 text-sm font-medium">
  <span className="text-primary-600">65%</span>
  <span className="text-gray-600">32,500€ / 50,000€</span>
</div>
```

---

### 3.7 Avatar

**`src/components/ui/Avatar.jsx` :**

```jsx
import { User } from 'lucide-react'

export function Avatar({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  fallback,
  className = '' 
}) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  }
  
  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
  }
  
  if (!src) {
    return (
      <div className={`${sizes[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}>
        {fallback || <User size={iconSizes[size]} />}
      </div>
    )
  }
  
  return (
    <img 
      src={src} 
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover border-2 border-gray-200 ${className}`}
    />
  )
}
```

**Usage :**

```jsx
import { Avatar } from '@/components/ui/Avatar'

// Avec image
<Avatar src="/avatar.jpg" alt="Alice Johnson" />

// Sans image (fallback icône)
<Avatar />

// Avec fallback texte
<Avatar fallback="AJ" />

// Sizes
<Avatar src="/avatar.jpg" size="xs" />
<Avatar src="/avatar.jpg" size="sm" />
<Avatar src="/avatar.jpg" size="md" />
<Avatar src="/avatar.jpg" size="lg" />
<Avatar src="/avatar.jpg" size="xl" />
<Avatar src="/avatar.jpg" size="2xl" />

// Groupe d'avatars
<div className="flex -space-x-2">
  <Avatar src="/avatar1.jpg" size="sm" className="ring-2 ring-white" />
  <Avatar src="/avatar2.jpg" size="sm" className="ring-2 ring-white" />
  <Avatar src="/avatar3.jpg" size="sm" className="ring-2 ring-white" />
  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
    +5
  </div>
</div>
```

---

### 3.8 Skeleton (Loading states)

**`src/components/ui/Skeleton.jsx` :**

```jsx
export function Skeleton({ className = '', variant = 'default' }) {
  const variants = {
    default: 'skeleton',
    circle: 'skeleton rounded-full',
    text: 'skeleton h-4 rounded-sm',
  }
  
  return <div className={`${variants[variant]} ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <Skeleton className="aspect-video" />
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-2 w-full mb-2" />
        <div className="flex justify-between mt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}
```

**Usage :**

```jsx
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

// Skeleton simple
<Skeleton className="w-full h-48" />

// Skeleton texte
<Skeleton variant="text" className="w-3/4" />
<Skeleton variant="text" className="w-1/2" />

// Skeleton cercle (avatar)
<Skeleton variant="circle" className="w-12 h-12" />

// Skeleton card complet
<SkeletonCard />

// Grid de skeletons
<div className="grid grid-cols-3 gap-6">
  <SkeletonCard />
  <SkeletonCard />
  <SkeletonCard />
</div>
```

---

### 3.9 Modal (Dialog)

**`src/components/ui/Modal.jsx` :**

```jsx
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal({ 
  isOpen, 
  onClose, 
  title,
  children,
  footer,
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }
  
  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
  
  // Bloquer le scroll du body quand modal ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-6">
          {children}
        </div>
        
        {/* Footer (optionnel) */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Usage :**

```jsx
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Ouvrir la modal
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmer l'action"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={() => {
              // Action
              setIsOpen(false)
            }}>
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
        </p>
      </Modal>
    </>
  )
}
```

---

### 3.10 Select

**`src/components/ui/Select.jsx` :**

```jsx
import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

export const Select = forwardRef(({ 
  label, 
  error, 
  helperText,
  options = [],
  placeholder = 'Sélectionner...',
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 pr-10
            text-base text-gray-900 
            bg-white border border-gray-300 rounded-lg 
            appearance-none
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown size={20} />
        </div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'
```

**Usage :**

```jsx
import { Select } from '@/components/ui/Select'

const statusOptions = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'active', label: 'Actif' },
  { value: 'completed', label: 'Terminé' },
]

<Select
  label="Statut du projet"
  options={statusOptions}
  placeholder="Choisir un statut"
  required
/>

// Avec erreur
<Select
  label="Catégorie"
  options={categoryOptions}
  error="Veuillez sélectionner une catégorie"
/>
```

---

## 4. Composants spécifiques GameFund

*(Le code reste identique à la v3, seules les classes Tailwind changent légèrement)*

### 4.1 ProjectCard

**`src/components/projects/ProjectCard.jsx` :**

```jsx
import { Link } from 'react-router-dom'
import { Users, Clock, TrendingUp } from 'lucide-react'
import { Card, CardImage, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Avatar } from '@/components/ui/Avatar'

export function ProjectCard({ project }) {
  const percentage = (project.total_collected / project.goal_amount) * 100
  const daysRemaining = Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))
  
  return (
    <Link to={`/projects/${project.id}`}>
      <Card hover>
        <CardImage 
          src={project.image_url} 
          alt={project.title} 
        />
        
        <CardContent>
          <div className="flex items-start justify-between gap-3 mb-3">
            <CardTitle className="line-clamp-2">{project.title}</CardTitle>
            <Badge variant={project.status}>{project.status}</Badge>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Avatar 
              src={project.creator.avatar_url} 
              alt={project.creator.display_name}
              size="sm"
            />
            <CardDescription>
              Par {project.creator.display_name}
            </CardDescription>
          </div>
          
          <ProgressBar 
            value={project.total_collected} 
            max={project.goal_amount}
            showLabel={false}
            animated
          />
          
          <div className="flex justify-between mt-3 text-sm font-medium">
            <span className="text-primary-600">{percentage.toFixed(0)}%</span>
            <span className="text-gray-600">
              {project.total_collected.toLocaleString('fr-FR')}€ / {project.goal_amount.toLocaleString('fr-FR')}€
            </span>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Users size={16} />
              <span>{project.donors_count}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{daysRemaining} jours</span>
            </div>
            
            {percentage > 50 && (
              <div className="flex items-center gap-1.5 text-accent-600">
                <TrendingUp size={16} />
                <span>En hausse</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
```

---

### 4.2 ProjectGrid

**`src/components/projects/ProjectGrid.jsx` :**

```jsx
import { ProjectCard } from './ProjectCard'
import { SkeletonCard } from '@/components/ui/Skeleton'

export function ProjectGrid({ projects, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun projet trouvé</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

---

### 4.3 ProjectFilters

**`src/components/projects/ProjectFilters.jsx` :**

```jsx
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

export function ProjectFilters({ 
  searchQuery, 
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange
}) {
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actifs' },
    { value: 'completed', label: 'Terminés' },
    { value: 'ending-soon', label: 'Bientôt terminés' },
  ]
  
  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'most-funded', label: 'Plus financés' },
    { value: 'ending-soon', label: 'Fin proche' },
    { value: 'popular', label: 'Populaires' },
  ]
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Rechercher un projet..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          placeholder="Filtrer par statut"
        />
        
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          placeholder="Trier par"
        />
      </div>
    </div>
  )
}
```

---

### 4.4 DonationCard

**`src/components/donations/DonationCard.jsx` :**

```jsx
import { Avatar } from '@/components/ui/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export function DonationCard({ donation }) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <Avatar 
        src={donation.donor.avatar_url}
        alt={donation.donor.display_name}
        size="md"
      />
      
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-gray-900">
            {donation.donor.display_name}
          </p>
          <span className="text-primary-600 font-bold">
            {donation.amount.toLocaleString('fr-FR')}€
          </span>
        </div>
        
        {donation.message && (
          <p className="text-sm text-gray-600 mb-2">
            "{donation.message}"
          </p>
        )}
        
        <p className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(donation.created_at), { 
            addSuffix: true,
            locale: fr 
          })}
        </p>
      </div>
    </div>
  )
}
```

---

## 5. Layout & Grid

### 5.1 Container

**`src/components/layout/Container.jsx` :**

```jsx
export function Container({ children, size = 'default', className = '' }) {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl',
    lg: 'max-w-[1400px]',
    full: 'max-w-full',
  }
  
  return (
    <div className={`${sizes[size]} mx-auto px-6 ${className}`}>
      {children}
    </div>
  )
}
```

---

### 5.2 Header

**`src/components/layout/Header.jsx` :**

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, User, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Container } from './Container'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              GameFund
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/projects" 
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Projets
            </Link>
            
            {user && (
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>
          
          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  <LogIn size={18} />
                  Connexion
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Inscription
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Button>
                
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Avatar 
                    src={profile?.avatar_url}
                    alt={profile?.display_name || user.email}
                    size="sm"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}
```

---

### 5.3 Footer

**`src/components/layout/Footer.jsx` :**

```jsx
import { Link } from 'react-router-dom'
import { Container } from './Container'
import { Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg" />
                <span className="text-xl font-bold text-white">GameFund</span>
              </div>
              <p className="text-sm text-gray-400">
                Soutenez les créateurs de jeux vidéo de demain.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Découvrir</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/projects" className="hover:text-white transition-colors">Projets</Link></li>
                <li><Link to="/creators" className="hover:text-white transition-colors">Créateurs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">À propos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">Notre mission</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Suivez-nous</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
            © {new Date().getFullYear()} GameFund. Tous droits réservés.
          </div>
        </div>
      </Container>
    </footer>
  )
}
```

---

## 6. Conventions de code

### 6.1 Nommage des composants

```jsx
// ✅ Bon - PascalCase pour les composants
export function Button() {}
export function ProjectCard() {}

// ❌ Mauvais
export function button() {}
export function project_card() {}
```

### 6.2 Organisation des props

```jsx
// ✅ Bon - Destructuration avec valeurs par défaut
export function Button({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...props 
}) {}

// ❌ Mauvais
export function Button(props) {
  const variant = props.variant || 'primary'
  // ...
}
```

### 6.3 Classes Tailwind

```jsx
// ✅ Bon - Classes groupées logiquement
<button className="
  px-6 py-3
  text-white font-medium 
  bg-primary-600 hover:bg-primary-700
  rounded-lg shadow-sm
  transition-all duration-200
">

// ✅ Bon - Utiliser des variables pour classes complexes
const buttonClasses = `
  px-6 py-3 text-white font-medium 
  bg-primary-600 hover:bg-primary-700
  rounded-lg shadow-sm transition-all
`

<button className={buttonClasses}>

// ❌ Éviter - Classes sur une seule ligne (illisible)
<button className="px-6 py-3 text-white font-medium bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-all duration-200">
```

### 6.4 Conditional classes

```jsx
// ✅ Bon - Template literals
<button className={`
  px-6 py-3 font-medium rounded-lg
  ${variant === 'primary' ? 'bg-primary-600' : 'bg-gray-600'}
  ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
`}>

// ✅ Bon - clsx ou classnames library (optionnel)
import clsx from 'clsx'

<button className={clsx(
  'px-6 py-3 font-medium rounded-lg',
  variant === 'primary' && 'bg-primary-600',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
```

### 6.5 Commentaires

```jsx
// ✅ Bon - Commenter les patterns complexes
export function ProgressBar({ value, max }) {
  // Calculer le pourcentage avec un max de 100%
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className="w-full bg-gray-200 rounded-full">
      {/* Animation shimmer pour l'effet de brillance */}
      <div 
        className="h-2 bg-primary-600 rounded-full relative overflow-hidden"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute inset-0 animate-shimmer" />
      </div>
    </div>
  )
}
```

---

## 7. Responsive Design

### 7.1 Breakpoints Tailwind

```
sm:  640px  @media (min-width: 640px)
md:  768px  @media (min-width: 768px)
lg:  1024px @media (min-width: 1024px)
xl:  1280px @media (min-width: 1280px)
2xl: 1536px @media (min-width: 1536px)
```

### 7.2 Mobile-first approach

```jsx
// ✅ Mobile-first - Commencer sans breakpoint (mobile), puis ajouter
<div className="
  grid grid-cols-1           /* Mobile: 1 colonne */
  md:grid-cols-2             /* Tablet: 2 colonnes */
  lg:grid-cols-3             /* Desktop: 3 colonnes */
  gap-4 md:gap-6 lg:gap-8    /* Gap augmente avec la taille */
">

// ✅ Text responsive
<h1 className="
  text-3xl          /* Mobile */
  md:text-4xl       /* Tablet */
  lg:text-5xl       /* Desktop */
  font-bold
">

// ✅ Padding responsive
<div className="
  px-4 py-6         /* Mobile */
  md:px-6 md:py-8   /* Tablet+ */
  lg:px-8 lg:py-12  /* Desktop+ */
">
```

### 7.3 Patterns responsive courants

```jsx
// Hide/Show selon device
<div className="hidden md:block">Visible seulement sur tablet+</div>
<div className="block md:hidden">Visible seulement sur mobile</div>

// Stack vertical sur mobile, horizontal sur desktop
<div className="
  flex flex-col         /* Mobile: vertical */
  md:flex-row           /* Desktop: horizontal */
  gap-4
">

// Container responsive
<div className="
  max-w-full            /* Mobile: pleine largeur */
  md:max-w-3xl          /* Tablet */
  lg:max-w-5xl          /* Desktop */
  mx-auto px-4
">
```

---

## 8. Animations

### 8.1 Transitions

```jsx
// Transition sur toutes les propriétés
<div className="transition-all duration-200">

// Transition spécifique
<div className="transition-colors duration-300">
<div className="transition-transform duration-200">
<div className="transition-opacity duration-150">

// Easing functions
<div className="transition ease-linear">
<div className="transition ease-in">
<div className="transition ease-out">
<div className="transition ease-in-out">
```

### 8.2 Transforms

```jsx
// Hover effects
<div className="hover:-translate-y-1">     // Lift up
<div className="hover:scale-105">          // Scale up
<div className="hover:rotate-3">           // Rotate

// Active state
<button className="active:scale-95">       // Press effect
```

### 8.3 Custom animations

```jsx
// Shimmer effect (déjà dans index.css)
<div className="animate-shimmer">

// Skeleton loading
<div className="skeleton">

// Spin (loading)
<div className="animate-spin">

// Pulse
<div className="animate-pulse">

// Bounce
<div className="animate-bounce">
```

---

## 9. Accessibilité

### 9.1 Checklist de base

```jsx
// ✅ Labels pour inputs
<Input 
  label="Email"
  id="email"
  type="email"
  required
/>

// ✅ Alt text pour images
<img src="/project.jpg" alt="Mystic Quest game screenshot" />

// ✅ Semantic HTML
<header>
<main>
<footer>
<nav>
<article>
<section>

// ✅ Focus states visibles
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-primary-500 
  focus:ring-offset-2
">

// ✅ Contraste suffisant (WCAG AA minimum)
// Text sur fond blanc : text-gray-900 (très bon contraste)
// Text secondaire : text-gray-600 (bon contraste)
```

### 9.2 ARIA attributes

```jsx
// Button avec icône seule
<button aria-label="Fermer">
  <X size={20} />
</button>

// Modal
<div 
  role="dialog" 
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Titre de la modal</h2>
</div>

// Loading state
<button aria-busy="true" disabled>
  Chargement...
</button>
```

---

## 10. Évolutions futures

### 10.1 Mode sombre

Ajouter le support du mode sombre avec Tailwind v4 :

**Dans `src/index.css` :**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f172a;
    --color-foreground: #f1f5f9;
  }
}

/* Ou avec data-theme */
[data-theme='dark'] {
  --color-background: #0f172a;
  --color-foreground: #f1f5f9;
}
```

**Usage :**
```jsx
<div className="bg-white dark:bg-gray-900">
<h1 className="text-gray-900 dark:text-white">
```

### 10.2 Animations avancées

Utiliser **Framer Motion** pour des animations complexes :

```bash
npm install framer-motion
```

```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## 📚 Ressources

- **Tailwind CSS v4** : https://tailwindcss.com/docs
- **Migration v3 → v4** : https://tailwindcss.com/docs/upgrade-guide
- **Lucide Icons** : https://lucide.dev/
- **Headless UI** : https://headlessui.com/ (composants accessibles)

---

## 📝 Note importante pour le développement

**À chaque phase importante du projet, il est fortement recommandé de créer/mettre à jour un document d'architecture** (`ARCHITECTURE.md`) qui documente :

- L'architecture globale du projet
- Les services et leurs responsabilités
- Les hooks et la gestion d'état
- L'architecture backend (tables, RLS, fonctions)
- Les flux métier (authentification, CRUD, etc.)
- Les décisions architecturales et leurs justifications
- Les points d'attention (sécurité, performance, accessibilité)

Ce document est **essentiel** pour :
- La reprise du projet par un nouveau développeur ou une IA
- La compréhension rapide de l'architecture technique
- La documentation vivante qui évolue avec le projet

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour un exemple complet.

---

## 🚀 Changements importants v3 → v4

### ✅ Ce qui a changé

1. **Plus de `tailwind.config.js`** → Configuration dans CSS avec `@theme`
2. **Installation** : `@tailwindcss/vite` au lieu de PostCSS
3. **Import** : `@import "tailwindcss"` au lieu de `@tailwind base/components/utilities`
4. **Autoprefixer intégré** : Plus besoin de l'installer
5. **Radius renommés** : `rounded` → `rounded-sm`, `rounded-sm` → `rounded-xs`

### ❌ Ce qui n'a PAS changé

1. **Classes utilitaires** : Identiques (bg-, text-, p-, m-, etc.)
2. **Responsive** : Mêmes breakpoints (sm:, md:, lg:, etc.)
3. **Hover/Focus** : Mêmes modifiers
4. **Composants** : Le code React reste identique

---

**Fin du Design Guide pour Tailwind CSS v4**

Ce guide contient tout ce dont Claude Code a besoin pour créer une interface cohérente, moderne et maintenable pour GameFund avec Tailwind CSS v4 ! 🎨