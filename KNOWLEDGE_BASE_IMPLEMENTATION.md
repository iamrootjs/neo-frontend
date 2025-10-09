# Knowledge Base Management System

A comprehensive knowledge base management system built with Nuxt.js, Pinia, and Tailwind CSS.

## Features

### ✅ Implemented

#### Knowledge Base Management
- **List Knowledge Bases**: View all knowledge bases in a tile/card layout
- **Create Knowledge Base**: Modal form to create new knowledge bases with chunking strategy selection
- **Actions**: Edit and delete actions on each knowledge base
- **Dynamic Routing**: Click on KB to navigate to `/knowledge-bases/[id]` route
- **Responsive Design**: Works on desktop and mobile

#### Knowledge Base Entries
- **Reusable Template**: Single template for all knowledge base entries
- **Table View**: List entries in a searchable, filterable table
- **CRUD Operations**: View, Edit, Delete functions for each entry
- **Modal Interface**: Uses Teleport to hoist modals outside DOM tree
- **Pagination**: Navigate through large entry lists
- **Filtering**: Search by content and filter by category
- **Entry Creation**: Add new entries with content, category, and chunking options

#### State Management (Pinia)
- **Knowledge Base Store**: Complete CRUD operations store
- **State Management**: Stores action results and loading states
- **Getters**: Format and filter data (sorted KBs, paginated entries, etc.)
- **Store-to-Refs**: Use reactive refs in components
- **Error Handling**: Proper error states and user feedback

#### Backend Integration
- **API Integration**: Connected to the provided backend API endpoints
- **Chunk Strategies**: Fetch and use chunking strategies from `/knowledge/chunk-strategies`
- **Knowledge Bases**: Full CRUD via `/knowledge/knowledge-bases` and `/knowledge/knowledge-base`
- **Entries**: Create entries via `/knowledge/knowledge-base-entries`
- **Vector Search**: Support for `/knowledge/compare-vector` endpoint

## File Structure

```
stores/
├── knowledgeBase.ts          # Main KB store with CRUD operations
└── chunkStrategy.ts          # Chunk strategies store

shared/types/
├── knowledgeBase.ts          # KB and entry type definitions
└── chunkStrategy.ts          # Chunk strategy types

app/components/app/
├── knowledge-base-list.vue   # KB listing component
├── create-kb-modal.vue       # Create KB modal
├── create-entry-modal.vue    # Create entry modal
├── view-entry-modal.vue      # View entry modal
├── edit-entry-modal.vue      # Edit entry modal
├── nav-bar.vue              # Navigation bar
└── side-bar.vue             # Sidebar navigation

app/pages/
├── index.vue                # Dashboard
├── knowledge-bases.vue      # KB listing page
└── knowledge-bases/[id].vue # Dynamic KB detail page
```

## API Endpoints Used

- `GET /knowledge/chunk-strategies` - Get available chunking strategies
- `GET /knowledge/knowledge-bases` - List all knowledge bases
- `POST /knowledge/knowledge-base` - Create new knowledge base
- `POST /knowledge/knowledge-base-entries` - Create new entry
- `POST /knowledge/compare-vector` - Search similar entries

## Store Features

### Knowledge Base Store (`useKnowledgeBaseStore`)

#### State
- `knowledgeBases[]` - Array of knowledge bases
- `currentKnowledgeBase` - Currently selected KB
- `entries[]` - Array of KB entries
- `status` - Loading state for KBs
- `entriesStatus` - Loading state for entries
- `pagination` - Page, itemsPerPage, totalItems
- `filters` - searchQuery, selectedCategory

#### Actions
- `fetchKnowledgeBases()` - Load all KBs
- `createKnowledgeBase()` - Create new KB
- `deleteKnowledgeBase()` - Delete KB
- `updateKnowledgeBase()` - Update KB
- `fetchKnowledgeBaseEntries()` - Load entries for KB
- `createKnowledgeBaseEntry()` - Create new entry
- `deleteKnowledgeBaseEntry()` - Delete entry
- `updateKnowledgeBaseEntry()` - Update entry
- `searchSimilarEntries()` - Vector similarity search
- `setCurrentPage()` - Pagination control
- `setSearchQuery()` - Search functionality
- `setSelectedCategory()` - Category filtering

#### Getters
- `sortedKnowledgeBases` - KBs sorted by update date
- `filteredEntries` - Entries filtered by search/category
- `paginatedEntries` - Current page entries
- `totalPages` - Total pagination pages
- `availableCategories` - Unique categories from entries

## Component Features

### Knowledge Base List (`knowledge-base-list.vue`)
- Displays KBs in card layout
- Shows name, description, update date
- Edit/Delete actions per card
- Click to navigate to detail page
- Loading and error states

### Dynamic KB Page (`[id].vue`)
- Breadcrumb navigation
- Entry table with search/filter
- Pagination controls
- View/Edit/Delete per entry
- Modal integration for CRUD operations

### Modals
- **Create KB Modal**: Form with name, description, chunking strategy
- **Create Entry Modal**: Content, category, chunking options
- **View Entry Modal**: Read-only entry display
- **Edit Entry Modal**: Edit content and metadata
- All use Teleport for proper DOM positioning

## Usage

1. **View Knowledge Bases**: Navigate to `/knowledge-bases`
2. **Create KB**: Click "Create Knowledge Base" button
3. **View KB Details**: Click on any knowledge base card
4. **Manage Entries**: Use the table in KB detail page
5. **Search/Filter**: Use search bar and category dropdown
6. **CRUD Operations**: Use action buttons on entries

## Technical Notes

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Proper error states and user feedback
- **Loading States**: Visual feedback during API calls
- **Type Safety**: Full TypeScript integration
- **Modal Management**: Clean modal state management
- **Routing**: Dynamic routes with proper navigation
- **Store Integration**: Reactive state with storeToRefs

## Future Enhancements

- Real-time updates via WebSocket
- Advanced search with full-text search
- Bulk operations for entries
- Export/Import functionality
- Analytics and metrics
- User management and permissions