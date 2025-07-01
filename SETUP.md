# HSC Tutor - Supabase Setup Guide

This guide will help you set up Supabase authentication and database for the HSC Tutor application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and pnpm installed
3. The HSC Tutor project code

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "hsc-tutor")
5. Enter a database password (save this securely)
6. Choose a region close to your users
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Project API Key** (anon public key)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase project URL and API key.

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of the `database-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the script

This will create all the necessary tables, indexes, row-level security policies, and triggers.

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your local development URL: `http://localhost:3000`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000` (for sign out redirect)

For production, add your production URLs as well.

## Step 6: Install Dependencies and Run

1. Install the required dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 7: Test the Authentication

1. Go to the sign-up page at `/auth/signup`
2. Create a new account with your email and password
3. You should be automatically signed in and redirected to the dashboard
4. Check the **Authentication** → **Users** section in your Supabase dashboard to confirm the user was created

## Step 8: Test Progress Tracking

1. Once signed in, visit `/progress` to see your initial analytics dashboard
2. Try the flashcard demo at `/demo/flashcards` to see real-time progress tracking
3. Complete a few flashcard sessions and then refresh your progress page
4. Watch as your data updates in real-time across all charts and metrics

The system will automatically:
- Track your flashcard accuracy and response times
- Update your overall mastery scores
- Calculate study streaks and time spent
- Generate personalized recommendations

## Features Implemented

### Authentication
- ✅ Email/password sign up and sign in
- ✅ Protected routes (middleware redirects unauthenticated users)
- ✅ User context throughout the app
- ✅ Sign out functionality
- ✅ User profile display in navbar

### Database
- ✅ User profiles with first/last name
- ✅ Progress tracking (study streak, total time, completion rate, mastery)
- ✅ Flashcard progress by text
- ✅ Short answer progress tracking
- ✅ Essay progress tracking
- ✅ Weekly reports with highlights and recommendations
- ✅ Row-level security (users can only access their own data)
- ✅ Automatic user profile creation on signup

### Progress Page
- ✅ Real-time data from Supabase
- ✅ Automatic data initialization for new users  
- ✅ Loading states and skeletons
- ✅ Personalized weekly reports
- ✅ Charts and analytics using real user data
- ✅ Comprehensive charts for each section (Overview, Flashcards, Essays, Short Answers)
- ✅ Dynamic skill level calculations
- ✅ Performance trends and recommendations

### Real-Time Progress Tracking
- ✅ Automatic flashcard progress tracking (accuracy, time, mastery)
- ✅ Short answer progress monitoring
- ✅ Essay progress with word count and quote usage
- ✅ Study streak tracking
- ✅ Time management analytics
- ✅ Overall mastery calculation with weighted scoring
- ✅ Progress tracker hook for easy integration

### Demo Features
- ✅ Interactive flashcard demo at `/demo/flashcards`
- ✅ Real-time progress updates
- ✅ Sample data for new users to see immediate results
- ✅ Working examples of progress tracking integration

## Troubleshooting

### Common Issues

1. **Environment variables not working**
   - Make sure your `.env.local` file is in the project root
   - Restart your development server after adding environment variables
   - Check that variable names start with `NEXT_PUBLIC_`

2. **Database connection errors**
   - Verify your Supabase URL and API key are correct
   - Make sure you've run the database schema script
   - Check the Supabase dashboard for any error messages

3. **Authentication not working**
   - Confirm your redirect URLs are set correctly in Supabase settings
   - Check browser developer tools for console errors
   - Verify RLS policies are set up correctly

4. **Users can't access their data**
   - Make sure the database schema script ran successfully
   - Check that RLS policies are enabled and working
   - Verify the user ID matches between auth and database records

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Look at the Supabase dashboard logs
3. Verify your environment variables are correct
4. Make sure the database schema was created properly

## Next Steps

Now that authentication and basic progress tracking are set up, you can:
1. Build out the other app features (practice zones, flashcards, etc.)
2. Add more detailed progress tracking
3. Implement the AI-powered features
4. Add real-time updates and notifications
5. Deploy to production

Remember to update your Supabase project settings with production URLs when you deploy! 