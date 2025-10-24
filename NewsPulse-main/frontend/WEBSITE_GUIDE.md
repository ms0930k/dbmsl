# News93 Website - Instant News Access

## 🚀 How to Access Instant News from Website

### Prerequisites
1. **Backend Server Running**: Make sure the backend is running on port 5000
2. **Frontend Server Running**: Make sure the frontend is running on port 5173 (default Vite port)

### Step-by-Step Guide

#### 1. **Start the Backend Server**
```bash
cd backend
npm start
```
The backend should be running on `http://localhost:5000`

#### 2. **Start the Frontend Server**
```bash
cd frontend
npm run dev
```
The frontend should be running on `http://localhost:5173`

#### 3. **Access the Website**
Open your browser and go to: **http://localhost:5173**

### 🎯 Using the Instant News Feature

#### **For New Users:**
1. **Register**: Fill out the registration form with:
   - Email and password
   - Telegram ID (optional but recommended for instant news)
   - Preferred delivery time
   - Select news categories (business, technology, sports, etc.)
   - Choose delivery method (Telegram, Email, or Both)

2. **Login**: Use your email and password to log in

#### **For Existing Users:**
1. **Login**: Use your existing email and password
2. **Get Instant News**: Click the "📰 Get Instant News" button
3. **Check Telegram**: News will be sent to your Telegram account

### 🔧 Features Available on Website

#### **User Dashboard:**
- View your profile information
- See your selected categories
- Check your delivery preferences
- Access instant news button

#### **Instant News Button:**
- **One-Click Access**: Click "📰 Get Instant News" to get latest news
- **Real-time Delivery**: News sent immediately to your Telegram
- **Personalized**: Uses your configured categories
- **Status Feedback**: Shows success/error messages

#### **Profile Management:**
- View all your settings
- See your Telegram ID
- Check delivery method and time preferences
- View selected news categories

### 📱 Integration with Telegram

The website integrates seamlessly with your Telegram bot:

1. **Registration**: Add your Telegram ID during registration
2. **Instant News**: Click the button to get news instantly
3. **Scheduled News**: Continue receiving daily scheduled news
4. **Bot Commands**: Still use `/news`, `/start`, `/help` commands

### 🛠️ API Endpoints Used

The website uses these backend APIs:
- `GET /api/users` - Fetch user data for login
- `POST /api/users` - Register new user
- `POST /api/telegram/instant-news` - Send instant news

### 🎨 Website Features

#### **Modern Design:**
- Responsive design for mobile and desktop
- Beautiful gradient backgrounds
- Smooth animations and transitions
- User-friendly interface

#### **Authentication:**
- Secure login/logout
- Session persistence
- Form validation
- Error handling

#### **User Experience:**
- Loading states
- Success/error messages
- Intuitive navigation
- Quick actions

### 🔍 Troubleshooting

#### **If Instant News Button is Disabled:**
- Make sure you have a Telegram ID set in your profile
- Check that you have selected news categories
- Verify your Telegram bot is working

#### **If Login Fails:**
- Check that the backend server is running
- Verify your email and password
- Make sure the API connection is working

#### **If News Doesn't Arrive:**
- Check your Telegram ID is correct
- Verify the Telegram bot is running
- Check your internet connection

### 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify both servers are running
3. Test the Telegram bot directly
4. Check the backend logs for errors

---

**Enjoy your personalized news experience with News93! 📰✨**
