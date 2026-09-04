// =====================================================================
// spriteType.js — detecta el "Tipo" de un sprite a partir de su nombre
// visible (variant_name), buscando palabras clave.
//
// Los tipos (Gold, Cheat Master, etc.) YA NO están hardcodeados aquí:
// viven en la tabla sprite_variant_types y se gestionan desde
// Admin > Variant Types. Este archivo solo sabe cómo APLICAR esa lista.
//
// Uso en cada página:
//   await loadSpriteVariantTypes(db);   // una vez, al iniciar
//   getSpriteType(sprite.variant_name); // ya funciona en todo el resto del código
// =====================================================================

// Respaldo por si la carga desde la base de datos falla o aún no corrió
// (así nada se rompe mientras tanto).
let SPRITE_VARIANT_TYPES = [
  { keyword: "cheat master", display_name: "Cheat Master" },
  { keyword: "gold", display_name: "Gold" },
];

async function loadSpriteVariantTypes(db) {
  try {
    const { data, error } = await db
      .from("sprite_variant_types")
      .select("keyword, display_name")
      .eq("is_active", true)
      .order("sort_order");

    if (!error && data && data.length > 0) {
      SPRITE_VARIANT_TYPES = data;
    }
  } catch (e) {
    // Si algo falla, se queda con el respaldo de arriba.
    console.warn("Could not load sprite variant types, using fallback list.", e);
  }
}

function getSpriteType(variantName) {
  if (!variantName) return "Normal";
  const lower = variantName.toLowerCase();

  for (const type of SPRITE_VARIANT_TYPES) {
    if (lower.includes(type.keyword)) {
      return type.display_name;
    }
  }

  return "Normal";
}
