# Headless Kreo - E-commerce Platform

A blazing-fast headless e-commerce website powered by Shopify, Firebase, and Next.js.

## Tech Stack

- **Frontend**: Next.js 15+ with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Backend**: Firebase (Firestore + Auth)
- **E-commerce**: Shopify Storefront API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- Shopify store with Storefront API access

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd headless-kreo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase configuration
   - Add your Shopify Storefront API credentials

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Shopify Configuration
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── admin/             # Admin panel pages
│   │   ├── navigation/    # Navigation management
│   │   └── site-settings/ # Site settings management
│   ├── api/               # API endpoints
│   │   ├── products/      # Product endpoints
│   │   ├── collections/   # Collection endpoints
│   │   ├── templates/     # Template management
│   │   ├── navigation/    # Navigation API
│   │   ├── logo/          # Logo management API
│   │   ├── site-settings/ # Site settings API
│   │   └── sync/          # Shopify sync
│   ├── products/          # Product pages
│   │   └── [handle]/      # Dynamic product page
│   ├── collections/       # Collection pages
│   │   └── [handle]/      # Dynamic collection page
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Home page
│   └── not-found.tsx      # 404 page
├── lib/                   # Core libraries and utilities
│   ├── firebase/          # Firebase configuration and utilities
│   ├── shopify/           # Shopify API client and queries
│   ├── react-query/       # React Query configuration
│   └── utils/             # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── providers/             # React context providers
└── components/            # Reusable React components
    ├── ui/                # shadcn/ui components
    ├── layout/            # Layout components (Header, Footer, etc.)
    └── product/           # Product-related components
```

## API Routes

### Products
- `GET /api/products/[id]` - Get product with template assignment

### Collections
- `GET /api/collections/[handle]` - Get collection with products

### Templates
- `GET /api/templates` - List all templates
- `POST /api/templates` - Create new template
- `GET /api/templates/[id]` - Get template by ID
- `PUT /api/templates/[id]` - Update template
- `DELETE /api/templates/[id]` - Delete template

### Navigation
- `GET /api/navigation/header` - Get header navigation
- `PUT /api/navigation/header` - Update header navigation
- `GET /api/navigation/footer` - Get footer navigation
- `PUT /api/navigation/footer` - Update footer navigation

### Site Settings
- `GET /api/site-settings` - Get site settings
- `PUT /api/site-settings` - Update site settings

### Logo Management
- `GET /api/logo` - Get current logo
- `POST /api/logo/upload` - Upload logo file
- `PUT /api/logo` - Update logo with CDN URL
- `DELETE /api/logo` - Remove logo

### Sync
- `POST /api/sync` - Trigger Shopify sync
- `GET /api/sync` - Get sync status

## Features Implemented

### Phase 0 & Phase 1 (Complete)
- ✅ Next.js 15 project setup with TypeScript
- ✅ Firebase integration (Firestore + Auth + Storage)
- ✅ Shopify Storefront API integration
- ✅ TypeScript types for Shopify and Firebase
- ✅ GraphQL queries for products and collections
- ✅ React Query hooks for data fetching
- ✅ API routes for products, collections, templates, and sync
- ✅ Error handling and retry logic
- ✅ Data validation with Zod

### Phase 2 (Complete)
- ✅ shadcn/ui component library setup
- ✅ CMS-controlled Header with dynamic navigation
- ✅ CMS-controlled Footer with sections and social links
- ✅ Logo management system (file upload + CDN link)
- ✅ Product page with image gallery, variants, and accordions
- ✅ Collection page with sorting and filtering
- ✅ Reusable components (ProductCard, ImageGallery, VariantSelector, etc.)
- ✅ Admin panel foundation (Navigation & Site Settings)
- ✅ Image optimization and performance setup
- ✅ Loading states and error boundaries
- ✅ 404 page and breadcrumb navigation
- ✅ Mobile-responsive design with hamburger menu

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Setup

Make sure to set up your Firebase project and Shopify store before running the application:

1. **Firebase Setup**:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication
   - Copy your Firebase config to `.env.local`

2. **Shopify Setup**:
   - Go to your Shopify Admin → Apps → Develop apps
   - Create a new app
   - Configure Storefront API access
   - Copy your Storefront Access Token and Store Domain to `.env.local`

## Next Steps

The following phases are planned:

- **Phase 2**: Frontend Foundation (Layout, Core Pages, Components)~~ ✅ **COMPLETE**
- **Phase 3**: Product Template System
- **Phase 4**: Collection & Home Pages (expand existing)
- **Phase 5**: Admin Panel (expand existing)
- **Phase 6**: Cart & Checkout Flow
- **Phase 7**: Polish & Edge Cases
- **Phase 8**: Testing & QA
- **Phase 9**: Launch Preparation

## CMS Features

### Header & Footer Management
The header and footer are fully CMS-controlled through the admin panel at `/admin/navigation`:

- **Header Navigation**: Create menu items that link to collections, products, or external URLs
- **Dropdown Menus**: Support for nested navigation items
- **Footer Sections**: Multiple footer sections with links
- **Social Links**: Configurable social media links with icons
- **Newsletter**: Toggle newsletter signup form

### Logo Management
Manage your site logo through `/admin/site-settings`:

- **File Upload**: Upload logo files (SVG, PNG, JPG, WEBP) to Firebase Storage
- **CDN Link**: Use external CDN URLs for logos
- **Alt Text**: Set accessibility alt text
- **Preview**: Real-time logo preview
- **Easy Removal**: One-click logo deletion

### Brand Colors
Customize your site's color scheme from the admin panel:

- Primary, Secondary, and Accent colors
- Color picker with hex value input
- Real-time preview (coming soon)

## Contributing

This is a private project. Please contact the project owner for contribution guidelines.

## License

Proprietary - All rights reserved

