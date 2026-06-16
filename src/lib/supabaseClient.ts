import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const isConfigured = supabaseUrl && isValidUrl(supabaseUrl) && supabaseAnonKey

let supabaseClient: SupabaseClient | null = null

if (isConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err)
  }
}

if (!supabaseClient) {
  console.warn(
    '⚠️ Supabase is not configured or has an invalid URL. Application will run in offline/mock mode. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )

  // Create a safe proxy that prevents runtime crashes when calling supabase methods
  const createMockProxy = (path = ''): any => {
    const noop = () => {}
    return new Proxy(noop, {
      get(target, prop) {
        const nextPath = path ? `${path}.${String(prop)}` : String(prop)
        
        // Mock specific expected methods
        if (prop === 'auth') {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: noop } } }),
          }
        }
        
        if (prop === 'from') {
          return () => createMockProxy('from')
        }

        // Return a chainable proxy for builder methods (insert, select, order, etc.)
        const chainableMethods = ['insert', 'select', 'order', 'eq', 'match', 'single']
        if (chainableMethods.includes(String(prop))) {
          return () => createMockProxy(nextPath)
        }

        // If called as a promise (e.g. awaited database call)
        if (prop === 'then') {
          return (resolve: any) => resolve({ data: [], error: new Error('Supabase is not configured. Please set environment variables.') })
        }

        return createMockProxy(nextPath)
      },
      apply(target, thisArg, argumentsList) {
        return Promise.resolve({ data: null, error: new Error('Supabase is not configured. Please set environment variables.') })
      }
    })
  }

  supabaseClient = createMockProxy() as unknown as SupabaseClient
}

export const supabase = supabaseClient as SupabaseClient


