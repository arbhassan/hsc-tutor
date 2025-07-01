import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Refresh session to handle chunked cookies properly
  await supabase.auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/demo',
    '/demo/flashcards',
    '/debug'
  ]
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + '/')
  )
  
  // Check if the user is trying to access auth pages
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  
  // Redirect unauthenticated users to login for all protected routes
  if (!user && !isAuthPage && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signin'
    // Add the current URL as a redirect parameter so we can redirect back after login
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return supabaseResponse
} 