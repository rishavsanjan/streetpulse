export interface LocalImage {
  id: string;
  originalFile: File;
  preview: string;
  croppedFile?: File;
  croppedPreview?: string;
}