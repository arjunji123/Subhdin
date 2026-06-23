import { vendorApi } from "./vendor";

export async function uploadToCloudinary(token: string, imageUri: string): Promise<string> {
  // 1. Get signed params from backend
  const { signature, timestamp, apiKey, cloudName, folder } = await vendorApi.getUploadSignature(token);

  // 2. Prepare form data
  const formData = new FormData();

  // React Native fetch uses this special object for file uploads
  const file: any = {
    uri: imageUri,
    type: 'image/jpeg', // Standard for gallery picks
    name: `upload_${Date.now()}.jpg`,
  };

  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', apiKey);
  formData.append('folder', folder);

  // 3. Upload directly to Cloudinary
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Upload to Cloudinary failed');
  }

  return data.secure_url;
}
