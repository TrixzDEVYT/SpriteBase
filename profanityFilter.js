// =====================================================================
// profanityFilter.js — filtro de contenido ofensivo, multi-idioma.
//
// Uso:
//   if (containsProfanity(texto)) { ...mostrar error... }
//
// Nota importante: esto corre en el navegador, así que un usuario con
// conocimientos técnicos podría saltárselo editando el JS localmente.
// Para un control realmente a prueba de manipulación (por ejemplo, en
// una comunidad grande), lo ideal sería añadir también una revisión en
// el servidor (una función de Postgres o un webhook).
//
// Palabras de 3 letras o menos solo se detectan como palabra EXACTA
// completa (no como fragmento dentro de otra palabra), para evitar
// falsos positivos como "cu" dentro de "cute" o "curioso".
//
// Para añadir más idiomas o palabras, agrega/edita el array correspondiente.
// =====================================================================

const BANNED_WORDS = {
  en: [
    "fuck","fucker","fuckers","fucking","fucked","fuckin",
    "motherfucker","motherfuckers","motherfucking",
    "shit","shits","shitty","bullshit","horseshit","shithead","shitheads",
    "bitch","bitches","bitchy","bastard","bastards",
    "asshole","assholes","dumbass","dumbasses","jackass","jackasses","smartass","badass",
    "dick","dicks","dickhead","dickheads","prick","pricks","jerk","jerks",
    "crap","crappy","damn","dammit","goddamn","hell",
    "cock","cocks","cocksucker","cocksuckers","cocksucking",
    "pussy","pussies","cunt","cunts","twat","twats",
    "slut","sluts","slutty","whore","whores","hoe","hoes","hooker","hookers","skank","skanks",
    "cum","cumming","jizz","semen",
    "boob","boobs","tits","titty","titties","nipple","nipples",
    "ass","asses","butthole","butt","balls","testicles",
    "idiot","idiots","moron","morons","imbecile","imbeciles","stupid","stupidity","dumb",
    "loser","losers","scumbag","scumbags","douche","douchebag","douchebags","tool",
    "asswipe","asshat","wtf","stfu","gtfo","lmfao",
    "faggot","faggots","fag","fags","dyke","dykes",
    "retard","retarded","retards",
    "nigger","niggers","nigga","niggas",
    "spic","spics","chink","chinks","kike","kikes","gook","gooks",
    "cracker","crackers","wetback","wetbacks","tranny","trannies",
    "piss","pissed",
  ],
  es: [
    "puta","putas","puto","putos","putita","putitas","putito","putitos",
    "putazo","putazos","putiza","putizas","puteria","putería","putero","putera","puteros","puteras",
    "mierda","mierdas","mierdero","mierdera","mierderos","mierdoso","mierdosa",
    "pendejo","pendeja","pendejos","pendejas","pendejada","pendejadas","pendejez",
    "pendejote","pendejota","pendejotes","pendejotas",
    "cabron","cabrón","cabrona","cabrones","cabronas","cabronada","cabronadas","cabronazo","cabronazos",
    "verga","vergas","vergazo","vergazos","vergota","vergotas","vergón","vergona",
    "chinga","chingar","chingado","chingada","chingados","chingadas",
    "chingón","chingon","chingona","chingones","chingonas",
    "chingadera","chingaderas","chingadazo","chingadazos","chingue","chingues","chinguen",
    "joder","jodido","jodida","jodidos","jodidas","jodete","jódete","jodiendo","jodeme","jódeme",
    "coño","coños","coñazo","coñazos",
    "polla","pollas","pollón","pollon","pollones","pollazo","pollazos",
    "pene","penes","pija","pijas","pijazo","pijazos","pijón","pijon","pito","pitos",
    "pajero","pajera","pajeros","pajeras","pajear","pajearse","paja","pajas",
    "masturbar","masturbarse","masturbacion","masturbación","masturbaciones",
    "correrse","corrida","corridas",
    "culo","culos","culero","culera","culeros","culeras","culerada","culeradas",
    "culazo","culazos","culon","culón","nalgas",
    "mamon","mamón","mamona","mamones","mamonas","mamada","mamadas","mamar","mamando",
    "cagar","cagada","cagadas","cagado","cagados","cagon","cagón","cagona","cagones","cagonas",
    "cagadero","cagaderos","pedo","pedos","pedorro","pedorra","pedorros","pedorreo",
    "idiota","idiotas","imbecil","imbécil","imbeciles","imbéciles",
    "estupido","estúpido","estupida","estúpida","estupidos","estúpidos","estupidas","estúpidas",
    "tarado","tarada","tarados","taradas","tonto","tonta","tontos","tontas",
    "baboso","babosa","babosos","babosas","mamerto","mamerta","zopenco","zopenca",
    "gilipollas","gilipollada","gilipolladas","capullo","capulla","capullos","capullas",
    "pringado","pringada","payaso","payasa","zorra","zorras","zorro",
    "ojete","ojetes","ojeta","ojetas","ojeton","ojetón","ojetona",
    "hijueputa","hijueputas","hijoputa","hijoputas",
    "hijo de puta","hijos de puta","hija de puta","hijas de puta",
    "hdp","hp","joto","jota","jotos","jotas",
    "marica","maricas","maricon","maricón","maricones","maricona","mariconas",
    "puñal","punal","puñales","punales","sudaca","sudacas",
    "cholo","chola","cholero","cholera",
    "ptm","ptmre","ptmr","pqp","hpt","hpta","no mames","nmms","nmm",
  ],
  fr: [
    "merde","merdes","merdique","putain","putains","pute","putes",
    "connard","connards","connasse","connasses","con","cons","conne","connes",
    "encule","enculé","enculée","encules","enculer","enculés",
    "batard","bâtard","batarde","bâtarde","bordel","bordels",
    "salope","salopes","salaud","salauds",
    "bite","bites","couille","couilles","couillon","couillonne",
    "chatte","chattes","nique","niquer","niqué","niquée",
    "foutre","foutu","foutue","foutus","foutues",
    "branleur","branleuse","branler","branlette",
    "cul","culs","abruti","abrutie","abrutis","idiot","idiote",
  ],
  pt: [
    "porra","porras","merda","merdas","caralho","caralhos",
    "foda","fodas","foder","fodase","foda-se","fodido","fodida","fodidos","fodidas",
    "cacete","cacetada","cacetes",
    "puta","putas","puto","putos","putaria","putarias",
    "buceta","bucetas","boceta","bocetas","pica","picas","picao","picão",
    "cu","cus","cuzão","cuzao","cuzona","cuzões",
    "desgraça","desgraca","desgraçado","desgracado","desgraçada","desgracada",
    "filhodaputa","filho da puta","filhos da puta",
    "viado","veado","viados","veados",
    "otario","otário","otaria","otária","otarios","otários",
    "babaca","babacas","idiota","idiotas","imbecil","imbecis",
    "merdinha","punheta","punhetas","punheteiro","punheteira",
  ],
};

