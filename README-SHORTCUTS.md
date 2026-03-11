# Location Tracker - Quick Start Guide

## 🚀 ONE-CLICK SOLUTION

### For User Panel (Signup/Login/Location Tracking):
**Just Double-Click:** `run-user-panel.bat`

### For Master Panel (Approve Users/View Map):
**Just Double-Click:** `run-master-panel.bat`

---

## ✨ What Happens Automatically:

When you run these scripts, they will:

1. ✅ Stop all old processes (backend/metro)
2. ✅ Update App.tsx to correct panel mode
3. ✅ Clear app cache completely
4. ✅ **Open Backend Server window** (keep it open!)
5. ✅ **Open Metro Bundler window** (keep it open!)
6. ✅ Wait for Metro to be ready (15 seconds)
7. ✅ Build and install app on emulator
8. ✅ Launch the app

**TWO NEW WINDOWS will open - DON'T CLOSE THEM!**
- Backend Server window
- Metro Bundler window

---

## 📱 What You'll See:

### User Panel Flow:
1. App opens → Login screen
2. Click "Sign up" → Enter name, email, password
3. After signup → Login with Email + OTP (get from Master)
4. After login → Track location with Start/Stop button

### Master Panel Flow:
1. App opens → Master Login screen
2. Login with:
   - Email: `master@office.com`
   - Password: `master123`
3. Dashboard → View stats
4. "Pending Requests" → See signups with OTP, Approve/Reject
5. "All Users" → See approved users and tracking status
6. "Map" → See live locations

---

## ⚠️ IMPORTANT RULES:

1. **Use ONLY ONE script at a time**
   - ❌ DON'T run both `run-user-panel.bat` and `run-master-panel.bat` together
   - ❌ DON'T use old `start-backend.bat` or `start-app.bat` files
   - ✅ Use ONLY the new `run-user-panel.bat` OR `run-master-panel.bat`

2. **Keep the windows open**
   - Backend Server window must stay open
   - Metro Bundler window must stay open
   - Close them only when done using the app

3. **If you see white screen:**
   - Wait 10-15 seconds for bundle to load
   - OR double-tap "R" key on emulator to reload
   - OR close everything and run the script again

---

## 🔧 Other Helper Scripts:

### Check System Status:
```
Double-click: check-status.bat
```
Shows: Backend status, Metro status, Emulator connection, Database size, Current panel mode

### Reset Database (DELETES ALL DATA!):
```
Double-click: reset-database.bat
```
**WARNING:** This deletes all users and locations!
Only use if database schema changes or corruption.

---

## 🐛 Common Issues & Solutions:

### Issue: White Screen
**Solution:**
- Wait 15 seconds for first load
- Double-tap R key in emulator to reload
- If still white, close all windows and run script again

### Issue: "Cannot connect to development server"
**Solution:**
- Make sure emulator is running BEFORE launching script
- Check that Metro Bundler window is open and showing "Ready"

### Issue: Multiple windows already open
**Solution:**
- The script will automatically close old processes
- Just run the script again

### Issue: App crashes immediately
**Solution:**
- Run the script again (it clears cache automatically)
- Check that Android emulator has enough RAM

---

## 💾 Database Safety:

Your data is now **SAFE**! Database is preserved across restarts.

**Location:** `backend/instance/location_tracker.db`

**To backup manually:**
```powershell
Copy-Item backend\instance\location_tracker.db backend\instance\backup.db
```

**To restore:**
```powershell
Copy-Item backend\instance\backup.db backend\instance\location_tracker.db -Force
```

---

## 🎯 Quick Test Workflow:

### Testing Complete Flow:

1. **Run Master Panel:**
   ```
   Double-click: run-master-panel.bat
   Wait for app to open → Login → Keep it running
   ```

2. **Run User Panel (in another test):**
   ```
   Double-click: run-user-panel.bat
   Wait for app → Signup → Note that you need approval
   ```

3. **Back to Master:**
   ```
   Run master panel script again
   Dashboard → Pending Requests → See OTP → Approve
   ```

4. **Back to User:**
   ```
   Run user panel script again
   Login with Email + OTP from master → Start tracking
   ```

---

## 📞 Need Help?

If something doesn't work:
1. Close ALL command windows (Backend, Metro, Script)
2. Close Android emulator
3. Restart emulator
4. Run the appropriate script again

The scripts are designed to be **foolproof** - just double-click and wait!
