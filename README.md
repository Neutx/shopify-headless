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
│   ├── api/               # API endpoints
│   │   ├── products/      # Product endpoints
│   │   ├── collections/   # Collection endpoints
│   │   ├── templates/     # Template management
│   │   └── sync/          # Shopify sync
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Core libraries and utilities
│   ├── firebase/          # Firebase configuration and utilities
│   ├── shopify/           # Shopify API client and queries
│   ├── react-query/       # React Query configuration
│   └── utils/             # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── providers/             # React context providers
└── components/            # Reusable React components (to be added)
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

### Sync
- `POST /api/sync` - Trigger Shopify sync
- `GET /api/sync` - Get sync status

## Features Implemented

### Phase 0 & Phase 1 (Complete)
- ✅ Next.js 15 project setup with TypeScript
- ✅ Firebase integration (Firestore + Auth)
- ✅ Shopify Storefront API integration
- ✅ TypeScript types for Shopify and Firebase
- ✅ GraphQL queries for products and collections
- ✅ React Query hooks for data fetching
- ✅ API routes for products, collections, templates, and sync
- ✅ Error handling and retry logic
- ✅ Data validation with Zod

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

- **Phase 2**: Frontend Foundation (Layout, Core Pages, Components)
- **Phase 3**: Product Template System
- **Phase 4**: Collection & Home Pages
- **Phase 5**: Admin Panel
- **Phase 6**: Performance Optimization
- **Phase 7**: Polish & Edge Cases
- **Phase 8**: Testing & QA
- **Phase 9**: Launch Preparation

## Contributing

This is a private project. Please contact the project owner for contribution guidelines.

## License

Proprietary - All rights reserved

