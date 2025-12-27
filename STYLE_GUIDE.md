# 📚 Style Guide - MaintenancePro

## 🎨 Système de Couleurs

### Palette Primaire
```
Primary: oklch(0.55 0.24 280) - Violet/Indigo
Secondary: oklch(0.75 0.18 35) - Orange/Gold
Accent: oklch(0.65 0.25 25) - Orange vif
```

### Couleurs d'État
| État | Couleur | Usage |
|------|---------|-------|
| Disponible | Vert (green-500) | Ressources prêtes |
| En cours | Bleu (blue-500) | Actions actives |
| Maintenance | Jaune (yellow-500) | En travail |
| Inactif | Gris (gray-500) | Désactivé |
| Erreur | Rouge (red-500) | Problèmes |

## 🏗️ Composants Réutilisables

### Cards
Tous les cards utilisent le même pattern:
```tsx
<CardWrapper>
  <CardHeader>
    {/* Titre et infos principales */}
  </CardHeader>
  <CardContent>
    {/* Contenu détaillé */}
  </CardContent>
  <CardFooter>
    {/* Actions (boutons) */}
  </CardFooter>
</CardWrapper>
```

### Boutons
```tsx
// Variantes disponibles
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="destructive">Danger Action</Button>
<Button variant="ghost">Subtle Action</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### Inputs
```tsx
<Input placeholder="Entrez du texte..." />
<Input type="email" placeholder="Email..." />
<Input type="password" placeholder="Mot de passe..." />
```

## 📐 Spacing Scale

| Classe | Valeur | Usage |
|--------|--------|-------|
| p-4 | 1rem | Padding par défaut |
| p-6 | 1.5rem | Cards |
| px-4, py-2 | 1rem / 0.5rem | Inputs/Buttons |
| gap-4 | 1rem | Entre éléments |
| gap-6 | 1.5rem | Entre sections |

## 🎬 Animations

### Entrée
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, delay: index * 0.1 }}
```

### Hover
```tsx
whileHover={{ y: -4, scale: 1.02 }}
transition={{ duration: 0.2 }}
```

### Tap (Mobile)
```tsx
whileTap={{ scale: 0.95 }}
```

## 📱 Responsive Breakpoints

```
Mobile:  < 640px  (sm)
Tablet:  ≥ 640px  (md)
Desktop: ≥ 1024px (lg)
```

### Grids par Page
```
- Accueil: 1 / 2 / 3 colonnes
- Techniciens: 1 / 2 / 3 colonnes
- Véhicules: 1 / 2 / 3 colonnes
- Interventions: 1 / 2 / 3 colonnes
```

## 🌙 Dark Mode

Tous les composants supportent le mode sombre:
```tsx
// Light
bg-white dark:bg-slate-800
text-slate-900 dark:text-white
border-slate-200 dark:border-slate-700
```

## ✅ Checklist d'Application

- [ ] Tous les cards utilisent CardWrapper
- [ ] Toutes les animations utilisent framer-motion
- [ ] Tous les gradients utilisent `bg-linear-to-*`
- [ ] Tous les boutons ont une variante
- [ ] Inputs utilisent le composant centralisé
- [ ] Dark mode appliqué partout
- [ ] Loading states avec spinner animé
- [ ] Empty states avec messages
- [ ] Confirmations avant suppression
- [ ] Toast notifications pour actions

## 🔄 Couleurs Dynamiques par Type

### Techniciens
- Icon background: blue → purple gradient
- Status badges: green/blue/yellow/red

### Véhicules
- Icon background: truck specific colors
- Status badges: actif/maintenance/inactif

### Interventions
- Status badges: EN_COURS/TERMINEE/PROGRAMMEE
- Priority colors: rouge/orange/jaune

## 🎯 Best Practices

1. **Toujours utiliser les composants** du système de design
2. **Respecter les spacings** pour la cohérence
3. **Ajouter des animations** pour le feedback utilisateur
4. **Tester en dark mode** avant de committer
5. **Utiliser des transitions** sur tous les hover/states
6. **Icônes de Tabler** pour la cohérence (voir package.json)

## 📦 Dépendances Utilisées

- **Framer Motion**: Animations fluides
- **Tailwind CSS v4**: Styling
- **Tabler Icons**: Icons professionnels
- **Radix UI**: Primitives accessibles
- **Sonner**: Notifications toast
