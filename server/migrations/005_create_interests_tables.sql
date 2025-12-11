-- Create interests table
CREATE TABLE IF NOT EXISTS interests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., 'genre', 'band', 'instrument', 'style'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_interests table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest_id INTEGER NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, interest_id)
);

-- Create course_interests table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS course_interests (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    interest_id INTEGER NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, interest_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_interest_id ON user_interests(interest_id);
CREATE INDEX IF NOT EXISTS idx_course_interests_course_id ON course_interests(course_id);
CREATE INDEX IF NOT EXISTS idx_course_interests_interest_id ON course_interests(interest_id);
CREATE INDEX IF NOT EXISTS idx_interests_category ON interests(category);

