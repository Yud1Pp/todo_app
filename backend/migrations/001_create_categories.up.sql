-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, color) VALUES
    ('Work', '#3B82F6'),
    ('Personal', '#10B981'),
    ('Shopping', '#F59E0B')
ON CONFLICT DO NOTHING;