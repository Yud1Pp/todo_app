export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  category_id: number | null;
  category?: Category;
  priority: 'high' | 'medium' | 'low';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}

export interface TodoFilters {
  search?: string;
  filterBy?: 'completed' | 'category_id' | 'priority';
  filterValue?: string;
}

export type Priority = 'high' | 'medium' | 'low';

export interface CreateTodoPayload {
  title: string;
  description?: string;
  category_id?: number | null;
  priority?: Priority;
  due_date?: string | null;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  completed?: boolean;
  category_id?: number | null;
  priority?: Priority;
  due_date?: string | null;
}

export interface CreateCategoryPayload {
  name: string;
  color?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  color?: string;
}