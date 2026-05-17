import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, ColorPicker, message } from 'antd';
import { useTodo } from '../../context/TodoContext';
import type { Category, CreateCategoryPayload } from '../../types';

interface CategoryFormProps {
  visible: boolean;
  onClose: () => void;
  category?: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ visible, onClose, category }) => {
  const [form] = Form.useForm();
  const { createCategory, updateCategory } = useTodo();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (category) {
        form.setFieldsValue({
          name: category.name,
          color: category.color,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ color: '#1B4332' });
      }
    }
  }, [visible, category, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const colorValue = typeof values.color === 'string'
        ? values.color
        : values.color.toHexString();

      const payload: CreateCategoryPayload = {
        name: values.name,
        color: colorValue,
      };

      if (category) {
        await updateCategory(category.id, payload);
        message.success('Category updated');
      } else {
        await createCategory(payload);
        message.success('Category created');
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

  return (
    <Modal
      title={
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
        }}>
          {category ? 'Edit Category' : 'New Category'}
        </span>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={category ? 'Save' : 'Create'}
      confirmLoading={loading}
      destroyOnClose
      width={400}
      centered
      className="category-form-modal"
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
          padding: '16px 24px',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 8 }}
      >
        <Form.Item
          name="name"
          label={
            <span style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Category Name
            </span>
          }
          rules={[{ required: true, message: 'Please enter a category name' }]}
        >
          <Input
            placeholder="e.g., Work, Personal, Shopping"
            style={{
              fontFamily: 'var(--font-body)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
            }}
          />
        </Form.Item>

        <Form.Item
          name="color"
          label={
            <span style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Color
            </span>
          }
          initialValue="#1B4332"
        >
          <ColorPicker
            format="hex"
            showText
            style={{
              fontFamily: 'var(--font-body)',
            }}
          />
        </Form.Item>
      </Form>

      <style>{`
        .category-form-modal .ant-color-picker-trigger {
          border-radius: var(--radius-md) !important;
          border-color: var(--color-border) !important;
          padding: 8px !important;
        }
        .category-form-modal .ant-input:hover,
        .category-form-modal .ant-input:focus {
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 2px rgba(27, 67, 50, 0.1);
        }
        .category-form-modal .ant-modal-footer .ant-btn-primary {
          background: var(--color-accent-primary);
          border-color: var(--color-accent-primary);
          font-family: var(--font-body);
          font-weight: 500;
          border-radius: var(--radius-md);
        }
        .category-form-modal .ant-modal-footer .ant-btn-primary:hover {
          background: var(--color-accent-secondary) !important;
          border-color: var(--color-accent-secondary) !important;
        }
        .category-form-modal .ant-modal-footer .ant-btn-default {
          font-family: var(--font-body);
          border-radius: var(--radius-md);
        }
      `}</style>
    </Modal>
  );
};

export default CategoryForm;