// Sustituciones comunes usadas para evadir filtros (leet speak).
const LEET_MAP = {
  "4": "a", "@": "a",
  "3": "e",
  "1": "i", "!": "i",
  "0": "o",
  "5": "s", "$": "s",
  "7": "t",
};

// Palabras de esta longitud o menos solo se detectan como palabra EXACTA,
// nunca como fragmento dentro del texto sin espacios (evita falsos
// positivos con abreviaciones cortas como "hp", "cu", "con").
const SHORT_WORD_THRESHOLD = 3;

function normalize(text) {
  let normalized = text.toLowerCase();

  normalized = normalized.replace(/[4@31!05$7]/g, (ch) => LEET_MAP[ch] || ch);
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  normalized = normalized.replace(/(.)\1{2,}/g, "$1$1");

  return normalized;
}

function escapeRegex(ch) {
  return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Construye una expresión regular que exige límites de palabra reales
 * (\b) en los extremos, permitiendo separadores opcionales entre letras
 * (para detectar evasión tipo "p u t a" o "p.u.t.a"), pero SIN cruzar
 * nunca un límite de palabra real. Esto evita que "hell" dispare dentro
 * de "hello", o que "rabbit" + "cheat" formen "bitch" por accidente.
 */
function buildWordRegex(word) {
  const clean = word
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ""); // frases como "hijo de puta" se tratan como una secuencia de letras

  const pattern = clean.split("").map(escapeRegex).join("[^a-z]*");
  return new RegExp(`\\b${pattern}\\b`, "i");
}

const ALL_WORDS = Object.values(BANNED_WORDS).flat();
const WORD_REGEXES = ALL_WORDS.map((word) => ({ word, regex: buildWordRegex(word) }));

/**
 * Revisa si un texto contiene alguna palabra prohibida, en cualquiera
 * de los idiomas configurados. Devuelve true/false.
 */
function containsProfanity(text) {
  if (!text) return false;
  const normalized = normalize(text);
  return WORD_REGEXES.some(({ regex }) => regex.test(normalized));
}
