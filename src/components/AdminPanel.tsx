import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCategories } from '@/hooks/useCategories';
import { useProjects } from '@/hooks/useProjects';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2, Pencil } from 'lucide-react';
import type { Project, CommunityMember } from '@/types/database';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'buildc3admin';

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  if (!open) return null;

  if (!authenticated) {
    return (
      <Dialog open={open} onOpenChange={v => !v && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>🔐 Access Required</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (password === ADMIN_PASSWORD) {
                setAuthenticated(true);
              } else {
                toast.error('Wrong password');
              }
            }}
            className="space-y-4"
          >
            <Input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full">Enter</Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { onClose(); setAuthenticated(false); setPassword(''); } }}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Panel</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="projects">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
          <TabsContent value="projects"><ProjectsTab /></TabsContent>
          <TabsContent value="categories"><CategoriesTab /></TabsContent>
          <TabsContent value="community"><CommunityTab /></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function ProjectsTab() {
  const queryClient = useQueryClient();
  const { data: projects = [] } = useProjects();
  const { data: categories = [] } = useCategories();
  const [editing, setEditing] = useState<Project | null>(null);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({ title: '', description: '', category_ids: [] as number[], thumbnail_url: '', external_link: '' });

  const resetForm = () => setForm({ title: '', description: '', category_ids: [], thumbnail_url: '', external_link: '' });

  const handleSave = async () => {
    if (!form.title || form.category_ids.length === 0) {
      toast.error('Title and at least one category are required');
      return;
    }

    if (editing) {
      // Update project
      try {
        await api.updateProject(editing.id, {
          title: form.title,
          description: form.description,
          thumbnail_url: form.thumbnail_url,
          external_link: form.external_link,
          category_ids: form.category_ids,
        });
        toast.success('Project updated');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Update failed');
        return;
      }
    } else {
      // Insert project
      try {
        await api.createProject({
          title: form.title,
          description: form.description,
          thumbnail_url: form.thumbnail_url,
          external_link: form.external_link,
          category_ids: form.category_ids,
        });
        toast.success('Project added');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Create failed');
        return;
      }
    }

    queryClient.invalidateQueries({ queryKey: ['projects'] });
    queryClient.invalidateQueries({ queryKey: ['all-projects'] });
    setEditing(null);
    setAdding(false);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteProject(id);
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const startEdit = (p: Project) => {
    setEditing(p);
    setAdding(true);
    setForm({
      title: p.title,
      description: p.description,
      category_ids: p.categories?.map(c => c.id) ?? [],
      thumbnail_url: p.thumbnail_url,
      external_link: p.external_link,
    });
  };

  const toggleCategory = (categoryId: number) => {
    setForm(f => ({
      ...f,
      category_ids: f.category_ids.includes(categoryId)
        ? f.category_ids.filter(id => id !== categoryId)
        : [...f.category_ids, categoryId]
    }));
  };

  return (
    <div className="space-y-4">
      {adding ? (
        <div className="space-y-3 p-4 border rounded-lg">
          <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Categories (select multiple)</label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md">
              {categories.map(c => (
                <Button
                  key={c.id}
                  type="button"
                  variant={form.category_ids.includes(c.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(c.id)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>

          <Input placeholder="Thumbnail path e.g. /project-images/myproject.png" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} />
          <Input placeholder="External Link" value={form.external_link} onChange={e => setForm(f => ({ ...f, external_link: e.target.value }))} />
          <div className="flex gap-2">
            <Button onClick={handleSave}>{editing ? 'Update' : 'Add'}</Button>
            <Button variant="outline" onClick={() => { setAdding(false); setEditing(null); resetForm(); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setAdding(true)}><Plus className="h-4 w-4 mr-1" /> Add Project</Button>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(p => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {p.categories && p.categories.length > 0 ? (
                    p.categories.map(cat => (
                      <Badge key={cat.id} variant="secondary" className="text-xs">
                        {cat.name}
                      </Badge>
                    ))
                  ) : '—'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CategoriesTab() {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();
  const [name, setName] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.display_order), 0);
    try {
      await api.createCategory({ name: name.trim(), display_order: maxOrder + 1 });
      toast.success('Category added');
      setName('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteCategory(id);
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="New category name" value={name} onChange={e => setName(e.target.value)} />
        <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      <div className="space-y-2">
        {categories.map(c => (
          <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">{c.name}</span>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityTab() {
  const queryClient = useQueryClient();
  const { data: members = [] } = useCommunityMembers();
  const [editing, setEditing] = useState<CommunityMember | null>(null);
  const [adding, setAdding] = useState(false);

  const emptyForm = { name: '', role: '', image_url: '', cover_image_url: '', linkedin_url: '', portfolio_url: '', display_order: 0 };
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => setForm(emptyForm);

  const handleSave = async () => {
    if (!form.name) {
      toast.error('Name is required');
      return;
    }

    if (editing) {
      try {
        await api.updateMember(editing.id, form);
        toast.success('Member updated');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Update failed');
        return;
      }
    } else {
      try {
        await api.createMember(form);
        toast.success('Member added');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Create failed');
        return;
      }
    }

    queryClient.invalidateQueries({ queryKey: ['community_members'] });
    setEditing(null);
    setAdding(false);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteMember(id);
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['community_members'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const startEdit = (m: CommunityMember) => {
    setEditing(m);
    setAdding(true);
    setForm({
      name: m.name,
      role: m.role,
      image_url: m.image_url,
      cover_image_url: m.cover_image_url,
      linkedin_url: m.linkedin_url,
      portfolio_url: m.portfolio_url,
      display_order: m.display_order,
    });
  };

  return (
    <div className="space-y-4">
      {adding ? (
        <div className="space-y-3 p-4 border rounded-lg">
          <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <Input placeholder="Portrait Image URL" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
          <Input placeholder="Cover Image URL (16:9)" value={form.cover_image_url} onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))} />
          <Input placeholder="LinkedIn URL" value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} />
          <Input placeholder="Portfolio URL" value={form.portfolio_url} onChange={e => setForm(f => ({ ...f, portfolio_url: e.target.value }))} />
          <Input placeholder="Display Order" type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
          <div className="flex gap-2">
            <Button onClick={handleSave}>{editing ? 'Update' : 'Add'}</Button>
            <Button variant="outline" onClick={() => { setAdding(false); setEditing(null); resetForm(); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setAdding(true)}><Plus className="h-4 w-4 mr-1" /> Add Member</Button>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map(m => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.name}</TableCell>
              <TableCell>{m.role}</TableCell>
              <TableCell>{m.display_order}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(m)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
