import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Todo, Category, TodoFilters, Pagination, CreateTodoPayload, UpdateTodoPayload, CreateCategoryPayload, UpdateCategoryPayload } from '../types';
import * as api from '../services/api';

interface TodoContextType {
  // State
  todos: Todo[];
  categories: Category[];
  pagination: Pagination | null;
  filters: TodoFilters;
  loading: boolean;
  error: string | null;

  // Todo Actions
  fetchTodos: (page?: number, filters?: TodoFilters) => Promise<void>;
  createTodo: (todo: CreateTodoPayload) => Promise<void>;
  updateTodo: (id: number, todo: UpdateTodoPayload) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;

  // Category Actions
  fetchCategories: () => Promise<void>;
  createCategory: (category: CreateCategoryPayload) => Promise<void>;
  updateCategory: (id: number, category: UpdateCategoryPayload) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  // Filter Actions
  setFilters: (filters: TodoFilters) => void;
  clearFilters: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFiltersState] = useState<TodoFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async (page: number = 1, currentFilters?: TodoFilters) => {
    setLoading(true);
    setError(null);
    try {
      const limit = 6;
      const filtersToUse = currentFilters ?? filters;
      const response = await api.getTodos(page, limit, filtersToUse);
      setTodos(response.data);
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTodo = useCallback(async (todo: CreateTodoPayload) => {
    setLoading(true);
    setError(null);
    try {
      await api.createTodo(todo);
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTodos]);

  const updateTodo = useCallback(async (id: number, todo: UpdateTodoPayload) => {
    setLoading(true);
    setError(null);
    try {
      await api.updateTodo(id, todo);
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTodos]);

  const deleteTodo = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTodos]);

  const toggleComplete = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.toggleComplete(id);
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTodos]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.getCategories(1, 100);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const createCategory = useCallback(async (category: CreateCategoryPayload) => {
    setLoading(true);
    setError(null);
    try {
      await api.createCategory(category);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: number, category: UpdateCategoryPayload) => {
    setLoading(true);
    setError(null);
    try {
      await api.updateCategory(id, category);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const setFilters = useCallback((newFilters: TodoFilters) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const value: TodoContextType = {
    todos,
    categories,
    pagination,
    filters,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setFilters,
    clearFilters,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;