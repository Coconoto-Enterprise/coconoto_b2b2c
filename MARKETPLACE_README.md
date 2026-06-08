# CocoConnect Multi-Vendor Marketplace

## Overview
CocoConnect is a fully functional multi-vendor marketplace where farmers and coconut product vendors can register, list their products, and manage orders. Customers can browse products, place orders, and connect directly with vendors.

## Features

### For Vendors (Farmers)
- **Account Registration & Management**
  - Sign up with business information
  - Secure login system with password encryption
  - Profile management with business details

- **Product Management**
  - Add, edit, and delete products
  - Set prices, stock quantities, and product descriptions
  - Upload product images
  - Organize products by categories
  - Activate/deactivate product listings

- **Order Management**
  - View all incoming orders
  - Update order status (pending, confirmed, processing, shipped, delivered, cancelled)
  - Track customer information and delivery details
  - Manage order history

- **Vendor Dashboard**
  - Overview of all products
  - Order management interface
  - Profile settings
  - Quick access to marketplace

### For Customers
- **Browse Marketplace**
  - View all active products from verified vendors
  - Filter by categories (Fresh Coconuts, Coconut Oil, Coconut Water, etc.)
  - Search products by name, description, or vendor
  - View product details with images and descriptions

- **Place Orders**
  - Select products and quantities
  - Provide delivery information
  - Add special notes or requests
  - Direct contact with vendors

- **Vendor Information**
  - View vendor business details
  - See verification status
  - Check vendor contact information

## Technology Stack

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **TailwindCSS** for styling
- **Vite** for build tooling

### Backend
- **Supabase** for database and real-time features
- **PostgreSQL** for data storage
- **Row Level Security (RLS)** for data protection
- **Vercel Serverless Functions** for API endpoints

### Authentication
- **bcryptjs** for password hashing
- Custom authentication system
- Secure session management with localStorage

## Database Schema

### Vendors Table
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password_hash (TEXT)
- business_name (VARCHAR)
- contact_name (VARCHAR)
- phone (VARCHAR)
- address (TEXT)
- description (TEXT)
- logo_url (TEXT)
- is_verified (BOOLEAN)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Vendor Products Table
```sql
- id (UUID, Primary Key)
- vendor_id (UUID, Foreign Key)
- product_name (VARCHAR)
- description (TEXT)
- category (VARCHAR)
- price (DECIMAL)
- unit (VARCHAR)
- stock_quantity (INTEGER)
- image_url (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Vendor Orders Table
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- vendor_id (UUID, Foreign Key)
- customer_name (VARCHAR)
- customer_email (VARCHAR)
- customer_phone (VARCHAR)
- quantity (INTEGER)
- total_price (DECIMAL)
- delivery_address (TEXT)
- status (VARCHAR)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Run the migration file in your Supabase SQL editor:
```bash
supabase/migrations/20260208000001_create_vendor_marketplace.sql
```

This will create:
- All necessary tables
- Indexes for performance
- Row Level Security policies
- Automatic timestamp triggers

### 3. Environment Variables
Make sure your `.env` file contains:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

## API Endpoints

### Vendor Authentication
- **POST** `/api/vendor-signup` - Register new vendor
- **POST** `/api/vendor-login` - Vendor login

Both endpoints handle:
- Password hashing with bcrypt
- Input validation
- Error handling
- Secure token generation

## Routes

### Public Routes
- `/` - Home page with CocoConnect section
- `/marketplace` - Browse all products
- `/vendor-login` - Vendor login page
- `/vendor-signup` - Vendor registration page

### Protected Routes (Vendor Only)
- `/vendor-dashboard` - Vendor dashboard
  - Products management
  - Orders management
  - Profile settings

## Product Categories
- Fresh Coconuts
- Coconut Water
- Coconut Oil
- Coconut Milk
- Desiccated Coconut
- Coconut Flour
- Coconut Sugar
- Coconut Shells
- Coconut Husks
- Coir Products
- Other Products

## Units of Measurement
- piece
- kg (kilogram)
- liter
- ton
- bag
- box
- bundle

## Security Features

### Authentication
- Passwords are hashed using bcrypt (salt rounds: 10)
- Authentication handled server-side via API endpoints
- No sensitive data stored in client

### Authorization
- Vendors can only manage their own products
- Vendors can only view/update their own orders
- Row Level Security policies enforce data access rules

### Data Protection
- All database tables have RLS enabled
- API endpoints validate user permissions
- CORS properly configured for secure requests

## Future Enhancements

### Phase 2 Features
- [ ] Payment gateway integration
- [ ] Rating and review system
- [ ] Advanced vendor analytics
- [ ] Bulk product upload
- [ ] Email notifications for orders
- [ ] SMS notifications
- [ ] Multi-currency support
- [ ] Advanced search with filters
- [ ] Wishlist functionality
- [ ] Vendor verification process
- [ ] Admin dashboard for platform management

### Phase 3 Features
- [ ] Mobile app (React Native)
- [ ] Real-time chat between buyers and vendors
- [ ] Shipping integration
- [ ] Inventory management system
- [ ] Promotions and discount codes
- [ ] Subscription plans for vendors
- [ ] Multi-language support
- [ ] Advanced reporting and analytics

## Usage Guide

### For Vendors

1. **Registration**
   - Visit `/vendor-signup`
   - Fill in business details
   - Create secure password (min 6 characters)
   - Submit registration

2. **Adding Products**
   - Login to vendor dashboard
   - Click "Add Product" button
   - Fill in product details:
     - Product name
     - Category
     - Description
     - Price and unit
     - Stock quantity
     - Image URL (optional)
   - Mark as active to display in marketplace
   - Submit

3. **Managing Orders**
   - View orders in the "Orders" tab
   - Update order status as you process them:
     - Pending → Confirmed → Processing → Shipped → Delivered
   - View customer contact information
   - Contact customers directly for confirmation

### For Customers

1. **Browsing Products**
   - Visit `/marketplace`
   - Use search bar to find specific products
   - Filter by category
   - Click on product card for details

2. **Placing Orders**
   - Click on desired product
   - Fill in order form:
     - Your name and email
     - Phone number (optional)
     - Quantity
     - Delivery address
     - Special notes
   - Submit order
   - Vendor will contact you to confirm

## Troubleshooting

### Common Issues

**Problem:** Can't login after signup
- **Solution:** Make sure you're using the exact email and password you registered with

**Problem:** Products not showing in marketplace
- **Solution:** Ensure products are marked as "active" in vendor dashboard

**Problem:** Orders not appearing
- **Solution:** Check that the order was successfully submitted (you should see a success message)

**Problem:** Images not displaying
- **Solution:** Ensure image URLs are publicly accessible and valid

## Support
For issues or questions about the marketplace:
- Contact: support@coconoto.com
- Documentation: This file
- GitHub Issues: [Repository issues page]

## License
This project is part of the Coconoto B2B2C platform.

## Contributors
- Development Team: limited
- Project: CocoConnect Multi-Vendor Marketplace
- Version: 1.0.0
- Last Updated: February 8, 2026
