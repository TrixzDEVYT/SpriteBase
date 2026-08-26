// =====================================================================
// Prueba de conexión: intenta leer la tabla sprite_series.
// Si la conexión y las políticas RLS están bien, esto responde
// "0 registros" (porque la tabla está vacía) en vez de un error.
// =====================================================================

const statusEl = document.getElementById("status");

async function testConnection() {
  const { data, error } = await db
    .from("sprite_series")
    .select("*");

  if (error) {
    statusEl.textContent = "❌ Error de conexión: " + error.message;
    statusEl.className = "status error";
    console.error(error);
    return;
  }

  statusEl.textContent =
    "✅ Conectado a Supabase correctamente. Registros en sprite_series: " +
    data.length;
  statusEl.className = "status ok";
}

testConnection();
