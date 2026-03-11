# Location Tracker Application - Complete Setup Guide

Office ke liye location tracking application jo team members ko track karta hai.

## 🎯 Features

### User App
- ✅ Email aur password se signup
- ✅ Login system with master approval
- ✅ Start/Stop location tracking button
- ✅ Simple and clean UI
- ✅ Master Login button REMOVED (user app mein nahi dikhega)

### Master App (Separate APK - Future)
- Master login panel
- User approval system
- Real-time location tracking
- User management

## 📁 Project Structure

```
LocationTracker/
├── backend/                 # Python Flask backend
│   ├── app.py              # Main backend server
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend instructions
├── src/
│   ├── screens/            # React Native screens
│   │   ├── LoginScreen.tsx           # Email/Password login (No OTP, No Master button)
│   │   ├── SignUpScreen.tsx          # Email/Password signup only
│   │   ├── LocationTrackingScreen.tsx # Start/Stop tracking
│   │   └── MasterLoginScreen.tsx     # For future Master app
│   └── config/
│       └── api.ts          # API configuration
├── android/                # Android native code
└── ios/                    # iOS native code
```

## 🚀 Setup Instructions

### 1️⃣ Backend Setup (Python)

Backend alag folder mein hai aur easily run kar sakte ho.

```bash
# Backend folder mein jao
cd backend

# Python dependencies install karo
pip install -r requirements.txt

# Server start karo
python app.py
```

✅ Server `http://localhost:5000` par run karega.

**Default Master Credentials:**
- Email: `master@office.com`
- Password: `master123`

**Important:** Backend ko chalte rehna chahiye jab app use kar rahe ho!

### 2️⃣ React Native App Setup

```bash
# Project root folder mein jao (agar backend folder mein ho toh)
cd ..

# Dependencies install karo (already installed hai)
npm install

# Android app run karo (emulator ya device connected hona chahiye)
npm run android
```

### 3️⃣ API Configuration

**For Emulator (Default):**
App already configured hai emulator ke liye. Kuch change karne ki zarurat nahi.

**For Real Device:**
Agar real device par test kar rahe ho, toh `src/config/api.ts` file mein change karo:

```typescript
// Emulator ke liye (default)
export const API_BASE_URL = 'http://10.0.2.2:5000/api';

// Real device ke liye - apna computer ka local IP use karo
export const API_BASE_URL = 'http://192.168.1.x:5000/api';
```

**Apna IP Address kaise pata kare:**
```bash
# Windows mein
ipconfig

# "IPv4 Address" dekho (e.g., 192.168.1.100)
```

## 📱 How to Use - User App

### Step 1: Signup
1. App open karo
2. "Sign up" link par click karo
3. **Sirf 2 fields:**
   - Email enter karo
   - Password enter karo
4. "Sign Up" button press karo
5. Message aayega: "Wait for master approval"

### Step 2: Master Approval
1. Backend console mein master credentials use karke user approve karna hoga
2. Ya future mein Master App se approve karenge

### Step 3: Login
1. Email aur password enter karo
2. "Sign In" button press karo
3. Successful login ke baad Location Tracking screen open hoga

### Step 4: Start Location Tracking
1. Login ke baad **sirf ek button** dikhega: **"▶ Start Tracking"**
2. Button press karo
3. Location tracking start ho jayega
4. Current location dikhai dega

### Step 5: Stop Location Tracking
1. Jab tracking start hai toh button change ho jayega: **"⏹ Stop Tracking"**
2. Press karne par tracking band ho jayegi

## 🔐 Authentication Flow

```
User Signup → Wait for Master Approval → Login → Location Tracking Screen
                                                        ↓
                                          Start Tracking / Stop Tracking
```

## 🌐 API Endpoints

### User APIs
```
POST /api/signup                    - New user signup
POST /api/login                     - User login
POST /api/location/start            - Start tracking
POST /api/location/update           - Update location
POST /api/location/stop             - Stop tracking
```

### Master APIs
```
POST /api/master/login              - Master login
GET /api/master/users               - Get all users
POST /api/master/approve/:id        - Approve user
GET /api/master/user/:id/locations  - Get user location history
```

## 🗄️ Database

SQLite database automatically create ho jaata hai `backend/location_tracker.db` naam se.

### Tables
1. **User**
   - id, email, password (hashed), is_master, approved, created_at
   
2. **Location**
   - id, user_id, latitude, longitude, timestamp, is_tracking

## 📱 Building Separate APKs

