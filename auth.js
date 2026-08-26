// =====================================================================
// auth.js — lógica compartida de sesión, login/signup y navegación.
// Se incluye en TODAS las páginas después de supabaseClient.js.
// =====================================================================

/**
 * Dibuja la barra de navegación dentro de <div id="site-header"></div>.
 * Cambia según si hay sesión activa o no.
 */
async function renderNav(activePage) {
  const el = document.getElementById("site-header");
  if (!el) return;

  const { data: { session } } = await db.auth.getSession();

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
    { href: "collection.html", label: "Colección" },
    { href: "trades.html", label: "Trades" },
  ];

  if (await checkIsAdmin(session.user.id)) {
    links.push({ href: "admin.html", label: "Admin" });
  }

  const linksHtml = links.map(l =>
    `<a href="${l.href}" class="${activePage === l.href ? 'active' : ''}">${l.label}</a>`
  ).join("");

  el.innerHTML = `
    <nav class="nav">
      <div class="nav-brand">Sprite<span>Base</span></div>
      <div class="nav-links">
        ${linksHtml}
        <button class="btn btn-ghost" id="logout-btn" style="padding:0.4rem 0.9rem;">Salir</button>
      </div>
    </nav>
  `;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await db.auth.signOut();
    window.location.href = "index.html";
  });
}

/**
 * Protege una página: si no hay sesión, redirige al login.
 * Llamar al inicio de dashboard.html, collection.html, trades.html.
 */
async function requireAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return session.user;
}

/**
 * Si YA hay sesión y el usuario visita el login, lo manda al dashboard.
 * Llamar al inicio de index.html.
 */
async function redirectIfLoggedIn() {
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    window.location.href = "dashboard.html";
  }
}

async function signUp(email, password, username) {
  // El username se manda como metadata; el trigger handle_new_user()
  // en la base de datos crea la fila en profiles automáticamente,
  // sin depender de que haya sesión activa en este momento.
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  return { data, error };
}

async function signIn(email, password) {
  return await db.auth.signInWithPassword({ email, password });
}

/**
 * Verifica si el usuario dado tiene rol admin, consultando user_roles.
 * La policy de select permite: auth.uid() = user_id OR is_admin(),
 * así que un usuario normal SÍ puede leer su propia fila.
 */
async function checkIsAdmin(userId) {
  const { data } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

/**
 * Protege admin.html: exige sesión Y rol admin. Si no es admin,
 * lo regresa al dashboard.
 */
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
