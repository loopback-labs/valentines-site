

# Photo Display Options & Visibility Improvements

## Overview
This plan adds options for controlling when photos are displayed (background vs. after clicking "Yes") and significantly improves photo visibility by reducing/removing the tint, blur, and overlay effects.

---

## What You Will Get

1. **New Display Mode Option** - Choose when photos appear:
   - "Background" - Photos show behind the main content (current behavior)
   - "After Yes" - Photos appear only after the visitor clicks "Yes"

2. **Clearer Photo Display** - Improved visibility:
   - Remove blur effect from photos
   - Increase opacity from 20% to 60-80%
   - Remove dark overlay gradients
   - Keep subtle rotation for collage aesthetic
   - Optional: Add a light frame/border for definition

---

## Technical Implementation

### 1. Update SiteConfig Interface
Add a new field to control photo display timing:

```typescript
interface SiteConfig {
  // ... existing fields
  enableBackgroundPhotos: boolean;
  backgroundPhotos: string[];
  photoDisplayMode: "background" | "after_yes"; // NEW
}
```

### 2. Database Migration
Add a new column to store the display mode preference:

```sql
ALTER TABLE public.valentine_sites
ADD COLUMN photo_display_mode text DEFAULT 'background';
```

### 3. Update PhotoUploadConfig Component
Add radio buttons or a select dropdown for choosing display mode:

- Add a new prop `displayMode` and `onDisplayModeChange`
- Show two options with clear icons/descriptions:
  - **Background**: "Show as subtle background behind content"
  - **After Saying Yes**: "Reveal photos after they click Yes"

### 4. Update PhotoBackground Component
Improve visibility by changing styling:

**Current (hard to see):**
```tsx
className="w-full h-full object-cover opacity-20 blur-[2px]"
// + overlay gradient
```

**Updated (clearly visible):**
```tsx
className="w-full h-full object-cover opacity-70"
// No blur, no dark overlay
// Add subtle white border/shadow for definition
```

### 5. Create PhotoGallery Component (for "After Yes" mode)
A new component that displays photos prominently in the success state:

- 2x2 grid layout with proper spacing
- Full opacity, no blur
- Subtle shadow and rounded corners
- Optional: Simple fade-in animation

### 6. Update All Template Components
Modify ClassicPreview, MemeGifPreview, and TeddyBearPreview to:

- Accept new `photoDisplayMode` prop
- Conditionally render PhotoBackground (background mode) or PhotoGallery (after_yes mode)
- Pass the prop through from TemplatePreview

### 7. Update TemplatePreview Interface
Add the new prop to the interface and pass it through to templates.

### 8. Update CreateSite.tsx and EditSite.tsx
- Add display mode to initial config state
- Pass display mode to PhotoUploadConfig
- Include in database save/load operations

### 9. Update ValentineSite.tsx
- Fetch `photo_display_mode` from database
- Pass to TemplatePreview

---

## File Changes Summary

| File | Change |
|------|--------|
| Database migration | Add `photo_display_mode` column |
| `src/components/PhotoUploadConfig.tsx` | Add display mode selector, improve PhotoBackground visibility |
| `src/components/TemplatePreview.tsx` | Add `photoDisplayMode` prop, pass to templates |
| `src/components/templates/ClassicPreview.tsx` | Handle both display modes |
| `src/components/templates/MemeGifPreview.tsx` | Handle both display modes |
| `src/components/templates/TeddyBearPreview.tsx` | Handle both display modes |
| `src/pages/CreateSite.tsx` | Add display mode config, UI, and save logic |
| `src/pages/EditSite.tsx` | Add display mode config, UI, and load/save logic |
| `src/pages/ValentineSite.tsx` | Fetch and pass display mode |

---

## Visual Changes

### PhotoBackground Component (for Background mode)
**Before:**
- 20% opacity
- 2px blur
- Dark gradient overlay
- Photos barely visible

**After:**
- 60-70% opacity
- No blur
- No dark overlay
- Subtle white/light border on each photo
- Photos clearly visible but still complement content

### PhotoGallery Component (for After Yes mode)
- Full size photo grid
- 100% opacity
- Clean white borders
- Prominent placement in success screen
- Appears alongside success message

---

## User Experience Flow

### Background Mode:
1. User enables background photos
2. Selects "Show in Background"
3. Uploads photos
4. Preview shows photos clearly behind content
5. Visitor sees photos immediately when viewing the site

### After Yes Mode:
1. User enables background photos
2. Selects "Show After Saying Yes"
3. Uploads photos
4. Preview shows photos in success state only
5. Visitor sees clean site initially, photos revealed as a "surprise" after clicking Yes

