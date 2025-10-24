import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  category: string[];
  delivery_method: string;
  preferred_time_of_day: string;
  subscription_status: boolean;
  telegram_id: string;
}

interface NewsResponse {
  success: boolean;
  sentTo: string;
  chatId: string;
  newsCount: number;
  categories: string[];
  sentNews: Array<{
    title: string;
    category: string;
    source_url: string;
  }>;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    email: '', 
    password: '', 
    telegram_id: '',
    categories: [] as string[],
    preferred_time: '09:00',
    delivery_method: 'telegram'
  });

  const categories = [
    "business", "entertainment", "general", "health", 
    "science", "sports", "technology"
  ];

  const API_BASE_URL = 'http://localhost:5000/api';

  // Check if user is logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('news93_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email: loginForm.email,
        password: loginForm.password
      });

      const foundUser = response.data;

      if (foundUser) {
        setUser(foundUser);
        setIsLoggedIn(true);
        localStorage.setItem('news93_user', JSON.stringify(foundUser));
        showMessage('Login successful!', 'success');
        setLoginForm({ email: '', password: '' });
      } else {
        showMessage('Invalid email or password', 'error');
      }
    } catch (error: any) {
      showMessage(error.response?.data?.error || 'Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, registerForm);
      setUser(response.data);
      setIsLoggedIn(true);
      localStorage.setItem('news93_user', JSON.stringify(response.data));
      showMessage('Registration successful!', 'success');
      setRegisterForm({ 
        email: '', 
        password: '', 
        telegram_id: '',
        categories: [],
        preferred_time: '09:00',
        delivery_method: 'telegram'
      });
    } catch (error: any) {
      showMessage(error.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('news93_user');
    showMessage('Logged out successfully', 'info');
  };

  const handleInstantNews = async () => {
    if (!user) return;

    setLoading(true);
    showMessage('Sending instant news to your Telegram...', 'info');

    try {
      const response = await axios.post(`${API_BASE_URL}/telegram/instant-news`, {
        userId: user._id,
        categories: user.category
      });

      const data: NewsResponse = response.data;
      showMessage(
        `✅ Sent ${data.newsCount} news articles to your Telegram!`, 
        'success'
      );
    } catch (error: any) {
      showMessage(
        error.response?.data?.error || 'Failed to send instant news', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setRegisterForm(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        <div className="container">
          <header className="header">
            <h1>📰 News93</h1>
            <p>Your personalized news delivery service</p>
          </header>

          <div className="auth-container">
            <div className="auth-section">
              <h2>Login</h2>
              <form onSubmit={handleLogin} className="form">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>

            <div className="auth-section">
              <h2>Register</h2>
              <form onSubmit={handleRegister} className="form">
                <input
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Telegram ID (optional)"
                  value={registerForm.telegram_id}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, telegram_id: e.target.value }))}
                />
                <input
                  type="time"
                  placeholder="Preferred time"
                  value={registerForm.preferred_time}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, preferred_time: e.target.value }))}
                />
                
                <div className="categories-section">
                  <label>Select Categories:</label>
                  <div className="categories-grid">
                    {categories.map(category => (
                      <label key={category} className="category-item">
                        <input
                          type="checkbox"
                          checked={registerForm.categories.includes(category)}
                          onChange={() => toggleCategory(category)}
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>

                <select
                  value={registerForm.delivery_method}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, delivery_method: e.target.value }))}
                >
                  <option value="telegram">Telegram</option>
                  <option value="email">Email</option>
                  <option value="both">Both</option>
                </select>

                <button type="submit" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
            </div>
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📰 News93</h1>
          <p>Welcome back, {user?.username || user?.email}!</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </header>

        <div className="dashboard">
          <div className="user-info">
            <h2>Your Profile</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>Email:</strong> {user?.email}
              </div>
              <div className="info-item">
                <strong>Telegram ID:</strong> {user?.telegram_id || 'Not set'}
              </div>
              <div className="info-item">
                <strong>Delivery Method:</strong> {user?.delivery_method}
              </div>
              <div className="info-item">
                <strong>Preferred Time:</strong> {user?.preferred_time_of_day || '09:00'}
              </div>
              <div className="info-item">
                <strong>Categories:</strong> {user?.category?.join(', ') || 'None selected'}
              </div>
            </div>
      </div>

          <div className="actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button 
                onClick={handleInstantNews} 
                className="instant-news-btn"
                disabled={loading || !user?.telegram_id}
              >
                {loading ? 'Sending...' : '📰 Get Instant News'}
        </button>
              
              {!user?.telegram_id && (
                <p className="warning">
                  ⚠️ Add your Telegram ID to receive instant news
                </p>
              )}
            </div>
          </div>

          <div className="features">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>📰 Instant News</h3>
                <p>Get the latest news from your selected categories instantly via Telegram</p>
              </div>
              <div className="feature-card">
                <h3>⏰ Scheduled Delivery</h3>
                <p>Receive daily news digest at your preferred time</p>
              </div>
              <div className="feature-card">
                <h3>🔔 Multiple Channels</h3>
                <p>Choose between Telegram, Email, or both delivery methods</p>
              </div>
              <div className="feature-card">
                <h3>📂 Personalized Categories</h3>
                <p>Select from business, technology, sports, and more</p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
      </div>
  )
}

export default App
