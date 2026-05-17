import axios from 'axios';
import type {
  Todo,
  Category,
  ApiResponse,
  TodoFilters,
  CreateTodoPayload,
  UpdateTodoPayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../types';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_USE_DOCKER === 'true') {
    return 'http://backend:8080/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Todo APIs
export const getTodos = async (
  page: number = 1,
  limit: number = 10,
  filters?: TodoFilters
): Promise<ApiResponse<Todo[]>> => {
  const response = await api.get('/todos', {
    params: { page, limit, ...filters },
  });
  return response.data;
};

export const getTodo = async (id: number): Promise<Todo> => {
  const response = await api.get(`/todos/${id}`);
  return response.data;
};

export const createTodo = async (todo: CreateTodoPayload): Promise<Todo> => {
  const response = await api.post('/todos', todo);
  return response.data;
};

export const updateTodo = async (id: number, todo: UpdateTodoPayload): Promise<Todo> => {
  const response = await api.put(`/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export const toggleComplete = async (id: number): Promise<Todo> => {
  const response = await api.patch(`/todos/${id}/complete`);
  return response.data;
};

// Category APIs
export const getCategories = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<Category[]>> => {
  const response = await api.get('/categories', {
    params: { page, limit },
  });
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (category: CreateCategoryPayload): Promise<Category> => {
  const response = await api.post('/categories', category);
  return response.data;
};

export const updateCategory = async (id: number, category: UpdateCategoryPayload): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export default api;