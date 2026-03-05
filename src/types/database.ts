export interface Category {
  id: number;
  name: string;
  display_order: number;
  created_at: string;
}

export interface ProjectCategory {
  id: number;
  project_id: number;
  category_id: number;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  external_link: string;
  created_at: string;
  categories?: Category[];
  project_categories?: { category: Category }[];
}

export interface CommunityMember {
  id: number;
  name: string;
  role: string;
  image_url: string;
  cover_image_url: string;
  linkedin_url: string;
  portfolio_url: string;
  display_order: number;
  created_at: string;
}
