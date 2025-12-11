const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
    try {
        console.log('🔄 Running database migrations...');

        // Read and execute create table migration
        const createTableSQL = fs.readFileSync(
            path.join(__dirname, '001_create_courses_table.sql'),
            'utf8'
        );
        await pool.query(createTableSQL);
        console.log('✅ Created courses table');

        // Check if courses table is empty before inserting
        const countResult = await pool.query('SELECT COUNT(*) FROM courses');
        const courseCount = parseInt(countResult.rows[0].count);

        if (courseCount === 0) {
            // Read and execute insert data migration
            const insertDataSQL = fs.readFileSync(
                path.join(__dirname, '002_insert_initial_courses.sql'),
                'utf8'
            );
            await pool.query(insertDataSQL);
            console.log('✅ Inserted initial courses data');
        } else {
            console.log(`ℹ️  Courses table already has ${courseCount} courses, skipping data insertion`);
        }

        // Create users table
        const createUsersTableSQL = fs.readFileSync(
            path.join(__dirname, '003_create_users_table.sql'),
            'utf8'
        );
        await pool.query(createUsersTableSQL);
        console.log('✅ Created users table');

        // Check if users table is empty before inserting
        const userCountResult = await pool.query('SELECT COUNT(*) FROM users');
        const userCount = parseInt(userCountResult.rows[0].count);

        if (userCount === 0) {
            // Read and execute insert users migration
            const insertUsersSQL = fs.readFileSync(
                path.join(__dirname, '004_insert_initial_users.sql'),
                'utf8'
            );
            await pool.query(insertUsersSQL);
            console.log('✅ Inserted initial users data');
        } else {
            console.log(`ℹ️  Users table already has ${userCount} users, skipping data insertion`);
        }

        // Create interests tables
        const createInterestsTableSQL = fs.readFileSync(
            path.join(__dirname, '005_create_interests_tables.sql'),
            'utf8'
        );
        await pool.query(createInterestsTableSQL);
        console.log('✅ Created interests tables');

        // Check if interests table is empty before inserting
        const interestsCountResult = await pool.query('SELECT COUNT(*) FROM interests');
        const interestsCount = parseInt(interestsCountResult.rows[0].count);

        if (interestsCount === 0) {
            // Read and execute insert interests migration
            const insertInterestsSQL = fs.readFileSync(
                path.join(__dirname, '006_insert_initial_interests.sql'),
                'utf8'
            );
            await pool.query(insertInterestsSQL);
            console.log('✅ Inserted initial interests data');
        } else {
            console.log(`ℹ️  Interests table already has ${interestsCount} interests, skipping data insertion`);
        }

        // Add example course interests
        const courseInterestsCountResult = await pool.query('SELECT COUNT(*) FROM course_interests');
        const courseInterestsCount = parseInt(courseInterestsCountResult.rows[0].count);

        if (courseInterestsCount === 0) {
            const addCourseInterestsSQL = fs.readFileSync(
                path.join(__dirname, '007_add_example_course_interests.sql'),
                'utf8'
            );
            await pool.query(addCourseInterestsSQL);
            console.log('✅ Added example course interests');
        } else {
            console.log(`ℹ️  Course interests already exist (${courseInterestsCount} entries), skipping`);
        }

        // Add profile fields to users table
        const addProfileFieldsSQL = fs.readFileSync(
            path.join(__dirname, '008_add_profile_fields_to_users.sql'),
            'utf8'
        );
        await pool.query(addProfileFieldsSQL);
        console.log('✅ Ensured profile fields exist on users table');

        console.log('✅ All migrations completed successfully!');
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    }
}

// Run migrations if this file is executed directly
if (require.main === module) {
    runMigrations()
        .then(() => {
            console.log('Migration process completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

module.exports = runMigrations;

