import { supabase } from './supabaseClient'

const BACKEND_URL = 'http://localhost:3000'

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Get current session token from Supabase
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    // No valid session, redirect to login
    console.error('No active session, redirecting to login.')
    await supabase.auth.signOut()
    window.location.href = '/'
    throw new Error('Authentication required')
  }
  
  // Build headers with auth token
  const headers: HeadersInit = {
    'Authorization': `Bearer ${session.access_token}`,
    ...options.headers,
  }
  
  // Don't set Content-Type for FormData - let the browser set it with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Make request to backend
  const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  // Handle 401 - token expired or invalid
  if (response.status === 401) {
    console.error('401 Unauthorized: Token expired or invalid. Redirecting to login.')
    await supabase.auth.signOut()
    window.location.href = '/'
    throw new Error('Authentication required')
  }
  
  return response
}
