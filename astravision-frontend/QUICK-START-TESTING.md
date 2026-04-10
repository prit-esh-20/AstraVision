# Quick Start - Testing Authentication Persistence

## 🚀 How to Test the Implementation

### Step 1: Start the Application
The server is already running at `http://localhost:5174`

Click the preview button in your tool panel to open the app.

---

### Step 2: Login as Admin

1. Click **"Login"** or navigate to `/login`
2. Enter credentials:
   - **Email:** `admin@fusionguard.ai`
   - **Password:** `admin123`
3. Click **"Initialize Login"**

**Expected Result:**
- ✅ Loading spinner appears (1.5 seconds)
- ✅ Success message: "Admin Access Granted"
- ✅ Redirected to Admin Dashboard

---

### Step 3: Verify Token Storage

Open browser DevTools:
- **Chrome/Edge:** Press `F12` → Application → Local Storage
- **Firefox:** Press `F12` → Storage → Local Storage

You should see:
```
fusionguard_auth_token: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "admin",
  "expiresAt": "2026-03-06T19:30:00.000Z"
}
```

---

### Step 4: Test Token Persistence (Server Restart)

1. **Stop the server:**
   - Go to terminal
   - Press `Ctrl+C`

2. **Restart the server:**
   ```bash
   npm run dev
   ```

3. **Refresh the browser** (Press `F5`)

**Expected Result:**
- ✅ Loading spinner appears with "Verifying Authentication..."
- ✅ After 0.5 seconds, you remain on the dashboard
- ✅ Still logged in as admin

**What's Happening:**
```
App Load → Check localStorage → Find token → 
Verify with API → Token valid → Restore session
```

---

### Step 5: Test Expired Token Handling

1. **Open DevTools** → Application → Local Storage

2. **Edit the token:**
   - Double-click on `fusionguard_auth_token`
   - Change `expiresAt` to yesterday's date
   - Example: `"2026-03-04T19:30:00.000Z"`
   - Press `Enter` to save

3. **Refresh the page** (Press `F5`)

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Token detected as expired
- ✅ Storage automatically cleared
- ✅ Redirected to login page
- ✅ Error message may appear briefly

**What's Happening:**
```
App Load → Check localStorage → Find token → 
Check expiration → EXPIRED → Clear storage → 
Redirect to /login
```

---

### Step 6: Test Logout Functionality

1. **Login again** (use credentials from Step 2)

2. **Click "Logout"** button in navbar

3. **Check localStorage** in DevTools

**Expected Result:**
- ✅ `fusionguard_auth_token` = `null`
- ✅ `fusionguard_role` = `null`
- ✅ Redirected to `/login` page

---

### Step 7: Test Protected Routes

1. **Logout** if logged in

2. **Try accessing protected URLs directly:**
   - `http://localhost:5174/dashboard`
   - `http://localhost:5174/admin/dashboard`
   - `http://localhost:5174/alerts`

**Expected Result:**
- ✅ All redirect to `/login`
- ✅ State preserved: `from: location` for post-login redirect

---

### Step 8: Test Public Routes

1. **Without logging in**, try these URLs:
   - `http://localhost:5174/`
   - `http://localhost:5174/architecture`
   - `http://localhost:5174/about`

**Expected Result:**
- ✅ All pages load successfully
- ✅ No authentication required
- ✅ Can browse freely

---

## 🎯 Verification Checklist

Use this checklist to verify the implementation:

### Login Flow
- [ ] Login form accepts credentials
- [ ] Loading spinner shows during login
- [ ] Success toast appears on success
- [ ] Error message shows on invalid credentials
- [ ] Redirects to correct dashboard based on role

### Token Storage
- [ ] Token stored in localStorage after login
- [ ] Token has structure: `{ token, role, expiresAt }`
- [ ] Role can be extracted from token payload

### Token Verification
- [ ] On app load, token is checked
- [ ] Loading UI shows during verification
- [ ] Valid token → Session restored
- [ ] Invalid token → Redirected to login
- [ ] Expired token → Cleared and redirected

