import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

interface CategoryBarProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryBar({ selectedId, onSelect }: CategoryBarProps) {
  const { data: categories = [] } = useCategories();

  return (
    <div className="sticky top-[64px] z-40 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
            selectedId === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          )}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap',
              selectedId === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
