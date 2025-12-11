-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    reviews DECIMAL(3, 1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    picture VARCHAR(50) DEFAULT '🎵',
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

