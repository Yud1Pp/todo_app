import React from 'react';
import { Select, Button } from 'antd';
import { FilterOutlined, XOutlined } from '@ant-design/icons';
import { useTodo } from '../../context/TodoContext';
import type { TodoFilters } from '../../types';

const FilterBar: React.FC = () => {
  const { filters, setFilters, clearFilters, categories, fetchTodos } = useTodo();

  const handleFilterChange = (filterType: 'completed' | 'category_id' | 'priority', value: string | undefined) => {
    const newFilters: TodoFilters = { ...filters };

    if (value) {
      newFilters.filterBy = filterType;
      newFilters.filterValue = value;
    } else {
      delete newFilters.filterBy;
      delete newFilters.filterValue;
    }

    setFilters(newFilters);
    fetchTodos(1, newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: TodoFilters = {};
    clearFilters();
    fetchTodos(1, emptyFilters);
  };

  const hasActiveFilters = (filters.filterBy !== undefined && filters.filterValue !== undefined) || filters.search;

  const completedOptions = [
    { label: 'Completed', value: 'true' },
    { label: 'In Progress', value: 'false' },
  ];

  const priorityOptions = [
    { label: 'High Priority', value: 'high' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'Low Priority', value: 'low' },
  ];

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id.toString(),
  }));

  const selectStyle = {
    width: 160,
    fontFamily: 'var(--font-body)',
  };

  return (
    <div className="filter-container">
      <div className="filter-group">
        <Select
          placeholder="Status"
          value={filters.filterBy === 'completed' ? filters.filterValue : undefined}
          onChange={(value) => handleFilterChange('completed', value)}
          allowClear
          style={selectStyle}
          options={completedOptions}
          suffixIcon={<FilterOutlined style={{ color: 'var(--color-text-muted)' }} />}
          className="filter-select"
        />

        <Select
          placeholder="Category"
          value={filters.filterBy === 'category_id' ? filters.filterValue : undefined}
          onChange={(value) => handleFilterChange('category_id', value)}
          allowClear
          style={selectStyle}
          options={categoryOptions}
          suffixIcon={<FilterOutlined style={{ color: 'var(--color-text-muted)' }} />}
          className="filter-select"
        />

        <Select
          placeholder="Priority"
          value={filters.filterBy === 'priority' ? filters.filterValue : undefined}
          onChange={(value) => handleFilterChange('priority', value)}
          allowClear
          style={selectStyle}
          options={priorityOptions}
          suffixIcon={<FilterOutlined style={{ color: 'var(--color-text-muted)' }} />}
          className="filter-select"
        />
      </div>

      {hasActiveFilters && (
        <Button
          icon={<XOutlined />}
          onClick={handleClearFilters}
          size="small"
          className="clear-btn"
          style={{
            color: 'var(--color-accent-secondary)',
            borderColor: 'var(--color-accent-secondary)',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
          }}
        >
          Clear
        </Button>
      )}

      <style>{`
        .filter-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .filter-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .filter-select .ant-select-selector {
          border-radius: var(--radius-md) !important;
          border-color: var(--color-border) !important;
          background: var(--color-bg-card) !important;
          transition: var(--transition-smooth) !important;
          font-family: var(--font-body) !important;
        }
        .filter-select .ant-select-selector:hover {
          border-color: var(--color-accent-primary) !important;
        }
        .filter-select.ant-select-focused .ant-select-selector {
          border-color: var(--color-accent-primary) !important;
          box-shadow: 0 0 0 2px rgba(27, 67, 50, 0.1) !important;
        }
        .filter-select .ant-select-selection-item {
          font-family: var(--font-body);
          font-weight: 500;
        }
        .clear-btn {
          transition: var(--transition-smooth);
        }
        .clear-btn:hover {
          background: var(--color-accent-secondary) !important;
          color: white !important;
          border-color: var(--color-accent-secondary) !important;
        }
        @media (max-width: 991px) {
          .filter-group {
            width: 100%;
          }
          .filter-select {
            flex: 1;
            min-width: 140px;
          }
          .filter-select .ant-select-selector {
            width: 100% !important;
          }
        }
        @media (max-width: 575px) {
          .filter-group {
            flex-direction: column;
            width: 100%;
          }
          .filter-select {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FilterBar;