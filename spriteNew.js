// =====================================================================
// spriteNew.js — detecta si un sprite fue agregado recientemente,
// para mostrar una insignia "NEW" sin tener que marcarlo a mano.
// =====================================================================

const NEW_SPRITE_DAYS = 7; // ajusta este número para cambiar cuánto dura el "NEW"

function isNewSprite(createdAt) {
  if (!createdAt) return false;
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs < NEW_SPRITE_DAYS * 24 * 60 * 60 * 1000;
}
