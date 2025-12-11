import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Include userId in query if user is logged in
        const url = user ? `/api/courses?userId=${user.id}` : '/api/courses';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="star">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="star empty">☆</span>
        ))}
        <span className="rating-number">{rating}</span>
      </div>
    );
  };

  return (
    <div className="courses-page">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <Link to="/main" className="logo">
            <div className="vinyl-logo">
              <svg className="vinyl-disc" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <mask id="c-cutout">
                    <rect width="120" height="120" fill="white"/>
                    <path d="M 60 15 
                             A 35 35 0 0 1 60 105
                             L 50 105
                             A 25 25 0 0 0 50 15
                             Z" fill="black"/>
                  </mask>
                </defs>
                <circle cx="60" cy="60" r="50" fill="#2a2a2a" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="45" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="42" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="39" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="36" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="33" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="30" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="27" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="24" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="21" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="18" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="6" fill="#1a1a1a" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="5" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                <ellipse cx="55" cy="55" rx="35" ry="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" mask="url(#c-cutout)"/>
              </svg>
            </div>
          </Link>
          <nav className="main-nav">
            <Link to="/main" className="nav-link">Home</Link>
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <a href="#instruments" className="nav-link">Instruments</a>
            <a href="#teachers" className="nav-link">Teachers</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="courses-header">
        <div className="courses-header-content">
          <h1 className="courses-title">Our Courses</h1>
          <p className="courses-subtitle">Discover your musical passion with our comprehensive course offerings</p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="courses-section">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading courses...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <p>Error loading courses: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="courses-container">
            {courses.length === 0 ? (
              <p className="no-courses">No courses available at the moment.</p>
            ) : (
              courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <div className="course-emoji">{course.picture}</div>
                <div className="course-category">{course.category}</div>
                {course.isForYou && (
                  <div className="for-you-badge">For You</div>
                )}
              </div>
              
              <div className="course-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 className="course-name">{course.name}</h3>
                  {course.isForYou && (
                    <span className="for-you-indicator">✓ Matches your interests</span>
                  )}
                </div>
                
                {course.matchingInterests && course.matchingInterests.length > 0 && (
                  <div className="matching-interests" style={{ marginBottom: '10px' }}>
                    <span style={{ color: '#c44d4d', fontSize: '13px', fontWeight: '600' }}>Matches: </span>
                    {course.matchingInterests.map((interest, idx) => (
                      <span key={idx} style={{ color: '#b8b8b8', fontSize: '13px' }}>
                        {interest}{idx < course.matchingInterests.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="course-description">{course.description}</p>
                
                <div className="course-reviews">
                  {renderStars(course.reviews)}
                  <span className="review-count">({course.reviewCount} reviews)</span>
                </div>
                
                <div className="course-footer">
                  <div className="course-price">
                    <span className="price-currency">$</span>
                    <span className="price-amount">{course.price}</span>
                    <span className="price-period">/month</span>
                  </div>
                  <button className="course-button">Enroll Now</button>
                </div>
              </div>
            </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default CoursesPage;

