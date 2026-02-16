# Production Debug Checklist

## ✅ What to Check in Vercel

### 1. Verify Environment Variables are Set

Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

**Required variables for Production:**

```
NEXTAUTH_URL = https://your-actual-domain.vercel.app
NEXTAUTH_SECRET = efgh
JWT_SECRET = abcd
DATABASE_URL = postgresql://...
UPLOADTHING_TOKEN = eyJhcGlLZXkiOi...
```

**Common Mistakes:**
- ❌ `NEXTAUTH_URL = http://localhost:3000` (wrong!)
- ❌ `NEXTAUTH_URL = your-actual-domain.vercel.app` (missing https://)
- ❌ Environment variable set to "Preview" only, not "Production"
- ❌ Variable name has typo (e.g., `NEXT_AUTH_URL` instead of `NEXTAUTH_URL`)

### 2. Check Which Domain You're Using

Your `NEXTAUTH_URL` must **exactly match** the domain you're visiting:

- If visiting `https://tarah.vercel.app` → `NEXTAUTH_URL=https://tarah.vercel.app`
- If visiting `https://www.yoursite.com` → `NEXTAUTH_URL=https://www.yoursite.com`
- If visiting `https://yoursite.com` → `NEXTAUTH_URL=https://yoursite.com`

### 3. Redeploy After Setting Variables

After adding/changing environment variables:
1. Go to **Deployments** tab
2. Click ⋯ (three dots) on latest deployment
3. Click **Redeploy**
4. Check "Use existing Build Cache" is **unchecked**
5. Click **Redeploy**

## 🔍 How to Debug

### Method 1: Check Vercel Logs

1. Go to your deployment in Vercel
2. Click on the deployment
3. Go to **Runtime Logs** tab
4. Look for these log entries:
   ```
   JWT Token: { ... role: 'CUSTOMER' ... }
   ```
   If you see the token logs, NextAuth is working

### Method 2: Check Browser Console

1. Open your production site
2. Sign in
3. Open DevTools (F12) → **Console**
4. Look for errors like:
   - "CSRF token mismatch"
   - "No session found"
   - Any red errors related to auth

### Method 3: Check Cookies

1. Open DevTools (F12) → **Application** tab → **Cookies**
2. Look for `next-auth.session-token`
3. Check:
   - ✅ Cookie exists after login
   - ✅ Has `Secure` flag (should be checked in production)
   - ✅ Has `HttpOnly` flag
   - ✅ `SameSite` = Lax
   - ✅ Domain matches your site

## 🚨 Most Common Issue: NEXTAUTH_URL Not Set

If the profile redirects to sign-in, 99% of the time it's because:

**`NEXTAUTH_URL` is missing or incorrect in Vercel**

### Quick Fix:

1. Go to Vercel → Settings → Environment Variables
2. Find `NEXTAUTH_URL`
3. Click **Edit**
4. Make sure the value is: `https://your-actual-domain.vercel.app`
5. Make sure **Production** is checked ✓
6. Click **Save**
7. Go to Deployments → Redeploy

## 📊 Verification Steps

After redeploying:

1. **Clear browser cache and cookies** for your production site
2. Open production site in **Incognito/Private** window
3. Sign up with a new email
4. After signup, check URL - should be on `/` not `/sign-in`
5. Navigate to `/profile`
6. ✅ Should see profile page, NOT redirect

## 🆘 Still Not Working?

### Run this in your browser console (on production site):

```javascript
// Check if session exists
fetch('/api/auth/session')
  .then(r => r.json())
  .then(console.log)

// Check cookies
console.log(document.cookie)
```

**Expected output after login:**
```json
{
  "user": {
    "id": "...",
    "email": "...",
    "role": "CUSTOMER"
  },
  "expires": "..."
}
```

**If you get `{}`:** Session is not being created = Environment variable issue

## 📸 Screenshot Checklist

Send these screenshots if issue persists:

1. Vercel Environment Variables page (blur sensitive values)
2. Browser DevTools → Application → Cookies
3. Browser DevTools → Console (after sign in)
4. Vercel Runtime Logs during login

## 🔗 Quick Command to Get Deployment URL

In Vercel CLI:
```bash
vercel --prod
```

This shows your production URL. Use this exact URL for `NEXTAUTH_URL`.
