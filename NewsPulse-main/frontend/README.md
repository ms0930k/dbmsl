# News93 Frontend

The frontend interface for News93 - Your Personalized News Service.

## 🚀 Features

- **Modern React 19** with TypeScript
- **Responsive Design** for all devices
- **User Authentication** with session management
- **Instant News Access** via web interface
- **Profile Management** for user preferences
- **Real-time API Integration** with backend

## 🛠️ Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **Modern CSS** - Responsive design with gradients

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Opens the development server at `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

Creates production build in `dist/` folder

## 🎨 Design Features

- **Gradient Backgrounds** - Beautiful visual appeal
- **Card-based Layout** - Clean, organized interface
- **Responsive Grid** - Works on all screen sizes
- **Smooth Animations** - Enhanced user experience
- **Modern Typography** - Professional appearance

## 🔧 API Integration

The frontend integrates with the News93 backend API:

- `GET /api/users` - User authentication
- `POST /api/users` - User registration
- `POST /api/telegram/instant-news` - Send instant news

## 📱 User Interface

### **Authentication**
- Login form with email/password
- Registration with full profile setup
- Session persistence with localStorage

### **Dashboard**
- User profile overview
- Quick action buttons
- Settings display
- Feature information cards

### **Instant News**
- One-click news delivery
- Loading states and feedback
- Error handling and messages
- Success confirmations

## 🎯 Key Components

- **App.tsx** - Main application component
- **App.css** - Comprehensive styling
- **Authentication** - Login/Register forms
- **Dashboard** - User interface
- **API Service** - Backend communication

## 🔒 Security

- **Input Validation** - Form validation and sanitization
- **Session Management** - Secure user sessions
- **Error Handling** - Graceful error management
- **Type Safety** - TypeScript for type checking

## 📊 Performance

- **Fast Loading** - Optimized bundle size
- **Lazy Loading** - Efficient resource usage
- **Caching** - Local storage for sessions
- **Responsive** - Mobile-first design

## 🚀 Deployment

The frontend can be deployed to any static hosting service:

- **Vercel** - Recommended for React apps
- **Netlify** - Easy deployment
- **GitHub Pages** - Free hosting
- **AWS S3** - Scalable hosting

## 🔧 Configuration

Update the API base URL in `App.tsx`:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

Change this to your production backend URL when deploying.

## 📞 Support

For issues and questions:
1. Check the browser console for errors
2. Verify API connectivity
3. Review the backend logs
4. Test individual components

---

**News93 Frontend - Modern, responsive, and user-friendly! 🚀**