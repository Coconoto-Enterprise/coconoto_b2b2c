# Image Upload Setup Guide

## Overview
This project now supports uploading product images directly to Supabase Storage instead of using external image URLs.

## What Changed

### 1. New API Endpoint
- **File**: `api/upload-product-image.js`
- **Purpose**: Handles image uploads from vendors to Supabase Storage
- **Features**:
  - Validates file types (JPEG, PNG, WEBP, AVIF)
  - Enforces 5MB max file size
  - Generates unique filenames to prevent conflicts
  - Returns public URL for the uploaded image

### 2. Updated Vendor Dashboard
- **File**: `src/pages/vendor/VendorDashboard.tsx`
- **Changes**:
  - Replaced "Image URL" text input with file upload input
  - Added image preview functionality
  - Shows upload progress states
  - Validates file type and size on the client side

### 3. Enhanced Vendor Service
- **File**: `src/services/vendorService.ts`
- **New Function**: `uploadProductImage(vendorId, imageFile)`
- **Purpose**: Handles the upload request to the API endpoint

### 4. Database Migration
- **File**: `supabase/migrations/20260214000001_create_product_images_bucket.sql`
- **Purpose**: Creates the storage bucket and sets up access policies

## Setup Instructions

### Step 1: Create Supabase Storage Bucket

You have two options:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Set:
   - **Name**: `product-images`
   - **Public**: Toggle ON (enable public access)
5. Click **"Create bucket"**

#### Option B: Using SQL Migration
1. Navigate to **SQL Editor** in Supabase dashboard
2. Run the migration file:
   ```sql
   -- Copy and paste content from:
   -- supabase/migrations/20260214000001_create_product_images_bucket.sql
   ```

### Step 2: Verify Environment Variables

Ensure these variables are set on Vercel:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Step 3: Deploy to Vercel

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add image upload functionality for vendor products"
   git push
   ```

2. Vercel will automatically deploy (if connected to your repo)

### Step 4: Test the Upload Feature

1. Log in to Vendor Dashboard
2. Click **"Add Product"** or edit an existing product
3. Click the file input to select an image from your device
4. You should see:
   - File size/type validation
   - Image preview
   - Upload progress indicator
5. Submit the form - the image will be uploaded to Supabase Storage

## File Upload Details

### Supported Formats
- JPEG/JPG
- PNG
- WEBP
- AVIF

### File Size Limit
- Maximum: 5 MB per image

### Storage Structure
Images are stored in the following path pattern:
```
product-images/
  └── {vendorId}/
      └── {timestamp}-{randomId}.{extension}
```

Example: `product-images/abc-123-def/1739548219994-x7k2m9.jpg`

## Troubleshooting

### "Failed to upload image" Error
1. Check that the storage bucket `product-images` exists in Supabase
2. Verify the bucket is set to **public**
3. Check Vercel logs for detailed error messages

### "Invalid file type" Error
- Ensure you're uploading JPEG, PNG, WEBP, or AVIF images only
- Some image formats may not be supported by all browsers

### Image Preview Not Showing
- This is a client-side feature using FileReader API
- Check browser console for JavaScript errors
- Ensure the file is a valid image

### Upload Timeout
- Check file size (must be under 5MB)
- Large files may take longer on slower connections
- Vercel serverless functions have a 10-second timeout on Hobby plan

## Security Features

1. **File Type Validation**: Only image files are accepted
2. **Size Limits**: 5MB maximum prevents abuse
3. **Unique Filenames**: Prevents overwriting existing files
4. **Vendor Isolation**: Images are organized by vendor ID
5. **Public Access**: Images are publicly accessible (necessary for marketplace display)

## Rollback Instructions

If you need to revert to URL-based images:

1. In `src/pages/vendor/VendorDashboard.tsx`, replace the file input with:
   ```tsx
   <input
     type="url"
     value={formData.image_url}
     onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
     placeholder="https://example.com/image.jpg"
   />
   ```

2. Remove the upload-related code (selectedImage, handleImageChange, etc.)

## Future Enhancements

Consider these improvements:
- Image compression before upload
- Multiple image support per product
- Image cropping/editing tools
- Automatic thumbnail generation
- Vendor logo upload using same system
- Bulk image upload
- Image optimization (WebP conversion)
