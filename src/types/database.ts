export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: Omit<Customer, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Customer, "id" | "created_at">>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Project, "id" | "created_at">>;
      };
      site_visits: {
        Row: SiteVisit;
        Insert: Omit<SiteVisit, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<SiteVisit, "id" | "created_at">>;
      };
      estimate_items: {
        Row: EstimateItem;
        Insert: Omit<EstimateItem, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<EstimateItem, "id" | "created_at">>;
      };
      project_photos: {
        Row: ProjectPhoto;
        Insert: Omit<ProjectPhoto, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<ProjectPhoto, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Customer = {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  notes: string | null;
};

export type Project = {
  id: string;
  created_at: string;
  customer_id: string | null;
  project_name: string | null;
  project_type: string | null;
  project_status: string | null;
  requested_work: string | null;
  budget_range: string | null;
  target_timeline: string | null;
  site_address_same_as_customer: boolean | null;
  site_address_line1: string | null;
  site_address_line2: string | null;
  site_city: string | null;
  site_state: string | null;
  site_zip: string | null;
  internal_notes: string | null;
};

export type SiteVisit = {
  id: string;
  created_at: string;
  project_id: string | null;
  visit_date: string | null;
  access_notes: string | null;
  existing_conditions: string | null;
  measurements: string | null;
  requirements: string | null;
  customer_concerns: string | null;
  follow_up_items: string | null;
};

export type EstimateItem = {
  id: string;
  created_at: string;
  project_id: string | null;
  item_type: string | null;
  description: string | null;
  quantity: number | null;
  unit_cost: number | null;
  labor_hours: number | null;
  labor_rate: number | null;
  total: number | null;
};

export type ProjectPhoto = {
  id: string;
  created_at: string;
  project_id: string | null;
  storage_path: string | null;
  caption: string | null;
  category: string | null;
};
