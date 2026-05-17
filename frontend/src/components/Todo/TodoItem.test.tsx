import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';
import type { Todo } from '../../types';

const mockTodo: Todo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
  category_id: 1,
  category: { id: 1, name: 'Work', color: '#3B82F6', created_at: '2026-05-17' },
  priority: 'high',
  due_date: '2026-05-20T23:59:59Z',
  created_at: '2026-05-17T12:00:00Z',
  updated_at: '2026-05-17T12:00:00Z',
};

describe('TodoItem', () => {
  const mockOnToggle = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render todo title', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should render todo description', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render priority tag', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should render category name', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = document.querySelector('.ant-checkbox') as HTMLElement;
    await user.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  it('should render completed state with strikethrough', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const title = screen.getByText('Test Todo');
    expect(title).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('should render medium priority correctly', () => {
    const mediumPriorityTodo = { ...mockTodo, priority: 'medium' as const };
    render(
      <TodoItem
        todo={mediumPriorityTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('should render low priority correctly', () => {
    const lowPriorityTodo = { ...mockTodo, priority: 'low' as const };
    render(
      <TodoItem
        todo={lowPriorityTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('should render without category', () => {
    const noCategoryTodo = { ...mockTodo, category_id: null, category: undefined };
    render(
      <TodoItem
        todo={noCategoryTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.queryByText('Work')).not.toBeInTheDocument();
  });

  it('should render without due date', () => {
    const noDueDateTodo = { ...mockTodo, due_date: null };
    render(
      <TodoItem
        todo={noDueDateTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
  });
});