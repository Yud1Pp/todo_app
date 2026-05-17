import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoProvider, useTodo } from './TodoContext';
import * as api from '../services/api';

vi.mock('../services/api');

const mockedApi = api as vi.Mocked<typeof api>;

const mockTodos = [
  { id: 1, title: 'Test Todo 1', description: 'Description 1', completed: false, priority: 'high' as const, category_id: 1, created_at: '2026-05-17', updated_at: '2026-05-17' },
  { id: 2, title: 'Test Todo 2', description: 'Description 2', completed: true, priority: 'medium' as const, category_id: 2, created_at: '2026-05-17', updated_at: '2026-05-17' },
];

const mockCategories = [
  { id: 1, name: 'Work', color: '#3B82F6', created_at: '2026-05-17' },
  { id: 2, name: 'Personal', color: '#10B981', created_at: '2026-05-17' },
];

const mockPagination = { current_page: 1, per_page: 6, total: 2, total_pages: 1 };

const TestComponent = () => {
  const {
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
    setFilters,
    clearFilters,
  } = useTodo();

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="todos-count">{todos.length}</div>
      <div data-testid="categories-count">{categories.length}</div>
      <div data-testid="pagination-total">{pagination?.total || 0}</div>
      <div data-testid="filter-search">{filters.search || ''}</div>
      <button data-testid="fetch-todos" onClick={() => fetchTodos(1)}>Fetch Todos</button>
      <button data-testid="fetch-categories" onClick={() => fetchCategories()}>Fetch Categories</button>
      <button data-testid="create-todo" onClick={() => createTodo({ title: 'New Todo' })}>Create Todo</button>
      <button data-testid="update-todo" onClick={() => updateTodo(1, { title: 'Updated' })}>Update Todo</button>
      <button data-testid="delete-todo" onClick={() => deleteTodo(1)}>Delete Todo</button>
      <button data-testid="toggle-complete" onClick={() => toggleComplete(1)}>Toggle Complete</button>
      <button data-testid="set-filters" onClick={() => setFilters({ search: 'test' })}>Set Filters</button>
      <button data-testid="clear-filters" onClick={() => clearFilters()}>Clear Filters</button>
    </div>
  );
};

describe('TodoContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApi.getTodos.mockResolvedValue({
      data: mockTodos,
      pagination: mockPagination,
    });
    mockedApi.getCategories.mockResolvedValue({
      data: mockCategories,
      pagination: { current_page: 1, per_page: 10, total: 2, total_pages: 1 },
    });
    mockedApi.createTodo.mockResolvedValue({ id: 3, title: 'New Todo' });
    mockedApi.updateTodo.mockResolvedValue({ id: 1, title: 'Updated' });
    mockedApi.deleteTodo.mockResolvedValue();
    mockedApi.toggleComplete.mockResolvedValue({ id: 1, completed: true });
  });

  it('should provide initial state', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    expect(screen.getByTestId('todos-count')).toHaveTextContent('0');
    expect(screen.getByTestId('categories-count')).toHaveTextContent('0');
  });

  it('should fetch todos successfully', async () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    await act(async () => {
      screen.getByTestId('fetch-todos').click();
    });

    await waitFor(() => {
      expect(mockedApi.getTodos).toHaveBeenCalledWith(1, 6, {});
      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');
    });
  });

  it('should fetch categories successfully', async () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    await act(async () => {
      screen.getByTestId('fetch-categories').click();
    });

    await waitFor(() => {
      expect(mockedApi.getCategories).toHaveBeenCalledWith(1, 100);
      expect(screen.getByTestId('categories-count')).toHaveTextContent('2');
    });
  });

  it('should create todo successfully', async () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    await act(async () => {
      screen.getByTestId('create-todo').click();
    });

    await waitFor(() => {
      expect(mockedApi.createTodo).toHaveBeenCalledWith({ title: 'New Todo' });
      expect(mockedApi.getTodos).toHaveBeenCalled();
    });
  });

  it('should update todo successfully', async () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    await act(async () => {
      screen.getByTestId('update-todo').click();
    });

    await waitFor(() => {
      expect(mockedApi.updateTodo).toHaveBeenCalledWith(1, { title: 'Updated' });
      expect(mockedApi.getTodos).toHaveBeenCalled();
    });
  });

  it('should delete todo successfully', async () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    await act(async () => {
      screen.getByTestId('delete-todo').click();
    });

    await waitFor(() => {
      expect(mockedApi.deleteTodo).toHaveBeenCalledWith(1);
      expect(mockedApi.getTodos).toHaveBeenCalled();
    });
  });

  it('should toggle complete successfully', async () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    await act(async () => {
      screen.getByTestId('toggle-complete').click();
    });

    await waitFor(() => {
      expect(mockedApi.toggleComplete).toHaveBeenCalledWith(1);
      expect(mockedApi.getTodos).toHaveBeenCalled();
    });
  });

  it('should set filters', async () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    await act(async () => {
      screen.getByTestId('set-filters').click();
    });

    expect(screen.getByTestId('filter-search')).toHaveTextContent('test');
  });

  it('should clear filters', async () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    await act(async () => {
      screen.getByTestId('set-filters').click();
    });

    await act(async () => {
      screen.getByTestId('clear-filters').click();
    });

    expect(screen.getByTestId('filter-search')).toHaveTextContent('');
  });

  it('should handle API errors when fetching todos', async () => {
    mockedApi.getTodos.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    await act(async () => {
      screen.getByTestId('fetch-todos').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch');
    });
  });

  it('should throw error when useTodo is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTodo must be used within a TodoProvider');

    consoleError.mockRestore();
  });
});