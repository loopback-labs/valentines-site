

# 💘 Valentine Website Generator + Hosting Platform

A full-featured web app that lets users create, customize, and host their own playful "Will You Be My Valentine?" websites with the classic "No is not an option" interaction.

---

## 🎯 Core Experience

### User Journey
1. **Sign Up/Login** → Create account to save and manage sites
2. **Customize** → Pick text, theme, and style with live preview
3. **Publish** → Get a unique shareable URL like `/piyushh`
4. **Share** → Copy link or download QR code
5. **Track** → See when someone clicks "Yes!"

---

## 🎨 Website Maker Dashboard

### Design Style
- **Playful & Bold Gen-Z aesthetic**
- Vibrant gradients, bold typography, colorful accents
- Fun micro-interactions and animations
- Mobile-first, responsive layout

### Configuration Panel

**Text Customization**
- Main headline (e.g., "Will You Be My Valentine?")
- Description/subtext
- "Yes" button text
- "No" button text with optional funny variants that change on hover

**Mood/Style Presets (5 themes)**
| Theme | Vibe |
|-------|------|
| 💕 Cute | Soft pinks, hearts, romantic |
| ⬜ Minimal | Clean, modern, understated |
| 🌙 Dark | Moody, elegant, mysterious |
| 🍬 Pastel | Soft colors, dreamy aesthetic |
| 🎪 Chaotic | Extra animations, playful chaos |

**Live Preview**
- Side-by-side preview that updates in real-time
- Toggle between desktop/mobile view
- Preview the "No" button escape animation

---

## 🖥️ Generated Valentine Sites

### Core Interaction Flow (preserved from original)
1. Site loads with main question
2. "Yes" button works normally
3. "No" button runs away when hovered/clicked
4. "No" gets progressively harder to click
5. Success celebration when "Yes" is clicked

### Features
- Responsive on all devices
- Smooth animations
- Fast loading (static generation)
- Clean, shareable URLs

---

## 🔗 Hosting & Publishing

### URL Structure
- Users claim unique slugs: `yourapp.lovable.app/piyushh`
- Slug validation (no duplicates, appropriate length)
- Option to change slug later

### Sharing Tools
- One-click copy URL button
- Auto-generated QR code for download
- Optional password protection toggle

---

## 📊 Response Tracking

### Dashboard View
- View count: how many people visited your link
- "Yes" click count with celebration indicator
- Timestamp of responses
- Simple, clean stats display

---

## 👤 User Accounts

### Authentication
- Email/password signup
- Optional social login (Google)
- Email verification

### User Dashboard
- List of all created Valentine sites
- Edit existing sites
- View analytics per site
- Delete sites

---

## 🛠️ Technical Architecture

### Frontend
- React with Tailwind CSS for styling
- Framer-motion-style animations
- Real-time preview with state management

### Backend (Lovable Cloud)
- **Database**: Store user accounts, site configs, response tracking
- **Authentication**: Supabase Auth with required accounts
- **Dynamic Routing**: Load site config based on username slug

### Data Flow
```
User Config (JSON) → Template Engine → Rendered Valentine Site
```

---

## 📋 Development Phases

### Phase 1: Foundation
- User authentication (signup, login, logout)
- User dashboard shell
- Database schema for sites and configs

### Phase 2: Site Builder
- Configuration UI with all text inputs
- All 5 theme presets
- Live preview component
- Slug selection and validation

### Phase 3: Valentine Template
- Build the interactive Valentine site template
- "No" button escape behavior
- All animations and theme variations
- Mobile responsiveness

### Phase 4: Publishing & Sharing
- Dynamic routing for user slugs
- Copy URL functionality
- QR code generation
- Password protection toggle

### Phase 5: Analytics & Polish
- Response tracking (views and "Yes" clicks)
- Analytics dashboard
- Final UI polish and testing

