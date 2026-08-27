// =====================================================================
// profanityFilter.js — filtro de contenido ofensivo, multi-idioma.
//
// Uso:
//   if (containsProfanity(texto)) {
//     ...mostrar error...
//   }
//
// Nota:
//   Esto corre en el navegador, por lo que puede ser manipulado por
//   usuarios con conocimientos técnicos. Para un sistema serio,
//   también valida el contenido en el servidor.
//
// El filtro:
//   - Ignora mayúsculas/minúsculas.
//   - Elimina acentos.
//   - Detecta sustituciones leet.
//   - Reduce letras repetidas.
//   - Detecta palabras separadas por símbolos.
//   - Detecta palabras separadas por espacios.
// =====================================================================

const BANNED_WORDS = {
  // ===================================================================
  // ENGLISH
  // ===================================================================
  en: [
    // Insultos / vulgaridades generales
    "fuck",
    "fucker",
    "fuckers",
    "fucking",
    "fucked",
    "fuckin",
    "motherfucker",
    "motherfuckers",
    "motherfucking",
    "shit",
    "shits",
    "shitty",
    "bullshit",
    "horseshit",
    "shithead",
    "shitheads",
    "bitch",
    "bitches",
    "bitchy",
    "bastard",
    "bastards",
    "asshole",
    "assholes",
    "dumbass",
    "dumbasses",
    "jackass",
    "jackasses",
    "smartass",
    "badass",
    "dick",
    "dicks",
    "dickhead",
    "dickheads",
    "prick",
    "pricks",
    "jerk",
    "jerks",
    "crap",
    "crappy",
    "damn",
    "dammit",
    "goddamn",
    "hell",

    // Sexual / vulgar
    "cock",
    "cocks",
    "cocksucker",
    "cocksuckers",
    "pussy",
    "pussies",
    "dick",
    "penis",
    "vagina",
    "cunt",
    "cunts",
    "twat",
    "twats",
    "slut",
    "sluts",
    "slutty",
    "whore",
    "whores",
    "hoe",
    "hoes",
    "hooker",
    "hookers",
    "skank",
    "skanks",
    "cum",
    "cumming",
    "jizz",
    "semen",
    "boob",
    "boobs",
    "tits",
    "titty",
    "titties",
    "nipple",
    "nipples",
    "ass",
    "asses",
    "butthole",
    "butt",
    "balls",
    "testicles",

    // Insultos
    "idiot",
    "idiots",
    "moron",
    "morons",
    "imbecile",
    "imbeciles",
    "stupid",
    "stupidity",
    "dumb",
    "dumbass",
    "loser",
    "losers",
    "scumbag",
    "scumbags",
    "douche",
    "douchebag",
    "douchebags",
    "tool",
    "asswipe",
    "asshat",

    // Abreviaciones comunes
    "wtf",
    "stfu",
    "gtfo",
    "lmfao",

    // Slurs / términos discriminatorios
    "faggot",
    "faggots",
    "fag",
    "fags",
    "dyke",
    "dykes",
    "retard",
    "retarded",
    "retards",
    "nigger",
    "niggers",
    "nigga",
    "niggas",
    "spic",
    "spics",
    "chink",
    "chinks",
    "kike",
    "kikes",
    "gook",
    "gooks",
    "cracker",
    "crackers",
    "wetback",
    "wetbacks",
    "tranny",
    "trannies",
  ],

  // ===================================================================
  // ESPAÑOL / MÉXICO / LATAM
  // ===================================================================
  es: [
    // Puta / puto
    "puta",
    "putas",
    "puto",
    "putos",
    "putita",
    "putitas",
    "putito",
    "putitos",
    "putazo",
    "putazos",
    "putiza",
    "putizas",
    "puteria",
    "putería",
    "putero",
    "putera",
    "puteros",
    "puteras",

    // Mierda
    "mierda",
    "mierdas",
    "mierdero",
    "mierdera",
    "mierderos",
    "mierdoso",
    "mierdosa",
    "mierdosos",
    "mierdosa",

    // Pendejo
    "pendejo",
    "pendeja",
    "pendejos",
    "pendejas",
    "pendejada",
    "pendejadas",
    "pendejez",
    "pendejote",
    "pendejota",
    "pendejotes",
    "pendejotas",

    // Cabrón
    "cabron",
    "cabrón",
    "cabrona",
    "cabrones",
    "cabronas",
    "cabronada",
    "cabronadas",
    "cabronazo",
    "cabronazos",

    // Verga
    "verga",
    "vergas",
    "vergazo",
    "vergazos",
    "vergota",
    "vergotas",
    "vergón",
    "vergona",

    // Chinga
    "chinga",
    "chingar",
    "chingado",
    "chingada",
    "chingados",
    "chingadas",
    "chingón",
    "chingon",
    "chingona",
    "chingones",
    "chingonas",
    "chingadera",
    "chingaderas",
    "chingadazo",
    "chingadazos",
    "chingona",
    "chingue",
    "chingues",
    "chinguen",

    // Joder
    "joder",
    "jodido",
    "jodida",
    "jodidos",
    "jodidas",
    "jodete",
    "jódete",
    "jodiendo",
    "jodeme",
    "jódeme",

    // Coño
    "coño",
    "coños",
    "coñazo",
    "coñazos",

    // Polla
    "polla",
    "pollas",
    "pollón",
    "pollon",
    "pollones",
    "pollazo",
    "pollazos",

    // Pene / sexual
    "pene",
    "penes",
    "pija",
    "pijas",
    "pijazo",
    "pijazos",
    "pijón",
    "pijon",
    "pito",
    "pitos",
    "pajero",
    "pajera",
    "pajeros",
    "pajeras",
    "pajear",
    "pajearse",
    "paja",
    "pajas",
    "masturbar",
    "masturbarse",
    "masturbacion",
    "masturbación",
    "masturbaciones",
    "correrse",
    "corrida",
    "corridas",

    // Culo
    "culo",
    "culos",
    "culero",
    "culera",
    "culeros",
    "culeras",
    "culerada",
    "culeradas",
    "culazo",
    "culazos",
    "culon",
    "culón",
    "nalgas",

    // Mamadas
    "mamon",
    "mamón",
    "mamona",
    "mamones",
    "mamonas",
    "mamada",
    "mamadas",
    "mamar",
    "mamando",
    "mamón",
    "mamona",

    // Cagar
    "cagar",
    "cagada",
    "cagadas",
    "cagado",
    "cagada",
    "cagados",
    "cagadas",
    "cagon",
    "cagón",
    "cagona",
    "cagones",
    "cagonas",
    "cagadero",
    "cagaderos",
    "cagón",

    // Pedos
    "pedo",
    "pedos",
    "pedorro",
    "pedorra",
    "pedorros",
    "pedorra",
    "pedorreo",

    // Insultos
    "idiota",
    "idiotas",
    "imbecil",
    "imbécil",
    "imbeciles",
    "imbéciles",
    "estupido",
    "estúpido",
    "estupida",
    "estúpida",
    "estupidos",
    "estúpidos",
    "estupidas",
    "estúpidas",
    "tarado",
    "tarada",
    "tarados",
    "taradas",
    "tonto",
    "tonta",
    "tontos",
    "tontas",
    "pendejo",
    "pendeja",
    "baboso",
    "babosa",
    "babosos",
    "babosas",
    "mamerto",
    "mamerta",
    "zopenco",
    "zopenca",
    "gilipollas",
    "gilipollada",
    "gilipolladas",
    "capullo",
    "capulla",
    "capullos",
    "capullas",
    "pringado",
    "pringada",
    "payaso",
    "payasa",

    // Zorra
    "zorra",
    "zorras",
    "zorro",
    "zorras",

    // Ojete
    "ojete",
    "ojetes",
    "ojeta",
    "ojetas",
    "ojeton",
    "ojetón",
    "ojetona",

    // Hijueputa / hijo de puta
    "hijueputa",
    "hijueputas",
    "hijoputa",
    "hijoputas",
    "hijo de puta",
    "hijos de puta",
    "hija de puta",
    "hijas de puta",
    "hdp",
    "hp",

    // Insultos regionales
    "joto",
    "jota",
    "jotos",
    "jotas",
    "marica",
    "maricas",
    "maricon",
    "maricón",
    "maricones",
    "maricona",
    "mariconas",
    "puñal",
    "punal",
    "puñales",
    "punales",
    "sudaca",
    "sudacas",
    "cholo",
    "chola",
    "cholero",
    "cholera",

    // Abreviaciones mexicanas / latinas
    "ptm",
    "ptmre",
    "ptmr",
    "pqp",
    "hdp",
    "hpt",
    "hpta",
    "hijueputa",
    "no mames",
    "nmms",
    "nmm",
    "mamón",
    "mamon",
  ],

  // ===================================================================
  // FRANÇAIS
  // ===================================================================
  fr: [
    "merde",
    "merdes",
    "merdique",
    "putain",
    "putains",
    "pute",
    "putes",
    "connard",
    "connards",
    "connasse",
    "connasses",
    "con",
    "cons",
    "conne",
    "connes",
    "encule",
    "enculé",
    "enculée",
    "encules",
    "enculer",
    "enculés",
    "batard",
    "bâtard",
    "batarde",
    "bâtarde",
    "bordel",
    "bordels",
    "salope",
    "salopes",
    "salaud",
    "salauds",
    "bite",
    "bites",
    "couille",
    "couilles",
    "couillon",
    "couillonne",
    "chatte",
    "chattes",
    "nique",
    "niquer",
    "niqué",
    "niquée",
    "foutre",
    "foutu",
    "foutue",
    "foutus",
    "foutues",
    "branleur",
    "branleuse",
    "branler",
    "branlette",
    "cul",
    "culs",
    "connard",
    "abruti",
    "abrutie",
    "abrutis",
    "idiot",
    "idiote",
  ],

  // ===================================================================
  // PORTUGUÊS
  // ===================================================================
  pt: [
    "porra",
    "porras",
    "merda",
    "merdas",
    "caralho",
    "caralhos",
    "foda",
    "fodas",
    "foder",
    "fodase",
    "foda-se",
    "fodido",
    "fodida",
    "fodidos",
    "fodidas",
    "cacete",
    "cacetada",
    "cacetes",
    "puta",
    "putas",
    "puto",
    "putos",
    "putaria",
    "putarias",
    "buceta",
    "bucetas",
    "boceta",
    "bocetas",
    "pica",
    "picas",
    "picao",
    "picão",
    "cu",
    "cus",
    "cuzão",
    "cuzao",
    "cuzona",
    "cuzões",
    "desgraça",
    "desgraca",
    "desgraçado",
    "desgracado",
    "desgraçada",
    "desgracada",
    "filhodaputa",
    "filho da puta",
    "filhos da puta",
    "viado",
    "veado",
    "viados",
    "veados",
    "otario",
    "otário",
    "otaria",
    "otária",
    "otarios",
    "otários",
    "babaca",
    "babacas",
    "idiota",
    "idiotas",
    "imbecil",
    "imbecis",
    "merdinha",
    "punheta",
    "punhetas",
    "punheteiro",
    "punheteira",
  ],
};


