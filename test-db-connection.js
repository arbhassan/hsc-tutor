// Simple test to check database connection and schema
import { createClient } from '@supabase/supabase-js'

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('Testing database connection and schema...')
  
  try {
    // Test 1: Check if user_profiles table exists with correct columns
    console.log('\n1. Checking user_profiles table structure...')
    const { data: profileColumns, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0)
    
    if (profileError) {
      console.error('❌ user_profiles table error:', profileError.message)
      if (profileError.message.includes('relation "public.user_profiles" does not exist')) {
        console.log('💡 The user_profiles table does not exist. You need to run the database schema.')
      }
    } else {
      console.log('✅ user_profiles table exists')
    }

    // Test 2: Check current user
    console.log('\n2. Checking current user...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('❌ User error:', userError.message)
    } else if (user) {
      console.log('✅ User is authenticated:', user.email)
      
      // Test 3: Check if user has profile
      console.log('\n3. Checking user profile...')
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (fetchError) {
        console.error('❌ Profile fetch error:', fetchError.message)
        if (fetchError.code === 'PGRST116') {
          console.log('💡 No profile found for this user. The trigger might not be working or the user was created before the schema was applied.')
        }
      } else {
        console.log('✅ User profile found:')
        console.log('   Name:', profile.first_name, profile.last_name)
        console.log('   Selected Book ID:', profile.selected_book_id)
        console.log('   Selected Book Title:', profile.selected_book_title)
        console.log('   Selected Book Author:', profile.selected_book_author)
        
        if (!profile.selected_book_id) {
          console.log('⚠️  No book selected in profile')
        }
      }
    } else {
      console.log('❌ No user is currently authenticated')
      console.log('💡 You need to sign up or sign in first')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testDatabase() 