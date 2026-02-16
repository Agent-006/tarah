# Production Environment Setup Guide

## Issue
Users are redirected to sign-in page after logging in when accessing the profile page in production.

## Root Cause
Missing or incorrect environment variables in production, specifically `NEXTAUTH_URL` and `NEXTAUTH_SECRET`.

## Fix Applied
✅ Updated cookie `secure` option to use `process.env.NODE_ENV === "production"` instead of hardcoded `false`

## Required Environment Variables for Production (Vercel/Deployment)

### 1. Authentication Variables
```bash
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your-secure-random-secret-here
JWT_SECRET=your-jwt-secret-here
```

**IMPORTANT:** 
- `NEXTAUTH_URL` **must** be your actual production domain (e.g., `https://tarah.vercel.app`)
- DO NOT use `http://localhost:3000` in production
- `NEXTAUTH_SECRET` should be a long, random string (generate with: `openssl rand -base64 32`)

### 2. Database
```bash
DATABASE_URL=your-neon-db-connection-string
```

### 3. UploadThing
```bash
UPLOADTHING_TOKEN=your-uploadthing-token
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Variable name: `NEXTAUTH_URL`
   - Value: `https://your-domain.vercel.app` (your actual domain)
   - Environment: Production ✓
   
5. Repeat for all variables above

6. **Redeploy** your application after adding variables

## Vercel Automatic NEXTAUTH_URL

Vercel can automatically set `NEXTAUTH_URL`, but it's better to set it explicitly:

```bash
# Add this to your vercel.json if you want automatic domain detection
{
  "env": {
    "NEXTAUTH_URL": "${VERCEL_URL}"
  }
}
```

However, this doesn't work with custom domains. **Best practice: Set it manually.**

## Testing in Production

After deployment:

1. ✅ Sign up with a new account
2. ✅ Login with existing account
3. ✅ Navigate to `/profile` - should NOT redirect to sign-in
4. ✅ Check browser DevTools → Application → Cookies
   - Should see `next-auth.session-token`
   - Cookie should have `Secure` flag in production

## Common Issues

### Issue: Still redirecting after fix
**Solution:** Clear browser cookies and try again. Old insecure cookies may persist.

### Issue: "Invalid credentials" after deployment
**Solution:** Make sure `DATABASE_URL` points to the correct production database.

### Issue: Session expires immediately
**Solution:** 
- Verify `NEXTAUTH_SECRET` is the same across all environment variables
- Check that cookies are not blocked by browser
- Ensure `NEXTAUTH_URL` matches your actual domain exactly (including https://)

## Verification Checklist

- [ ] `NEXTAUTH_URL` is set to production domain
- [ ] `NEXTAUTH_SECRET` is set (not empty)
- [ ] All environment variables are in Production environment
- [ ] Application is redeployed after adding variables
- [ ] Browser cookies cleared for testing
- [ ] Session token cookie has `Secure` flag

## Local Development

Your `.env.local` remains unchanged:
```bash
NEXTAUTH_URL=http://localhost:3000
```

The code automatically uses `secure: false` for development and `secure: true` for production.
