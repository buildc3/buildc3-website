export interface Category {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category_id: string;
  thumbnail_url: string;
  external_link: string;
  created_at: string;
  category?: Category;
}
