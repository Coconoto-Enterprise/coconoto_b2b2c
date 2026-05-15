import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error' 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse form data
    const form = formidable({ 
      maxFileSize: 5 * 1024 * 1024, // 5MB max
      keepExtensions: true,
      multiples: false
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const vendorId = fields.vendorId?.[0] || fields.vendorId;
    const uploadedFile = files.image?.[0] || files.image;

    if (!vendorId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vendor ID is required' 
      });
    }

    if (!uploadedFile) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(uploadedFile.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid file type. Only JPEG, PNG, WEBP, and AVIF images are allowed.' 
      });
    }

    // Read file
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);
    
    // Generate unique filename
    const fileExt = uploadedFile.originalFilename?.split('.').pop() || 'jpg';
    const fileName = `${vendorId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, fileBuffer, {
        contentType: uploadedFile.mimetype || 'image/jpeg',
        upsert: false
      });

    // Clean up temp file
    fs.unlinkSync(uploadedFile.filepath);

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to upload image' 
      });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return res.status(200).json({ 
      success: true, 
      imageUrl: publicUrl,
      path: fileName
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to upload image' 
    });
  }
}
