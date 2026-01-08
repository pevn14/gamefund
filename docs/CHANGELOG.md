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

## Phase 7 - CRUD Projets (Créateur)

### 📅 08/01/2026 - Storage Policies ✅ (Partiel)

**État actuel :**
- Le bucket `project-images` est **public** avec policy DELETE ajoutée
- ✅ Policy DELETE implémentée : permet aux utilisateurs authentifiés de supprimer les images
- ⏳ Policies SELECT, INSERT, UPDATE à implémenter (Phase 12)

**Policy implémentée :**
```sql
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated'
);
```

**Fonctionnalités actives :**
- ✅ Suppression automatique des images lors du changement d'image d'un projet
- ✅ Suppression automatique des images lors de la suppression d'un projet
- ✅ Images stockées directement à la racine du bucket (format: `projectId-timestamp.ext`)

**À implémenter (Phase 12 - Polish) :**
- Rendre le bucket privé et ajouter les policies SELECT, INSERT, UPDATE
- Voir détails complets dans `docs/TODO_SECURITY.md`

**Priorité :** MOYENNE pour développement, HAUTE pour production

**Impact :** Aucune modification du code frontend requise

**Fichier de référence :**
- `docs/TODO_SECURITY.md` (contient le code SQL exact à exécuter)

---

