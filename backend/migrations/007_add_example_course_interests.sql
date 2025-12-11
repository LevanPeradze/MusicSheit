-- Add example interests to courses
-- This links courses with interests for demonstration

-- Guitar Mastery - Rock, Queen, Guitar, Strumming
INSERT INTO course_interests (course_id, interest_id)
SELECT c.id, i.id
FROM courses c, interests i
WHERE c.name = 'Guitar Mastery' 
AND i.name IN ('Rock', 'Queen', 'Guitar', 'Strumming')
ON CONFLICT DO NOTHING;

-- Violin Excellence - Classical, Mozart, Beethoven, Violin
INSERT INTO course_interests (course_id, interest_id)
SELECT c.id, i.id
FROM courses c, interests i
WHERE c.name = 'Violin Excellence' 
AND i.name IN ('Classical', 'Mozart', 'Beethoven', 'Violin')
ON CONFLICT DO NOTHING;

-- Drum Beats & Rhythms - Rock, Funk, Drums
INSERT INTO course_interests (course_id, interest_id)
SELECT c.id, i.id
FROM courses c, interests i
WHERE c.name = 'Drum Beats & Rhythms' 
AND i.name IN ('Rock', 'Funk', 'Drums')
ON CONFLICT DO NOTHING;

-- Saxophone Journey - Jazz, Miles Davis, John Coltrane, Saxophone, Improvisation
INSERT INTO course_interests (course_id, interest_id)
SELECT c.id, i.id
FROM courses c, interests i
WHERE c.name = 'Saxophone Journey' 
AND i.name IN ('Jazz', 'Miles Davis', 'John Coltrane', 'Saxophone', 'Improvisation')
ON CONFLICT DO NOTHING;

-- Music Theory Basics - All genres, All instruments (general)
INSERT INTO course_interests (course_id, interest_id)
SELECT c.id, i.id
FROM courses c, interests i
WHERE c.name = 'Music Theory Basics' 
AND i.category IN ('genre', 'instrument')
ON CONFLICT DO NOTHING;

