// =====================================================================
// auth.js — lógica compartida de sesión, login/signup y navegación.
// Se incluye en TODAS las páginas después de supabaseClient.js.
//
// LOGIN SOLO CON USERNAME:
// Supabase Auth requiere internamente un "email" por cuenta, pero no
// tiene que ser real. Generamos uno sintético al registrarse
// (user-<uuid>@spritebase.local) y lo guardamos en profiles.login_email
// para poder traducir username -> email interno al iniciar sesión.
// Ese email NUNCA se usa para enviar nada ni se le muestra al usuario.
// =====================================================================

function makeSyntheticEmail() {
  return `user-${crypto.randomUUID()}@spritebase.local`;
}

/**
 * Obtiene la sesión de forma robusta (evita falsos negativos por
 * timing al restaurar la sesión guardada).
 */
async function getSessionRobust() {
  const { data: { session } } = await db.auth.getSession();
  if (session) return session;

  return new Promise((resolve) => {
    const { data: listener } = db.auth.onAuthStateChange((_event, s) => {
      listener.subscription.unsubscribe();
      resolve(s);
    });
    setTimeout(() => {
      listener.subscription.unsubscribe();
      resolve(null);
    }, 800);
  });
}

/**
 * Dibuja la barra de navegación dentro de <div id="site-header"></div>.
 */
async function renderNav(activePage) {
  const el = document.getElementById("site-header");
  if (!el) return;

  const session = await getSessionRobust();

  if (!session) {
    el.innerHTML = `
      <nav class="nav">
        <div class="nav-brand">Sprite<span>Base</span></div>
      </nav>
    `;
    return;
  }

  const links = [
    { href: "dashboard.html", label: "Dashboard" },
    { href: "collection.html", label: "Collection" },
    { href: "trades.html", label: "Trades" },
  ];

  if (await checkIsAdmin(session.user.id)) {
    links.push({ href: "admin.html", label: "Admin" });
  }

  links.push({ href: "profile.html", label: "Profile" });

  const linksHtml = links.map(l =>
    `<a href="${l.href}" class="${activePage === l.href ? 'active' : ''}">${l.label}</a>`
  ).join("");

  el.innerHTML = `
    <nav class="nav">
      <div class="nav-brand">Sprite<span>Base</span></div>
      <div class="nav-links">
        ${linksHtml}
      </div>
    </nav>
  `;
}

async function requireAuth() {
  const session = await getSessionRobust();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return session.user;
}

async function redirectIfLoggedIn() {
  const session = await getSessionRobust();
  if (session) {
    window.location.href = "dashboard.html";
  }
}

/**
 * Registra una cuenta nueva usando solo username + password.
 * Revisa disponibilidad del username primero para dar un mensaje claro
 * en vez de un error genérico de base de datos.
 */
async function signUp(username, password) {
  const { data: existing } = await db
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();

  if (existing) {
    return { error: { message: "That username is already taken." } };
  }

  const syntheticEmail = makeSyntheticEmail();
  const { data, error } = await db.auth.signUp({
    email: syntheticEmail,
    password,
    options: { data: { username } },
  });
  return { data, error };
}

/**
 * Inicia sesión buscando primero el login_email interno asociado al
 * username, y usándolo para autenticar contra Supabase.
 */
async function signIn(username, password) {
  const { data: profile, error: lookupError } = await db
    .from("profiles")
    .select("login_email")
    .ilike("username", username)
    .maybeSingle();

  if (lookupError || !profile || !profile.login_email) {
    return { error: { message: "Username not found." } };
  }

  return await db.auth.signInWithPassword({ email: profile.login_email, password });
}

async function checkIsAdmin(userId) {
  const { data } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

async function requireAdmin() {
  const user = await requireAuth();
  if (!user) return null;

  const isAdmin = await checkIsAdmin(user.id);
  if (!isAdmin) {
    window.location.href = "dashboard.html";
    return null;
  }
  return user;
}
