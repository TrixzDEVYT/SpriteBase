// =====================================================================
// Conexión a Supabase
//
// SUPABASE_URL y SUPABASE_ANON_KEY son datos PÚBLICOS a propósito.
// Es seguro que estén en el frontend y en GitHub: la seguridad real la
// da Row Level Security (RLS), ya configurado en la base de datos.
//
// Nunca pongas aquí la "service_role key" — esa sí es secreta.
// =====================================================================

const SUPABASE_URL = "https://dtqhshpiugfplpbgmlag.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mvyk7zH8EN9rbuFF_I8cgA_REEMPLAZA_ESTO";

// El objeto `supabase` global viene del script CDN cargado en index.html
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