### Current App = User App ✅
- Master Login button REMOVED
- Sirf email/password signup
- Sirf email/password login
- Simple start/stop tracking

### Master App (Future Enhancement)
Master ka separate app banane ke liye:
1. Naya React Native project create karo
2. MasterLoginScreen add karo
3. Dashboard banao with:
   - Pending users list
   - User approval buttons
   - Active users with location
   - Location history on map

## ⚙️ Android Permissions

Already configured hai `AndroidManifest.xml` mein:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

## 🐛 Troubleshooting

### ❌ Backend connection error
**Problem:** "Error connecting to server"

**Solution:**
1. Check backend is running: `http://localhost:5000/api/test` browser mein open karo
2. Response milna chahiye: `{"message": "Backend is running!"}`
3. Agar nahi chal raha toh: `cd backend` → `python app.py`

### ❌ App emulator par nahi chal raha
**Solution:**
```bash
# Clean build karo
cd android
.\gradlew clean
cd ..

# Phir run karo
npm run android
```

### ❌ Location permission denied
**Solution:**
1. Android Settings open karo
2. Apps → LocationTracker → Permissions → Location
3. "Allow all the time" ya "Allow only while using the app" select karo

### ❌ Cannot connect to backend from real device
**Solution:**
1. Backend aur device same WiFi par hona chahiye
2. Computer ka firewall check karo (port 5000 allow hai?)
3. `src/config/api.ts` mein sahi IP address use karo

## 🛠️ Tech Stack

- **Frontend:** React Native 0.84.0, TypeScript
- **Backend:** Python 3.x, Flask 3.0.0
- **Database:** SQLite
- **Authentication:** JWT (JSON Web Tokens)
- **Password:** Hashed with Werkzeug
- **Location:** React Native Geolocation (future)

## 📝 Important Notes

### Security
- ⚠️ `SECRET_KEY` production mein change karo (`backend/app.py`)
- ⚠️ HTTPS use karo production mein
- ⚠️ Default master password change karo

### Master Login Button Removed
- User app mein "Master Login" button ab **nahi dikhega**
- Master panel alag APK mein banega
- Current app mein `MasterLoginScreen` navigation se accessible nahi hai users ke liye

### Location Tracking
- Abhi dummy location use ho raha hai (28.6139, 77.2090 - Delhi)
- Real location tracking implement karne ke liye:
  - `@react-native-community/geolocation` package install karo
  - `LocationTrackingScreen.tsx` mein Geolocation.getCurrentPosition() use karo

## 🔄 Next Steps / Future Enhancements

1. ✅ Backend ready with authentication
2. ✅ User signup (email + password only)
3. ✅ User login (email + password only)
4. ✅ Location tracking start/stop
5. ✅ Master login button removed from user app
6. ⏳ Real device GPS location integration
7. ⏳ Background location tracking
8. ⏳ Master App (separate APK)
9. ⏳ Real-time location updates (WebSocket)
10. ⏳ Map view with user locations
11. ⏳ Geofencing (office area detection)
12. ⏳ Attendance marking
13. ⏳ Push notifications

## 🧪 Testing Flow

### Test User Signup & Login
1. Backend start karo: `python backend/app.py`
2. App run karo: `npm run android`
3. Signup screen mein: `test@gmail.com` / `password123`
4. Backend console mein user ID milega
5. Master login se user approve karo (ya directly database mein `approved=1` set karo)
6. Login karo same credentials se
7. Location Tracking screen khulega
8. "Start Tracking" button press karo

### Test Master
1. Browser mein: `http://localhost:5000/api/test` (check backend running)
2. Postman ya app se master login:
   - Email: `master@office.com`
   - Password: `master123`
3. Token milega
4. Users list dekho: GET `/api/master/users` with token

## 📞 Support

Koi problem ho toh:
1. Backend logs check karo (console)
2. React Native logs check karo (`npm run android` wale terminal mein)
3. Android Logcat dekho: `adb logcat`

## ✨ What's Different from Original Request

✅ **Implemented:**
- Email + Password signup (no phone, no name)
- Email + Password login (no OTP)
- Master Login button REMOVED from user app
- Python backend with Flask
- SQLite database
- JWT authentication
- Location tracking API ready
- Start/Stop button for tracking
- User approval system by master

🎯 **Ready for Production with:**
- Change SECRET_KEY
- Change master password
- Add HTTPS
- Real GPS integration
- Background tracking service
- Master App development

---

**Happy Tracking! 📍**
