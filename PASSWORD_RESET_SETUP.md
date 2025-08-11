# Password Reset Setup Guide

This guide explains the password reset functionality that has been implemented in your HSC Tutor application.

## What's Been Added

### 1. **"Forgot Password?" Link**
- Added to the sign-in page (`/auth/signin`)
- Links to the forgot password page

### 2. **Forgot Password Page** (`/auth/forgot-password`)
- Allows users to enter their email address
- Sends password reset email via Supabase
- Shows confirmation message when email is sent
- Includes link back to sign-in page

### 3. **Reset Password Page** (`/auth/reset-password`)
- Accessed via link in the password reset email
- Validates the reset token from the email
- Allows users to set a new password
- Includes password confirmation
- Shows success message and redirects to sign-in

### 4. **Middleware Updates**
- Updated to allow access to `/auth/reset-password` even for authenticated users
- This is necessary because users click the reset link while potentially logged in

## Supabase Configuration Required

To make the password reset functionality work, you need to configure your Supabase project:

### 1. **Add Redirect URLs**

In your Supabase dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add the following to **Redirect URLs**:
   - Development: `http://localhost:3000/auth/reset-password`
   - Production: `https://yourdomain.com/auth/reset-password`

### 2. **Email Templates (Optional)**

You can customize the password reset email template:

1. Go to **Authentication** → **Email Templates**
2. Select "Reset Password" template
3. Customize the email content as needed
4. Make sure the action link points to your reset password page

## How It Works

### User Flow:
1. User goes to sign-in page and clicks "Forgot your password?"
2. User enters their email address on the forgot password page
3. Supabase sends a password reset email to the user
4. User clicks the link in the email
5. User is taken to the reset password page with authentication tokens
6. User enters their new password (twice for confirmation)
7. Password is updated and user is redirected to sign-in page

### Technical Flow:
1. `supabase.auth.resetPasswordForEmail()` sends the reset email
2. Email contains access tokens as URL parameters
3. Reset password page extracts tokens and sets up session
4. `supabase.auth.updateUser()` updates the password
5. User is redirected to complete the process

## Security Features

- **Token Validation**: Reset links contain secure tokens that expire
- **Session Validation**: The reset page validates the user's session before allowing password change
- **Password Requirements**: Minimum 6 characters (configurable)
- **Confirmation Required**: Users must enter their new password twice
- **Automatic Expiry**: Reset links expire after a set time (configurable in Supabase)

## Testing the Feature

1. Start your development server: `pnpm dev`
2. Go to `http://localhost:3000/auth/signin`
3. Click "Forgot your password?"
4. Enter a valid email address (that exists in your system)
5. Check your email for the reset link
6. Click the link and set a new password
7. Verify you can sign in with the new password

## Troubleshooting

### Email Not Received
- Check spam/junk folder
- Verify email templates are enabled in Supabase
- Check Supabase logs for delivery issues
- Ensure the email address exists in your user database

### Reset Link Not Working
- Verify redirect URLs are configured in Supabase
- Check that the link hasn't expired
- Ensure middleware allows access to reset-password route

### Password Update Fails
- Check password meets minimum requirements
- Verify session is valid on reset page
- Check browser console for error messages

## Customization Options

### Styling
- All pages use the same design system as existing auth pages
- Modify the Tailwind classes in the page components to match your brand

### Password Requirements
- Currently set to minimum 6 characters
- Can be modified in the validation functions
- Consider adding complexity requirements if needed

### Email Content
- Customize in Supabase dashboard under Email Templates
- Can include your branding and custom messaging

### Redirect Behavior
- Currently redirects to sign-in page after successful reset
- Can be modified to redirect to dashboard or other pages

## Files Modified/Created

- `app/auth/signin/page.tsx` - Added "Forgot Password?" link
- `app/auth/forgot-password/page.tsx` - New page for email submission
- `app/auth/reset-password/page.tsx` - New page for password reset
- `lib/supabase/middleware.ts` - Updated to allow reset-password access
- `PASSWORD_RESET_SETUP.md` - This documentation file

The password reset functionality is now fully implemented and ready for use!