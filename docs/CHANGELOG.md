# Changelog - Demandes supplémentaires

Demandes et modifications ajoutées au plan initial.

**Légende :** ⏳ À faire | 🚧 En cours | ✅ Terminé | ❌ Annulé
---

## Phase 2 - Composants UI

### 📅 03/01/2026 - FilePicker ✅

**Ajout :** Composant upload d'images avec drag & drop, preview et validation

**Fichiers :**
- `src/components/ui/FilePicker.jsx`
- `src/pages/ComponentsDemo.jsx`

**Note :** Intégration Supabase Storage → Phase 7

---

## Phase 3 - Layout Components

### 📅 03/01/2026 - Menu burger mobile ✅

**Ajout :** Menu hamburger responsive pour navigation mobile

**Fichiers :**
- `src/components/layout/Header.jsx`

**Détails :**
- Bouton burger visible uniquement sur mobile (< md)
- Menu déroulant avec liens de navigation
- Boutons auth pleine largeur sur mobile
- Fermeture automatique au clic sur un lien

### 📅 03/01/2026 - Améliorations responsive à prévoir ⏳

**À implémenter en Phase 12 (Polish) :**

**Importantes :**
- Boutons auth mobile : icônes seulement ou padding réduit
- Spacing mobile optimisé : px-4 au lieu de px-6, titres plus petits
- Cards en orientation horizontale sur très petit écran
- Footer mobile simplifié (accordéon ou colonnes empilées)

**Nice to have :**
- Touch-friendly : zones de clic min-h-12, gaps plus grands
- Modal plein écran sur mobile
- Tables responsive (cards sur mobile)

---

