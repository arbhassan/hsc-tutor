const { createClient } = require('@supabase/supabase-js')

async function debugQuotes() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
    return
  }

  console.log('✅ Environment variables found')
  console.log('URL:', supabaseUrl.substring(0, 30) + '...')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Check if we can connect to Supabase
    console.log('\n🔍 Testing Supabase connection...')
    
    // Try to check if quotes table exists by querying it
    const { data, error, count } = await supabase
      .from('quotes')
      .select('*', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('❌ Error querying quotes table:', error.message)
      
      if (error.message.includes('relation "public.quotes" does not exist')) {
        console.log('\n📝 The quotes table does not exist. You need to create it first.')
        console.log('Run the quotes-table-schema.sql file in your Supabase SQL editor.')
      } else if (error.message.includes('RLS')) {
        console.log('\n🔒 Row Level Security might be blocking access.')
        console.log('Check your RLS policies in Supabase dashboard.')
      }
      return
    }

    console.log(`✅ Quotes table exists with ${count} rows`)
    
    if (count === 0) {
      console.log('\n📝 Table is empty. You need to add some quotes.')
      console.log('The schema file includes sample data - make sure it was inserted.')
    } else {
      console.log('\n📋 Sample quotes:')
      data.forEach((quote, i) => {
        console.log(`${i + 1}. ${quote.quote_text.substring(0, 50)}...`)
        console.log(`   Book: ${quote.book_id}, Theme: ${quote.theme}`)
      })
    }

    // Check authentication status
    console.log('\n🔐 Checking authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('❌ Auth error:', authError.message)
    } else if (user) {
      console.log('✅ User authenticated:', user.email)
    } else {
      console.log('⚠️  No authenticated user')
      console.log('This might be why you see no quotes if RLS is enabled.')
    }

  } catch (error) {
    console.error('❌ Script error:', error.message)
  }
}

debugQuotes() 