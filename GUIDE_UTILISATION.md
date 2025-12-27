# 🚀 GUIDE D'UTILISATION - MaintenancePro Stylisée

## 📦 Prérequis

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

## 🚀 Lancer l'Application

### Développement
```bash
# Naviguez dans le dossier
cd f:\mes_projets\projet_front\maltimart

# Installez les dépendances (si première fois)
npm install

# Lancez le serveur de dev
npm run dev

# L'app sera disponible sur http://localhost:3003
```

### Production
```bash
# Build pour production
npm run build

# Lancez le serveur
npm start
```

---

## 🎨 Vue d'Ensemble du Design

### Couleurs Principales
```
🟣 Primary: Violet → Indigo (gradients)
🟠 Secondary: Orange/Gold
⚪ Background: Slate (50/100/900)
```

### Animations
```
✅ Fade-in au chargement
✅ Hover lift effects (-4px)
✅ Stagger effects (listes)
✅ Loading spinners
✅ Smooth transitions (300ms)
```

### Dark Mode
```
✅ Support complet
✅ Couleurs adaptées
✅ Contraste optimal
✅ Toggle automatique
```

---

## 📁 Structure des Fichiers

### Styles
```
app/globals.css              ← Couleurs globales
components/ui/              ← Composants réutilisables
  ├── button.tsx
  ├── input.tsx
  ├── dialog.tsx
  └── ...
```

### Pages Principales
```
components/
├── home/                    ← Dashboard
│   ├── home-index.tsx
│   ├── bilan-card.tsx
│   ├── intervention-card.tsx
│   └── total-card.tsx
├── interventions/           ← Gestion interventions
├── techniciens/             ← Gestion techniciens
├── vehicule/                ← Gestion véhicules
└── mvpblocks/
    └── header-1.tsx         ← Navigation
```

---

## 🎯 Utilisation des Composants

### 1. Ajouter une Nouvelle Card

```tsx
'use client';  // Important!

import { motion } from 'framer-motion';

export const MyCard = ({ item, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-2xl shadow-lg border border-slate-200 
                 dark:border-slate-700 p-6 bg-white dark:bg-slate-800
                 hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-600
                 transition-all duration-300"
    >
      {/* Votre contenu ici */}
    </motion.div>
  );
};
```

### 2. Ajouter une Liste Responsive

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item, index) => (
    <Card key={item.id} item={item} index={index} />
  ))}
</div>
```

### 3. Ajouter un Status Badge

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIF':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'EN_MAINTENANCE':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    // ... autres statuts
  }
};

<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
  {status}
</span>
```

### 4. Ajouter un Bouton Iconé

```tsx
import { motion } from 'framer-motion';
import { IconEdit, IconTrash } from '@tabler/icons-react';

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 
             dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 
             p-2 rounded-lg transition"
  onClick={() => handleEdit()}
>
  <IconEdit stroke={2} />
</motion.button>
```

---

## 🌙 Dark Mode

### Vérifier le Dark Mode
```tsx
// Tailwind automatique
className="light:bg-white dark:bg-slate-800"

// La classe .dark sera appliquée au html
// Next-themes handle ça automatiquement
```

### Toggle Dark Mode
L'application devrait avoir un toggle quelque part pour changer le mode.

---

## 📱 Responsive Breakpoints

```
sm: 640px   → 2 colonnes
md: 768px   → (généralement ignoré)
lg: 1024px  → 3 colonnes

Mobile First: 1 colonne par défaut
```

### Exemple
```tsx
className="
  w-full sm:w-[calc(50%-1rem)] 
  md:w-[calc(50%-1rem)] 
  lg:w-[calc(33.333%-1rem)]
"
```

---

## 🎬 Animations Framer Motion

### Fade-in Simple
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Stagger Effect (Pour Listes)
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}  // ← Stagger!
  >
    {item}
  </motion.div>
))}
```

### Hover Effect
```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
  Hover me!
</motion.div>
```

---

## 🔧 Configuration Tailwind

Fichier: `tailwind.config.ts` (normalement)

```typescript
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Extensions personnalisées ici
    },
  },
  plugins: [],
}
```

---

## 🎨 Couleurs Personnalisées

### Modifier la couleur primaire
Fichier: `app/globals.css`

```css
:root {
  --primary: oklch(0.55 0.24 280);  /* Violet/Indigo */
  --secondary: oklch(0.75 0.18 35);  /* Orange */
  /* ... autres variables */
}
```

### Ajouter une nouvelle couleur
```css
:root {
  --my-color: oklch(0.5 0.2 150);
}
```

Utilisation:
```tsx
className="bg-[var(--my-color)]"
```

---

## 📊 Déployer en Production

### Build
```bash
npm run build
```

### Tester la build
```bash
npm start
```

### Déployer (Vercel)
```bash
# Avec Vercel CLI
vercel deploy

# Ou via GitHub (auto-deploy)
```

---

## ✅ Checklist Avant Deployment

- [ ] Pas d'erreurs TypeScript
- [ ] Dark mode fonctionne
- [ ] Mobile responsive fonctionne
- [ ] Animations smooth (60fps)
- [ ] Images optimisées
- [ ] No console errors
- [ ] Lighthouse > 90
- [ ] Tested sur vrais appareils

---

## 🐛 Troubleshooting

### "Error: Attempted to call createMotionComponent from server"
**Solution**: Ajouter `'use client';` au top du fichier qui utilise `motion.div`

### "Port 3000 is in use"
**Solution**: Le serveur utilise automatiquement le port suivant (3003 par défaut)

### Dark mode ne change pas
**Solution**: Vérifier que next-themes est installé et que le toggle fonctionne

### Animations saccadées
**Solution**: 
1. Réduire le nombre d'animations complexes
2. Utiliser `transform` et `opacity` seulement
3. Éviter les `layout` animations

---

## 📚 Ressources Externes

### Tailwind CSS v4
https://tailwindcss.com/docs

### Framer Motion
https://www.framer.com/motion/

### Radix UI
https://www.radix-ui.com/

### Tabler Icons
https://tabler-icons.io/

---

## 🆘 Support et Questions

### Documentation Locale
```
📄 STYLISATION_RESUME.md  - Résumé des changements
📄 STYLE_GUIDE.md         - Guide complet
📄 COLOR_PALETTE.md       - Palette de couleurs
📄 RECOMMENDATIONS.md     - Bonnes pratiques
```

---

## 🎉 C'est Prêt!

Vous pouvez maintenant:
✅ Développer de nouveaux features
✅ Modifier les styles
✅ Ajouter des animations
✅ Déployer en production

**Bon développement! 🚀**

---

*LastUpdate: 2025-11-12*
