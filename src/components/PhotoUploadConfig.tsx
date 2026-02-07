import { useState, useRef, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_PHOTOS = 4;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface PhotoUploadConfigProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export function PhotoUploadConfig({
  enabled,
  onEnabledChange,
  photos,
  onPhotosChange,
}: PhotoUploadConfigProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`"${file.name}" is too large. Maximum size is 5MB.`);
      return false;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`"${file.name}" is not a supported image type. Use JPEG, PNG, WebP, or GIF.`);
      return false;
    }
    return true;
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('valentine-photos')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('valentine-photos')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = MAX_PHOTOS - photos.length;

    if (fileArray.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more photo${remainingSlots === 1 ? '' : 's'}.`);
      return;
    }

    const validFiles = fileArray.filter(validateFile);
    if (validFiles.length === 0) return;

    setIsUploading(true);

    const uploadedUrls: string[] = [];
    for (const file of validFiles) {
      const url = await uploadPhoto(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      onPhotosChange([...photos, ...uploadedUrls]);
      toast.success(`Uploaded ${uploadedUrls.length} photo${uploadedUrls.length === 1 ? '' : 's'}!`);
    }

    setIsUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!enabled) return;
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [enabled, photos]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (enabled) {
      setIsDragging(true);
    }
  }, [enabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removePhoto = async (index: number) => {
    const photoUrl = photos[index];
    
    // Extract path from URL for deletion
    try {
      const urlParts = photoUrl.split('/valentine-photos/');
      if (urlParts.length > 1) {
        await supabase.storage.from('valentine-photos').remove([urlParts[1]]);
      }
    } catch (err) {
      console.error('Failed to delete from storage:', err);
    }

    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    toast.success("Photo removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="photo-bg-toggle" className="text-base font-medium">
            Background Photos
          </Label>
          <p className="text-sm text-muted-foreground">
            Add personal photos as a subtle background
          </p>
        </div>
        <Switch
          id="photo-bg-toggle"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
      </div>

      {enabled && (
        <div className="space-y-4 pt-2">
          {/* Upload Area */}
          {photos.length < MAX_PHOTOS && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
                ${isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
                }
                ${isUploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
              `}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Drop photos here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max {MAX_PHOTOS} photos, 5MB each • JPEG, PNG, WebP, GIF
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Photo Grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.map((photo, index) => (
                <div key={photo} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`Background ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(index);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Add more button */}
              {photos.length < MAX_PHOTOS && !isUploading && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add</span>
                </button>
              )}
            </div>
          )}

          {photos.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {photos.length} of {MAX_PHOTOS} photos added
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Background Photos Display Component for Templates
interface PhotoBackgroundProps {
  photos: string[];
  className?: string;
}

export function PhotoBackground({ photos, className = "" }: PhotoBackgroundProps) {
  if (!photos || photos.length === 0) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
        {photos.slice(0, 4).map((photo, index) => (
          <div
            key={photo}
            className="relative overflow-hidden rounded-lg"
            style={{
              transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (2 + index)}deg)`,
            }}
          >
            <img
              src={photo}
              alt=""
              className="w-full h-full object-cover opacity-20 blur-[2px]"
            />
          </div>
        ))}
      </div>
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
    </div>
  );
}
