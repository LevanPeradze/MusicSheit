-- Insert initial admin user
-- Password: password123 (stored as plain text for now - should be hashed in production)
INSERT INTO users (username, password, email, role) VALUES
('admin', 'password123', 'admin@musicschool.com', 'admin')
ON CONFLICT (username) DO NOTHING;

