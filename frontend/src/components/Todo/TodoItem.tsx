import React, { useState } from 'react';
import { Checkbox, Tag, Button, Popconfirm, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Todo } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

const priorityConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  high: { color: '#FFFFFF', bg: '#C65D3B', border: '#C65D3B', label: 'High' },
  medium: { color: '#1A1A1A', bg: '#FDF6E3', border: '#E8D5A3', label: 'Medium' },
  low: { color: '#FFFFFF', bg: '#1B4332', border: '#1B4332', label: 'Low' },
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const priority = priorityConfig[todo.priority] || priorityConfig.medium;
  const isOverdue = todo.due_date && dayjs(todo.due_date).isBefore(dayjs()) && !todo.completed;

  const formatDueDate = (date: string | null) => {
    if (!date) return null;
    return dayjs(date).format('MMM D');
  };

  return (
    <>
      <div
        className="todo-card"
        onClick={() => setDetailVisible(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: todo.completed ? 'var(--color-bg-elevated)' : 'var(--color-bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--radius-lg)',
          boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-soft)',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'var(--transition-smooth)',
          border: '1px solid var(--color-border-light)',
          borderLeft: `4px solid ${todo.category?.color || 'var(--color-accent-sage)'}`,
          cursor: 'pointer',
          opacity: todo.completed ? 0.75 : 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${todo.category?.color || 'var(--color-accent-sage)'}, transparent)`,
            opacity: isHovered ? 1 : 0,
            transition: 'var(--transition-smooth)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={todo.completed}
              onChange={(e) => {
                e.stopPropagation();
                onToggle(todo.id);
              }}
              style={{
                transform: 'scale(1.2)',
              }}
            />
            {todo.completed && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'var(--color-accent-primary)',
                  opacity: 0.2,
                  animation: 'pulse-soft 2s infinite',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 8,
            }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: todo.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  margin: 0,
                  lineHeight: 1.3,
                  textAlign: 'left',
                  wordBreak: 'break-word',
                  transition: 'var(--transition-fast)',
                }}
              >
                {todo.title}
              </h3>

              <Tag
                style={{
                  background: priority.bg,
                  color: priority.color,
                  border: `1px solid ${priority.border}`,
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  flexShrink: 0,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {priority.label}
              </Tag>
            </div>

            {todo.description && (
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  margin: '0 0 12px 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {todo.description}
              </p>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
            }}>
              {todo.category && (
                <span
                  style={{
                    color: todo.category.color,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: todo.category.color,
                  }} />
                  {todo.category.name}
                </span>
              )}
              {todo.due_date && (
                <span style={{
                  color: isOverdue ? '#C65D3B' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <CalendarOutlined style={{ fontSize: '0.75rem' }} />
                  {formatDueDate(todo.due_date)}
                  {isOverdue && <span style={{ fontWeight: 600 }}>Overdue</span>}
                </span>
              )}
              <span style={{ opacity: 0.7 }}>{dayjs(todo.created_at).fromNow()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4, opacity: isHovered ? 1 : 0.5, transition: 'var(--transition-fast)' }}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(todo);
              }}
              style={{
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
            <Popconfirm
              title="Delete this todo?"
              onConfirm={(e) => {
                e?.stopPropagation();
                onDelete(todo.id);
              }}
              okText="Delete"
              cancelText="Cancel"
              onCancel={(e) => e?.stopPropagation()}
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
                onClick={(e) => e.stopPropagation()}
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
            </Popconfirm>
          </div>
        </div>
      </div>

      <Modal
        title={
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 500 }}>
            {todo.title}
          </span>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={520}
        centered
        destroyOnClose
        styles={{
          header: {
            borderBottom: '1px solid var(--color-border-light)',
            padding: '20px 24px',
          },
          body: {
            padding: '24px',
          },
          footer: {
            borderTop: '1px solid var(--color-border-light)',
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <span style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-text-muted)',
              fontWeight: 500,
            }}>
              Description
            </span>
            <p style={{
              margin: '8px 0 0 0',
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}>
              {todo.description || 'No description provided'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <span style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                display: 'block',
                marginBottom: 8,
              }}>
                Priority
              </span>
              <Tag
                style={{
                  background: priority.bg,
                  color: priority.color,
                  border: `1px solid ${priority.border}`,
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                {priority.label}
              </Tag>
            </div>
            <div>
              <span style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                display: 'block',
                marginBottom: 8,
              }}>
                Category
              </span>
              {todo.category ? (
                <Tag
                  style={{
                    background: `${todo.category.color}15`,
                    color: todo.category.color,
                    border: `1px solid ${todo.category.color}30`,
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 500,
                  }}
                >
                  {todo.category.name}
                </Tag>
              ) : (
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Uncategorized</span>
              )}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            padding: '16px',
            background: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div>
              <span style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                display: 'block',
                marginBottom: 4,
              }}>
                Due Date
              </span>
              <span style={{ color: isOverdue ? '#C65D3B' : 'var(--color-text-primary)', fontWeight: 500 }}>
                {todo.due_date ? dayjs(todo.due_date).format('MMMM D, YYYY') : 'Not set'}
              </span>
            </div>
            <div>
              <span style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                display: 'block',
                marginBottom: 4,
              }}>
                Status
              </span>
              <Tag
                color={todo.completed ? 'success' : 'processing'}
                style={{
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {todo.completed ? 'Completed' : 'In Progress'}
              </Tag>
            </div>
          </div>

          <div style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            paddingTop: 8,
            borderTop: '1px solid var(--color-border-light)',
          }}>
            Created {dayjs(todo.created_at).format('MMMM D, YYYY [at] h:mm A')}
          </div>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 991px) {
          .todo-card {
            padding: 16px !important;
          }
        }
        @media (max-width: 575px) {
          .todo-card {
            padding: 12px !important;
            border-radius: var(--radius-md) !important;
          }
          .todo-card h3 {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default TodoItem;