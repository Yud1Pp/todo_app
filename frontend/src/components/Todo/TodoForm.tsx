import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { useTodo } from '../../context/TodoContext';
import type { Todo, CreateTodoPayload } from '../../types';
import dayjs from 'dayjs';

interface TodoFormProps {
  visible: boolean;
  onClose: () => void;
  todo?: Todo | null;
}

const { TextArea } = Input;

const TodoForm: React.FC<TodoFormProps> = ({ visible, onClose, todo }) => {
  const [form] = Form.useForm();
  const { createTodo, updateTodo, categories, fetchCategories } = useTodo();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (visible) {
      if (todo) {
        form.setFieldsValue({
          title: todo.title,
          description: todo.description,
          category_id: todo.category_id,
          priority: todo.priority,
          due_date: todo.due_date ? dayjs(todo.due_date) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ priority: 'medium' });
      }
    }
  }, [visible, todo, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload: CreateTodoPayload = {
        title: values.title,
        description: values.description,
        category_id: values.category_id || null,
        priority: values.priority || 'medium',
        due_date: values.due_date ? values.due_date.toISOString() : null,
      };

      if (todo) {
        await updateTodo(todo.id, payload);
        message.success('Todo updated successfully');
      } else {
        await createTodo(payload);
        message.success('Todo created successfully');
      }

      form.resetFields();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { label: 'High Priority', value: 'high' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'Low Priority', value: 'low' },
  ];

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  return (
    <Modal
      title={
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.35rem',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.01em',
        }}>
          {todo ? 'Edit Task' : 'New Task'}
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={todo ? 'Save Changes' : 'Create Task'}
      confirmLoading={loading}
      destroyOnClose
      width={480}
      centered
      styles={{
        header: {
          borderBottom: '1px solid var(--color-border-light)',
          padding: '20px 24px',
          margin: 0,
        },
        body: {
          padding: '24px',
        },
        footer: {
          borderTop: '1px solid var(--color-border-light)',
          padding: '16px 24px',
        },
      }}
      className="todo-form-modal"
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 8 }}
      >
        <Form.Item
          name="title"
          label={
            <span style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Task Title
            </span>
          }
          rules={[{ required: true, message: 'Please enter a title for your task' }]}
        >
          <Input
            placeholder="What needs to be done?"
            style={{
              fontFamily: 'var(--font-body)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: '1rem',
            }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <span style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Description
            </span>
          }
        >
          <TextArea
            rows={3}
            placeholder="Add some details about this task..."
            style={{
              fontFamily: 'var(--font-body)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              resize: 'none',
            }}
          />
        </Form.Item>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}>
          <Form.Item
            name="priority"
            label={
              <span style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Priority
              </span>
            }
            initialValue="medium"
          >
            <Select
              options={priorityOptions}
              style={{
                fontFamily: 'var(--font-body)',
              }}
            />
          </Form.Item>

          <Form.Item
            name="category_id"
            label={
              <span style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Category
              </span>
            }
          >
            <Select
              options={categoryOptions}
              placeholder="Select category"
              allowClear
              style={{
                fontFamily: 'var(--font-body)',
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="due_date"
          label={
            <span style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Due Date
            </span>
          }
        >
          <DatePicker
            style={{
              width: '100%',
              fontFamily: 'var(--font-body)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
            showTime
            placeholder="Select due date"
          />
        </Form.Item>
      </Form>

      <style>{`
        .todo-form-modal .ant-select-selector {
          border-radius: var(--radius-md) !important;
          border-color: var(--color-border) !important;
          font-family: var(--font-body) !important;
        }
        .todo-form-modal .ant-select-selector:hover {
          border-color: var(--color-accent-primary) !important;
        }
        .todo-form-modal .ant-picker {
          border-radius: var(--radius-md);
          border-color: var(--color-border);
        }
        .todo-form-modal .ant-picker:hover {
          border-color: var(--color-accent-primary);
        }
        .todo-form-modal .ant-input:hover,
        .todo-form-modal .ant-input:focus {
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 2px rgba(27, 67, 50, 0.1);
        }
        .todo-form-modal .ant-input:focus,
        .todo-form-modal .ant-input-focused {
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 2px rgba(27, 67, 50, 0.1);
        }
        .todo-form-modal .ant-modal-footer .ant-btn-primary {
          background: var(--color-accent-primary);
          border-color: var(--color-accent-primary);
          font-family: var(--font-body);
          font-weight: 500;
          border-radius: var(--radius-md);
          height: auto;
          padding: '8px 20px';
          transition: var(--transition-smooth);
        }
        .todo-form-modal .ant-modal-footer .ant-btn-primary:hover {
          background: var(--color-accent-secondary) !important;
          border-color: var(--color-accent-secondary) !important;
          transform: translateY(-1px);
        }
        .todo-form-modal .ant-modal-footer .ant-btn-default {
          font-family: var(--font-body);
          border-radius: var(--radius-md);
          height: auto;
          padding: '8px 20px';
        }
        @media (max-width: 575px) {
          .todo-form-modal .ant-modal-content {
            margin: 16px;
          }
          .todo-form-modal div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Modal>
  );
};

export default TodoForm;