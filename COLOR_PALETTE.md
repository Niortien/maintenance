# 🎨 COLOR PALETTE - MaintenancePro

## Gradients Principaux

### Violet → Indigo (Primaire)
```css
from-purple-600 to-indigo-600  /* Light Mode */
from-purple-400 to-indigo-400  /* Dark Mode */
```
Utilisation: Header logo, boutons primaires, accents

### Orange → Orange (Secondaire)
```css
from-orange-500 to-orange-700  /* Original accent */
```
Utilisation: Cartes, highlights

## Couleurs d'État

### ✅ Disponible / Actif
```
Light: bg-green-100 text-green-700 border-green-200
Dark:  bg-green-900/30 text-green-400 border-green-600
```

### 🔵 En Cours / En Mission / Bleu
```
Light: bg-blue-100 text-blue-700 border-blue-200
Dark:  bg-blue-900/30 text-blue-400 border-blue-600
```

### ⚠️ Maintenance / En Attente / Jaune
```
Light: bg-yellow-100 text-yellow-700 border-yellow-200
Dark:  bg-yellow-900/30 text-yellow-400 border-yellow-600
```

### ❌ Inactif / Erreur / Rouge
```
Light: bg-red-100 text-red-700 border-red-200
Dark:  bg-red-900/30 text-red-400 border-red-600
```

## Backgrounds

### Pages
```
Light: bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
Dark:  bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950
```

### Cards
```
Light: bg-white / bg-gradient-to-br from-white to-slate-50
Dark:  bg-slate-800 / bg-gradient-to-br from-slate-800 to-slate-900
```

### Hover Cards
```
Light: from-white to-slate-50 → hover:border-purple-300
Dark:  from-slate-800 to-slate-900 → hover:border-purple-600
```

## Borders

### Par défaut
```
Light: border-slate-200
Dark:  border-slate-700
```

### Hover/Active
```
Light: border-purple-300
Dark:  border-purple-600
```

### Translucent (Sur gradients)
```
border-white/10   /* Bornes blanches semi-transparentes */
border-white/20   /* Plus visible au hover */
```

## Text Colors

### Primaire
```
Light: text-slate-900
Dark:  text-white
```

### Secondaire
```
Light: text-slate-700
Dark:  text-slate-300
```

### Tertiaire
```
Light: text-slate-600
Dark:  text-slate-400
```

### Muted
```
Light: text-slate-500
Dark:  text-slate-500
```

## Shadows

### Standard
```css
shadow-lg    /* Cartes au repos */
```

### Hover
```css
shadow-2xl   /* Cartes au hover */
```

### Layered (Élément de premier plan)
```css
shadow-sm + shadow-md    /* Combines */
```

## Opacity/Transparency

### Fond avec opacity
```
bg-black/50           /* 50% black overlay */
bg-white/10           /* 10% white translucent */
text-white/80         /* 80% opacity text */
```

### Hover states
```
hover:bg-slate-100       /* Light mode */
dark:hover:bg-slate-800  /* Dark mode */
```

## Component-Specific Colors

### Icon Buttons
```
Default:    bg-slate-100 dark:bg-slate-700
Danger:     bg-red-100 dark:bg-red-900/30
Primary:    bg-purple-100 dark:bg-purple-900/30
```

### Status Badges
```
DISPONIBLE:     green
EN_MISSION:     blue
EN_MAINTENANCE: yellow
INACTIF:        red
```

### Badge Variants
```
Light: bg-[color]-100 text-[color]-700 border-[color]-200
Dark:  bg-[color]-900/30 text-[color]-400 border-[color]-600
```

## Gradients Spécifiques

### Header Background (Scroll)
```css
linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(240, 249, 255, 0.8) 100%)
/* Light Mode */

linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(20, 28, 52, 0.8) 100%)
/* Dark Mode */
```

### Icon Backgrounds
```css
bg-linear-to-br from-blue-500 to-purple-600
bg-linear-to-br from-purple-600 to-indigo-600
```

## Dark Mode Classes

Tous les éléments utilisent:
```
className="light:bg-white dark:bg-slate-800"
className="light:text-slate-900 dark:text-white"
className="light:border-slate-200 dark:border-slate-700"
```

## Ajouter des Nouvelles Couleurs

Si vous devez ajouter des couleurs:

1. Respecter la cohérence (slate/purple/indigo primaires)
2. Ajouter les variants light et dark
3. Utiliser les nuances 100/400/700 (badges) ou 50/800/900 (backgrounds)
4. Tester en dark mode
5. Ajouter à cette documentation

## Référence Tailwind Opacité

```
/5    = 5% opacity (95% transparent)
/10   = 10% opacity
/20   = 20% opacity
/30   = 30% opacity
/50   = 50% opacity
/75   = 75% opacity
```

---

**💡 Utiliser toujours les classes Tailwind plutôt que du CSS personnalisé pour la cohérence!**
