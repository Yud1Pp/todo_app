import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from './api';

vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  return {
    ...actual,
    create: vi.fn(() => ({
      get: vi.fn().mockResolvedValue({ data: { data: [], pagination: {} } }),
      post: vi.fn().mockResolvedValue({ data: {} }),
      put: vi.fn().mockResolvedValue({ data: {} }),
      delete: vi.fn().mockResolvedValue({}),
      patch: vi.fn().mockResolvedValue({ data: {} }),
    })),
  };
});

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should be defined', () => {
      expect(api.getTodos).toBeDefined();
    });

    it('should have correct function signature', () => {
      const typeResult = api.getTodos(1, 10, { search: 'test' });
      expect(typeResult).toBeInstanceOf(Promise);
    });
  });

  describe('getTodo', () => {
    it('should be defined', () => {
      expect(api.getTodo).toBeDefined();
    });
  });

  describe('createTodo', () => {
    it('should be defined', () => {
      expect(api.createTodo).toBeDefined();
    });
  });

  describe('updateTodo', () => {
    it('should be defined', () => {
      expect(api.updateTodo).toBeDefined();
    });
  });

  describe('deleteTodo', () => {
    it('should be defined', () => {
      expect(api.deleteTodo).toBeDefined();
    });
  });

  describe('toggleComplete', () => {
    it('should be defined', () => {
      expect(api.toggleComplete).toBeDefined();
    });
  });

  describe('getCategories', () => {
    it('should be defined', () => {
      expect(api.getCategories).toBeDefined();
    });
  });

  describe('getCategory', () => {
    it('should be defined', () => {
      expect(api.getCategory).toBeDefined();
    });
  });

  describe('createCategory', () => {
    it('should be defined', () => {
      expect(api.createCategory).toBeDefined();
    });
  });

  describe('updateCategory', () => {
    it('should be defined', () => {
      expect(api.updateCategory).toBeDefined();
    });
  });

  describe('deleteCategory', () => {
    it('should be defined', () => {
      expect(api.deleteCategory).toBeDefined();
    });
  });
});