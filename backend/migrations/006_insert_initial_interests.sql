-- Insert initial interests
INSERT INTO interests (name, category) VALUES
-- Music Genres
('Rock', 'genre'),
('Jazz', 'genre'),
('Classical', 'genre'),
('Blues', 'genre'),
('Pop', 'genre'),
('Metal', 'genre'),
('Country', 'genre'),
('Funk', 'genre'),

-- Bands/Artists
('Queen', 'band'),
('The Beatles', 'band'),
('Led Zeppelin', 'band'),
('Pink Floyd', 'band'),
('Miles Davis', 'band'),
('John Coltrane', 'band'),
('Mozart', 'band'),
('Beethoven', 'band'),

-- Instruments
('Guitar', 'instrument'),
('Piano', 'instrument'),
('Violin', 'instrument'),
('Drums', 'instrument'),
('Saxophone', 'instrument'),
('Bass', 'instrument'),

-- Styles
('Fingerstyle', 'style'),
('Strumming', 'style'),
('Solo', 'style'),
('Ensemble', 'style'),
('Improvisation', 'style')
ON CONFLICT (name) DO NOTHING;