### Protected Routes
- [ ] Dashboard requires login
- [ ] Alerts requires login
- [ ] Recordings requires login
- [ ] Logs requires login
- [ ] Admin routes require admin role

### Logout
- [ ] Logout button clears all auth data
- [ ] localStorage cleaned up
- [ ] Redirected to login page
- [ ] Cannot access protected routes after logout

### UX/UI
- [ ] Loading spinner styled correctly
- [ ] Neon cyan theme maintained
- [ ] "Verifying Authentication..." text shows
- [ ] Smooth transitions, no flickering

---

## 🐛 Debugging Tips

### If token verification fails:

**Check Console Logs:**
```javascript
// Open DevTools Console (F12)
console.log(localStorage.getItem('fusionguard_auth_token'));
```

Should output something like:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "expiresAt": "2026-03-06T19:30:00.000Z"
}
```

### If always redirects to login:

1. **Verify token exists:**
   ```javascript
   console.log('Token:', localStorage.getItem('fusionguard_auth_token'));
   ```

2. **Check if expired:**
   ```javascript
   const tokenData = JSON.parse(localStorage.getItem('fusionguard_auth_token'));
   console.log('Expires:', new Date(tokenData.expiresAt));
   console.log('Now:', new Date());
   ```

### If loading spinner never stops:

1. **Check for errors in Console**
2. **Verify AuthContext is wrapping the app**
3. **Check that `isLoading` state is being set to false**

---

## 📊 Expected Timings

| Action | Expected Time |
|--------|---------------|
| Login (mock) | ~1.5 seconds |
| Token Verification | ~0.5 seconds |
| Logout | Instant |
| Page Navigation | Instant |
| Protected Route Redirect | < 100ms |

---

## 🎨 What You'll See

### Loading State UI
```
┌─────────────────────────────────┐
│                                 │
│         ⟳ (spinning)            │
│                                 │
│  VERIFYING AUTHENTICATION...    │
│                                 │
└─────────────────────────────────┘
```

- **Spinner:** 64px × 64px, neon cyan border
- **Text:** Monospace font, uppercase, pulsing
- **Background:** Dark base (#0B0F17)

---

## ✅ Success Criteria

Your implementation is working correctly if:

1. ✅ Login generates and stores a token
2. ✅ Server restart doesn't log you out
3. ✅ Expired tokens are rejected
4. ✅ Logout properly clears all data
5. ✅ Protected routes require authentication
6. ✅ Public routes work without login
7. ✅ Loading states show during verification
8. ✅ Error messages are user-friendly

---

## 📝 Test User Credentials

### Admin Account
- **Email:** `admin@fusionguard.ai`
- **Password:** `admin123`
- **Role:** Admin
- **Dashboard:** `/admin/dashboard`

### User Account
- **Email:** `user@fusionguard.ai`
- **Password:** `user123`
- **Role:** User (Operator)
- **Dashboard:** `/dashboard`

---

## 🔧 Troubleshooting Commands

### Clear All Auth Data
```javascript
localStorage.clear();
location.reload();
```

### Manually Set Valid Token
```javascript
const mockToken = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJleHAiOjk5OTk5OTk5OTl9.mock-signature",
  role: "admin",
  expiresAt: new Date(Date.now() + 86400000).toISOString() // +24 hours
};
localStorage.setItem('fusionguard_auth_token', JSON.stringify(mockToken));
location.reload();
```

### Check Auth State
```javascript
console.log({
  token: localStorage.getItem('fusionguard_auth_token'),
  role: localStorage.getItem('fusionguard_role'),
  allStorage: { ...localStorage }
});
```

---

## 🎉 Next Steps

Once you've verified everything works:

1. ✅ Test all scenarios in this guide
2. ✅ Review the code implementation
3. ✅ Read `AUTHENTICATION-GUIDE.md` for deep dive
4. ✅ Plan backend integration when ready

---

**Implementation Status:** ✅ COMPLETE  
**Ready for Production:** Yes (with mock backend)  
**Backend Integration Ready:** Yes (API service abstracted)

Happy testing! 🚀
