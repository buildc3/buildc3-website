import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CategoryBar } from '@/components/CategoryBar';
import { MasonryGrid } from '@/components/MasonryGrid';
import { AdminPanel } from '@/components/AdminPanel';

const Index = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        search={search}
        onSearchChange={setSearch}
        onSecretTrigger={() => setAdminOpen(true)}
      />
      <CategoryBar selectedId={selectedCategory} onSelect={setSelectedCategory} />
      <main>
        <MasonryGrid categoryId={selectedCategory} search={search} />
      </main>
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
};

export default Index;
