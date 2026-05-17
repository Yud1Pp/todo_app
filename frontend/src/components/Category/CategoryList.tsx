import React, { useEffect, useState } from 'react';
import { Button, Space, Popconfirm, Table, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import { useTodo } from '../../context/TodoContext';
import CategoryForm from './CategoryForm';
import type { Category } from '../../types';

const CategoryList: React.FC = () => {
  const { categories, fetchCategories, deleteCategory } = useTodo();
  const [formVisible, setFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      message.success('Category deleted');
    } catch {
      message.error('Failed to delete category');
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setEditingCategory(null);
  };

  const columns = [
    {
      title: '',
      dataIndex: 'color',
      key: 'color',
      width: 50,
      render: (color: string) => (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            backgroundColor: color,
            boxShadow: `0 0 0 2px ${color}30`,
          }}
        />
      ),
    },
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: '0.95rem',
          color: 'var(--color-text-primary)',
        }}>
          {name}
        </span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
        }}>
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: unknown, record: Category) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            style={{
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <Popconfirm
            title="Delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              style={{ borderRadius: 'var(--radius-sm)' }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="category-list-container">
      <div className="category-header">
        <div className="category-info">
          <FolderOutlined style={{ fontSize: 20, color: 'var(--color-accent-primary)' }} />
          <span className="category-count">{categories.length} categories</span>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
          className="add-category-btn"
        >
          New Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <FolderOutlined style={{ fontSize: 48, color: 'var(--color-border)', marginBottom: 16 }} />
          <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            No categories yet. Create one to organize your tasks.
          </p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            style={{
              background: 'var(--color-accent-primary)',
              borderColor: 'var(--color-accent-primary)',
            }}
          >
            Create Category
          </Button>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          pagination={false}
          className="category-table"
        />
      )}

      <style>{`
        .category-list-container {
          animation: fadeInUp 0.5s ease;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 20px 24px;
          background: var(--color-bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-light);
          box-shadow: var(--shadow-soft);
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .category-count {
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .add-category-btn {
          background: var(--color-accent-primary) !important;
          border-color: var(--color-accent-primary) !important;
          font-family: var(--font-body) !important;
          font-weight: 500 !important;
          border-radius: var(--radius-md) !important;
          transition: var(--transition-smooth) !important;
        }

        .add-category-btn:hover {
          background: var(--color-accent-secondary) !important;
          border-color: var(--color-accent-secondary) !important;
          transform: translateY(-1px);
        }

        .category-table .ant-table {
          background: var(--color-bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-light);
          overflow: hidden;
          font-family: var(--font-body);
        }

        .category-table .ant-table-thead > tr > th {
          background: var(--color-bg-elevated);
          border-bottom: 1px solid var(--color-border-light);
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
        }

        .category-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid var(--color-border-light);
          transition: var(--transition-fast);
        }

        .category-table .ant-table-tbody > tr:hover > td {
          background: var(--color-bg-elevated) !important;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          background: var(--color-bg-card);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--color-border);
        }

        @media (max-width: 575px) {
          .category-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          .add-category-btn {
            width: 100%;
          }
        }
      `}</style>

      <CategoryForm
        visible={formVisible}
        onClose={handleFormClose}
        category={editingCategory}
      />
    </div>
  );
};

export default CategoryList;