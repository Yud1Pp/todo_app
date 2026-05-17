import React, { useEffect, useState } from 'react';
import { Layout, Button, Tabs } from 'antd';
import { PlusOutlined, AppstoreOutlined, UnorderedListOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { useTodo } from '../context/TodoContext';
import TodoList from '../components/Todo/TodoList';
import TodoForm from '../components/Todo/TodoForm';
import SearchBar from '../components/Todo/SearchBar';
import FilterBar from '../components/Todo/FilterBar';
import CategoryList from '../components/Category/CategoryList';
import type { Todo } from '../types';

const { Header, Content } = Layout;

const Home: React.FC = () => {
  const { fetchTodos, fetchCategories, todos } = useTodo();
  const [todoFormVisible, setTodoFormVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [activeTab, setActiveTab] = useState('todos');

  useEffect(() => {
    fetchTodos(1);
    fetchCategories();
  }, [fetchTodos, fetchCategories]);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setTodoFormVisible(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setTodoFormVisible(true);
  };

  const handleFormClose = () => {
    setTodoFormVisible(false);
    setEditingTodo(null);
  };

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;

  const todoTabItems = [
    {
      key: 'todos',
      label: (
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          <UnorderedListOutlined style={{ marginRight: 8 }} />
          Tasks
        </span>
      ),
      children: (
        <div style={{ padding: '32px 0' }} className="tasks-section">
          <div className="toolbar-section">
            <div className="toolbar-top">
              <div className="toolbar-search">
                <SearchBar />
              </div>
              <div className="toolbar-filter">
                <FilterBar />
              </div>
            </div>

            <div className="toolbar-add">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddTodo}
                className="add-todo-btn"
              >
                New Task
              </Button>
            </div>
          </div>

          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">{todos.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item stat-pending">
              <span className="stat-number">{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item stat-completed">
              <span className="stat-number">{completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <TodoList onEditTodo={handleEditTodo} />
        </div>
      ),
    },
    {
      key: 'categories',
      label: (
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          <AppstoreOutlined style={{ marginRight: 8 }} />
          Categories
        </span>
      ),
      children: (
        <div style={{ padding: '32px 0' }}>
          <CategoryList />
        </div>
      ),
    },
  ];

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">
              <CheckSquareOutlined />
            </div>
            <div className="brand-text">
              <span className="brand-name">Taskflow</span>
              <span className="brand-tagline">Organize your day</span>
            </div>
          </div>
        </div>
      </Header>

      <Content className="home-content">
        <div className="content-wrapper">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={todoTabItems}
            size="large"
            className="home-tabs"
          />
        </div>
      </Content>

      <TodoForm
        visible={todoFormVisible}
        onClose={handleFormClose}
        todo={editingTodo}
      />

      <style>{`
        .home-layout {
          min-height: 100vh;
          background: var(--color-bg);
        }

        .home-header {
          background: transparent;
          padding: 0;
          position: relative;
          height: auto;
          line-height: normal;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 48px 24px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 16px;
          animation: fadeInUp 0.6s ease forwards;
        }

        .brand-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          box-shadow: var(--shadow-md);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .brand-tagline {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--color-text-muted);
          letter-spacing: 0.02em;
        }

        .home-content {
          background: transparent;
          padding: 0;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .home-tabs .ant-tabs-nav {
          margin-bottom: 0;
        }

        .home-tabs .ant-tabs-tab {
          font-family: var(--font-body);
          padding: 16px 24px;
          transition: var(--transition-smooth);
        }

        .home-tabs .ant-tabs-tab-active {
          background: var(--color-bg-card);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          box-shadow: var(--shadow-sm);
        }

        .home-tabs .ant-tabs-ink-bar {
          background: var(--color-accent-primary);
          height: 3px;
          border-radius: 2px;
        }

        .tasks-section {
          background: var(--color-bg);
          border-radius: 0 var(--radius-lg) var(--radius-lg) var(--radius-lg);
          padding: 32px;
          animation: fadeInScale 0.4s ease;
        }

        .toolbar-section {
          margin-bottom: 24px;
        }

        .toolbar-top {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }

        .toolbar-search {
          width: 100%;
        }

        .toolbar-filter {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .toolbar-add {
          display: flex;
          justify-content: flex-start;
        }

        .add-todo-btn {
          background: var(--color-accent-primary) !important;
          border-color: var(--color-accent-primary) !important;
          font-family: var(--font-body);
          font-weight: 500;
          border-radius: var(--radius-md) !important;
          transition: var(--transition-smooth) !important;
        }

        .add-todo-btn:hover {
          background: var(--color-accent-secondary) !important;
          border-color: var(--color-accent-secondary) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .stats-bar {
          display: flex;
          gap: 24px;
          padding: 16px 20px;
          background: var(--color-bg-elevated);
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          border: 1px solid var(--color-border-light);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px 16px;
          border-right: 1px solid var(--color-border-light);
        }

        .stat-item:last-child {
          border-right: none;
        }

        .stat-number {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1;
        }

        .stat-label {
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }

        .stat-pending .stat-number {
          color: var(--color-accent-secondary);
        }

        .stat-completed .stat-number {
          color: var(--color-accent-primary);
        }

        @media (min-width: 992px) {
          .toolbar-top {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .toolbar-search {
            width: auto;
            flex: 0 0 auto;
          }
          .toolbar-filter {
            justify-content: flex-end;
          }
        }

        @media (max-width: 991px) {
          .header-content {
            padding: 24px 32px 20px;
          }
          .content-wrapper {
            padding: 0 32px;
          }
          .tasks-section {
            padding: 24px;
            border-radius: var(--radius-md);
          }
          .stats-bar {
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        @media (max-width: 575px) {
          .header-content {
            padding: 20px 16px 16px;
          }
          .content-wrapper {
            padding: 0 16px;
          }
          .brand-icon {
            width: 44px;
            height: 44px;
            font-size: 20px;
            border-radius: var(--radius-md);
          }
          .brand-name {
            font-size: 1.35rem;
          }
          .tasks-section {
            padding: 16px;
          }
          .toolbar-top {
            gap: 12px;
          }
          .stats-bar {
            padding: 12px;
            gap: 16px;
          }
          .stat-item {
            padding: 4px 12px;
          }
          .stat-number {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Home;