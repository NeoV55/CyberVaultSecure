# CyberVault Explorer - Decentralized Identity & Notarization dApp

## Overview

CyberVault Explorer is a full-stack TypeScript application that serves as a web-based interface for a decentralized identity and notarization framework. The application provides a modern, responsive UI for managing DIDs (Decentralized Identifiers), notarizing documents, and verifying blockchain records.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom cyber-themed design system
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful JSON API
- **Storage**: In-memory storage implementation (MemStorage class)
- **Development**: Hot reload with Vite integration

### Database Design
The application uses Drizzle ORM with PostgreSQL schema definitions, though currently implements in-memory storage. The schema includes:
- **Users**: Basic user management with username/password
- **DIDs**: Decentralized identifiers linked to wallet addresses
- **Notarized Documents**: Document hashes with metadata and timestamps

## Key Components

### Data Models
1. **DIDs Table**: Stores decentralized identifiers with wallet bindings
   - Unique DID strings
   - Associated wallet addresses
   - Status tracking (active/inactive)
   - Creation timestamps

2. **Notarized Documents Table**: Tracks document notarization
   - Unique document hashes (SHA-256)
   - Original filenames
   - Category classification
   - Blockchain timestamps

### Core Features
1. **DID Registration & Binding**: Form-based interface for registering DIDs and binding them to wallet addresses
2. **Document Notarization**: File upload with automatic hash generation and blockchain submission
3. **Document Verification**: Hash-based lookup for verifying document authenticity
4. **Dashboard Interface**: Comprehensive view of all registered DIDs and notarized documents

### UI Components
- **Modern Glass-morphism Design**: Dark theme with translucent cards and cyber aesthetics
- **Responsive Layout**: Fixed sidebar navigation with main content area
- **Interactive Forms**: Real-time validation and user feedback
- **Data Tables**: Sortable, searchable tables for DIDs and documents
- **Toast Notifications**: User feedback for all operations

## Data Flow

### DID Registration Flow
1. User connects wallet (simulated)
2. User enters DID in registration form
3. Frontend validates input and sends POST to `/api/dids`
4. Backend creates DID record with wallet binding
5. UI updates with success notification and refreshes data

### Document Notarization Flow
1. User uploads file or enters hash manually
2. Frontend generates SHA-256 hash from file
3. User selects document category
4. System creates timestamp and submits to `/api/documents`
5. Backend stores notarization record
6. UI confirms successful blockchain submission

### Document Verification Flow
1. User enters document hash
2. Frontend queries `/api/documents/verify/{hash}`
3. Backend checks for existing notarization
4. Result displayed with full document metadata if found

## External Dependencies

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **FontAwesome**: Additional icons (via CDN)

### Development Tools
- **Drizzle ORM**: Type-safe database toolkit
- **Zod**: Runtime type validation
- **TanStack Query**: Data fetching and caching
- **Wouter**: Lightweight routing

### Build & Development
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety and tooling
- **ESBuild**: Fast JavaScript bundler
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Development Mode
- Vite dev server serves frontend with HMR
- Express server handles API routes
- In-memory storage for rapid prototyping
- Real-time error overlay for debugging

### Production Build
- Vite builds optimized static assets
- ESBuild bundles server code
- Single deployable artifact with embedded frontend
- Environment-based configuration

### Database Migration
- Drizzle configuration ready for PostgreSQL
- Schema definitions support easy migration
- In-memory storage can be swapped for real database
- Environment variables for database connection

The architecture is designed for easy transition from prototype to production, with clear separation of concerns and modern development practices throughout the stack.