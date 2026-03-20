import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const PLACEHOLDER_VALUES = [
  '',
  'tu-anon-key-aqui',
  'https://tu-proyecto.supabase.co',
]

const isPlaceholder = (val: string | undefined) =>
  !val || PLACEHOLDER_VALUES.includes(val)

if (import.meta.env.PROD && (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey))) {
  throw new Error(
    '[Órbita] Supabase no está configurado. ' +
    'Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu entorno de producción.'
  )
}

if (import.meta.env.DEV && isPlaceholder(supabaseUrl)) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Órbita DEV] Supabase no configurado. ' +
    'El sistema usa datos mock. Ignorar si es intencional.'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
