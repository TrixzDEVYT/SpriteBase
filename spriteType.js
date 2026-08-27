// =====================================================================
// spriteType.js — detecta el "Tipo" de un sprite a partir de su nombre
// visible (variant_name), buscando palabras clave conocidas.
//
// Ejemplo:
//   "Gold Jackrabbit Sprite"          -> "Gold"
//   "Cheat Master Jackrabbit Sprite"  -> "Cheat Master"
//   "Jackrabbit Sprite"               -> "Normal" (sin palabra clave)
//
// Para añadir más tipos, solo agrega una entrada al array. El orden
// importa: las palabras clave más específicas van primero, para que
// "cheat master" se detecte antes que una futura keyword más genérica
// que pudiera solaparse.
// =====================================================================

const SPRITE_TYPE_KEYWORDS = [
  "cheat master",
  "gold",
  // Agrega más aquí, por ejemplo: "renegade", "shadow", "og", "frozen"...
];

function getSpriteType(variantName) {
  if (!variantName) return "Normal";
  const lower = variantName.toLowerCase();

  for (const keyword of SPRITE_TYPE_KEYWORDS) {
    if (lower.includes(keyword)) {
      // Convierte a Title Case: "cheat master" -> "Cheat Master"
      return keyword.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  return "Normal";
}
