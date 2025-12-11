import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Login successful!');
        setError(false);
        // Store user info in localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        // Redirect to main page after successful login
        setTimeout(() => {
          navigate('/main');
        }, 1000);
      } else {
        setMessage(data.message || 'Login failed. Please check your credentials.');
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
      <h1>Welcome Back</h1>
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
            placeholder="Enter your username"
            className={error ? 'error' : ''}
            required
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
            placeholder="Enter your password"
            className={error ? 'error' : ''}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
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
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#c44d4d', textDecoration: 'none', fontWeight: '600' }}>
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

