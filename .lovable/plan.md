

# BUILDC3 — Pinterest-Style Project Showcase

## Overview
A Pinterest-inspired masonry grid website to showcase company projects. Features a dynamic category bar, search functionality, and a secret hidden admin panel for managing content.

---

## 🎨 Design & Theme
- **Pinterest-inspired color scheme**: Red/white primary palette, clean cards with rounded corners, soft shadows
- **Logo**: Use the uploaded BUILDC3 logo in the top navigation bar
- **Typography**: Clean, modern sans-serif fonts matching Pinterest's aesthetic
- **Responsive**: Fully responsive masonry layout that adapts from mobile to desktop

---

## 🏠 Home Page

### Top Navigation Bar
- BUILDC3 logo on the left
- Search bar in the center — search projects by name (filters the grid in real-time)
- Clean, minimal nav similar to Pinterest

### Category Bar
- Horizontal scrollable row of category pills/chips below the nav
- Categories are fetched dynamically from the database (e.g., Web, Chrome Extensions, AI, AI Agents, etc.)
- Clicking a category filters the project grid
- "All" option to show everything

### Masonry Project Grid
- Pinterest-style masonry layout with varied card sizes
- Each card shows: project thumbnail image, project name, and category badge
- Cards adjust dynamically based on image aspect ratio (just like Pinterest)
- Smooth hover effects (slight scale, shadow lift)
- Clicking a card navigates to the project detail page

---

## 📄 Project Detail Page
- Large project thumbnail/hero image
- Project name, description, and category
- Link to the live project (external URL)
- Back button to return to the grid

---

## 🔐 Secret Admin Panel (Easter Egg)
- **Hidden trigger**: A secret combination — clicking the BUILDC3 logo **5 times rapidly** opens a hidden login prompt
- After the secret knock, a simple password input appears (no visible UI hint exists)
- Correct password reveals the admin panel
- **Admin capabilities**:
  - Add new projects (name, description, category, thumbnail image, external link)
  - Edit existing projects
  - Delete projects
  - Manage categories (add/remove)
- Thumbnail images stored via Supabase Storage (not in the database)

---

## 🗄️ Backend (Supabase / Lovable Cloud)
- **`categories` table**: id, name, display_order, created_at
- **`projects` table**: id, title, description, category_id (FK), thumbnail_url, external_link, created_at
- Supabase Storage bucket for project thumbnail images
- No authentication system needed — admin access is handled via the hidden easter egg with a simple secret password

---

## 📱 Pages Summary
1. **Home** — Nav + search + categories + masonry grid
2. **Project Detail** — Full project info page
3. **Secret Admin** — Hidden panel for content management

