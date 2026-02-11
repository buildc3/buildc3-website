import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useCategories } from '@/hooks/useCategories';
import { useProjects } from '@/hooks/useProjects';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Trash2, Pencil } from 'lucide-react';
import type { Project } from '@/types/database';
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
          </TabsList>
          <TabsContent value="projects"><ProjectsTab /></TabsContent>
          <TabsContent value="categories"><CategoriesTab /></TabsContent>
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

  const [form, setForm] = useState({ title: '', description: '', category_id: '', thumbnail_url: '', external_link: '' });

  const resetForm = () => setForm({ title: '', description: '', category_id: '', thumbnail_url: '', external_link: '' });

  const handleSave = async () => {
    if (!form.title || !form.category_id) {
      toast.error('Title and category are required');
      return;
    }

    if (editing) {
      const { error } = await supabase.from('projects').update(form).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Project updated');
    } else {
      const { error } = await supabase.from('projects').insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success('Project added');
    }

    queryClient.invalidateQueries({ queryKey: ['projects'] });
    setEditing(null);
    setAdding(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const startEdit = (p: Project) => {
    setEditing(p);
    setAdding(true);
    setForm({ title: p.title, description: p.description, category_id: p.category_id, thumbnail_url: p.thumbnail_url, external_link: p.external_link });
  };

  return (
    <div className="space-y-4">
      {adding ? (
        <div className="space-y-3 p-4 border rounded-lg">
          <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="Thumbnail URL" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} />
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
            <TableHead>Category</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(p => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>{p.category?.name ?? '—'}</TableCell>
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
    const { error } = await supabase.from('categories').insert({ name: name.trim(), display_order: maxOrder + 1 });
    if (error) { toast.error(error.message); return; }
    toast.success('Category added');
    setName('');
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    queryClient.invalidateQueries({ queryKey: ['categories'] });
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
