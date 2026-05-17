-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    category_id INTEGER,
    priority VARCHAR(10) NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_todos_category FOREIGN KEY (category_id)
        REFERENCES categories(id) ON DELETE SET NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_category_id ON todos(category_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

-- Insert sample todos
INSERT INTO todos (title, description, category_id, priority, due_date) VALUES
    ('Complete coding challenge', 'Build a full-stack todo application for Industrix', 1, 'high', '2026-05-20 23:59:59'),
    ('Review pull requests', 'Review team PRs on GitHub', 1, 'medium', '2026-05-18 17:00:00'),
    ('Buy groceries', 'Milk, eggs, bread, vegetables', 3, 'low', '2026-05-17 18:00:00'),
    ('Schedule team meeting', 'Weekly sync with the team', 1, 'medium', '2026-05-19 10:00:00'),
    ('Read a book', 'Finish reading "Atomic Habits"', 2, 'low', '2026-05-25 22:00:00')
ON CONFLICT DO NOTHING;