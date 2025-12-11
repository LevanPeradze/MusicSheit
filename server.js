const express = require('express');
const path = require('path');
const pool = require('./server/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        // Validate username length
        if (username.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username must be at least 3 characters long' 
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Check if username already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: 'Username already exists. Please choose a different username.' 
            });
        }

        // Check if email already exists (if provided)
        if (email) {
            const existingEmail = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [email]
            );

            if (existingEmail.rows.length > 0) {
                return res.status(409).json({ 
                    success: false, 
                    message: 'Email already registered. Please use a different email.' 
                });
            }
        }

        // Insert new user into database
        // Note: In production, password should be hashed with bcrypt
        const result = await pool.query(
            `INSERT INTO users (username, password, email, role, display_name)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, username, email, role, display_name AS "displayName", theme_pref AS "themePref"`,
            [username.trim(), password, email ? email.trim() : null, 'student', username.trim()]
        );

        const newUser = result.rows[0];

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Registration successful! You can now login.',
            user: newUser
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error during registration', 
            error: error.message 
        });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide both username and password' });
        }

        // Query user from database
        const result = await pool.query(
            `SELECT id,
                    username,
                    password,
                    email,
                    role,
                    display_name AS "displayName",
                    theme_pref AS "themePref"
             FROM users
             WHERE username = $1`,
            [username]
        );

        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // Check if password is correct
        // Note: In production, passwords should be hashed (using bcrypt)
        if (password !== user.password) {
            return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
        }

        // Login successful
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;
        res.json({ 
            success: true, 
            message: 'Login successful!',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Error during login', error: error.message });
    }
});