// =====================================================================
// SUSTITUCIONES COMUNES — LEET SPEAK
// =====================================================================

const LEET_MAP = {
  "4": "a",
  "@": "a",
  "3": "e",
  "1": "i",
  "!": "i",
  "0": "o",
  "5": "s",
  "$": "s",
  "7": "t",
};


// =====================================================================
// NORMALIZACIÓN
// =====================================================================

function normalize(text) {
  let normalized = String(text).toLowerCase();

  // ---------------------------------------------------------------
  // Sustituciones tipo leet
  // ---------------------------------------------------------------
  normalized = normalized.replace(
    /[4@31!05$7]/g,
    (ch) => LEET_MAP[ch] || ch
  );

  // ---------------------------------------------------------------
  // Eliminar acentos
  //
  // "cabrón" -> "cabron"
  // "péndéjo" -> "pendejo"
  // ---------------------------------------------------------------
  normalized = normalized
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // ---------------------------------------------------------------
  // Colapsar letras excesivamente repetidas
  //
  // "mierdaaaaa" -> "mierdaa"
  // "fuuuuuck"   -> "fuuck"
  //
  // Dejamos dos letras para no alterar demasiado las palabras.
  // ---------------------------------------------------------------
  normalized = normalized.replace(/(.)\1{2,}/g, "$1$1");

  // ---------------------------------------------------------------
  // Quitar símbolos utilizados para evadir el filtro.
  //
  // "p.u.t.a" -> "puta"
  // "p-u-t-a" -> "puta"
  // "p_u_t_a" -> "puta"
  // ---------------------------------------------------------------
  normalized = normalized.replace(/[^a-z\s]/g, "");

  return normalized;
}


