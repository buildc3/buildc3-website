# Many-to-Many Project Categories Migration

This migration converts the project-category relationship from one-to-many to many-to-many, allowing projects to belong to multiple categories.

## Database Changes

### New Junction Table: `project_categories`

A new table has been created to manage the many-to-many relationship between projects and categories:

```sql
CREATE TABLE project_categories (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ,
  UNIQUE(project_id, category_id)
);
```

### Migration Files

The following SQL migration files have been created in `supabase/migrations/`:

1. **`01_create_initial_tables.sql`** - Creates the base `categories` and `projects` tables with RLS policies

2. **`02_create_project_categories_junction.sql`** - Creates the `project_categories` junction table with:
   - Foreign key constraints with CASCADE delete
   - Indexes for better query performance
   - RLS policies for read/write access
   - Unique constraint to prevent duplicate associations

3. **`03_migrate_to_many_to_many.sql`** - Migration script that:
   - Checks if `category_id` column exists in `projects` table
   - Migrates existing data to the junction table
   - Removes the old `category_id` column
   - Safe to run multiple times (idempotent)

## Running the Migrations

If you're starting fresh or already have the structure in place, run migrations in order:

```bash
# Apply all migrations
supabase db push

# Or apply individually
psql -d your_database -f supabase/migrations/01_create_initial_tables.sql
psql -d your_database -f supabase/migrations/02_create_project_categories_junction.sql
psql -d your_database -f supabase/migrations/03_migrate_to_many_to_many.sql
```

## Code Changes

### TypeScript Types (`src/types/database.ts`)

**Before:**
```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  category_id: string;  // Single category
  category?: Category;   // Joined category
  // ...
}
```

**After:**
```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  categories?: Category[];  // Multiple categories
  project_categories?: { category: Category }[];  // Junction data
  // ...
}
```

### Query Updates (`src/hooks/useProjects.ts`)

**Before:**
```typescript
.select('*, category:categories(*)')
.eq('category_id', categoryId)  // Filter by single category
```

**After:**
```typescript
.select(`
  *,
  project_categories(
    category:categories(*)
  )
`)
// Transform and filter in JavaScript
.filter(project => 
  project.categories?.some(cat => cat.id === categoryId)
)
```

### UI Components Updated

1. **`ProjectCard.tsx`** - Now displays multiple category badges
2. **`Projects.tsx`** - Shows all categories for each project
3. **`ProjectDetail.tsx`** - Updated query to fetch categories
4. **`project-parallax-slider.tsx`** - Displays categories joined with " • "
5. **`AdminPanel.tsx`** - Multi-select interface for assigning categories

### Admin Panel Changes

The admin panel now features:
- **Multi-select category picker** - Click multiple category buttons to assign
- **Visual feedback** - Selected categories highlighted
- **Bulk category assignment** - Projects can have any number of categories
- **Display** - Categories shown as badges in the table

## Benefits

### For Users
- Better project organization with cross-cutting tags
- Filter projects by any combination of categories
- More accurate categorization (e.g., "Web" + "AI" + "Education")

### For Admins
- Flexible project management
- No need to create overly specific categories
- Easy to reorganize projects across categories

## Query Examples

### Fetch all projects with their categories
```typescript
const { data } = await supabase
  .from('projects')
  .select(`
    *,
    project_categories(
      category:categories(*)
    )
  `);
```

### Assign multiple categories to a project
```typescript
await supabase.from('project_categories').insert([
  { project_id: 'proj-id', category_id: 'cat-1' },
  { project_id: 'proj-id', category_id: 'cat-2' },
  { project_id: 'proj-id', category_id: 'cat-3' },
]);
```

### Update project categories
```typescript
// 1. Delete old associations
await supabase.from('project_categories')
  .delete()
  .eq('project_id', projectId);

// 2. Insert new associations
await supabase.from('project_categories').insert(
  categoryIds.map(catId => ({ project_id: projectId, category_id: catId }))
);
```

### Find all projects in a category
```typescript
const { data } = await supabase
  .from('project_categories')
  .select('project:projects(*)')
  .eq('category_id', categoryId);
```

## Rollback (if needed)

If you need to revert to the old structure:

1. Add back the `category_id` column:
```sql
ALTER TABLE projects ADD COLUMN category_id UUID REFERENCES categories(id);
```

2. Migrate data back (takes first category only):
```sql
UPDATE projects p
SET category_id = (
  SELECT category_id 
  FROM project_categories 
  WHERE project_id = p.id 
  LIMIT 1
);
```

3. Drop the junction table:
```sql
DROP TABLE project_categories;
```

## Notes

- The `ON DELETE CASCADE` ensures cleanup when projects or categories are deleted
- The `UNIQUE(project_id, category_id)` constraint prevents duplicate associations
- Indexes on both foreign keys ensure fast lookups in both directions
- All RLS policies maintain the same permission structure as before
