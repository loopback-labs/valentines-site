

## Add "Teddy Bear" Template from AlwaysBeMine

Based on the [AlwaysBeMine](https://github.com/UjjwalSaini07/AlwaysBeMine) repository, I'll add a new template with a cute teddy bear GIF, holographic gradient background, and playful interactions.

### What This Template Includes

The new template will feature:
- **Holographic gradient background** - A vibrant animated gradient with pink, purple, cyan, and blue colors (matching the screenshot)
- **Cute teddy bear GIF** - The adorable bear holding roses with floating hearts
- **"All You Need Is Love" badge** - Decorative corner element
- **Growing "Yes" button** - Gets bigger each time "No" is clicked
- **Cycling "No" button text** - Shows increasingly desperate messages
- **Floating heart/sad GIFs** - Appear when hovering over buttons
- **Celebration state** - Romantic success screen with cycling love GIFs

### Key Features Comparison

| Feature | Classic | Meme GIF | Teddy Bear (New) |
|---------|---------|----------|------------------|
| Background | Solid gradient | Solid gradient | Holographic animated |
| Main visual | Heart icon | Single GIF | Teddy bear + floating GIFs |
| "No" behavior | Button escapes cursor | Button shrinks, Yes grows | Yes grows, floating sad GIFs |
| Success state | Confetti + heart | Single happy GIF | Cycling romantic GIFs + marquee text |

---

### Technical Implementation

#### 1. Update Template Types
Add `"teddy_bear"` to the `TemplateId` type in `TemplateSelector.tsx`

#### 2. Create New Template Component
Create `src/components/templates/TeddyBearPreview.tsx` with:
- Holographic gradient background using CSS keyframe animation
- Theme-specific color variations (adapting the holographic look for each of the 5 themes)
- Teddy bear GIF as the main visual
- Floating hearts/sad emoji GIFs on button hover
- Growing Yes button mechanics
- Success state with cycling celebration GIFs

#### 3. Add Template to Selector
Update the templates array in `TemplateSelector.tsx` to include:
```text
id: "teddy_bear"
name: "Teddy Bear"  
emoji: "🧸"
description: "Cute bear with holographic background"
features: ["Holographic BG", "Floating GIFs", "Growing Yes"]
```

#### 4. Update Template Preview Router
Add the new template case in `TemplatePreview.tsx`

#### 5. Add CSS Animation
Add holographic gradient keyframe animation to `index.css`:
- `bg-gradient-holographic` class for the animated multi-color gradient
- Smooth color shifting animation (matching the screenshot aesthetic)

---

### Asset Sources

The template will use these publicly available GIFs:
- **Teddy bear**: From Giphy (similar cute bear with roses)
- **Floating hearts**: Heart emojis/GIFs on Yes hover
- **Sad faces**: Sad emoji GIFs on No hover  
- **Success GIFs**: Cycling romantic/celebration GIFs

---

### Theme Adaptations

Each theme will adapt the holographic effect:
| Theme | Holographic Colors |
|-------|-------------------|
| Cute | Pink, magenta, purple |
| Minimal | White, light gray, soft blue |
| Dark | Purple, blue, dark magenta |
| Pastel | Lavender, soft pink, light blue |
| Chaotic | Rainbow with faster animation |

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/templates/TeddyBearPreview.tsx` | Create new template component |
| `src/components/TemplateSelector.tsx` | Add teddy_bear to TemplateId type and templates array |
| `src/components/TemplatePreview.tsx` | Add teddy_bear case to switch statement |
| `src/index.css` | Add holographic gradient animation |

