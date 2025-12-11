import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div className="main-page">
      {/* Header Navigation */}
      <header className="main-header">
        <div className="header-content">
          <Link to="/main" className="logo">
            <div className="vinyl-logo">
              <svg className="vinyl-disc" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <mask id="c-cutout">
                    <rect width="120" height="120" fill="white"/>
                    {/* C shape cutout - creates the opening */}
                    <path d="M 60 15 
                             A 35 35 0 0 1 60 105
                             L 50 105
                             A 25 25 0 0 0 50 15
                             Z" fill="black"/>
                  </mask>
                </defs>
                
                {/* Vinyl disc base with C cutout */}
                <circle cx="60" cy="60" r="50" fill="#2a2a2a" mask="url(#c-cutout)"/>
                
                {/* Vinyl record grooves - concentric circles */}
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
                
                {/* Center hole */}
                <circle cx="60" cy="60" r="6" fill="#1a1a1a" mask="url(#c-cutout)"/>
                <circle cx="60" cy="60" r="5" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout)"/>
                
                {/* Highlight for 3D effect */}
                <ellipse cx="55" cy="55" rx="35" ry="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" mask="url(#c-cutout)"/>
              </svg>
            </div>
          </Link>
          <nav className="main-nav">
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <a href="#instruments" className="nav-link">Instruments</a>
            <a href="#teachers" className="nav-link">Teachers</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Music School</h1>
          <p className="hero-subtitle">Your journey to musical excellence begins here</p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn-primary">Explore Courses</Link>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Expert Teachers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">20+</div>
            <div className="stat-label">Courses</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <div className="stat-label">Instruments</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">What We Offer</h2>
          <p className="section-subtitle">Discover our comprehensive music education programs</p>
        </div>
        
        <div className="main-cards">
          <Link to="/courses" className="main-card">
            <div className="card-icon">🎵</div>
            <h3>Courses</h3>
            <p>Explore our wide range of music courses designed for all skill levels</p>
            <ul className="card-features">
              <li>Beginner to Advanced</li>
              <li>Individual & Group Classes</li>
              <li>Flexible Scheduling</li>
            </ul>
          </Link>
          
          <div className="main-card instruments-card">
            <div className="card-icon">🎹</div>
            <h3>Instruments</h3>
            <p>Learn piano, guitar, violin, and more with expert guidance</p>
            <div className="instruments-list">
              <span className="instrument-tag">KLEOBA</span>
              <span className="instrument-tag">Guitar</span>
              <span className="instrument-tag">Violin</span>
              <span className="instrument-tag">Drums</span>
              <span className="instrument-tag">Saxophone</span>
              <span className="instrument-tag">Flute</span>
            </div>
          </div>
          
          <div className="main-card">
            <div className="card-icon">👨‍🏫</div>
            <h3>Teachers</h3>
            <p>Learn from experienced professionals passionate about music</p>
            <ul className="card-features">
              <li>Certified Instructors</li>
              <li>Years of Experience</li>
              <li>Personalized Approach</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
        </div>
        <div className="why-grid">
          <div className="why-item">
            <div className="why-icon">⭐</div>
            <h4>Excellence</h4>
            <p>Top-rated music education with proven results</p>
          </div>
          <div className="why-item">
            <div className="why-icon">🎯</div>
            <h4>Personalized</h4>
            <p>Tailored lessons to match your learning style</p>
          </div>
          <div className="why-item">
            <div className="why-icon">🏆</div>
            <h4>Recognition</h4>
            <p>Certificates and performance opportunities</p>
          </div>
          <div className="why-item">
            <div className="why-icon">💡</div>
            <h4>Innovation</h4>
            <p>Modern teaching methods and technology</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Musical Journey?</h2>
          <p className="cta-text">Join hundreds of students already learning with us</p>
          <button className="btn-cta">Get Started Today</button>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
