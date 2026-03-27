# Partial Data Backup (Before UUID to INT Migration)

## Summary
- **Categories**: 2 rows
- **Projects**: 11 rows  
- **Project-Category Links**: 3 rows
- **Community Members**: 0 rows

## Categories (Partial)
Based on queries, at least these categories existed:
1. Portfolio
2. 3D Sites

## Projects (Partial Sample - 5 of 11)
From query results:
1. "Arunodoy Portfolio" - linked to "Portfolio" category
2. "ContriHub" - no category linked
3. "EchoDcrypt" - no category linked
4. "NeuroDB" - no category linked
5. "Omzee Portfolio" - linked to "3D Sites" category

## Notes
- Only 3 out of 11 projects had category associations at the time of migration
- Most projects (8 out of 11) had no categories assigned
- Full project details (descriptions, thumbnails, external links) were not captured
- 6 additional project names not captured in sample queries

## Recommendation
If you need to recover the full data:
1. Check if you have a backup in your Supabase dashboard (Project Settings → Database → Backups)
2. Check your git history if data was seeded via migrations
3. Check any local backup files or exports
4. Contact Supabase support if you have Point-in-Time Recovery enabled

The migration intentionally dropped all data to change from UUID to INTEGER primary keys. This was necessary because PostgreSQL doesn't allow changing column types when they're part of primary/foreign key constraints with existing data.
