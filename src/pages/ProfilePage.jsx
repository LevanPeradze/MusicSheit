import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('interests');
  const [allInterests, setAllInterests] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [interestsLoading, setInterestsLoading] = useState(true);
  const [interestsSaving, setInterestsSaving] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [interestError, setInterestError] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    avatarUrl: '',
    themePref: 'dark'
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    // Get user from localStorage (set during login)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    fetchAllInterests();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserInterests(user.id);
      fetchUserProfile(user.id);
    }
  }, [user]);

  const fetchAllInterests = async () => {
    try {
      const response = await fetch('/api/interests');
      const data = await response.json();
      
      // Group by category
      const grouped = data.reduce((acc, interest) => {
        if (!acc[interest.category]) {
          acc[interest.category] = [];
        }
        acc[interest.category].push(interest);
        return acc;
      }, {});
      
      setAllInterests(grouped);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  const fetchUserInterests = async (userId) => {
    try {
      setInterestsLoading(true);
      const response = await fetch(`/api/users/${userId}/interests`);
      const data = await response.json();
      setUserInterests(data.map(i => i.id));
    } catch (error) {
      console.error('Error fetching user interests:', error);
    } finally {
      setInterestsLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      setProfileLoading(true);
      const response = await fetch(`/api/users/${userId}/profile`);
      const data = await response.json();
      if (data.success && data.profile) {
        setProfile({
          displayName: data.profile.displayName || '',
          bio: data.profile.bio || '',
          avatarUrl: data.profile.avatarUrl || '',
          themePref: data.profile.themePref || 'dark'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleInterestToggle = (interestId) => {
    setUserInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSaveInterests = async () => {
    if (!user) {
      setInterestMessage('Please login first');
      setInterestError(true);
      return;
    }

    setInterestsSaving(true);
    setInterestMessage('');
    setInterestError(false);

    try {
      const response = await fetch(`/api/users/${user.id}/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interestIds: userInterests }),
      });

      const data = await response.json();
      
      if (data.success) {
        setInterestMessage('Interests saved successfully!');
        setInterestError(false);
      } else {
        setInterestMessage(data.message || 'Failed to save interests');
        setInterestError(true);
      }
    } catch (error) {
      setInterestMessage('Error saving interests. Please try again.');
      setInterestError(true);
    } finally {
      setInterestsSaving(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSave = async () => {
    if (!user) {
      setProfileMessage('Please login first');
      setProfileError(true);
      return;
    }

    setProfileSaving(true);
    setProfileMessage('');
    setProfileError(false);

    try {
      const response = await fetch(`/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: profile.displayName,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          themePref: profile.themePref
        }),
      });

      const data = await response.json();

      if (data.success && data.profile) {
        setProfileMessage('Profile updated successfully!');
        setProfileError(false);

        const updatedUser = {
          ...user,
          displayName: data.profile.displayName,
          themePref: data.profile.themePref
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setProfileMessage(data.message || 'Failed to update profile');
        setProfileError(true);
      }
    } catch (error) {
      setProfileMessage('Error updating profile. Please try again.');
      setProfileError(true);
    } finally {
      setProfileSaving(false);
    }
  };

  if (!user || interestsLoading || profileLoading) {
    return (
      <div className="courses-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="courses-page">
        <div className="error-container">
          <p>Please login to view your profile</p>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <Link to="/main" className="logo">
            <div className="vinyl-logo">
              <svg className="vinyl-disc" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <mask id="c-cutout-profile">
                    <rect width="120" height="120" fill="white"/>
                    <path d="M 60 15 
                             A 35 35 0 0 1 60 105
                             L 50 105
                             A 25 25 0 0 0 50 15
                             Z" fill="black"/>
                  </mask>
                </defs>
                <circle cx="60" cy="60" r="50" fill="#2a2a2a" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="45" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="42" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="39" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="36" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="33" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="30" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="27" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="24" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="21" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="18" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="6" fill="#1a1a1a" mask="url(#c-cutout-profile)"/>
                <circle cx="60" cy="60" r="5" fill="none" stroke="#3a3a3a" strokeWidth="0.5" mask="url(#c-cutout-profile)"/>
                <ellipse cx="55" cy="55" rx="35" ry="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" mask="url(#c-cutout-profile)"/>
              </svg>
            </div>
          </Link>
          <nav className="main-nav">
            <Link to="/main" className="nav-link">Home</Link>
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="courses-header">
        <div className="courses-header-content">
          <h1 className="courses-title">My Profile</h1>
          <p className="courses-subtitle">Manage your interests and preferences</p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="profile-section">
        <div className="profile-container">
          {/* Tabs */}
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'interests' ? 'active' : ''}`}
              onClick={() => setActiveTab('interests')}
            >
              Interests
            </button>
            <button 
              className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Account Info
            </button>
          </div>

          {/* Interests Tab */}
          {activeTab === 'interests' && (
            <div className="profile-content">
              <h2>Select Your Interests</h2>
              <p style={{ color: '#b8b8b8', marginBottom: '30px' }}>
                Choose your interests to get personalized course recommendations
              </p>

              {Object.entries(allInterests).map(([category, interests]) => (
                <div key={category} className="interest-category">
                  <h3 className="interest-category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <div className="interests-grid">
                    {interests.map(interest => (
                      <button
                        key={interest.id}
                        className={`interest-tag ${userInterests.includes(interest.id) ? 'selected' : ''}`}
                        onClick={() => handleInterestToggle(interest.id)}
                      >
                        {interest.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="profile-actions">
                <button 
                  className="btn-primary" 
                  onClick={handleSaveInterests}
                  disabled={interestsSaving}
                >
                  {interestsSaving ? 'Saving...' : 'Save Interests'}
                </button>
                {interestMessage && (
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '12px', 
                    borderRadius: '8px',
                    backgroundColor: interestError ? '#f8d7da' : '#d4edda',
                    color: interestError ? '#721c24' : '#155724',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    {interestMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Info Tab */}
          {activeTab === 'info' && (
            <div className="profile-content">
              <h2>Account Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <label>Username</label>
                  <p>{user.username}</p>
                </div>
                {user.email && (
                  <div className="info-item">
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                )}
                <div className="info-item">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => handleProfileChange('displayName', e.target.value)}
                    placeholder="Enter display name"
                  />
                </div>
                <div className="info-item">
                  <label>Avatar URL</label>
                  <input
                    type="text"
                    value={profile.avatarUrl}
                    onChange={(e) => handleProfileChange('avatarUrl', e.target.value)}
                    placeholder="https://example.com/avatar.png"
                  />
                  {profile.avatarUrl && (
                    <img 
                      src={profile.avatarUrl} 
                      alt="Avatar preview" 
                      style={{ marginTop: '10px', width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="info-item">
                  <label>Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    placeholder="Tell us more about your musical journey..."
                    rows={4}
                  />
                </div>
                <div className="info-item">
                  <label>Theme Preference</label>
                  <select
                    value={profile.themePref}
                    onChange={(e) => handleProfileChange('themePref', e.target.value)}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                <div className="info-item">
                  <label>Role</label>
                  <p>{user.role}</p>
                </div>
                <div className="profile-actions">
                  <button
                    className="btn-primary"
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                  >
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                  {profileMessage && (
                    <div style={{ 
                      marginTop: '15px', 
                      padding: '12px', 
                      borderRadius: '8px',
                      backgroundColor: profileError ? '#f8d7da' : '#d4edda',
                      color: profileError ? '#721c24' : '#155724',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      {profileMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;

