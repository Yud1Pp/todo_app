import React from 'react';
import { Spin, Empty, Pagination } from 'antd';
import TodoItem from './TodoItem';
import { useTodo } from '../../context/TodoContext';
import type { Todo } from '../../types';

interface TodoListProps {
  onEditTodo: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onEditTodo }) => {
  const { todos, pagination, loading, toggleComplete, deleteTodo, fetchTodos } = useTodo();

  const handlePageChange = (page: number) => {
    fetchTodos(page);
  };

  if (loading && todos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#6B7280' }}>Loading todos...</p>
      </div>
    );
  }

  if (!loading && todos.length === 0) {
    return (
      <Empty
        description="No todos yet"
        style={{ padding: '48px 0' }}
      >
        <p style={{ color: '#6B7280' }}>
          Create your first todo to get started!
        </p>
      </Empty>
    );
  }

  return (
    <div className="todo-list-container" data-testid="todo-list">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
        }}
        className="todo-grid"
      >
        {todos.map((todo, index) => (
          <div
            key={todo.id}
            className="todo-item-wrapper"
            style={{
              animation: `fadeInUp 0.5s ease forwards`,
              animationDelay: `${index * 0.08}s`,
              opacity: 0,
            }}
          >
            <TodoItem
              todo={todo}
              onToggle={toggleComplete}
              onEdit={onEditTodo}
              onDelete={deleteTodo}
            />
          </div>
        ))}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 32,
          paddingTop: 24,
          borderTop: '1px solid var(--color-border-light)',
        }}>
          <Pagination
            current={pagination.current_page}
            pageSize={pagination.per_page}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            size="middle"
            style={{
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
      )}

      <style>{`
        .todo-list-container {
          animation: fadeInScale 0.4s ease;
        }
        .todo-item-wrapper {
          will-change: transform, opacity;
        }
        @media (max-width: 991px) {
          .todo-grid {
            grid-template-columns: repeat(2, 48%) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 576px) {
          .todo-grid {
            grid-template-columns: 100% !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TodoList;