// =====================================================================
// PREPARAR TODAS LAS PALABRAS
// =====================================================================

const ALL_WORDS = Object.values(BANNED_WORDS)
  .flat()
  .map((word) =>
    word
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );


// Eliminar duplicados
const UNIQUE_WORDS = [...new Set(ALL_WORDS)];


// Ordenar de mayor a menor.
// Esto hace que primero se revisen términos más específicos.
UNIQUE_WORDS.sort((a, b) => b.length - a.length);


// =====================================================================
// DETECTOR
// =====================================================================

function containsProfanity(text) {
  if (!text) return false;

  const normalized = normalize(text);

  // Versión sin espacios.
  //
  // "p u t a" -> "puta"
  // "f u c k" -> "fuck"
  const collapsed = normalized.replace(/\s+/g, "");

  return UNIQUE_WORDS.some((word) => {
    if (!word) return false;

    // ---------------------------------------------------------------
    // 1. Coincidencia como palabra completa
    // ---------------------------------------------------------------
    const wordBoundaryRegex = new RegExp(
      `\\b${escapeRegExp(word)}\\b`,
      "i"
    );

    if (wordBoundaryRegex.test(normalized)) {
      return true;
    }

    // ---------------------------------------------------------------
    // 2. Coincidencia ignorando espacios
    //
    // "p u t a"
    // "f u c k"
    // ---------------------------------------------------------------
    if (collapsed.includes(word)) {
      return true;
    }

    return false;
  });
}


// =====================================================================
// ESCAPAR REGEX
// =====================================================================

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


// =====================================================================
// EXPORTACIÓN OPCIONAL
// =====================================================================
//
// Si utilizas módulos:
//
// export { containsProfanity, normalize, BANNED_WORDS };
//
// Si NO utilizas módulos, puedes simplemente usar:
//
// containsProfanity("texto aquí");
//
// =====================================================================
