import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);

    // Client-side validation
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setError(true);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setError(true);
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setMessage('Username must be at least 3 characters long');
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email: email || null }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Registration successful! Redirecting to login...');
        setError(false);
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
        setError(true);
      }
    } catch (error) {
      setMessage('Error connecting to server. Please try again.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Choose a username (min 3 characters)"
            className={error ? 'error' : ''}
            required
            minLength={3}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email (Optional)</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Enter your email"
            className={error ? 'error' : ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Enter password (min 6 characters)"
            className={error ? 'error' : ''}
            required
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Confirm your password"
            className={error ? 'error' : ''}
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {message && (
          <div style={{ 
            marginTop: '15px', 
            padding: '12px', 
            borderRadius: '8px',
            backgroundColor: error ? '#f8d7da' : '#d4edda',
            color: error ? '#721c24' : '#155724',
            textAlign: 'center',
            fontWeight: '500',
            border: error ? '1px solid #f5c6cb' : '1px solid #c3e6cb'
          }}>
            {message}
          </div>
        )}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#b8b8b8', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#c44d4d', textDecoration: 'none', fontWeight: '600' }}>
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;

