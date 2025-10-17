import { supabase } from './supabaseClient'

const BACKEND_URL = 'http://localhost:3001'

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Get current session token from Supabase
  const { data: { session } } = await supabase.auth.getSession()
  
  // Build headers with auth token if available
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  
  // Make request to backend
  const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  // Handle 401 - redirect to login
  if (response.status === 401) {
    await supabase.auth.signOut()
    window.location.href = '/' // Will show login page
  }
  
  return response
}
