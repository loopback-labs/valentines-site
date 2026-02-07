

# Personal Photo Background Feature with 5MB Limit

## Overview
Add the ability for site creators to upload up to 4 personal photos (max 5MB each) that will be displayed as a subtle background collage on their valentine site. The photos will also appear in the preview when the feature is enabled.

---

## What You Will Get
- A new "Personal Photos" section in the site creator form with:
  - Toggle to enable/disable photo backgrounds
  - Upload area for up to 4 photos (max 5MB per photo)
  - Clear file size validation with error messages
  - Preview thumbnails with ability to remove photos
- Photos displayed as a semi-transparent background in the actual valentine site
- Real-time preview showing your uploaded photos

---

## Technical Implementation

### 1. Database Changes
Add a new column to store photo URLs:

```sql
ALTER TABLE public.valentine_sites
ADD COLUMN background_photos text[] DEFAULT NULL;
```

### 2. Storage Setup
Create a storage bucket for photos:

```sql
-- Create bucket for valentine photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('valentine-photos', 'valentine-photos', true);

-- RLS policies for the bucket
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'valentine-photos');

CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'valentine-photos');

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'valentine-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. New Component: PhotoUploadConfig
Create a new component for the photo upload UI with 5MB validation:

**Location**: `src/components/PhotoUploadConfig.tsx`

**Key Features**:
- Toggle switch to enable background photos
- Drag-and-drop or click-to-upload area
- **5MB file size limit per photo** with clear error messaging
- Maximum 4 photos limit
- Image type validation (JPEG, PNG, WebP, GIF only)
- Grid of uploaded photo thumbnails with delete buttons
- Upload progress indicator

**File Size Validation Logic**:
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_PHOTOS = 4;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const validateFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    toast.error(`"${file.name}" is too large. Maximum size is 5MB.`);
    return false;
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    toast.error(`"${file.name}" is not a supported image type.`);
    return false;
  }
  return true;
};
```

### 4. Update SiteConfig Interface
Add new fields to the configuration in CreateSite.tsx and EditSite.tsx:

```typescript
interface SiteConfig {
  // ... existing fields
  enableBackgroundPhotos: boolean;
  backgroundPhotos: string[]; // Array of photo URLs (max 4)
}
```

### 5. Update Template Components
Modify each template to render background photos:
- ClassicPreview.tsx
- MemeGifPreview.tsx  
- TeddyBearPreview.tsx

**Background Photo Display**:
- 2x2 grid layout behind main content
- Low opacity (15-25%) for readability
- Slight blur effect for depth
- Subtle animation between photos (optional)

### 6. Update ValentineSite.tsx
- Fetch `background_photos` from the database
- Pass photos to TemplatePreview component

---

## File Changes Summary

| File | Change |
|------|--------|
| Database migration | Add `background_photos` column + create storage bucket |
| `src/components/PhotoUploadConfig.tsx` | NEW - Photo upload UI with 5MB validation |
| `src/pages/CreateSite.tsx` | Add PhotoUploadConfig section, handle uploads |
| `src/pages/EditSite.tsx` | Add PhotoUploadConfig section, handle uploads |
| `src/components/TemplatePreview.tsx` | Pass backgroundPhotos prop |
| `src/components/templates/ClassicPreview.tsx` | Render background photos |
| `src/components/templates/MemeGifPreview.tsx` | Render background photos |
| `src/components/templates/TeddyBearPreview.tsx` | Render background photos |
| `src/pages/ValentineSite.tsx` | Fetch and pass background photos |

---

## User Experience Flow

1. **Creator opens site editor** and sees a new "Personal Photos" section
2. **Toggles on** the background photos feature
3. **Uploads photos** by clicking or dragging (up to 4 photos, max 5MB each)
4. **If file is too large**, sees a clear error: "photo.jpg is too large. Maximum size is 5MB."
5. **Sees preview update** with their photos as a subtle background
6. **Saves/publishes** the site
7. **Visitor sees** the valentine site with the personal photos in the background

---

## Validation Rules Summary

| Rule | Value |
|------|-------|
| Maximum photos | 4 |
| Maximum file size per photo | 5MB |
| Allowed file types | JPEG, PNG, WebP, GIF |

