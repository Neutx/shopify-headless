# Setup Instructions

## Phase 1 Implementation Complete! 🎉

All the code for Phase 1 (Core Data Layer) has been successfully implemented. Follow these steps to get your project up and running:

## Step 1: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install:
- Next.js 15+ (latest)
- React 18
- TypeScript
- Tailwind CSS
- React Query (@tanstack/react-query)
- Firebase SDK
- GraphQL and graphql-request
- Zod (validation)
- And all other dependencies

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
copy .env.local.example .env.local
```

2. Fill in your Firebase configuration in `.env.local`:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project (or create a new one)
   - Go to Project Settings > General
   - Scroll down to "Your apps" and copy the Firebase config values

3. Add your Shopify credentials:
   - Go to your Shopify Admin
   - Navigate to: Apps > Develop apps (or Create an app)
   - Enable Storefront API access
   - Copy your Storefront Access Token
   - Your store domain is: `your-store.myshopify.com`

Your `.env.local` should look like this:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Shopify Configuration
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
```

## Step 3: Set Up Firebase Firestore

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database
4. Click "Create database"
5. Choose "Start in test mode" (for development)
6. Select a location and click "Enable"

### Firestore Security Rules (Development)

For development, you can use these permissive rules. **Update them for production!**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Create Initial Collections

The app will automatically create documents when you use the API, but you can manually create these collections:
- `products` - Product template assignments
- `templates` - Template definitions

## Step 4: Set Up Shopify Storefront API

1. Log in to your Shopify Admin
2. Go to: **Apps** > **App and sales channel settings** > **Develop apps**
3. Click **Create an app**
4. Give it a name (e.g., "Headless Kreo")
5. Click **Configure Storefront API scopes**
6. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collection_listings`
7. Click **Save**
8. Go to **API credentials** tab
9. Click **Install app**
10. Copy the **Storefront API access token**
11. Add it to your `.env.local` file

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Test the API Endpoints

You can test the API endpoints using curl, Postman, or your browser:

### Test Products API
```bash
# Get a product (replace 'your-product-handle' with an actual product handle from your Shopify store)
curl http://localhost:3000/api/products/your-product-handle
```

### Test Collections API
```bash
# Get a collection
curl http://localhost:3000/api/collections/your-collection-handle
```

### Test Templates API
```bash
# Get all templates
curl http://localhost:3000/api/templates

# Create a template
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standard Template",
    "component": "ProductTemplateA",
    "description": "Standard product layout"
  }'
```

### Test Sync API
```bash
# Sync all products from Shopify
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{
    "syncAll": true,
    "defaultTemplateId": "product-template-a"
  }'
```

## What's Been Implemented

### ✅ Core Infrastructure
- Next.js 15+ with App Router
- TypeScript with strict mode
- Tailwind CSS
- React Query for data fetching
- Firebase integration (Firestore + Auth)
- Shopify Storefront API integration

### ✅ Data Layer
- Complete TypeScript types for Shopify and Firebase
- GraphQL queries for products and collections
- Fetching utilities with error handling and retry logic
- React Query hooks (useProduct, useCollection, etc.)

### ✅ API Routes
- `/api/products/[id]` - Get product with template
- `/api/collections/[handle]` - Get collection
- `/api/templates` - CRUD operations for templates
- `/api/templates/[id]` - Individual template operations
- `/api/sync` - Shopify sync functionality

### ✅ Utilities
- Error handling with custom error classes
- Retry logic with exponential backoff
- Zod validation schemas
- Firebase CRUD operations

## Troubleshooting

### "Cannot find module 'react'" or similar errors
Run `npm install` to install all dependencies.

### Firebase connection errors
Make sure all Firebase environment variables are correctly set in `.env.local`.

### Shopify API errors
- Verify your Storefront API access token is correct
- Make sure your store domain is in the format: `your-store.myshopify.com`
- Check that you've enabled the required API scopes

### CORS errors
If you encounter CORS issues, make sure you're running the Next.js dev server and accessing via `localhost:3000`.

## Next Steps

Phase 1 is complete! Here's what comes next:

**Phase 2: Frontend Foundation** (Week 3-4)
- Layout system (header, footer, navigation)
- Core pages (Home, Collection, Product)
- Reusable components
- Performance setup

**Phase 3: Product Template System** (Week 5-6)
- Dynamic template rendering
- Multiple product templates
- Template features (image gallery, variant selector, etc.)

**Phase 4: Collection & Home Pages** (Week 7)
- Home page implementation
- Collection page with filters
- Search functionality

**Phase 5: Admin Panel** (Week 8-9)
- Authentication
- Template assignment interface
- Product management

## Need Help?

- Check the [README.md](README.md) for project overview
- Review the [requirements.md](requirements.md) for the full project plan
- Check Firebase and Shopify documentation for API-specific issues

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

