# 🚀 Location Tracker - Ek Hi Click Mein Chalao!

## ✨ SABSE AASAN TARIKA

### User Panel Ke Liye (Employees):
```
Double-click karo: START-USER.bat
```

### Master Panel Ke Liye (Admin/Manager):
```
Double-click karo: START-MASTER.bat
```

---

## 🎯 KYA HOGA:

Jab tum script chalao ge, ye sab automatically hoga:

1. ✅ Purane processes band ho jayenge
2. ✅ App cache clear hoga
3. ✅ Backend Server khulegi (WINDOW OPEN HOGI - band mat karna!)
4. ✅ Metro Bundler khulegi (WINDOW OPEN HOGI - band mat karna!)
5. ✅ 25 seconds wait karega (Metro ready hone ke liye)
6. ✅ App build hoga
7. ✅ Emulator pe app install hoga
8. ✅ App automatically launch hoga

**DO NAYE WINDOWS khulenge - UN par DON'T CLOSE likha hoga!**

---

## ⚠️ IMPORTANT - DHYAN SE PADHO:

### Rule #1: EK HI SCRIPT CHALAO
- ❌ User aur Master dono saath mein mat chalao
- ❌ Purane `start-backend.bat` ya `start-app.bat` mat use karo
- ✅ Sirf `START-USER.bat` YA `START-MASTER.bat` use karo

### Rule #2: WINDOWS KHULE RAKHO
- Backend Server window
- Metro Bundler window  
- Dono band mat karo jab tak app use kar rahe ho

### Rule #3: WHITE SCREEN DIKHE TO:
- 10-15 seconds wait karo
- YA emulator mein "R" key do baar press karo
- YA `reload-app.bat` double-click karo
- YA script dobara chalao

---

## 📱 KYA DIKHEGA:

### User Panel:
1. Login screen → "Sign up" button
2. Signup karo → Name, Email, Password daalo
3. Master se OTP maango
4. Email + OTP se login karo
5. "Start Tracking" button press karo

### Master Panel:
1. Master Login → Credentials:
   - Email: `master@office.com`
   - Password: `master123`
2. Dashboard → Stats dekho
3. "Pending Requests" → OTP dekho → Approve/Reject karo
4. "All Users" → Tracking users dekho
5. "Map" → Live locations dekho

---

## 🐛 PROBLEM HO TO:

### White Screen Nahi Ja Raha:
```
1. Backend aur Metro windows check karo - chal rahe hain?
2. reload-app.bat chalao
3. Ya sab windows band karo aur script dobara chalao
```

### "Cannot connect to server" Error:
```
1. Emulator pehle se chalu hona chahiye
2. Metro Bundler window mein "Ready" dikhna chahiye
3. Agar nahi dikhra toh sab band karo aur script dobara chalao
```

### Bohot Saari Windows Khul Gayi Hain:
```
Script automatically sabko band kar deti hai
Just dobara script chalao
```

---

## 💡 TESTING KAISE KARE:

### Poora Flow Test:

1. **Pehle Master Panel:**
   ```
   START-MASTER.bat double-click karo
   Wait karo 30-40 seconds
   Master login karo
   Dashboard dekho
   ```

2. **User Panel (Doosra Test):**
   ```
   Sab windows band karo
   START-USER.bat double-click karo
   Wait karo 30-40 seconds
   Signup karo
   "Not approved" error aayega (ye theek hai!)
   ```

3. **Wapas Master Panel:**
   ```
   Sab windows band karo
   START-MASTER.bat double-click karo
   "Pending Requests" pe jao
   OTP dekho, Approve karo
   ```

4. **Wapas User Panel:**
   ```
   Sab windows band karo
   START-USER.bat double-click karo
   Email + OTP se login karo (jo master ne approve kiya)
   Start Tracking button press karo
   ```

---

## 📁 IMPORTANT FILES:

- `START-USER.bat` ← **YE USE KARO (User panel ke liye)**
- `START-MASTER.bat` ← **YE USE KARO (Master panel ke liye)**
- `reload-app.bat` ← White screen fix karne ke liye
- `check-status.bat` ← Status check karne ke liye
- `reset-database.bat` ← Database reset (DATA DELETE HOGA!)

---

## ❓ HELP CHAHIYE?

Kuch kaam nahi kar raha:

1. Sabse pehle EMULATOR check karo - chal raha hai?
2. Sab command windows band karo
3. Emulator restart karo
4. Phir appropriate script dobara chalao

Scripts **foolproof** hain - bas double-click karo aur wait karo!

---

## 🎓 TIPS:

- Script chala ke 30-40 seconds patience rakho
- "DO NOT CLOSE" windows ko band mat karo
- White screen normal hai initially - wait karo ya R press karo
- Ek baar properly load ho jaye, fir smooth chalega

**BAKI SAB AUTOMATIC HAI! 😊**
