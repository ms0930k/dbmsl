# News93 - Your Personalized News Service

## 🚀 Complete Rebranding from NewsPulse to News93

News93 is your comprehensive personalized news delivery service that brings you the latest news from your favorite categories directly to your Telegram or email.

## ✨ Features

### 📰 **Instant News Access**
- **Telegram Commands**: Use `/news` to get instant news
- **Website Interface**: Click "Get Instant News" button
- **API Access**: Programmatic instant news delivery
- **Personalized**: Based on your selected categories

### ⏰ **Scheduled Delivery**
- **Daily Digest**: Receive news at your preferred time
- **Multiple Channels**: Telegram, Email, or Both
- **Smart Scheduling**: Automatic timezone handling
- **Reliable Delivery**: Robust scheduling system

### 🔔 **Multiple Delivery Methods**
- **Telegram Bot**: Interactive bot with commands and buttons
- **Email**: Formatted HTML email digests
- **Both**: Dual delivery for maximum coverage

### 📂 **Customizable Categories**
- Business, Entertainment, General, Health
- Science, Sports, Technology
- Easy category selection and management

## 🛠️ Technical Stack

### **Backend**
- **Node.js** with TypeScript
- **Express.js** REST API
- **MongoDB** with Mongoose
- **Telegram Bot API** integration
- **News API** for content
- **Cron Jobs** for scheduling
- **Email Service** with Nodemailer

### **Frontend**
- **React 19** with TypeScript
- **Vite** build tool
- **Axios** for API calls
- **Modern CSS** with responsive design
- **Local Storage** for session management

## 🚀 Quick Start

### **1. Backend Setup**
```bash
cd backend
npm install
npm run build
npm start
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### **3. Environment Configuration**
Create `backend/.env` with:
```
TELEGRAM_BOT_TOKEN=your_bot_token
MONGO_URI=your_mongodb_connection
NEWS_API_KEY=your_news_api_key
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## 📱 Usage

### **Telegram Bot Commands**
- `/start` - Register or manage account
- `/news` - Get instant news
- `/help` - Show available commands

### **Website Access**
1. Open `http://localhost:5173`
2. Register or login
3. Click "📰 Get Instant News" button
4. Check your Telegram for delivery

### **API Endpoints**
- `POST /api/telegram/instant-news` - Send instant news
- `GET /api/users` - Get user data
- `POST /api/users` - Register user

## 🎯 Key Benefits

1. **Instant Access**: Get news immediately when you want it
2. **Personalized**: Tailored to your interests and preferences
3. **Multiple Channels**: Choose your preferred delivery method
4. **Reliable**: Robust scheduling and error handling
5. **User-Friendly**: Both command-line and web interfaces
6. **Modern Design**: Beautiful, responsive website interface

## 🔧 Architecture

### **Backend Services**
- **Telegram Service**: Bot management and message sending
- **News Service**: Content fetching and scheduling
- **Scheduler Service**: Cron job management
- **Email Service**: SMTP email delivery
- **User Service**: User management and preferences

### **Database Models**
- **User**: Account information and preferences
- **NewsSummary**: Cached news articles
- **NewsScheduler**: Delivery scheduling

### **Frontend Components**
- **Authentication**: Login/Register forms
- **Dashboard**: User profile and quick actions
- **Instant News**: One-click news delivery
- **Settings**: Category and preference management

## 📊 Project Structure

```
News93/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── dist/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## 🎨 Design Philosophy

News93 follows a modern, user-centric design approach:
- **Simplicity**: Easy to use interfaces
- **Reliability**: Robust error handling
- **Performance**: Fast loading and response times
- **Accessibility**: Works on all devices
- **Scalability**: Built for growth

## 🔮 Future Enhancements

- **Push Notifications**: Mobile app notifications
- **AI Summarization**: Enhanced news summaries
- **Social Features**: Share and discuss news
- **Analytics**: Reading habits and preferences
- **Multi-language**: Support for multiple languages

## 📞 Support

For support and questions:
1. Check the documentation
2. Review error logs
3. Test API endpoints
4. Verify configuration

---

**News93 - Your personalized news experience! 📰✨**
