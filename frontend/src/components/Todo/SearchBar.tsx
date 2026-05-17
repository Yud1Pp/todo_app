import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTodo } from '../../context/TodoContext';

const SearchBar: React.FC = () => {
  const { setFilters, filters, fetchTodos } = useTodo();
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearch = () => {
    const newFilters = { ...filters, search: searchValue || undefined };
    setFilters(newFilters);
    fetchTodos(1, newFilters);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchValue('');
    const newFilters = { ...filters, search: undefined };
    setFilters(newFilters);
    fetchTodos(1, newFilters);
  };

  return (
    <div className="search-container">
      <Space.Compact className="search-bar">
        <Input
          placeholder="Search tasks..."
          prefix={<SearchOutlined style={{ color: 'var(--color-text-muted)' }} />}
          value={searchValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          allowClear
          onClear={handleClear}
          style={{
            background: 'var(--color-bg-card)',
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
            fontFamily: 'var(--font-body)',
          }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          className="search-btn"
          style={{
            background: 'var(--color-accent-primary)',
            borderColor: 'var(--color-accent-primary)',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
          }}
        >
          <span className="search-btn-text">Search</span>
        </Button>
      </Space.Compact>

      <style>{`
        .search-container {
          width: 100%;
        }
        .search-bar {
          width: 100%;
          max-width: 360px;
        }
        .search-bar .ant-input-affix-wrapper {
          width: 100%;
          max-width: 280px;
          padding: '8px 12px';
          border-radius: var(--radius-md) 0 0 var(--radius-md);
          transition: var(--transition-smooth);
        }
        .search-bar .ant-input-affix-wrapper:hover,
        .search-bar .ant-input-affix-wrapper:focus,
        .search-bar .ant-input-affix-wrapper-focused {
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 2px rgba(27, 67, 50, 0.1);
        }
        .search-bar .ant-input {
          font-family: var(--font-body);
        }
        .search-bar .ant-btn-primary {
          padding: '8px 16px';
          height: auto;
          transition: var(--transition-smooth);
        }
        .search-bar .ant-btn-primary:hover {
          background: var(--color-accent-secondary) !important;
          border-color: var(--color-accent-secondary) !important;
          transform: translateY(-1px);
        }
        @media (max-width: 991px) {
          .search-bar {
            width: 100%;
            max-width: 100%;
          }
          .search-bar .ant-input-affix-wrapper {
            max-width: calc(100% - 80px);
          }
        }
        @media (max-width: 575px) {
          .search-bar {
            max-width: 100%;
          }
          .search-bar .ant-input-affix-wrapper {
            max-width: 100%;
          }
          .search-btn-text {
            display: none;
          }
          .search-btn {
            padding: 8px 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;