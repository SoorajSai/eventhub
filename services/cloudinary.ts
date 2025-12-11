
export const CloudinaryService = {
  uploadImage: async (file: File): Promise<string> => {
    // CONFIGURATION: Replace these with your actual Cloudinary Cloud Name and Upload Preset
    // 1. Sign up at https://cloudinary.com/
    // 2. Go to Settings -> Upload -> Add upload preset (Mode: Unsigned)
    // 3. Use your Cloud Name and the Name of the new preset below
    
    // Defaulting to 'demo' and a common example preset for demonstration. 
    // NOTE: The 'demo' cloud has strict limits and may not work for all uploads.
    const CLOUD_NAME = 'dbvsoijhj'; 
    const UPLOAD_PRESET = 'ss8z5ww6';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Image upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw error;
    }
  }
};
