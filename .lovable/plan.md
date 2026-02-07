

# Template Selection Feature for Valentine Site Creator

## Overview
Add a template selection step to the site creation flow, allowing users to choose from multiple Valentine site templates. The first template is the existing "Classic" design (escaping No button with floating hearts), and the second is a "Meme GIF" template inspired by the GitHub reference (animated GIF banner with growing Yes button).

---

## Current State Analysis

**Existing Template (Classic):**
- Floating hearts animation
- "No" button escapes cursor and moves randomly
- "Yes" button scales up with each "No" attempt
- 5 theme variations (cute, minimal, dark, pastel, chaotic)
- Confetti celebration on success

**New Template (Meme GIF):**
- Animated GIF banner that changes based on interaction
- "Yes" button grows larger with each "No" click
- "No" button text changes through variants (stays in place)
- Simple, meme-style aesthetic
- Success message with happy GIF

---

## Implementation Plan

### Step 1: Database Schema Update

Add a `template` column to the `valentine_sites` table:

```text
+--------------------+
| valentine_sites    |
+--------------------+
| ...existing cols   |
| template (text)    |  <- NEW: "classic" | "meme_gif"
+--------------------+
```

- Default value: `"classic"` (backward compatible)
- Type: text enum or simple text field

---

### Step 2: Create Template Selection UI Component

**New File:** `src/components/TemplateSelector.tsx`

A horizontal scrollable gallery of template cards:

```text
+-------------------+  +-------------------+
|   [Preview Img]   |  |   [Preview Img]   |
|                   |  |                   |
|  Classic          |  |  Meme GIF         |
|  Escaping No btn  |  |  Growing Yes btn  |
|  [Selected]       |  |                   |
+-------------------+  +-------------------+
```

Each card shows:
- Animated preview thumbnail or static screenshot
- Template name
- Short description
- Selection indicator (checkmark when active)

---

### Step 3: Create Meme GIF Template Preview Component

**New File:** `src/components/templates/MemeGifPreview.tsx`

Features:
- Animated GIF banner area (using placeholder images initially)
- Three GIF states: neutral, sad (on No click), happy (on Yes click)
- Growing Yes button on each No click
- Changing No button text (same as classic, but button stays in place)
- Success message display

**GIF States:**
- Default: Cute hopeful character
- On "No" clicks: Sad/pleading character
- On "Yes": Celebrating character

---

### Step 4: Refactor Preview Components

**Update:** `src/components/ValentinePreview.tsx`

Rename to `ClassicPreview.tsx` and create a wrapper:

**New File:** `src/components/TemplatePreview.tsx`

```text
TemplatePreview
   |
   +-- template === "classic"  --> ClassicPreview
   |
   +-- template === "meme_gif" --> MemeGifPreview
```

This wrapper receives the template type and routes to the correct preview component.

---

### Step 5: Update CreateSite Page Layout

**Modify:** `src/pages/CreateSite.tsx`

New flow with template selection as the first step:

```text
+------------------------------------------+
| Header: Create New Site                  |
+------------------------------------------+
| Step 1: Choose Template                  |
| +----------------+  +----------------+   |
| |   Classic      |  |   Meme GIF     |   |
| |   [Selected]   |  |                |   |
| +----------------+  +----------------+   |
+------------------------------------------+
| Your URL        |  Text Customization    |
| /your-slug      |  Headline, Subtext,    |
|                 |  Yes/No buttons        |
+------------------------------------------+
| Theme Selection  |  Live Preview         |
| (left sidebar)   |  (right panel)        |
|                  |                       |
+------------------------------------------+
```

**Config State Update:**
```typescript
interface SiteConfig {
  template: "classic" | "meme_gif";  // NEW
  headline: string;
  subtext: string;
  yesButtonText: string;
  noButtonText: string;
  theme: Theme;
  slug: string;
}
```

---

### Step 6: Update ValentineSite (Public Page)

**Modify:** `src/pages/ValentineSite.tsx`

- Fetch `template` field from database
- Pass to `TemplatePreview` wrapper
- Routes to correct template component

---

### Step 7: Update Dashboard Display

**Modify:** `src/pages/Dashboard.tsx`

- Show template indicator on site cards (small badge/icon)
- Template name in site details

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/xxx.sql` | Create | Add `template` column |
| `src/components/TemplateSelector.tsx` | Create | Template gallery component |
| `src/components/TemplatePreview.tsx` | Create | Template routing wrapper |
| `src/components/templates/ClassicPreview.tsx` | Create | Renamed from ValentinePreview |
| `src/components/templates/MemeGifPreview.tsx` | Create | New meme GIF template |
| `src/pages/CreateSite.tsx` | Modify | Add template selection step |
| `src/pages/ValentineSite.tsx` | Modify | Handle template routing |
| `src/pages/Dashboard.tsx` | Modify | Show template indicator |
| `src/index.css` | Modify | Add any new animations |

---

## Template Data Structure

```typescript
const templates = [
  {
    id: "classic",
    name: "Classic",
    emoji: "💕",
    description: "The 'No' button escapes your cursor",
    features: ["Floating hearts", "Escaping button", "5 themes"],
  },
  {
    id: "meme_gif",
    name: "Meme GIF",
    emoji: "🐱",
    description: "Growing 'Yes' button with animated GIFs",
    features: ["Animated banners", "Growing button", "Meme style"],
  },
];
```

---

## Visual Preview of New Template

**Meme GIF Template States:**

```text
Initial State:         After No Clicks:       Success State:
+---------------+      +---------------+      +---------------+
|   [Happy      |      |   [Sad        |      |   [Celebrate  |
|    GIF]       |      |    GIF]       |      |    GIF]       |
+---------------+      +---------------+      +---------------+
| Will you be   |      | Will you be   |      | Yay! See you  |
| my Valentine? |      | my Valentine? |      | soon! :3      |
+---------------+      +---------------+      +---------------+
| [Yes]  [No]   |      |[YES!!!] [No?] |      |               |
| (equal size)  |      |(big)   (small)|      |               |
+---------------+      +---------------+      +---------------+
```

---

## Future Extensibility

The architecture supports adding more templates easily:

1. Create new preview component in `src/components/templates/`
2. Add template metadata to the templates array
3. Add case in `TemplatePreview.tsx` switch
4. No database changes needed (just new template ID value)

---

## Technical Considerations

### GIF Assets
- Will use placeholder/stock GIFs initially
- Can be replaced with custom assets later
- GIFs will be stored in `/public/images/` or fetched from CDN

### Theme Compatibility
- Classic template: Full 5-theme support (existing)
- Meme GIF template: Simplified theme support (light/dark variants)
- Each template can define which themes it supports

### Mobile Responsiveness
- Both templates fully responsive
- Meme GIF template optimized for mobile (GIF banner scales)