// User profile endpoints
app.get('/api/users/:userId/profile', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const result = await pool.query(
            `SELECT id, username, email, display_name AS "displayName", bio, avatar_url AS "avatarUrl", theme_pref AS "themePref"
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, profile: result.rows[0] });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
    }
});

app.put('/api/users/:userId/profile', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { displayName, bio, avatarUrl, themePref } = req.body;

        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const allowedThemes = ['dark', 'light'];
        const sanitizedTheme = themePref && allowedThemes.includes(themePref) ? themePref : null;

        const result = await pool.query(
            `UPDATE users
             SET display_name = $2,
                 bio = $3,
                 avatar_url = $4,
                 theme_pref = COALESCE($5, theme_pref),
                 updated_at = NOW()
             WHERE id = $1
             RETURNING id, username, email, display_name AS "displayName", bio, avatar_url AS "avatarUrl", theme_pref AS "themePref"`,
            [
                userId,
                displayName ? displayName.trim() : null,
                bio ? bio.trim() : null,
                avatarUrl ? avatarUrl.trim() : null,
                sanitizedTheme
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Profile updated', profile: result.rows[0] });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
    }
});

// Interests endpoints
// Get all available interests
app.get('/api/interests', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, category FROM interests ORDER BY category, name'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching interests:', error);
        res.status(500).json({ success: false, message: 'Error fetching interests', error: error.message });
    }
});

// Get user interests (requires user_id in query or body)
app.get('/api/users/:userId/interests', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const result = await pool.query(
            `SELECT i.id, i.name, i.category 
             FROM interests i
             INNER JOIN user_interests ui ON i.id = ui.interest_id
             WHERE ui.user_id = $1
             ORDER BY i.category, i.name`,
            [userId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching user interests:', error);
        res.status(500).json({ success: false, message: 'Error fetching user interests', error: error.message });
    }
});

// Update user interests
app.post('/api/users/:userId/interests', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { interestIds } = req.body; // Array of interest IDs

        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        if (!Array.isArray(interestIds)) {
            return res.status(400).json({ success: false, message: 'interestIds must be an array' });
        }

        // Start transaction: delete old interests and insert new ones
        await pool.query('BEGIN');

        // Delete existing user interests
        await pool.query('DELETE FROM user_interests WHERE user_id = $1', [userId]);

        // Insert new interests
        if (interestIds.length > 0) {
            const values = interestIds.map((_, index) => `($1, $${index + 2})`).join(', ');
            const params = [userId, ...interestIds];
            await pool.query(
                `INSERT INTO user_interests (user_id, interest_id) VALUES ${values}`,
                params
            );
        }

        await pool.query('COMMIT');

        res.json({
            success: true,
            message: 'User interests updated successfully',
            interestIds: interestIds
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating user interests:', error);
        res.status(500).json({ success: false, message: 'Error updating user interests', error: error.message });
    }
});

// Courses endpoint - Get all courses (with interest matching if userId provided)
app.get('/api/courses', async (req, res) => {
    try {
        const userId = req.query.userId ? parseInt(req.query.userId) : null;
        
        // Get all courses
        const coursesResult = await pool.query(
            'SELECT id, name, description, price, reviews, review_count as "reviewCount", picture, category FROM courses ORDER BY id'
        );
        
        const courses = coursesResult.rows;

        // If userId provided, check interest matching
        if (userId && !isNaN(userId)) {
            // Get user interests
            const userInterestsResult = await pool.query(
                `SELECT interest_id FROM user_interests WHERE user_id = $1`,
                [userId]
            );
            
            const userInterestIds = userInterestsResult.rows.map(row => row.interest_id);

            if (userInterestIds.length > 0 && courses.length > 0) {
                // Get course interests for all courses
                const courseInterestsResult = await pool.query(
                    `SELECT ci.course_id, ci.interest_id, i.name as interest_name
                     FROM course_interests ci
                     INNER JOIN interests i ON ci.interest_id = i.id
                     WHERE ci.course_id = ANY($1::int[])`,
                    [courses.map(c => c.id)]
                );

                // Group interests by course
                const courseInterestsMap = {};
                courseInterestsResult.rows.forEach(row => {
                    if (!courseInterestsMap[row.course_id]) {
                        courseInterestsMap[row.course_id] = [];
                    }
                    courseInterestsMap[row.course_id].push({
                        id: row.interest_id,
                        name: row.interest_name
                    });
                });

                // Check matching for each course
                courses.forEach(course => {
                    const courseInterestIds = (courseInterestsMap[course.id] || []).map(ci => ci.id);
                    const matchingInterests = courseInterestIds.filter(id => userInterestIds.includes(id));
                    course.isForYou = matchingInterests.length > 0;
                    course.matchingInterests = (courseInterestsMap[course.id] || [])
                        .filter(ci => userInterestIds.includes(ci.id))
                        .map(ci => ci.name);
                });
            } else {
                // No user interests, mark all as not for user
                courses.forEach(course => {
                    course.isForYou = false;
                    course.matchingInterests = [];
                });
            }
        } else {
            // No userId provided, no matching
            courses.forEach(course => {
                course.isForYou = false;
                course.matchingInterests = [];
            });
        }

        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ success: false, message: 'Error fetching courses', error: error.message });
    }
});

// Courses endpoint - Get single course by ID
app.get('/api/courses/:id', async (req, res) => {
    try {
        const courseId = parseInt(req.params.id);
        
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: 'Invalid course ID' });
        }

        const result = await pool.query(
            'SELECT id, name, description, price, reviews, review_count as "reviewCount", picture, category FROM courses WHERE id = $1',
            [courseId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ success: false, message: 'Error fetching course', error: error.message });
    }
});

// Database test endpoint
app.get('/api/db/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time, version() as version');
        res.json({
            success: true,
            message: 'Database connection successful',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Add interests to a course
app.post('/api/courses/:courseId/interests', async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const { interestIds } = req.body; // Array of interest IDs

        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: 'Invalid course ID' });
        }

        if (!Array.isArray(interestIds)) {
            return res.status(400).json({ success: false, message: 'interestIds must be an array' });
        }

        // Delete existing course interests
        await pool.query('DELETE FROM course_interests WHERE course_id = $1', [courseId]);

        // Insert new interests
        if (interestIds.length > 0) {
            const values = interestIds.map((_, index) => `($1, $${index + 2})`).join(', ');
            const params = [courseId, ...interestIds];
            await pool.query(
                `INSERT INTO course_interests (course_id, interest_id) VALUES ${values}`,
                params
            );
        }

        res.json({
            success: true,
            message: 'Course interests updated successfully',
            interestIds: interestIds
        });
    } catch (error) {
        console.error('Error updating course interests:', error);
        res.status(500).json({ success: false, message: 'Error updating course interests', error: error.message });
    }
});

// Get course interests
app.get('/api/courses/:courseId/interests', async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        
        if (isNaN(courseId)) {
            return res.status(400).json({ success: false, message: 'Invalid course ID' });
        }

        const result = await pool.query(
            `SELECT i.id, i.name, i.category 
             FROM interests i
             INNER JOIN course_interests ci ON i.id = ci.interest_id
             WHERE ci.course_id = $1
             ORDER BY i.category, i.name`,
            [courseId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching course interests:', error);
        res.status(500).json({ success: false, message: 'Error fetching course interests', error: error.message });
    }
});

// Courses endpoint - Create new course
app.post('/api/courses', async (req, res) => {
    try {
        const { name, description, price, reviews, reviewCount, picture, category, interestIds } = req.body;

        // Validation
        if (!name || !description || price === undefined || !category) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: name, description, price, and category are required' 
            });
        }

        // Validate price is a number
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Price must be a positive number' 
            });
        }

        await pool.query('BEGIN');

        // Insert course into database
        const result = await pool.query(
            `INSERT INTO courses (name, description, price, reviews, review_count, picture, category)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name, description, price, reviews, review_count as "reviewCount", picture, category`,
            [
                name.trim(),
                description.trim(),
                price,
                reviews || 0,
                reviewCount || 0,
                picture || "🎵",
                category.trim()
            ]
        );

        const newCourse = result.rows[0];

        // Add interests if provided
        if (Array.isArray(interestIds) && interestIds.length > 0) {
            const values = interestIds.map((_, index) => `($1, $${index + 2})`).join(', ');
            const params = [newCourse.id, ...interestIds];
            await pool.query(
                `INSERT INTO course_interests (course_id, interest_id) VALUES ${values}`,
                params
            );
        }

        await pool.query('COMMIT');

        // Return created course with 201 status
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: newCourse
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating course:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating course', 
            error: error.message 
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

